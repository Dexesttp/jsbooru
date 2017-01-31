const database = require("../database");
const fs = require("mz/fs");
const config = require("../config").config;

module.exports = function(req, res) {
	Promise.all([
		database.getPictures(),
		fs.readdir(config.imageFolder),
		fs.readdir(config.thumbnailFolder)
	])
	.then((results) => {
		const pictures = results[0];
		const files = results[1].filter(f => f !== ".gitignore");
		const thumbnails = results[2].filter(f => f !== ".gitignore");

		const deadPictures = files.filter(f => pictures.every(p => p.url !== '/img/' + f));
		const deadThumbnails = thumbnails.filter(f => pictures.every(p => p.thumbnail !== '/thumb/' + f));

		const unmatchedPictures = pictures.filter(p => files.every(f => p.url !== '/img/' + f));
		const unmatchedThumbnails = pictures.filter(p => p.thumbnail && thumbnails.every(f => p.thumbnail !== '/thumb/' + f));
		const nonCreatedThumbnails = pictures.filter(p => !p.thumbnail);
		res.send({
			deadPicturesCount: deadPictures.length,
			deadPictures,
			deadThumbnails,
			unmatchedPictures,
			unmatchedThumbnails,
			noThumb: nonCreatedThumbnails.length,
		});
	})
    .catch((e) => {
        console.error(`Getting the GET clean data failed.`);
        console.error(e.message);
        res.sendStatus(500);
    });
}
