const database = require("../database");
const fs = require("mz/fs");
const path = require("path");
const config = require("../config").config;
const thumb = require("../thumbnailer");

module.exports = function(req, res) {
	database.getPictures()
	.then((pictures) => {
		const nonCreatedThumbnails = pictures.filter(p => !p.thumbnail && p.url);
		return Promise.all(
			nonCreatedThumbnails.map(nct => {
				const imageFileName = nct.url.substring(5);
				const imagePath = path.resolve(config.imageFolder, imageFileName);
				const urlID = path.basename(imagePath, path.extname(imagePath));
				return new Promise((resolve, reject) => {
					console.info(`Starting conversion for ${nct._id} : ${urlID}`)
					thumb
						.createThumbnail(imagePath)
						.then((hash) => database.updatePicture(
							nct._id,
							{ thumbnail: '/thumb/' + urlID + ".jpg", hash: hash }
						))
						.then(() => resolve({id: nct._id, ok: true}))
						.catch(() => resolve({id: nct._id, ok: false}));
				});
			})
		);
	})
	.then((result) => {
		const ok = result.filter(r => r.ok);
		const fail = result.filter(r => !r.ok);
		res.send({
			text: `Updated pictures: ${ok.length}, failed pictures: ${fail.length}`,
			ok: ok.map(d => d.id),
			fail: fail.map(d => d.id),
		});
	})
    .catch((e) => {
        console.error(`Getting the GET clean data failed.`);
        console.error(e.message);
        res.sendStatus(500);
    });
}
