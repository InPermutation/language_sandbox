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

        var output = f.ptol(list).join('');
        console.log(output);
});

var _ = function(x) { return function() { return x; } }


var SOLVE = module.exports.SOLVE = function SOLVE(pairlist) {
    return f.MAP(function(x) { return f.EQUAL(x, 'T')(_('U'), _(x)); }, pairlist);
}

