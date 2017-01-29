const express = require("express");
const path = require("path");
const config = require("./config").config;

exports.init = function(app) {
    app.use("/upload", function(req, res) {
        res.sendFile(path.resolve(config.staticFolder, "upload.html"));
    });
    app.use("/search", function(req, res) {
        res.sendFile(path.resolve(config.staticFolder, "index.html"))
    });
    app.use("/view", function(req, res) {
        res.sendFile(path.resolve(config.staticFolder, "index.html"));
    });
    app.use("/", express.static(config.staticFolder));
}