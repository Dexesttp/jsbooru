const path = require("path");

const config = {};

exports.initConfig = function(extConfig) {
    var fileConfig = {};
    try {
        var configFilePath = path.resolve(__dirname, "../..", "config.json");
        var configContents = fs.readFileSync(configFilePath, 'utf8');
        console.log(`Found configuration file : ${configFilePath}`);
        fileConfig = JSON.parse(configContents);
    } catch(e) {
        // NO OP
    }
    extConfig = extConfig || fileConfig;
    config.database = path.resolve(__dirname, "../../", extConfig.database || "database");
    config.imageFolder = path.resolve(__dirname, "../../", extConfig.imageFolder || "images");
    config.staticFolder = path.resolve(__dirname, "../../", extConfig.staticFolder || "public");
    config.port = extConfig.port || 3000;
}

module.exports.config = config;