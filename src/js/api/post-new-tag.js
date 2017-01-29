const database = require("../database");

module.exports = function(req, res) {
    database.insertTag(req.params.name);
    res.sendStatus(200);
};
