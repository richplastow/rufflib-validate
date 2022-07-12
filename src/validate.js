// rufflib-validate/src/validate.js

// Assembles the `Validate` class.


/* --------------------------------- Import --------------------------------- */

const VERSION = '0.0.1';

// import foo from './methods/foo.js';


/* ---------------------------------- Class --------------------------------- */

// A RuffLIB library for succinctly validating JavaScript values.
//
// Typical usage:
//     @TODO
//     
export default class Validate {
    constructor() {
    }
}

Validate.VERSION = VERSION;
// Validate.prototype.foo = foo;


/* ---------------------------------- Tests --------------------------------- */

// Runs basic Validate tests.
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
                foo: undefined,
            });
}
