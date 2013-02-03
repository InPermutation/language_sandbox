var f = require('../f')
// A few lines of procedural I/O and translation:
var buffer = '';
process.stdin.resume();
process.stdin.on('data', function(chunk) {
        buffer += chunk;
});
process.stdin.on('end', function() {
        var strands = buffer.split(/[^GATC]/);

        var dist = SOLVE(f.ltop(strands[0]), f.ltop(strands[1]));

        console.log(f.ptoi(dist).toString(10));
});

var _ = function(x) { return function() { return x; } }

function HAMMING(a, b, r) {
    return f.IS_NIL(a)(
        _(r),
        function() { 
            return f.EQUAL(f.CAR(a), f.CAR(b))(
                function() { return HAMMING(f.CDR(a), f.CDR(b), r); },
                function() { return HAMMING(f.CDR(a), f.CDR(b), f.INCR(r)); })
        });
}
var SOLVE = module.exports.SOLVE = function SOLVE(a, b) {
    return HAMMING(a, b, f.ZERO);
}

