const fs = require("fs");
const path = require("path");
const config = require("../config").config;
const database = require("../database");
const uuid = require("../utils").uuid;
const thumb = require("../thumbnailer");

function saveInDBAndRedirect(res, newFile, urlID, hash) {
    return database
        .insertPicture(
            hash
                ? {
                      url: "/img/" + newFile,
                      thumbnail: "/thumb/" + urlID + ".jpg",
                      hash: hash,
                      tags: [],
                  }
                : {
                      url: "/img/" + newFile,
                      tags: [],
                  }
        )
        .then((id) => {
            res.redirect(`/#/view/${id}`);
        })
        .catch((e) => {
            console.error(
                `Creating an ID for the new uploaded picture failed.`
            );
            console.error(e.message);
            res.sendStatus(500);
        });
}

const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

module.exports = function (req, res) {
    req.pipe(req.busboy);
    req.busboy.on("file", function (fieldname, file, fileMetadata) {
        const urlID = uuid();
        const extension = path.extname(fileMetadata.filename);
        // Only allow certain extensions
        if (!allowedExtensions.some((e) => e === extension)) {
            res.status(500);
            res.send(`The uploaded picture doesn't have a valid extension.`);
            return;
        }
        const newFile = urlID + extension;
        const newFileAbsolute = path.resolve(config.imageFolder, newFile);
        fstream = fs.createWriteStream(newFileAbsolute);
        file.pipe(fstream);
        fstream.on("close", () => {
            thumb
                .createThumbnail(newFileAbsolute)
                .then((hash) => saveInDBAndRedirect(res, newFile, urlID, hash))
                .catch((e) => {
                    saveInDBAndRedirect(res, newFile);
                });
        });
    });
    return;
};
