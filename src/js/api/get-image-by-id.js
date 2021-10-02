const database = require("../database");

module.exports = function (req, res) {
    const id = req.params.id;
    database.getPictureData(req.params.id).then(function (data) {
        Promise.all(
            data.tags.map((tagName) => {
                return new Promise(function (resolve, reject) {
                    database.getTagDataByName(tagName).then((tagData) => {
                        database.getCountByTagList(tagName).then((count) => {
                            resolve({
                                name: tagName,
                                type:
                                    (tagData ? tagData.type : "") || "no-type",
                                count: count,
                            });
                        });
                    });
                });
            })
        ).then((tags) => {
            data.tags = tags;
            res.send(data);
        });
    });
};
