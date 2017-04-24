/**
 * Deflates the given JSON structure into an array of strings in the format
 *   <key>=<value>
 * where key is a string constructed from traversing the json hierarchy, and value is the bottom most string value for
 * that particular hierarchy traversal.
 *
 * @param json
 * @param prefix
 * @returns {Array}
 */
exports.deflate = function (json, prefix) {
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function (key) {
        var _prefix;

        if (typeof json[key] === 'object') {
            var _currPrefix = key.concat('.');
            _prefix = prefix ? prefix.concat(_currPrefix) : _currPrefix;
            result = result.concat(exports.deflate(json[key], _prefix));
        } else {
            _prefix = prefix ? prefix.concat(key) : key;
            result.push(_prefix.concat('=').concat(json[key]));
        }
    });

    return result;
};