const fs = require("fs");
const path = require("path");

const config = {
    database: "",
    imageFolder: "",
    staticFolder: "",
    host: "localhost",
    port: 8000,
};


function checkAccess(file) {
    try {
        fs.accessSync(file);
    }
    catch(e) {
        return false;
    }
    return true;
}

exports.initConfig = function(extConfig) {
    let fileConfig = {};
    const configFilePath = path.resolve(__dirname, "../..", "config.json");
    try {
        const configContents = fs.readFileSync(configFilePath, 'utf8');
        console.info(`Found configuration file : ${configFilePath}`);
        try {
            fileConfig = JSON.parse(configContents);
        } catch(e) {
            console.error(`Invalid data: ${configFilePath} does not contain a valid JSON string.`);
            throw e;
        }
    } catch(e) {
        console.info(`No valid configuration file found at ${configFilePath}. Using default configuration.`);
    }
    extConfig = extConfig || fileConfig;
    config.database = path.resolve(__dirname, "../../", extConfig.database || "database");
    config.imageFolder = path.resolve(__dirname, "../../", extConfig.imageFolder || "images");
    config.staticFolder = path.resolve(__dirname, "../../", extConfig.staticFolder || "public");
    config.host = extConfig.host || "localhost";
    config.port = extConfig.port || 3000;
    // Check access permissions
    if(!checkAccess(config.database)) {
        console.error(`The database folder ${config.database} can't be accessed. Ensure that the folder is created and that the user has enough permissions to access it.`);
        return false;
    }
    if(!checkAccess(config.imageFolder)) {
        console.error(`The image folder ${config.database} can't be accessed. Ensure that the folder is created and that the user has enough permissions to access it.`);
        return false;
    }
    if(!checkAccess(config.staticFolder)) {
        console.error(`The public folder ${config.database} can't be accessed. Ensure that the folder is created and that the user has enough permissions to access it.`);
        return false;
    }
    return true;
}

module.exports.config = config;