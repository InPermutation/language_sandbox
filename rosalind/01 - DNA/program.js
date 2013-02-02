// A few lines of procedural I/O and translation:
var buffer = '';
process.stdin.resume();
process.stdin.on('data', function(chunk) {
        buffer += chunk;
});
process.stdin.on('end', function() {
        var pairs = ltop(buffer.split(''));

        var list = SOLVE(pairs);

        var output = ptol(list).map(ptoi).join(' ');
        process.stdout.write(output+"\n");
});

// Shortcuts to assist with debugging
// Convert from Javascript Number to Church numeral:
var itop = module.exports.itop = function itop(i) {
    var r = ZERO;
    while(i>0) {
        r = INCR(r);
        i--;
    }
    return r;
}
// Convert from Church numeral to Javascript Number
var ptoi = module.exports.ptoi = function ptoi(p) {
    var r = 0;
    while(p !== ZERO) {
        p = DECR(p);
        r++;
    }
    return r;
}
// Convert from Javascript Array to CONS list
var ltop = module.exports.ltop = function ltop(l) {
    var p = NIL;
    for(var i = l.length-1; i>=0; i--)
        p = CONS(l[i], p);
    return p;
}
// Convert from CONS list to Javascript Array
var ptol = module.exports.ptol = function ptol(p) {
    var l = [];
    while(p !== NIL) {
        l.push(CAR(p));
        p = CDR(p);
    }
    return l;
}

// Axiom
var AXIOM_EQUAL = module.exports.AXIOM_EQUAL = function AXIOM_EQUAL(a, b, t, f) {
    return a === b ? t : f;
}

// Base cases
var EQUAL = module.exports.EQUAL = function EQUAL(a, b) {
    return AXIOM_EQUAL(a, b, TRUE, FALSE);
}

var TRUE = module.exports.TRUE = function TRUE(t, f) {
    return t();
}
var FALSE = module.exports.FALSE = function FALSE(t, f) {
    return f();
}

// A shortcut for wrapping constants
var _ = function(l){ return function(){ return l; } };

// Everything else can be derived from the axioms
// Numbers!
var ZERO = module.exports.ZERO = function ZERO(n){ return n; }
var IS_ZERO = module.exports.IS_ZERO = function IS_ZERO(i) {
    return EQUAL(i, ZERO);
}
var INCR = module.exports.INCR = function INCR(l) {
    return function _CHURCH_NUMERAL() { return l; };
}
var DECR = module.exports.DECR = function DECR(l) {
    return l();
}
var ONE = INCR(ZERO);
var TWO = INCR(ONE);
var THREE=INCR(TWO);
var FOUR= INCR(THREE);

// Lists!
var NIL = module.exports.NIL = function NIL(n){ return n; };
var IS_NIL = module.exports.IS_NIL = function IS_NIL(v) {
    return EQUAL(v, NIL);
}

var CONS = module.exports.CONS = function CONS(H, T) {
    return function(pred) { 
        return pred(_(H), _(T));
    }
}
var CAR = module.exports.CAR = function CAR(pair) {
    return pair(TRUE);
}
var CDR = module.exports.CDR = function CDR(pair) {
    return pair(FALSE);
}

var REDUCE = module.exports.REDUCE = function REDUCE(fxn, v, list) {
    return IS_NIL(list)(
        _(v),
        function() { return REDUCE(fxn, fxn(v, CAR(list)), CDR(list)); });
}

// this does the functional equivalent of list[index]++;
var INCR_AT = module.exports.INCR_AT = function INCR_AT(index, list) {
    return IS_ZERO(index)(
            function _FOUND(){ return CONS(INCR(CAR(list)), CDR(list)); },
            function _NOTYET(){ return CONS(CAR(list), INCR_AT(DECR(index), CDR(list))); });
}
// In ruby, this would be num.times { ctor }
var REPEAT = module.exports.REPEAT = function REPEAT(num, ctor) {
    return IS_ZERO(num)(
            _(NIL),
            function(){ return CONS(ctor(), REPEAT(DECR(num), ctor)); });
}

// Here's the actual meat of the solution
var INCREMENT_APPROPRIATE = 
    module.exports.INCREMENT_APPROPRIATE =
    function INCREMENT_APPROPRIATE(counts, nucleotide) {
        return EQUAL('A', nucleotide)(
                _(INCR_AT(ZERO, counts)), 
                _(EQUAL('C', nucleotide)(
                    _(INCR_AT(ONE, counts)), 
                    _(EQUAL('G', nucleotide)(
                        _(INCR_AT(TWO, counts)), 
                        _(EQUAL('T', nucleotide)(
                            _(INCR_AT(THREE, counts)), 
                            _(counts)
                        ))
                    ))
                ))
               );
    }


var SOLVE = module.exports.SOLVE = function SOLVE(pairlist) {
    var INITIAL_SCORES = REPEAT(FOUR, _(ZERO));
    return REDUCE(INCREMENT_APPROPRIATE, INITIAL_SCORES, pairlist);
}

