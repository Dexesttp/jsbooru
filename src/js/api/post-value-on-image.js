const database = require("../database");

module.exports = function (req, res) {
    database.updatePicture(req.params.id, req.body).then(function () {
        res.sendStatus(200);
    });
};
