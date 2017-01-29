const path = require("path");

const config = {};

exports.initConfig = function(extConfig) {
    extConfig = extConfig || {};
    config.database = path.resolve(__dirname, "../../", extConfig.database || "database");
    config.imageFolder = path.resolve(__dirname, "../../", extConfig.imageFolder || "images");
    config.staticFolder = path.resolve(__dirname, "../../", extConfig.staticFolder || "public");
    config.port = extConfig.port || 3000;
}

module.exports.config = config;