const database = require("../database");

module.exports = function (req, res) {
    const tagName = req.params.name;
    Promise.all([
        database.getTagDataByName(tagName),
        database.getTagCount(tagName),
        database.getTagWiki(tagName),
    ])
        .then((results) => {
            const data = results[0];
            const count = results[1];
            const wiki = results[2];
            res.send({
                name: tagName,
                type: data.type || "no-type",
                wiki,
                count,
            });
        })
        .catch((e) => {
            console.error(`Getting the data from the tag ${tagName} failed.`);
            console.error(e.message);
            res.sendStatus(500);
        });
};
