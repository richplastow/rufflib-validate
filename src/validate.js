// rufflib-validate/src/validate.js

// Assembles the `Validate` class.


/* --------------------------------- Import --------------------------------- */

const VERSION = '1.0.0';

import _type from './methods/_type.js';
import _validateAgainstSchema from './methods/_validate-against-schema.js';

import array from './methods/array.js';
import boolean from './methods/boolean.js';
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

    constructor (prefix, skip) {
        this.err = null;
        this.prefix = prefix || '(anon)';
        this.skip = skip || false;
    }

}

Validate.VERSION = VERSION;

Validate.prototype._type = _type;
Validate.prototype._validateAgainstSchema = _validateAgainstSchema;

Validate.prototype.array = array;
Validate.prototype.boolean = boolean;
Validate.prototype.integer = integer;
Validate.prototype.number = number;
Validate.prototype.object = object;
Validate.prototype.schema = schema;
Validate.prototype.string = string;


/* ---------------------------------- Tests --------------------------------- */

// Runs basic tests on Validate.
export function test(expect, Validate) {
    expect().section('Validate basics');
    expect(`typeof Validate // in JavaScript, a class is type 'function'`,
            typeof Validate).toBe('function');
    expect(`Validate.VERSION`,
            Validate.VERSION).toBe(VERSION);
    expect(`typeof new Validate()`,
            typeof new Validate()).toBe('object');
    expect(`new Validate()`,
            new Validate()).toHave({
                err:null, prefix:'(anon)', skip:false });
    expect(`new Validate('foo()', true)`,
            new Validate('foo()', true)).toHave({
                err:null, prefix:'foo()', skip:true });


    expect().section('Typical usage');
    function sayOk(n, allowInvalid) {
        const v = new Validate('sayOk()', allowInvalid);
        if (!v.number(n, 'n', 100)) return v.err;
        return 'ok!';
    }
    expect(`sayOk(123)`,
            sayOk(123))
            .toBe('ok!');
    expect(`sayOk(null)`,
            sayOk(null))
            .toBe(`sayOk(): 'n' is null not type 'number'`);
    expect(`sayOk(3)`,
            sayOk(3))
            .toBe(`sayOk(): 'n' 3 is < 100`);
    expect('sayOk(3, true) // test that the `skip` argument is working',
            sayOk(3, true)) // @TODO test that skip works with all methods
            .toBe('ok!');

}
