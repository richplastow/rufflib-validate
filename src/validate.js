// rufflib-validate/src/validate.js

// Assembles the `Validate` class.


/* --------------------------------- Import --------------------------------- */

const NAME = 'Validate';
const VERSION = '2.0.1';

import _type from './methods/_type.js';
import _validateAgainstSchema from './methods/_validate-against-schema.js';

import array from './methods/array.js';
import boolean from './methods/boolean.js';
import class_ from './methods/class.js';
import integer from './methods/integer.js';
import number from './methods/number.js';
import object from './methods/object.js';
import schema from './methods/schema.js';
import string from './methods/string.js';


/* ---------------------------------- Class --------------------------------- */

// A RuffLIB library for succinctly validating JavaScript values.
//
// Typical usage:
//
//     import Validate from 'rufflib-validate';
//
//     function sayOk(n, allowInvalid) {
//         const v = new Validate('sayOk()', allowInvalid);
//         if (!v.number(n, 'n', 100)) return v.err;
//         return 'ok!';
//     }
//     
//     sayOk(123); // ok!
//     sayOk(null); // sayOk(): 'n' is null not type 'number'
//     sayOk(3); // 'n' 3 is < 100
//     sayOk(3, true); // ok! (less safe, but faster)
//
export default class Validate {
    static name = NAME; // make sure minification doesn’t squash the `name` property
    static VERSION = VERSION;

    constructor (prefix, skip) {
        this.err = null;
        this.prefix = prefix || '(anon)';
        this.skip = skip || false;
    }

}

Validate.prototype._type = _type;
Validate.prototype._validateAgainstSchema = _validateAgainstSchema;

Validate.prototype.array = array;
Validate.prototype.boolean = boolean;
Validate.prototype.class = class_;
Validate.prototype.integer = integer;
Validate.prototype.number = number;
Validate.prototype.object = object;
Validate.prototype.schema = schema;
Validate.prototype.string = string;


/* ---------------------------------- Tests --------------------------------- */

// Runs basic tests on Validate.
export function test(expect, Validate) {
    const et = expect.that;

    expect.section('Validate basics');
    et(`typeof Validate // in JavaScript, a class is type 'function'`,
        typeof Validate).is('function');
    et(`Validate.name // minification should not squash '${NAME}'`,
        Validate.name).is(NAME);
    et(`Validate.VERSION // make sure we are testing ${VERSION}`,
        Validate.VERSION).is(VERSION);
    et(`typeof new Validate()`,
        typeof new Validate()).is('object');
    et(`new Validate()`,
        new Validate()).has({
            err:null, prefix:'(anon)', skip:false });
    et(`new Validate('foo()', true)`,
        new Validate('foo()', true)).has({
            err:null, prefix:'foo()', skip:true });

    expect.section('Typical usage');
    function sayOk(n, allowInvalid) {
        const v = new Validate('sayOk()', allowInvalid);
        if (!v.number(n, 'n', 100)) return v.err;
        return 'ok!';
    }
    et(`sayOk(123)`,
        sayOk(123))
        .is('ok!');
    et(`sayOk(null)`,
        sayOk(null))
        .is(`sayOk(): 'n' is null not type 'number'`);
    et(`sayOk(3)`,
        sayOk(3))
        .is(`sayOk(): 'n' 3 is < 100`);
    et('sayOk(3, true) // test that the `skip` argument is working',
        sayOk(3, true)) // @TODO test that skip works with all methods
        .is('ok!');

}
