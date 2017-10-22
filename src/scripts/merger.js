var files = require('./files');

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

            if (collection.items) {
                collection.items.forEach(function (item) {
                    items.push(prefix.toUpperCase().concat('.').concat(item));
                });
            }
        });

        files.writeAsProperties(dir, file, items);
    };
};