const database = require("../database");

module.exports = function (req, res) {
    Promise.resolve(true)
        .then((_) => {
            res.sendStatus(200);
        })
        .catch((e) => {
            console.error(
                `Updating tag wiki vote count for ${req.params.name} failed.`
            );
            console.error(e.message);
            res.sendStatus(500);
        });
};
