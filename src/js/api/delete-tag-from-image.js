const database = require("../database");

module.exports = function (req, res) {
    const imageID = req.params.id;
    const tagName = req.params.tagname;
    database.deleteTag(imageID, tagName);
    res.sendStatus(200);
};
