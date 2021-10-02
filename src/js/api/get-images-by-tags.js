const database = require("../database");

module.exports = function (req, res) {
    const start = +req.query.s || 0;
    const tags = req.query.q ? req.query.q.split(" ") : [];
    const uniqueTags = tags.filter((i, idx, arr) => {
        return arr.indexOf(i) === idx;
    });
    database.getCountByTagList(uniqueTags, (count) => {
        database.getPicturesByTag(uniqueTags, start, 20, (pics) => {
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
