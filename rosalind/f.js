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
var ptos = module.exports.ptos = function ptos(p) {
    var s = '';
    while(p !== NIL) {
        s += CAR(p);
        p = CDR(p);
    }
    return s;
}
var stop = module.exports.stop = function stop(s) {
    return ltop(s.split(''));
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
var ONE = module.exports.ONE = INCR(ZERO);
var TWO = module.exports.TWO = INCR(ONE);
var THREE=module.exports.THREE=INCR(TWO);
var FOUR= module.exports.FOUR =INCR(THREE);

var ADD = module.exports.ADD = function ADD(a, b) {
    return IS_ZERO(a)(
        _(b),
        function() { return ADD(DECR(a), INCR(b)); });
}

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

var MAP = module.exports.MAP = function MAP(fxn, list) {
    return IS_NIL(list)(
        _(NIL),
        function() { return CONS(fxn(CAR(list)), MAP(fxn, CDR(list))); });
};

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

var REVERSE = module.exports.REVERSE = function REVERSE(list) {
    return REDUCE(function(rval, cur) { return CONS(cur, rval); }, NIL, list);
}

var ZIP = module.exports.ZIP = function ZIP(l, r) {
    return IS_NIL(l)(
        _(NIL),
        function() {
            return CONS(
                CONS( CAR(l), CONS(CAR(r), NIL)),
                ZIP(CDR(l), CDR(r)));
        });
}

var NOT = module.exports.NOT = function NOT(pred) {
    return function(t, f) { 
        return pred(f, t);
    };
}
