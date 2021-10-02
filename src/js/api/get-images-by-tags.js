const database = require("../database");
const encode = require("../utils").encode;

function getUniqueTags(unsafeQuery) {
    const tags = unsafeQuery ? unsafeQuery.split(" ") : [];
    const shouldSearchAll = unsafeQuery === "" || unsafeQuery === "*";
    const unsafeTagsFromQuery = tags.filter((i, idx, arr) => {
        return arr.indexOf(i) === idx;
    });
    const unsafeTags = shouldSearchAll ? [] : unsafeTagsFromQuery;
    return unsafeTags.map((tag) => encode(tag));
}

module.exports = function (req, res) {
    const start = +req.query.s || 0;
    const tagsToSearch = getUniqueTags(req.query.q);
    database.getCountByTagList(tagsToSearch).then((count) => {
        database.getPicturesByTag(tagsToSearch, start, 20).then((pics) => {
            Promise.all(
                pics
                    .reduce((prev, curr) => prev.concat(curr.tags), [])
                    .filter((i, idx, arr) => {
                        return arr.indexOf(i) === idx;
                    })
                    .map((tagName) => {
                        return database
                            .getTagDataByName(tagName)
                            .then((tagData) => {
                                return database
                                    .getTagCount(tagName)
                                    .then((count) => ({
                                        name: tagName,
                                        type:
                                            (tagData ? tagData.type : "") ||
                                            "no-type",
                                        count: count,
                                    }));
                            });
                    })
            ).then((tags) => {
                res.send({
                    count: count,
                    result: pics,
                    tags: tags,
                });
            });
        });
    });
};
