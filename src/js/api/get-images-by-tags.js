const database = require("../database");

module.exports = function(req, res) {
    const start = +req.query.s || 0;
    const tags = req.query.q ? req.query.q.split(" ") : [];
    const uniqueTags = tags.filter(function(i, idx, arr) { return arr.indexOf(i) === idx; });
    database.getCountByTagList(uniqueTags, function(count) {
        database.getPicturesByTag(uniqueTags, start, 20, function(pics) {
            res.send({
                count: count,
                result: pics
            });
        });
    })
}
