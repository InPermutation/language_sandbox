var f = require('../f')
// A few lines of procedural I/O and translation:
var buffer = '';
process.stdin.resume();
process.stdin.on('data', function(chunk) {
        buffer += chunk;
});
process.stdin.on('end', function() {
        var fasta = buffer.split('');

        var pair = SOLVE(f.ltop(fasta));

        var label = f.ptos(CAR(pair));
        var numer = f.ptoi(CAR(CDR(pair)));
        var denom = f.ptoi(CAR(CDR(CDR(pair))));

        console.log(label);
        console.log(numer/denom*100);
});

var _ = function(x) { return function() { return x; } }
var CONS = f.CONS;
var CAR = f.CAR;
var CDR = f.CDR;
var NIL = f.NIL;
var IS_NIL = f.IS_NIL;
var IS_ZERO = f.IS_ZERO;
var NOT = f.NOT;
var FALSE = f.FALSE;
var EQ = f.EQUAL;
var REVERSE = f.REVERSE;
var REDUCE = f.REDUCE;
var MAP = f.MAP;
var INCR = f.INCR;
var DECR = f.DECR;
var ADD = f.ADD;
var ZERO = f.ZERO;

// GC looks like this: [label, numer, denom]
function NO_GC(){
    // ['no', 0, 1]
    return CONS(
        CONS('n', CONS('o', NIL)),
        CONS(
            ZERO,
            CONS(INCR(ZERO), NIL)));
}

// Convert the list [label, strand] into a GC [label, numer, denom]
function GC(list) {
    var label = CAR(list);
    var strand = CAR(CDR(list));

    var counts = REDUCE(function _GC_REDUCE(vals, base){ 
            var n = CAR(vals);
            var d = CAR(CDR(vals));
            var new_n = EQ('C', base)(
                _(INCR(n)),
                _(EQ('G', base)(
                    _(INCR(n)),
                    _(n))));
            return CONS(new_n, CONS(INCR(d), NIL));
        },
        CONS(ZERO, CONS(ZERO, NIL)),
        CAR(CDR(list)));
    
    return CONS(label, counts);
}

// Compare two GCs and return the one with a higher GC-content
function MAX_GC(a, b) {
    function N(gc) { return CAR(CDR(gc)); }
    function D(gc) { return CAR(CDR(CDR(gc))); }

    // cross product
    var Axp = MUL(N(a), D(b));
    var Bxp = MUL(N(b), D(a));

    return GREATER(Axp, Bxp)(_(a), _(b));
}

// This is going to blow the stack. Use a ridiculous `node --max-stack-size=?` like 3000000
function GREATER(a, b){
    return IS_ZERO(b)(
        function(){ return NOT(IS_ZERO(a)); },
        function(){ 
            return IS_ZERO(a)(_(FALSE),
                function(){ return GREATER(DECR(a), DECR(b))});
        });
}

function MUL(a, b) {
    return IS_ZERO(b)(_(ZERO),
        function(){
            return ADD(a, MUL(a, DECR(b)));
        });
}

// Take a list [a, b, a, b, a, b..] and transform it into [[a,b], [a,b], [a,b]...]
function PAIRUP(list) {
    return IS_NIL(list)(
        _(NIL),
        function _ONEPAIR() {
            return CONS(
                CONS(CAR(list), CONS(CAR(CDR(list)), NIL)),
                PAIRUP(CDR(CDR(list))));
        });
}

// Coroutine: [dna, FASTALABEL...]
// TODO: can have newlines in strands
function STRAND(pbuf, dna) {
    return EQ('\n', CAR(pbuf))(
        function _COLABEL(){ return CONS(REVERSE(dna), PARSEFASTA(CDR(pbuf))); },
        function _STRANDING(){ return STRAND(CDR(pbuf), CONS(CAR(pbuf), dna)); });
}

// Coroutine: [label, STRAND...]
function FASTALABEL(pbuf, label) {
    return EQ('\n', CAR(pbuf))(
        function _COSTRAND(){ return CONS(REVERSE(label), STRAND(CDR(pbuf), NIL)); },
        function _LABELING(){ return FASTALABEL(CDR(pbuf), CONS(CAR(pbuf), label)); });
}
        
        
// Returns: LIST of LISTS; i.e. [label, dna, label, dna, ...]
function PARSEFASTA(pbuf) {
    var d= IS_NIL(pbuf)(
        _(NIL),
        function() { 
            return EQ(CAR(pbuf), '>')(
                function _START() { return FASTALABEL(CDR(pbuf), NIL); },
                function() { return 'error'; }
            );
        });
    return d;
}

var SOLVE = module.exports.SOLVE = function SOLVE(pbuf) {
    return REDUCE(MAX_GC, NO_GC(), MAP(GC, PAIRUP(PARSEFASTA(pbuf))));
}

