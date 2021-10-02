const database = require("../database");

module.exports = function (req, res) {
    database.getCountByTagList(req.params.name.split(" "), function (data) {
        res.send({
            name: req.params.name,
            count: data,
        });
    });
};
