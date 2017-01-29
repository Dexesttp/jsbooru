const database = require("../database");

module.exports = function(req, res) {
	const id = req.params.id;
	database.getPictureData(req.params.id, function(data) {
		res.send(data);
	})
}