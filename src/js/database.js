const Engine = require("tingodb")();
const config = require("./config").config;

const collectionNames = {
    images: "pictures",
    tags: "tags",
}

exports.init = function() {
    const db = new Engine.Db(config.database, {});

    db.createCollection(collectionNames.images, function(err, images) {
        if(err) throw new Error("Could not initialize images database");
        db.createCollection(collectionNames.tags, function(err, tags) {
            if(err) throw new Error("Could not initialize tags database");
            exports.images = images;
            exports.tags = tags;
        });

    });
}

exports.insertTag = function(tagName) {
    exports.tags.insert({ name: tagName });
}

exports.updateTag = function(tagName, tagData) {
    exports.tags.update({ name: tagName }, { $set: tagData });
}

exports.insertPicture = function(pictureData, callback) {
    exports.images.insert(pictureData, function(err, result) {
        if(err) console.log(err);
        callback(result[0]._id);
    });
}

exports.deletePicture = function(pictureID) {
    exports.images.remove({ _id: pictureID });
}

exports.getTags = function(tagName, callback) {
    exports.tags.find(
        {name: { $regex: new RegExp(`^${tagName.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")}`) } }
    ).toArray(function(err, result) {
        if(err) console.log(err);
        callback(result);
    });
}

exports.setTag = function(pictureID, tagName) {
    exports.tags.update({ name: tagName }, { name: tagName }, {upsert: true});
    exports.images.update({ _id: pictureID }, { $addToSet: {tags: tagName} });
}

exports.deleteTag = function(pictureID, tagName) {
    exports.images.update({ _id: pictureID }, { $pull: {tags: tagName} });
}

exports.updatePicture = function(pictureID, pictureData, callback) {
    exports.images.update(
        { _id: pictureID },
        { $set: pictureData },
    function(err, result) {
        if(err) {
            console.log(err);
            throw new Error(`Could not update the picture ${pictureID} with the values ${pictureData}`);
        }
        callback();
    });
}

exports.getCountByTagList = function(tagList, callback) {
    exports.images.count(
        { tags: { $all: tagList } },
    function(err, count) {
        if(err) {
            console.log(err);
            throw new Error(`Could not retrieve the number of images for the tag ${tagName}`);
        }
        callback(count);
    });
}

exports.getPictureData = function(pictureID, callback) {
    exports.images.findOne(
        { _id: pictureID },
        function(err, result) {
            if(err) console.log(err);
            callback(result);
        }
    );
}

exports.getPicturesByTag = function(tagNames, skip, limit, callback) {
    exports.images.find(
        { tags: { $all: tagNames } },
        { _id: 1, url: 1, tags: 1 },
        {
            skip: skip,
            limit: limit,
        }
    ).toArray(function(err, result) {
        if(err) {
            console.log(err);
            throw new Error(`Could not retrieve the images for the tags ${tagNames}`);
        }
        callback(result);
    });
}
