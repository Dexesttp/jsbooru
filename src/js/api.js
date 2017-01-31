const express = require("express");
const router = express.Router();

// GET
router.get("/tags", require("./api/get-tags-by-partial-names"));
router.get("/tag/:name", require("./api/get-tag-data-by-name"));
router.get("/image/:id", require("./api/get-image-by-id"));
router.get("/image", require("./api/get-images-by-tags"));
router.get("/clean/image", require("./api/get-clean-image"));

// POST
router.post("/tag/:name", require("./api/post-new-tag"));
router.post("/image/:id/:tagname", require("./api/post-new-tag-on-image"));
router.post("/image/:id", require("./api/post-value-on-image"));
router.post(
    "/clean/image/thumbnail",
    require("./api/post-clean-image-thumbnail")
);

const postByUrl = require("./api/post-new-image-by-url");
const postByFile = require("./api/post-new-image-by-file-contents");
router.post("/image", function (req, res) {
    if (req.body.url) {
        postByUrl(req, res);
        return;
    }
    postByFile(req, res);
});

// DELETE
router.delete("/image/:id", require("./api/delete-image-by-id"));
router.delete("/image/:id/:tagname", require("./api/delete-tag-from-image"));

module.exports = router;
