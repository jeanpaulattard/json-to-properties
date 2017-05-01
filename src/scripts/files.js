var fs = require('fs'),
    readline = require('readline');

var getFiles = function (dir, extension) {
    if (!fs.existsSync(dir)) {
        console.error('The src directory [ ' + dir + ' ] does not exist.');
        return;
    }

    // Set the regex to match any string ending with .json
    var regex = new RegExp('\\.' + extension);
    // Retrieve all the files in the directory
    var files = fs.readdirSync(dir);
    // The identified json file names
    var _files = [];
    if (files) {
        files.forEach(function (file) {
            if (regex.test(file)) {
                _files.push(file);
            }
        });
    }
    return _files;
};

/**
 * Returns an array of file names ending in .json found in the specified directory.
 *
 * @param dir The directory from where the files should be returned
 * @returns {Array} An array of file names ending in .json
 */
exports.getJsonFiles = function (dir) {
    return getFiles(dir, 'json');
};

/**
 * Returns an array of file names ending in .properties found in the specified directory.
 *
 * @param dir The directory from where the files should be returned
 */
exports.getPropertiesFiles = function (dir) {
    return getFiles(dir, 'properties');
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
 * Given a directory and a file name identifying a .properties file, reads each line of the file adding it to an array,
 * that is then resolved within a promise once the file is full ready.
 *
 * @param dir The directory the file is located
 * @param file The name of the file to read
 * @returns {Promise} A promise that is resolved once the end of file is reached. Resolves with an array of lines,
 *     where each line represents a line entry within the file
 */
exports.getFileDataAsLines = function (dir, file) {
    var fullPath = dir + '\\' + file;
    if (!fs.existsSync(fullPath)) {
        console.error('The file identified by the full path [ ' + fullPath + ' ] is not found.');
        return;
    }

    var inputStream = fs.createReadStream(fullPath);
    var reader = readline.createInterface({
        input: inputStream
    });

    var lines = [];
    reader.on('line', function (line) {
        lines.push(line);
    });

    var promise = new Promise(function (resolve) {
        reader.on('close', function () {
            resolve(lines);
        });
    });

    return promise;
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

/**
 * Writes the given json string in a .json file whose name is the same as the provided file name, within the provided
 * directory.
 *
 * @param dir The directory where to save the file
 * @param file The full file name including .properties extension
 * @param json The JSON string to write to disk. ( Result of JSON.stringify(...) )
 */
exports.writeAsJson = function (dir, file, json) {
    if (!fs.existsSync(dir)) {
        console.error('The output directory [ ' + dir + ' ] is not a valid directory');
        return;
    }

    var fileName = file.substr(0, file.length - 11); //Omit the .properties extension from the file name
    var writeStream = fs.createWriteStream(dir.concat('\\').concat(fileName.concat('.json')), {
        autoClose: false
    });

    writeStream.write(json);
    writeStream.end();
};