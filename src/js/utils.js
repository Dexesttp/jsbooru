
/**
 * Returns a new rfc4122-v4 compliant UUID  
 * Source : @Broofa at http://stackoverflow.com/a/2117523/6335555  
 * Full application at https://github.com/broofa/node-uuid - MIT license.
 * @returns {string} the UUID;
 */
exports.uuid = function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};