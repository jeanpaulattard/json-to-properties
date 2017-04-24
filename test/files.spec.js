var fs = require('fs'),
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
            var fileArray = ['file1.json', 'file2.json', 'file3.properties', 'file4.xml', 'file5.json', 'file5.txt'];
            fs.readdirSync = sinon.stub().returns(fileArray);

            assert.deepEqual(files.getJsonFiles('some/dir'), ['file1.json', 'file2.json', 'file5.json']);
            assert(fs.readdirSync.calledWith('some/dir'));
        });
    });

    describe('getFileDataAsString', function () {
        it('Should check if the full path exists', function () {
            fs.existsSync = sinon.stub().returns(false);

            files.getFileDataAsString('some/dir', 'file.json');
            assert(fs.existsSync.calledWith('some/dir\\file.json'));
        });

        it('Should log an message and return if the resolved file is nonexistent', function () {
            fs.existsSync = sinon.stub().returns(false);
            console.error = sinon.spy();

            assert.equal(files.getFileDataAsString('some/dir', 'file.json'), undefined);
            assert(console.error.calledWith('The file identified by the full path [ some/dir\\file.json ] is not found.'))
        });

        it('Should return a utf8 encoded string representing the content of the file', function () {
            fs.existsSync = sinon.stub().returns(true);
            fs.readFileSync = sinon.stub().returns('utf8 content');

            assert.equal(files.getFileDataAsString('some/dir', 'file.json'), 'utf8 content');
            assert(fs.readFileSync.calledWith('some/dir\\file.json', 'utf8'));
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
            assert(fs.createWriteStream.calledWith('some/dir\\file.properties', {autoClose: false}));
        });

        it('Should write each item on the entries array to the file', function () {
            fs.existsSync = sinon.stub().returns(true);
            var writeSpy = sinon.spy();
            fs.createWriteStream = sinon.stub().returns({
                end: function () {
                },
                write: writeSpy
            });

            var entries = ['entry1', 'entry2', 'entry3'];
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
});