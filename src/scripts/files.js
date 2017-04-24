var fs = require('fs');

/**
 * Returns an array of file names ending in .json found in the specified directory.
 *
 * @param dir The directory from where the files should be returned
 * @returns {Array} An array of file names ending in .json
 */
exports.getJsonFiles = function (dir) {
    if (!fs.existsSync(dir)) {
        console.error('The src directory [ ' + dir + ' ] does not exist.');
        return;
    }

    // Set the regex to match any string ending with .json
    var regex = new RegExp(/\.json$/);
    // Retrieve all the files in the directory
    var files = fs.readdirSync(dir);
    // The identified json file names
    var jsonFiles = [];
    if (files) {
        files.forEach(function (file) {
            if (regex.test(file)) {
                jsonFiles.push(file);
            }
        });
    }

    return jsonFiles;
};

/**
 * Given a directory and file name, reads the content of the file and returns it as utf8 encoded string.
 *
 * @param dir The directory the file is located
 * @param file The name of the file to read
 * @returns The file data represented as a utf8 encoded string
 */
exports.getFileDataAsString = function (dir, file) {
    var fullPath = dir + '\\' + file;
    if (!fs.existsSync(fullPath)) {
        console.error('The file identified by the full path [ ' + fullPath + ' ] is not found.');
        return;
    }

    return fs.readFileSync(fullPath, 'utf8');
};

/**
 * Writes each item on the entries array in a .properties file whose name is the same as the provided file name, within
 * the provided directory.
 *
 * @param dir The directory where to save the file
 * @param file The full file name including .json extension
 * @param entries An array of strings to write to the file
 */
exports.writeAsProperties = function (dir, file, entries) {
    if (!fs.existsSync(dir)) {
        console.error('The output directory [ ' + dir + ' ] is not a valid directory');
        return;
    }

    var fileName = file.substr(0, file.length - 5); // Omit the .json extension from the file name
    var writeStream = fs.createWriteStream(dir.concat('\\').concat(fileName.concat('.properties')), {
        autoClose: false
    });

    entries.forEach(function (entry) {
        writeStream.write(entry.concat('\n'));
    });
    writeStream.end(); // Close the write stream
};