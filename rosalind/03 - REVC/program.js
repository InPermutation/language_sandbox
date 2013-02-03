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

var EQ = f.EQUAL;
var COMPLEMENT = module.exports.COMPLEMENT = function COMPLEMENT(nt) {
    return EQ(nt, 'A')(_('T'),
          _(EQ(nt, 'T')(_('A'),
          _(EQ(nt, 'G')(_('C'),
          _(EQ(nt, 'C')(_('G'),
          _(nt))))))));
};

var SOLVE = module.exports.SOLVE = function SOLVE(pairlist) {
    return f.REVERSE(f.MAP(COMPLEMENT, pairlist));
}

