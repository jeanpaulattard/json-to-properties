var fs = require('fs'),
    readline = require('readline'),
    files = require('../src/scripts/files'),
    sinon = require('sinon'),
    assert = require('assert');

describe('files', function () {

    describe('getJsonFiles', function () {
        it('Should log a message and return if the provided directory does not exist', function () {
            fs.existsSync = sinon.stub().returns(false);
            console.error = sinon.spy();

            assert.equal(files.getJsonFiles('some/dir'), undefined);
            assert(fs.existsSync.calledWith('some/dir'));
            assert(console.error.calledWith('The src directory [ some/dir ] does not exist.'));
        });

        it('Should return the files within the specified dir ending in .json only', function () {
            fs.existsSync = sinon.stub().returns(true);
            var fileArray = [ 'file1.json', 'file2.json', 'file3.properties', 'file4.xml', 'file5.json', 'file5.txt' ];
            fs.readdirSync = sinon.stub().returns(fileArray);

            assert.deepEqual(files.getJsonFiles('some/dir'), [ 'file1.json', 'file2.json', 'file5.json' ]);
            assert(fs.readdirSync.calledWith('some/dir'));
        });
    });


    describe('getPropertiesFiles', function () {
        it('Should log a message and return if the provided directory does not exist', function () {
            fs.existsSync = sinon.stub().returns(false);
            console.error = sinon.spy();

            assert.equal(files.getPropertiesFiles('some/dir'), undefined);
            assert(fs.existsSync.calledWith('some/dir'));
            assert(console.error.calledWith('The src directory [ some/dir ] does not exist.'));
        });

        it('Should return the files within the specified dir ending in .properties only', function () {
            fs.existsSync = sinon.stub().returns(true);
            var fileArray = [ 'file1.json', 'file2.json', 'file3.properties', 'file4.xml', 'file5.json', 'file5.txt' ];
            fs.readdirSync = sinon.stub().returns(fileArray);

            assert.deepEqual(files.getPropertiesFiles('some/dir'), [ 'file3.properties' ]);
            assert(fs.readdirSync.calledWith('some/dir'));
        });
    });

    describe('getFileDataAsString', function () {

        it('Should check if the full path exists', function () {
            fs.existsSync = sinon.stub().returns(false);

            files.getFileDataAsString('some/dir', 'file.json');
            assert(fs.existsSync.calledWith('some/dir/file.json'));
        });

        it('Should log an error and return if the resolved file is nonexistent', function () {
            fs.existsSync = sinon.stub().returns(false);
            console.error = sinon.spy();

            assert.equal(files.getFileDataAsString('some/dir', 'file.json'), undefined);
            assert(console.error.calledWith('The file identified by the full path [ some/dir/file.json ] is not found.'))
        });

        it('Should return a utf8 encoded string representing the content of the file', function () {
            fs.existsSync = sinon.stub().returns(true);
            fs.readFileSync = sinon.stub().returns('utf8 content');

            assert.equal(files.getFileDataAsString('some/dir', 'file.json'), 'utf8 content');
            assert(fs.readFileSync.calledWith('some/dir/file.json', 'utf8'));
        });
    });

    describe('getFileDataAsLines', function () {
        it('Should check if the full path exists', function () {
            fs.existsSync = sinon.stub().returns(false);

            files.getFileDataAsLines('some/dir', 'file.properties');
            assert(fs.existsSync.calledWith('some/dir/file.properties'));
        });

        it('Should log an error and return if the resolved file is nonexistent', function () {
            fs.existsSync = sinon.stub().returns(false);
            console.error = sinon.spy();

            assert.equal(files.getFileDataAsLines('some/dir', 'file.properties'), undefined);
            assert(console.error.calledWith('The file identified by the full path [ some/dir/file.properties ] is not found.'))
        });

        it('Should resolve the returned promise with the file lines once it completes', function (done) {
            fs.existsSync = sinon.stub().returns(true);
            fs.createReadStream = sinon.stub().returns('astream');
            readline.createInterface = sinon.stub().returns({
                on: function (cmd, callback) {
                    switch (cmd) {
                        case 'line':
                            callback('some line');
                            callback('some line');
                            break;
                        case 'close':
                            callback();
                            break;
                    }
                }
            });

            files.getFileDataAsLines('some/dir', 'file.properties').then(function (items) {
                assert.deepEqual(items, [ 'some line', 'some line' ]);
            }).then(done, done);

            assert(fs.createReadStream.calledWith('some/dir/file.properties'));
            assert(readline.createInterface.calledWith({ input: 'astream' }));
        });

        it('Should not include comment lines; lines starting with a # or ! in the returned list of items', function (done) {
            fs.existsSync = sinon.stub().returns(true);
            fs.createReadStream = sinon.stub().returns('astream');
            readline.createInterface = sinon.stub().returns({
                on: function (cmd, callback) {
                    switch (cmd) {
                        case 'line':
                            callback('#This is a comment');
                            callback('!This is a comment');
                            callback('This is a valid line');
                            break;
                        case 'close':
                            callback();
                            break;
                    }
                }
            });

            files.getFileDataAsLines('some/dir', 'file.properties').then(function (items) {
                assert.deepEqual(items, [ 'This is a valid line' ]);
            }).then(done, done);
        });

        it('Should not include empty lines', function (done) {
            fs.existsSync = sinon.stub().returns(true);
            fs.createReadStream = sinon.stub().returns('astream');
            readline.createInterface = sinon.stub().returns({
                on: function (cmd, callback) {
                    switch (cmd) {
                        case 'line':
                            callback('             ');
                            callback('This is a valid line');
                            break;
                        case 'close':
                            callback();
                            break;
                    }
                }
            });

            files.getFileDataAsLines('some/dir', 'file.properties').then(function (items) {
                assert.deepEqual(items, [ 'This is a valid line' ]);
            }).then(done, done);
        });
    });

    describe('writeAsProperties', function () {
        it('Should log an error to the console and return if the provided directory is nonexistent', function () {
            fs.existsSync = sinon.stub().returns(false);
            console.error = sinon.spy();

            assert.equal(files.writeAsProperties('some/dir', 'file.json', []), undefined);
            assert(fs.existsSync.calledWith('some/dir'));
            assert(console.error.calledWith('The output directory [ some/dir ] is not a valid directory'));
        });

        it('Should create a file in the given directory with the provided file name and a .properties extension', function () {
            fs.existsSync = sinon.stub().returns(true);
            fs.createWriteStream = sinon.stub().returns({
                end: function () {
                }
            });

            files.writeAsProperties('some/dir', 'file.json', []);
            assert(fs.createWriteStream.calledWith('some/dir/file.properties', { autoClose: false }));
        });

        it('Should write each item on the entries array to the file', function () {
            fs.existsSync = sinon.stub().returns(true);
            var writeSpy = sinon.spy();
            fs.createWriteStream = sinon.stub().returns({
                end: function () {
                },
                write: writeSpy
            });

            var entries = [ 'entry1', 'entry2', 'entry3' ];
            files.writeAsProperties('some/dir', 'file.json', entries);

            assert.equal(writeSpy.callCount, 3);
            assert(writeSpy.calledWith('entry1\n'));
            assert(writeSpy.calledWith('entry2\n'));
            assert(writeSpy.calledWith('entry3\n'));
        });

        it('Should close the write stream', function () {
            fs.existsSync = sinon.stub().returns(true);
            var endSpy = sinon.spy();
            fs.createWriteStream = sinon.stub().returns({
                end: endSpy
            });

            files.writeAsProperties('some/dir', 'file.json', []);
            assert(endSpy.called);
        });
    });


    describe('writeAsJson', function () {
        it('Should log an error to the console and return if the provided directory is nonexistent', function () {
            fs.existsSync = sinon.stub().returns(false);
            console.error = sinon.spy();

            assert.equal(files.writeAsJson('some/dir', 'file.properties', ''), undefined);
            assert(fs.existsSync.calledWith('some/dir'));
            assert(console.error.calledWith('The output directory [ some/dir ] is not a valid directory'));
        });

        it('Should create a file in the given directory with the provided file name and a .json extension', function () {
            fs.existsSync = sinon.stub().returns(true);
            fs.createWriteStream = sinon.stub().returns({
                end: function () {
                },
                write: function () {
                }
            });

            files.writeAsJson('some/dir', 'file.properties', []);
            assert(fs.createWriteStream.calledWith('some/dir/file.json', { autoClose: false }));
        });

        it('Should write the provided json string to the file', function () {
            fs.existsSync = sinon.stub().returns(true);
            var writeSpy = sinon.spy();
            fs.createWriteStream = sinon.stub().returns({
                end: function () {
                },
                write: writeSpy
            });

            files.writeAsJson('some/dir', 'file.properties', 'json_string');
            assert(writeSpy.calledWith('json_string'));
        });

        it('Should close the write stream', function () {
            fs.existsSync = sinon.stub().returns(true);
            var endSpy = sinon.spy();
            fs.createWriteStream = sinon.stub().returns({
                end: endSpy,
                write: function () {
                }
            });

            files.writeAsJson('some/dir', 'file.properties', []);
            assert(endSpy.called);
        });
    });
});