var f = require('../f')
// A few lines of procedural I/O and translation:
var buffer = '';
process.stdin.resume();
process.stdin.on('data', function(chunk) {
        buffer += chunk;
});
process.stdin.on('end', function() {
        var pairs = f.ltop(buffer.split(''));

        var list = SOLVE(pairs);

        var output = f.ptol(list).map(f.ptoi).join(' ');
        process.stdout.write(output+"\n");
});

var _ = function(x) { return function() { return x; } }


// Here's the actual meat of the solution
var INCREMENT_APPROPRIATE = 
    module.exports.INCREMENT_APPROPRIATE =
    function INCREMENT_APPROPRIATE(counts, nucleotide) {
        return f.EQUAL('A', nucleotide)(
                _(f.INCR_AT(f.ZERO, counts)), 
                _(f.EQUAL('C', nucleotide)(
                    _(f.INCR_AT(f.ONE, counts)), 
                    _(f.EQUAL('G', nucleotide)(
                        _(f.INCR_AT(f.TWO, counts)), 
                        _(f.EQUAL('T', nucleotide)(
                            _(f.INCR_AT(f.THREE, counts)), 
                            _(counts)
                        ))
                    ))
                ))
               );
    }


var SOLVE = module.exports.SOLVE = function SOLVE(pairlist) {
    var INITIAL_SCORES = f.REPEAT(f.FOUR, _(f.ZERO));
    return f.REDUCE(INCREMENT_APPROPRIATE, INITIAL_SCORES, pairlist);
}

