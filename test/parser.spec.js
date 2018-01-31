var parser = require('../src/scripts/parser'),
    assert = require('assert');

describe('parser', function () {
    describe('deflate', function () {
        it('{ A:"1", B:"2"} => [ "A=1","B=2"]', function () {
            var input = {
                A: 1,
                B: 2
            };

            assert.deepEqual(parser.deflate(input), [ 'A=1', 'B=2' ]);
        });

        it('{ A:null } => [ "A=" ]', function () {
            var input = {
                A: null
            };

            assert.deepEqual(parser.deflate(input), [ 'A=' ]);
        });

        it('{ A: { B: 1, C:2 } } => [ "A.B=1", "A.C=2" ]', function () {
            var input = { A: { B: 1, C: 2 } };

            assert.deepEqual(parser.deflate(input), [ 'A.B=1', 'A.C=2' ]);
        });

        it('{ A: 1, B: { C: { D:2, E:3 }, F:4, G: { H:5, I:6 } } => ["A=1", "B.C.D=2", "B.C.E=3", "B.F=4", "B.G.H=5", "B.G.I=6" ]', function () {
            var input = {
                A: 1,
                B: {
                    C: { D: 2, E: 3 },
                    F: 4,
                    G: { H: 5, I: 6 }
                }
            };

            var output = [ 'A=1', 'B.C.D=2', 'B.C.E=3', 'B.F=4', 'B.G.H=5', 'B.G.I=6' ];
            assert.deepEqual(parser.deflate(input), output);
        });
    });

    describe('inflate', function () {

        it('[ "A=" ] => { A:"" }', function () {
            var input = [ 'A=' ];

            var output = {
                A: ""
            };

            assert.deepEqual(parser.inflate(input), output);
        });

        it('[ "A=1","B=2"] => { A:"1", B:"2"}', function () {
            var input = [ 'A=1', 'B=2' ];

            var output = {
                A: 1,
                B: 2
            };

            assert.deepEqual(parser.inflate(input), output);
        });

        it('[ "A.B=1", "A.C=2" ] => { A: { B: 1, C:2 } }', function () {
            var input = [ 'A.B=1', 'A.C=2' ];

            var output = { A: { B: 1, C: 2 } };

            assert.deepEqual(parser.inflate(input), output);
        });

        it('[ "A=1", "B.C.D=2", "B.C.E=3", "B.F=4", "B.G.H=5", "B.G.I=6" ] => { A: 1, B: { C: { D:2, E:3 }, F:4, G: { H:5, I:6 } }', function () {
            var input = [ 'A=1', 'B.C.D=2', 'B.C.E=3', 'B.F=4', 'B.G.H=5', 'B.G.I=6' ];

            var output = {
                A: 1,
                B: {
                    C: { D: 2, E: 3 },
                    F: 4,
                    G: { H: 5, I: 6 }
                }
            };
            assert.deepEqual(parser.inflate(input), output);
        });
    });
});
