const database = require("../database");

module.exports = function (req, res) {
    const imageID = req.params.id;
    database.deletePicture(imageID);
    res.sendStatus(200);
};
