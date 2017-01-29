const bodyParser = require("body-parser");
const busboy = require("connect-busboy");
const express = require("express");
const fs = require('fs');
const path = require("path");

const confHelper = require("./config");
const api = require("./api");
const routes = require("./routes");
const database = require("./database");

const app = express();
app.use(bodyParser.json());
app.use(busboy());

try {
    var configFilePath = path.resolve(__dirname, "../..", "config.json");
    var configContents = fs.readFileSync(configFilePath, 'utf8');
    console.log(`Found configuration file : ${configFilePath}`);
    confHelper.initConfig(JSON.parse(configContents));
} catch(e) {
    confHelper.initConfig();
}
const config = confHelper.config;
console.log(config);

database.init();

app.use("/img", express.static(config.imageFolder));
api.init(app);
routes.init(app);

app.listen(config.port, function() {
    console.log(`Started app on port ${config.port}`);
});
