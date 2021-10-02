const database = require("../database");

module.exports = function (req, res) {
    const tagName = req.params.name;
    const tagList = tagName.split(" ");
    if (tagList.length > 1) {
        database.getCountByTagList(tagList, (count) => {
            res.send({
                name: tagName,
                type: "all-type",
                count: count,
            });
        });
        return;
    }
    database.getTagDataByName(tagName, (tagData) => {
        database.getCountByTagList(tagList, function (data) {
            res.send({
                name: req.params.name,
                type: (tagData ? tagData.type : "") || "no-type",
                count: data,
            });
        });
    });
};
