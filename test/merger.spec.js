var merger = require('../src/scripts/merger'),
    parser = require('../src/scripts/parser'),
    files = require('../src/scripts/files'),
    sinon = require('sinon'),
    assert = require('assert');

describe('merger', function () {
    describe('addCollection', function () {
        it('Should add the passed data to the object\'s collections array', function () {
            var _merger = new merger.Merger();
            _merger.addCollection('my-file', [ 'value1', 'value2' ]);

            assert.deepEqual(_merger.collections, [ { file: 'my-file', items: [ 'value1', 'value2' ] } ]);
        });
    });

    describe('merge', function () {
        it('Should merge the contents of the collections into a single array and written as a properties file', function () {
            var _merger = new merger.Merger();

            _merger.addCollection('en.json', [ 'value1', 'value2' ]);
            _merger.addCollection('it.json', [ 'value3', 'value4' ]);

            files.writeAsProperties = sinon.spy();

            _merger.merge('my/dir', 'bundle.properties');

            assert(files.writeAsProperties.calledWith('my/dir', 'bundle.properties', [
                'EN.value1',
                'EN.value2',
                'IT.value3',
                'IT.value4'
            ]));
        });

        it('Should replace the . in the generated prefix with _', function () {
            var _merger = new merger.Merger();

            _merger.addCollection('zh.tw.json', [ 'value1', 'value2' ]);

            files.writeAsProperties = sinon.spy();

            _merger.merge('my/dir', 'bundle.properties');

            assert(files.writeAsProperties.calledWith('my/dir', 'bundle.properties', [
                'ZH_TW.value1',
                'ZH_TW.value2'
            ]));
        });
    });

    describe('reverse', function () {
        it('Should write as json the children of the first level keys', function (done) {
            var lines = [ 'line1', 'line2' ];
            var promise = Promise.resolve(lines);
            var dataLinesStub = sinon.stub(files, 'getFileDataAsLines').returns(promise);

            files.writeAsJson = sinon.spy();

            var inflated = {
                en: { key1: 'hello' },
                IT: { key1: 'ciao' }
            };

            var inflateStub = sinon.stub(parser, 'inflate').returns(inflated);

            var dist = 'my/dist';
            var src = 'my/src';
            var file = 'bundle.properties';
            var spaces = 2;

            var jsonStub = sinon.stub(JSON, 'stringify').returns('stringifiedstring');

            var _merger = new merger.Merger();
            _merger.reverse(src, dist, file, spaces);

            promise.then(function () {
                assert(dataLinesStub.calledWith(src, file));
                assert(inflateStub.calledWith(lines));

                assert(jsonStub.calledWith(inflated.en, null, spaces));
                assert(jsonStub.calledWith(inflated.IT, null, spaces));

                assert(files.writeAsJson.calledWith(dist, 'en_rm', 'stringifiedstring'));
                assert(files.writeAsJson.calledWith(dist, 'it_rm', 'stringifiedstring'));

                dataLinesStub.restore();
                parser.inflate.restore();
            }).then(done, done);
        });
    });
});
