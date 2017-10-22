#!/usr/bin/env node
'use strict';

var fs = require('fs');
var program = require('commander');
var processor = require('./scripts/processor');

program
    .option('-r, --reverse', 'Perform the reverse process, creating a json structure from a .properties file')
    .option('-m, --merge [file name]', 'Bundles the content of all the generated properties file into one file, prefixed by the name of the file. When used with -r --reverse option, the specified file is unmerged in separate json files represented by the initial key of each group.')
    .option('-s, --spaces <spaces>', 'The amount of spaces per line during the properties to json conversion. Defaults to 4.')
    .option('-c, --config <config>', 'A file in json format having a src and dist attribute, pointing to the source directory where the input files are located, and a destination directory where the output files are written.')
    .parse(process.argv);

var options = {};
if (program.reverse) {
    options.reverse = true;
}

if (program.spaces) {
    options.spaces = +program.spaces;
}

if (program.merge) {
    // If no file name was provided, program.merge has value 'true'
    if (typeof program.merge === 'boolean') {
        console.log('No file name was provided when using the -m, --merge option. Defaulting to bundle.properties...');
        options.merge = 'bundle.properties';
    } else {
        options.merge = program.merge;
    }
}

if (program.config) {
    // Read the content of the provided config file as string value
    var fileContent = fs.readFileSync(program.config);
    // Parse the file content into a json structure
    var config = JSON.parse(fileContent);
    // Validate the content of the config
    if (config.src && config.dist) {
        options.config = config;
    } else {
        console.error('Config file invalid. Expecting a JSON object with a src and dist attributes');
    }
} else {
    console.log('Operating in current directory...');
}

processor.process(options);