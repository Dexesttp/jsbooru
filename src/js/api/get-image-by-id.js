const database = require("../database");

module.exports = function (req, res) {
    const id = req.params.id;
    database.getPictureData(req.params.id, function (data) {
        Promise.all(
            data.tags.map((tag) => {
                return new Promise(function (resolve, reject) {
                    database.getCountByTagList(tag, (count) => {
                        resolve({ name: tag, count: count });
                    });
                });
            })
        ).then((tags) => {
            data.tags = tags;
            res.send(data);
        });
    });
};
