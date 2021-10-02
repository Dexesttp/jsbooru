const fs = require("fs");
const path = require("path");
const database = require("../database");
const config = require("../config").config;

module.exports = function (req, res) {
    const imageID = req.params.id;
    database
        .getPicture(imageID)
        .then((data) => {
            if (data.url.startsWith("/img/")) {
                const filename = data.url.substring("/img/".length);
                const file = path.resolve(config.imageFolder, filename);
                if (fs.existsSync(file)) fs.unlinkSync(file);
            }
            if (data.thumbnail.startsWith("/thumb/")) {
                const filename = data.thumbnail.substring("/thumb/".length);
                const file = path.resolve(config.thumbnailFolder, filename);
                if (fs.existsSync(file)) fs.unlinkSync(file);
            }
            return database.deletePicture(imageID);
        })
        .then(() => {
            database.updateTagCounts();
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((e) => {
            console.error(`Deleting the picture ${imageID} failed.`);
            if (e && e.message) console.error(e.message);
            res.sendStatus(500);
        });
};
