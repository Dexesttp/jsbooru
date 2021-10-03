const database = require("../database");

module.exports = function (req, res) {
    database.getPicturePrevNextInformation(req.params.id).then(function (data) {
        res.send(data);
    });
};
