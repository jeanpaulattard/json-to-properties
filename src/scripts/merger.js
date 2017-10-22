var files = require('./files'),
    parser = require('./parser'),
    fs = require('fs');

exports.Merger = function Merger() {
    this.collections = [];

    this.addCollection = function (fileName, collection) {
        this.collections.push({ file: fileName, items: collection });
    };

    /**
     * Merges all the collections in a single file specified as the destination.
     *
     * @param dir The directory to write to.
     * @param file The destination file name to write to.
     */
    this.merge = function (dir, file) {
        var items = [];
        this.collections.forEach(function (collection) {
            var file = collection.file;
            var prefix = file.substr(0, file.length - 5); // Omit the .json extension from the file name

            // Replace any .s in the generated prefix with underscores... This is required such that the reverse
            // process does not break and retains the original prefixes.
            prefix = prefix.replace(/\./g, '_');

            if (collection.items) {
                collection.items.forEach(function (item) {
                    items.push(prefix.toUpperCase().concat('.').concat(item));
                });
            }
        });

        files.writeAsProperties(dir, file, items);
    };

    /**
     * Unpacks a properties file having merged content where each first level key represents a language. Each group of
     * languages is extracted into its own json files.
     *
     * For the sake of not overriding other json files written as a bi-product of the standard reverse process, the
     * json files obtained as part of this reverse process have appended with a  suffix.
     *
     * @param src The src directory of the bundled properties file
     * @param dist The destination directory where to write the resultant json files.
     * @param file The name of the bundled properties file
     * @param spaces The value to provide to the JSON.stringify method
     */
    this.reverse = function (src, dist, file, spaces) {
        var promise = files.getFileDataAsLines(src, file);
        promise.then(function (lines) {
            var jsonCollection = parser.inflate(lines);

            // Traverse the first level keys... These should be equivalent to the expected language file names
            var keys = Object.keys(jsonCollection);
            keys.forEach(function (key) {
                var fileName = key.toLowerCase().concat('_rm');
                files.writeAsJson(dist, fileName, JSON.stringify(jsonCollection[ key ], null, spaces));
            });
        });
    };
};