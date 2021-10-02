const path = require("path");
const fs = require("fs");
const config = require("./config").config;
const uuid = require("./utils").uuid;

const collectionNames = {
    images: "pictures",
    tags: "tags",
};

/** @type {[{ _id: string, url: string, tags: string[] }]} */
exports.images = [];

/** @type {[{ _id: string, name: string }]} */
exports.tags = [];

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

    saveToMem();
};

exports.insertTag = function (tagName) {
    let new_uuid = uuid();
    exports.tags.push(Object.assign({}, { name: tagName }, { _id: new_uuid }));
    saveToMem();
};

exports.updateTag = function (tagName, tagData) {
    let tag_index = exports.tags.findIndex(function (tag) {
        return tag.name === tagName;
    });
    if (tag_index === -1) {
        return;
    }
    exports.tags[tag_index] = Object.assign(
        {},
        exports.tags[tag_index],
        tagData
    );
    saveToMem();
};

exports.insertPicture = function (pictureData) {
    return new Promise((resolve) => {
        let new_uuid = uuid();
        exports.images.push(Object.assign({}, pictureData, { _id: new_uuid }));
        saveToMem();
        resolve(new_uuid);
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
    let image_index = exports.images.findIndex(function (i) {
        return i._id === pictureID;
    });
    if (image_index === -1) {
        return;
    }

    exports.images[image_index].tags = exports.images[image_index].tags.filter(
        function (t) {
            return t != tagName;
        }
    );
    saveToMem();
};

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
