var fs = require('fs');

exports.getJsonFiles = function (dir) {
    if (!fs.existsSync(dir)) {
        console.log('The src directory [' + dir + '] does not exist.');
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

exports.getFileDataAsString = function (dir, file) {
    var fullPath = dir + '\\' + file;
    if (!fs.existsSync(fullPath)) {
        console.log('The file identified by the full path [' + fullPath + '] is not found.');
        return;
    }

    return fs.readFileSync(fullPath, 'utf8');
};

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