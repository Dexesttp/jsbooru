const database = require("../database");
const encode = require("../utils").encode;

module.exports = function (req, res) {
    database
        .insertTag(encode(req.params.name))
        .then((_) => database.updateTagCounts())
        .then((_) => {
            res.sendStatus(200);
        })
        .catch((e) => {
            console.error(`Creating a new tag ${req.params.name} failed.`);
            console.error(e.message);
            res.sendStatus(500);
        });
};
