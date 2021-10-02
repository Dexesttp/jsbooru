const database = require("../database");

module.exports = function (req, res) {
    database
        .updateTagCounts()
        .then((_) => {
            res.sendStatus(200);
        })
        .catch((e) => {
            console.error(`Getting the GET clean data failed.`);
            console.error(e.message);
            res.sendStatus(500);
        });
};
