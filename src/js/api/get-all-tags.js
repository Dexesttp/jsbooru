const database = require("../database");

module.exports = function (req, res) {
    database
        .getAllTags()
        .then((results) => {
            return Promise.all(
                results.map((tag) =>
                    database.getTagCount(tag.name).then((tagCount) => ({
                        name: tag.name,
                        type: tag.type || "no-type",
                        count: tagCount,
                    }))
                )
            );
        })
        .then((results) => {
            res.send(results);
        })
        .catch((e) => {
            console.error(`Getting all the tag data failed.`);
            console.error(e.message);
            res.sendStatus(500);
        });
};
