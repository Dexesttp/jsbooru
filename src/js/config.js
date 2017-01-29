const fs = require("fs");
const path = require("path");

const config = {};

exports.initConfig = function(extConfig) {
    var fileConfig = {};
    try {
        var configFilePath = path.resolve(__dirname, "../..", "config.json");
        var configContents = fs.readFileSync(configFilePath, 'utf8');
        console.log(`Found configuration file : ${configFilePath}`);
        try {
            fileConfig = JSON.parse(configContents);
        } catch(e) {
            console.log(`Invalid data: ${configFilePath} does not contain a valid JSON string.`);
        }
    } catch(e) {
        console.log(`No configuraton file found : ${configFilePath}`);
    }
    extConfig = extConfig || fileConfig;
    config.database = path.resolve(__dirname, "../../", extConfig.database || "database");
    config.imageFolder = path.resolve(__dirname, "../../", extConfig.imageFolder || "images");
    config.staticFolder = path.resolve(__dirname, "../../", extConfig.staticFolder || "public");
    config.port = extConfig.port || 3000;
}

module.exports.config = config;