var parser = require('../src/scripts/parser'),
    assert = require('assert');

describe('parser', function () {
    describe('deflate', function () {
        it('{ A:1, B:2} => [ "A=1","B=2"]', function () {
            var input = {
                A: 1,
                B: 2,
                C:true
            };

            assert.deepStrictEqual(parser.deflate(input), [ 'A=1', 'B=2','C=true' ]);
        });

        it('{ A:"null", B:"true", C:"false", D:"1"} => [ "A=\"null\"","B=\"true\"", "C=\"false\", "D=\"1\""]', function () {
            var input = {
                A: "null",
                B: "true",
                C: "false",
                D: "1"
            };

            var output = [ 'A="null"', 'B="true"', 'C="false"', 'D="1"' ];
            assert.deepStrictEqual(parser.deflate(input), output);
        });

         it('{ A: { B: 1, C:2 } } => [ "A.B=1", "A.C=2" ]', function () {
            var input = { A: { B: 1, C: 2 } };

            assert.deepStrictEqual(parser.deflate(input), [ 'A.B=1', 'A.C=2' ]);
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
            assert.deepStrictEqual(parser.deflate(input), output);
        });

        it('{A:[1,2]} => ["A.0=1", "A.1=2"]', function(){
            var input = {
                A: [1,2]
            };
            var output = ['A.0=1' , 'A.1=2'];
            assert.deepStrictEqual(parser.deflate(input), output);
        });
    });

    describe('inflate', function () {
        it('[ "A=1","B=2"] => { A:1, B:2}', function () {
            var input = [ 'A=1', 'B=2' ];

            var output = {
                A: 1,
                B: 2
            };

            assert.deepStrictEqual(parser.inflate(input), output);
        });

        it('[A=null, B=true, C=false, D=1, foo=bar] => {A:null, B:true, C:false, D:1, foo:bar}',function(){
            var input = ['A=null', 'B=true', 'C=false', 'D=1', 'foo=bar'];
            var output = {A:null, B:true, C:false, D:1, foo:'bar'};
            assert.deepStrictEqual(parser.inflate(input), output);
        });

        it('[A="null", B="true", C="false"] => {A:"null", B:"true", C:"false", D:"1"}',function(){
            var input = ['A="null"', 'B="true"', 'C="false"', 'D="1"'];
            var output = {A:"null", B:"true", C:"false", D:"1"};
            assert.deepStrictEqual(parser.inflate(input), output);
        });


        it('[ "A.B=1", "A.C=2" ] => { A: { B: 1, C:2 } }', function () {
            var input = [ 'A.B=1', 'A.C=2' ];

            var output = { A: { B: 1, C: 2 } };

            assert.deepStrictEqual(parser.inflate(input), output);
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
            assert.deepStrictEqual(parser.inflate(input), output);
        });

        it('["A.0=1", "A.1=2"] => {A:[1,2]}', function () {
            var input = ['A.0=1' , 'A.1=2'];

            var output = { A: [1,2] };

            var inflate = parser.inflate(input);
            assert.deepStrictEqual(inflate, output);
        });

    });
});
