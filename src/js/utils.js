const Entities = require("html-entities").AllHtmlEntities;
const entities = new Entities();

/**
 * Returns a new rfc4122-v4 compliant UUID
 * Source : @Broofa at http://stackoverflow.com/a/2117523/6335555
 * Full application at https://github.com/broofa/node-uuid - MIT license.
 * @returns {string} the UUID;
 */
exports.uuid = function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
};

/**
 * Encode the given string as a HTML-safe string.
 * @param {string} data the string to encode.
 * @return {string} a safe string
 */
exports.encode = entities.encode;

/**
 * Transorms the given string into a regexpr that matches anything starting by the string.
 * @param {string} data the string to encode
 * @return {Promise<RegExp>} A promise on the encoded regexpr
 */
exports.toStartByRegex = function (data) {
    if (!data.includes("/")) {
        const cleanData = data.replace(
            /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
            "\\$&"
        );
        return Promise.resolve(new RegExp(`^${cleanData}`));
    }
    return Promise.reject(new Error("The input string can't contain a slash."));
};
