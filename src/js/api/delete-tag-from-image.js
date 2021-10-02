const database = require("../database");

module.exports = function (req, res) {
    const imageID = req.params.id;
    const tagName = req.params.tagname;
    database
        .deleteTag(imageID, tagName)
        .then((_) => database.updateTagCounts())
        .then((_) => {
            res.sendStatus(200);
        })
        .catch((e) => {
            console.error(
                `Deleting the tag ${tagName} from the picture ${imageID} failed.`
            );
            console.error(e.message);
            res.sendStatus(500);
        });
};
