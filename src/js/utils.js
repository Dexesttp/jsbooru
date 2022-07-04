const entities = require("html-entities");

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
 * @param {string} string_to_match the string to encode and match
 * @return {RegExp} The regexp wanted
 */
exports.startsWithRegex = function (string_to_match) {
    if (!string_to_match.includes("/")) {
        const cleanData = string_to_match.replace(
            /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
            "\\$&"
        );
        return new RegExp(`^${cleanData}`);
    }
    throw new Error("The input string can't contain a slash.");
};

/**
 * Transorms the given string into a regexpr that matches anything containing the string.
 * @param {string} string_to_match the string to encode and match
 * @return {RegExp} The regexp wanted
 */
exports.containsRegex = function (string_to_match) {
    if (!string_to_match.includes("/")) {
        const cleanData = string_to_match.replace(
            /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
            "\\$&"
        );
        return new RegExp(`${cleanData}`);
    }
    throw new Error("The input string can't contain a slash.");
};
