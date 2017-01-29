const fs = require("fs");
const path = require("path");
const config = require("../config").config;
const database = require("../database");
const uuid = require("../utils").uuid;

module.exports = function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        const urlID = uuid();
        const extension = path.extname(filename);
        const newFile = urlID + extension;
        const newFileAbsolute = path.resolve(config.imageFolder, newFile);
        console.log(`Added file : ${newFileAbsolute}`);
        fstream = fs.createWriteStream(newFileAbsolute);
        file.pipe(fstream);
        fstream.on('close', function() {
            database.insertPicture({
                url: '/img/' + newFile,
                tags: [],
            }, function(id) {
                console.log(`Assigned ID : ${id}`);
                res.redirect(`/#/view/${id}`);
            });
        });
    })
    return;
};
