const path = require("path");
const fs = require("fs");
const config = require("./config").config;
const uuid = require("./utils").uuid;
const toStartByRegex = require("./utils").toStartByRegex;

const collectionNames = {
    images: "pictures",
    tags: "tags",
    tagcounts: "tag_counts",
};

/**
 * @typedef {{ _id: string, url: string, tags: string[] }} ImageData
 * @typedef {{ _id: string, name: string, type: string }} TagData
 * @typedef {{ name: string, count: number }} TagCountData
 */

/** @type {ImageData[]} */
exports.images = [];

/** @type {TagData[]} */
exports.tags = [];

/** @type {TagCountData[]} */
exports.tagcounts = [];

function saveToMem() {
    const images_file_path = path.join(
        config.database,
        `${collectionNames.images}.json`
    );
    const images_data = JSON.stringify(exports.images);
    if (fs.existsSync(images_file_path)) fs.unlinkSync(images_file_path);
    fs.writeFileSync(images_file_path, images_data);

    const tags_file_path = path.join(
        config.database,
        `${collectionNames.tags}.json`
    );
    const tags_data = JSON.stringify(exports.tags);
    if (fs.existsSync(tags_file_path)) fs.unlinkSync(tags_file_path);
    fs.writeFileSync(tags_file_path, tags_data);

    const tag_counts_file_path = path.join(
        config.database,
        `${collectionNames.tagcounts}.json`
    );
    const tag_counts_data = JSON.stringify(exports.tagcounts);
    if (fs.existsSync(tag_counts_file_path))
        fs.unlinkSync(tag_counts_file_path);
    fs.writeFileSync(tag_counts_file_path, tag_counts_data);
}

exports.init = function () {
    const images_file_path = path.join(
        config.database,
        `${collectionNames.images}.json`
    );
    if (fs.existsSync(images_file_path)) {
        const images_file_contents = fs.readFileSync(images_file_path);
        const images = JSON.parse(images_file_contents);
        exports.images = images;
    }

    const tags_file_path = path.join(
        config.database,
        `${collectionNames.tags}.json`
    );
    if (fs.existsSync(tags_file_path)) {
        const tags_file_contents = fs.readFileSync(tags_file_path);
        const tags = JSON.parse(tags_file_contents);
        exports.tags = tags;
    }

    const tag_counts_file_path = path.join(
        config.database,
        `${collectionNames.tagcounts}.json`
    );
    if (fs.existsSync(tag_counts_file_path)) {
        const tag_counts_file_contents = fs.readFileSync(tag_counts_file_path);
        const tagcounts = JSON.parse(tag_counts_file_contents);
        exports.tagcounts = tagcounts;
    }

    saveToMem();
};

/**
 * Inserts a new tag in the database
 * @param {string} tagName The name of the tag to insert
 * @returns {Promise<string>} The UUID of the new tag.
 */
exports.insertTag = function (tagName) {
    return new Promise((resolve) => {
        let new_uuid = uuid();
        exports.tags.push(
            Object.assign({}, { name: tagName }, { _id: new_uuid })
        );
        saveToMem();
        resolve(new_uuid);
    });
};

/**
 * Updates the given tag with the given tag data.
 * @param {string} tagName the tag to update
 * @param {{ name: string, type?: string}} tagData the new data to set.
 * @return {Promise<TagData>} the promise of a result.
 */
exports.updateTag = function (tagName, tagData) {
    return new Promise((resolve, reject) => {
        let tag_index = exports.tags.findIndex(function (tag) {
            return tag.name === tagName;
        });
        if (tag_index === -1) {
            reject();
            return;
        }
        exports.tags[tag_index] = Object.assign(
            {},
            exports.tags[tag_index],
            tagData
        );
        saveToMem();
        resolve(Object.assign({}, exports.tags[tag_index]));
    });
};

/**
 * Inserts a new picture based on the picture data.
 * @param {{ thumbnail: string, tags: string[]}} pictureData the picture data to insert
 * @return {Promise<string>} the inserted picture's ID.
 */
exports.insertPicture = function (pictureData) {
    return new Promise((resolve) => {
        let new_uuid = uuid();
        exports.images.push(Object.assign({}, pictureData, { _id: new_uuid }));
        saveToMem();
        resolve(new_uuid);
    });
};

// Pure select

/**
 * Get the list of pictures.
 * @returns {Promise<ImageData[]>} the picture list.
 */
exports.getPictures = function () {
    return new Promise((resolve, reject) => {
        exports.images.map(function (err, result) {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};

/**
 * Get the tag count for an unique tag.
 * @param {string} tagName the name of the tag to retrieve the count for.
 * @return {Promise<number>} a promise on the count.
 */
exports.getTagCount = function (tagName) {
    return new Promise((resolve, reject) => {
        const result = exports.tagcounts.find((t) => t.name === tagName);
        resolve(result ? result.count : 0);
    });
};

exports.deletePicture = function (pictureID) {
    let image_index = exports.images.findIndex(function (i) {
        return i._id === pictureID;
    });
    if (image_index === -1) {
        return;
    }
    delete exports.images[image_index];
    saveToMem();
};

exports.getTags = function (tagName) {
    return new Promise((resolve) => {
        const regex = new RegExp(
            `^${tagName.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")}`
        );
        const result = exports.tags.filter(function (tag) {
            return regex.test(tag.name);
        });
        resolve(result);
    });
};

/**
 * Get the tag information for a given tag
 * @param {string} tagName the tag name to match
 * @return {Promise<TagData>} the promise of the match.
 */
exports.getTagDataByName = function (tagName) {
    return new Promise((resolve) => {
        const result = exports.tags.find(function (tag) {
            return tag.name === tagName;
        });
        resolve(result);
    });
};

exports.setTag = function (pictureID, tagName) {
    let image_index = exports.images.findIndex(function (i) {
        return i._id === pictureID;
    });
    if (image_index === -1) {
        return;
    }

    if (
        !exports.tags.some(function (t) {
            return t.name == tagName;
        })
    ) {
        exports.insertTag(tagName);
    }

    exports.images[image_index].tags.push(tagName);
    saveToMem();
};

exports.deleteTag = function (pictureID, tagName) {
    return new Promise((resolve, reject) => {
        let image_index = exports.images.findIndex(function (i) {
            return i._id === pictureID;
        });
        if (image_index === -1) {
            reject();
            return;
        }

        exports.images[image_index].tags = exports.images[
            image_index
        ].tags.filter(function (t) {
            return t != tagName;
        });
        saveToMem();
        resolve();
    });
};

/**
 * Update the given picture
 * @param {string} pictureID the picture ID
 * @param {ImageData} pictureData the picture data.
 * @return {Promise<void>} the promise.
 */
exports.updatePicture = function (pictureID, pictureData) {
    return new Promise((resolve) => {
        let image_index = exports.images.findIndex(function (i) {
            return i._id === pictureID;
        });
        if (image_index === -1) {
            return;
        }

        exports.images[image_index] = Object.assign(
            {},
            exports.images[image_index],
            pictureData
        );
        saveToMem();
        resolve();
    });
};

exports.getCountByTagList = function (tagList) {
    return new Promise((resolve) => {
        let tagListArray = tagList;
        if (!Array.isArray(tagList)) tagListArray = [tagList];
        const images = exports.images.filter(function (image) {
            for (const tag of tagListArray) {
                if (image.tags.indexOf(tag) === -1) return false;
            }
            return true;
        });

        resolve(images.length);
    });
};

exports.getPictureData = function (pictureID) {
    return new Promise((resolve, reject) => {
        let image_index = exports.images.findIndex(function (i) {
            return i._id === pictureID;
        });
        if (image_index === -1) {
            reject();
            return;
        }

        resolve(Object.assign({}, exports.images[image_index]));
    });
};

exports.getPicturesByTag = function (tagList, skip, limit) {
    return new Promise((resolve) => {
        let tagListArray = tagList;
        if (!Array.isArray(tagList)) tagListArray = [tagList];
        const images = exports.images
            .filter(function (image) {
                for (const tag of tagListArray) {
                    if (image.tags.indexOf(tag) === -1) return false;
                }
                return true;
            })
            .slice(skip, limit - skip);
        resolve(images);
    });
};

exports.updateTagCounts = function () {
    for (const tag of exports.tags) {
        const tagName = tag.name;
        const imageCount = exports.images.filter((i) =>
            i.tags.some((t) => t === tagName)
        ).length;
        const entry = exports.tagcounts.find((t) => t.name === tagName);
        if (entry) {
            entry.count = imageCount;
            continue;
        }
        exports.tagcounts.push({
            name: tagName,
            count: imageCount,
        });
    }
    saveToMem();
    return Promise.resolve();
};
