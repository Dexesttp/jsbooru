const database = require("../database");

module.exports = function(req, res) {
	console.log(req.body);
    database.updatePicture(req.params.id, req.body, function() {
    	res.sendStatus(200);
	});
};
