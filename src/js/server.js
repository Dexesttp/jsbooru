const busboy = require("connect-busboy");
const express = require("express");
const fs = require("fs");
const path = require("path");

const confHelper = require("./config");
const routes = require("./routes");
const database = require("./database");

const app = express();
app.use(express.json());
app.use(busboy());

if (!confHelper.initConfig()) {
    console.error("There was an error reading the configuration file.");
    process.exit(0);
}
const config = confHelper.config;

database.init();

app.use("/img", express.static(config.imageFolder));
app.use("/thumb", express.static(config.thumbnailFolder));
app.use("/api", require("./api"));
routes.init(app);

for (const host of config.host) {
    app.listen(host.port, host.url, () => {
        console.info(`Started application on http://${host.url}:${host.port}`);
    }).on("error", function (err) {
        console.error(`Server error : ${err.message}`);
        console.info(
            "Error opening the server. Are you sure the given port is valid ?"
        );
        process.exit(0);
    });
}
