const database = require("../database");
const encode = require("../utils").encode;

module.exports = function (req, res) {
    const tagName = req.params.name;
    const unsafeTagList = tagName.split(" ");
    const tagList = unsafeTagList.map(tag => encode(tag));
    if (tagList.length > 1) {
        database.getCountByTagList(tagList).then((count) => {
            res.send({
                name: tagName,
                type: "all-type",
                count: count,
            });
        });
        return;
    }
    database.getTagDataByName(tagName).then((tagData) => {
        database.getCountByTagList(tagList).then(function (data) {
            res.send({
                name: req.params.name,
                type: (tagData ? tagData.type : "") || "no-type",
                count: data,
            });
        });
    });
};
