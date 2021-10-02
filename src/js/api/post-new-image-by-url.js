const database = require("../database");

module.exports = function (req, res) {
    database.insertPicture({
        url: req.body.url,
        tags: [],
    });
    res.sendStatus(200);
};
