const database = require("../database");

module.exports = function (req, res) {
    const start = +req.query.s || 0;
    const tags = req.query.q ? req.query.q.split(" ") : [];
    const shouldSearchAll = req.query.q === "" || req.query.q === "*";
    const uniqueTagsFromSearchQuery = tags.filter((i, idx, arr) => {
        return arr.indexOf(i) === idx;
    });
    const tagsToSearch = shouldSearchAll ? [] : uniqueTagsFromSearchQuery;
    database.getCountByTagList(tagsToSearch, (count) => {
        database.getPicturesByTag(tagsToSearch, start, 20, (pics) => {
            Promise.all(
                pics
                    .reduce((prev, curr) => prev.concat(curr.tags), [])
                    .filter((i, idx, arr) => {
                        return arr.indexOf(i) === idx;
                    })
                    .map((tagName) => {
                        return new Promise(function (resolve, reject) {
                            database.getTagDataByName(tagName, (tagData) => {
                                database.getCountByTagList(tagName, (count) => {
                                    resolve({
                                        name: tagName,
                                        type:
                                            (tagData ? tagData.type : "") ||
                                            "no-type",
                                        count: count,
                                    });
                                });
                            });
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
