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

function HAMMING(pair) {
    return f.EQUAL(f.CAR(pair), f.CAR(f.CDR(pair)))(_(f.ZERO), _(f.ONE));
}
function SUM(nums) {
    return f.REDUCE(f.ADD, f.ZERO, nums);
}
var SOLVE = module.exports.SOLVE = function SOLVE(a, b) {
    return SUM(f.MAP(HAMMING, f.ZIP(a, b)));
}

