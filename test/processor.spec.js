var assert = require('assert'),
    fs = require('fs'),
    files = require('../src/scripts/files'),
    parser = require('../src/scripts/parser'),
    processor = require('../src/scripts/processor'),
    sinon = require('sinon');

describe('processor', function () {
    describe('processOptions', function () {
        describe('reverse === false', function () {
            var opts = {
                reverse: false,
                config: { src: 'src/path', dist: 'dist/path' }
            };

            it('Should retrieve the json files in the src directory', function () {
                files.getJsonFiles = sinon.stub().returns([]);

                processor.processOptions(opts);
                assert(files.getJsonFiles.calledWith('src/path'));
            });

            it('Should convert the json files into properties files', function () {
                files.getJsonFiles = sinon.stub().returns([ 'file1.json', 'file2.json' ]);
                files.getFileDataAsString = sinon.stub().returns('data');
                files.writeAsProperties = sinon.spy();

                JSON.parse = sinon.stub().returns({ some: 'key' });
                parser.deflate = sinon.stub().returns([ 'entry1', 'entry2' ]);

                processor.processOptions(opts);

                assert(files.getFileDataAsString.calledWith('src/path', 'file1.json'));
                assert(files.getFileDataAsString.calledWith('src/path', 'file2.json'));

                assert(JSON.parse.calledWith('data'));
                assert(parser.deflate.calledWith({ some: 'key' }));

                assert(files.writeAsProperties.calledWith('dist/path', 'file1.json', [ 'entry1', 'entry2' ]));
                assert(files.writeAsProperties.calledWith('dist/path', 'file2.json', [ 'entry1', 'entry2' ]));
            });
        });
    });

    describe('process', function () {
        it('Should call process options with the default options if non are provided', function () {
            process.cwd = sinon.stub().returns('some/path');
            processor.processOptions = sinon.spy();

            processor.process({});
            var defaultOpts = {
                config: { src: 'some/path', dist: 'some/path' },
                reverse: false,
                timestamp: false
            };
            assert(processor.processOptions.calledWith(defaultOpts));
        });

        it('Should call process options with the provided options', function () {
            processor.processOptions = sinon.spy();

            processor.process({ config: { src: 'path/one', dist: 'path/two' } });
            var opts = {
                config: { src: 'path/one', dist: 'path/two' },
                reverse: false,
                timestamp: false
            };
            assert(processor.processOptions.calledWith(opts));
        });
    });
});