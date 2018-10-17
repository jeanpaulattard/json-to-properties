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

        if (json[key] && typeof json[ key ] === 'object') {
            var _currPrefix = key.concat('.');
            _prefix = prefix ? prefix.concat(_currPrefix) : _currPrefix;
            result = result.concat(exports.deflate(json[ key ], _prefix));
        } else {
            _prefix = prefix ? prefix.concat(key) : key;
            result.push(_prefix.concat('=').concat(json[ key ] || ''));
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
    if (keys.length === 0) {
        return value;
    } else {
        var key = keys[ 0 ];
        if (typeof result[key] === 'string') {
            // if we reached a level === string, return array of keys to combine
            return keys;
        } else if (typeof result[key] === 'object' && keys.length === 1) {
            // if we reached a bottom level === object, deflate its properties
            var r = result[key];
            for (var k in r) {
                if (r.hasOwnProperty(k)) {
                    result[key.concat('.', k)] = r[k];
                }
            }

            // and save new property
            result[key] = value;

            return result;
        } else {
            var item = null;
            do {
                keys = item === null
                    ? keys.slice(1) // do recursive insert
                    : [item.slice(0, 2).join('.')].concat(item.slice(2)); // otherwise if an array was returned,
                                                                        // combine first two keys into one key for insert
                item = inflateItem(keys, value, typeof result[ key ] !== 'undefined' ? result[key] : {});
            } while(Array.isArray(item));

            result[key] = item;

            return result;
        }
    }
};
exports.inflate = function (lines) {
    var result = {};

    lines.forEach(function (line) {
        var divider = line.indexOf('='); // Identify the index of the first occurrence of the = symbol
        var key = line.slice(0, divider); // Extract the key from the line
        var value = line.slice(divider + 1); // Extract the content of the line, and exclude the divider

        var keys = key.split('.');
        inflateItem(keys, value, result);
    });

    return result;
};