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

        if (typeof json[ key ] === 'object') {
            var _currPrefix = key.concat('.');
            _prefix = prefix ? prefix.concat(_currPrefix) : _currPrefix;
            result = result.concat(exports.deflate(json[ key ], _prefix));
        } else {
            _prefix = prefix ? prefix.concat(key) : key;
            var value = json[key];
            if (typeof value === 'string'
                && (value === "null"
                    || value === "true"
                    || value === "false"
                    || isNumeric(value)
                )) {
                value = '"' + value + '"';
            }
            result.push(_prefix.concat('=').concat(value));
        }
    });

    return result;
};


/**
 * Inflates the given array of lines into a JSON structure. Example:
 *  lines = [
 *      'KEYA.KEY1=Value A1',
 *      'KEYA.KEY2=Value A2',
 *      'KEYB.KEY2.KEY3=Value A23'
 *  ]
 *
 *  result in
 *
 *  {
 *      KEYA: {
 *          KEY1:'Value A1',
 *          KEY2:'Value A2'
 *      },
 *      KEYB: {
 *          KEY2: {
 *              KEY3: 'Value A23'
 *          }
 *      }
 *  }
 *
 * @param keys An array of keys whose concatenation reconstructs the original key in the properties file
 * @param value The value to insert at the bottom most key
 * @param result The JSON object to append to
 * @returns {{}}
 */
var inflateItem = function (keys, value, result) {
    var key = keys[ 0 ];
    var index = Number.parseInt(key);
    if (Number.isInteger(index)) {
        key = index;
        if (Object.keys(result).length === 0 && result.constructor === Object) {
            result = [];
        }
    }

    if (keys.length === 1) {
        if (value === '"null"'
            || value === '"true"'
            || value === '"false"'
            || (value.length >= 3 && value.startsWith('"')) && isNumeric(value.substring(1, value.length - 1))
        ) {
            value = value.substring(1, value.length - 1);
        }
        result[ key ] = value;
        return result;
    } else {
        result[ key ] = inflateItem(keys.slice(1), value, result[ key ] || {});
        return result;
    }
};
exports.inflate = function (lines) {
    var result = {};

    lines.forEach(function (line) {
        var divider = line.indexOf('='); // Identify the index of the first occurrence of the = symbol
        var key = line.slice(0, divider); // Extract the key from the line
        var value = line.slice(divider + 1); // Extract the content of the line, and exclude the divider
        // Use the JSON value instead of a string if the value is one of the following
        if (value === "null"
            || value === "true"
            || value === "false"
            || isNumeric(value)) {
                value = JSON.parse(value);
        }

        var keys = key.split('.');
        inflateItem(keys, value, result);
    });

    return result;
};

function isNumeric(value) {
    return (+value === +value && +parseFloat(value) === +parseFloat(value));
}
