const bodyParser = require("body-parser");
const busboy = require("connect-busboy");
const express = require("express");
const fs = require('fs');
const path = require("path");

const confHelper = require("./config");
const routes = require("./routes");
const database = require("./database");

const app = express();
app.use(bodyParser.json());
app.use(busboy());

confHelper.initConfig();
const config = confHelper.config;
console.log(config);

database.init();

app.use("/img", express.static(config.imageFolder));
app.use("/api", require("./api"));
routes.init(app);

app.listen(config.port, function() {
    console.log(`Started app on port ${config.port}`);
});
