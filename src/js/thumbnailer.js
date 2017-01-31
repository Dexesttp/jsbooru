"use strict";
const jimp = require("jimp");
const path = require("path");
const config = require("./config").config;

/**
 * Creates a thumbnail for the given image.
 * @param {string} absoluteFileName the absolute image file name.
 * @return {Promise<string>} a promise of the thumbnail hash.
 */
exports.createThumbnail = function (absoluteFileName) {
    return jimp.read(absoluteFileName).then((image) => {
        const w = image.bitmap.width;
        const h = image.bitmap.height;
        const thumbnailPath = path.resolve(
            config.thumbnailFolder,
            path.basename(absoluteFileName, path.extname(absoluteFileName)) +
                ".jpg"
        );
        return new Promise(function (resolve, reject) {
            image.resize(
                w >= h ? 154 : jimp.AUTO,
                w <= h ? 154 : jimp.AUTO,
                jimp.RESIZE_BICUBIC
            );
            image.write(thumbnailPath, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                console.info(`Created thumbnail : ${thumbnailPath}`);
                resolve(image.hash());
            });
        });
    });
};
