const database = require("../database");

module.exports = function (req, res) {
    const tagName = req.params.name;
    database
        .deleteTagFromAllDatabase(tagName)
        .then((_) => {
            res.sendStatus(200);
        })
        .catch((e) => {
            console.error(`Deleting the tag ${tagName} failed.`);
            console.error(e.message);
            res.sendStatus(500);
        });
};
