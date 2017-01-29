const fs = require("fs");
const path = require("path");
const config = require("./config").config;
const database = require("./database");

exports.init = function(app) {
    // GET
    app.get("/api/tags", function(req, res) {
        const request = req.query.q ? req.query.q.split(" ") : [];
        const firsts = request.slice(0, -1);
        const queried = request.length > 0 ? request[request.length - 1] : "";
        if(queried === "") {
            res.send([{
                result: request.join(" "),
                query: queried,
                name: request.join(" "),
                match: true,
                count: 0,
            }]);
            return;
        }
        database.getTags(queried, function(results) {
            if(results.length === 0) {
                res.send([{
                    result: request.join(" "),
                    query: queried,
                    name: "(no match)",
                    match: false,
                    count: 0,
                }]);
                return;
            }
            const str1 = firsts.join(" ");
            const str = str1 ? str1 + " " : "";
            res.send(results.map(r => ({
                result: str + r.name,
                query: queried,
                name: r.name,
                match: true,
                count: r.count || 0,
            })));
        });
    });

    app.get("/api/tag/:name", function(req, res) {
        database.getTagImages(req.params.name.split(" "), function(data) {
            res.send({
                name: req.params.name,
                count: data,
            });
        });
    });
    
    app.get("/api/image/:id", function(req, res) {
        const id = req.params.id;
        database.getPictureData(req.params.id, function(data) {
            res.send(data);
        })
    });
    
    app.get("/api/images", function(req, res) {
        const start = req.query.start || 0;
        const tags = req.query.q ? req.query.q.split(" ") : [];
        const uniqueTags = tags.filter(function(i, idx, arr) { return arr.indexOf(i) === idx; });
        database.getPicturesByTag(uniqueTags, start, 20, function(pics) {
            res.send(pics);
        });
    });

    // POST
    app.post("/api/tag/:name", function(req, res) {
        database.insertTag(req.params.name);
        res.sendStatus(200);
    });
    
    app.post("/api/images", function(req, res) {
        database.insertPicture({
            url: req.body.url,
            tags: [],
        });
        res.sendStatus(200);
    });

    app.post("/api/image/:id/:tagname", function(req, res) {
        const imageID = req.params.id;
        const tagName = req.params.tagname;
        database.setTag(imageID, tagName);
        res.sendStatus(200);
    });

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    app.post("/api/image", function(req, res) {
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
    });

    app.delete("/api/image/:id", function(req, res) {
        const imageID = req.params.id;
        database.deletePicture(imageID);
        res.sendStatus(200);
    });

    app.delete("/api/image/:id/:tagname", function(req, res) {
        const imageID = req.params.id;
        const tagName = req.params.tagname;
        database.deleteTag(imageID, tagName);
        res.sendStatus(200);
    });
};
