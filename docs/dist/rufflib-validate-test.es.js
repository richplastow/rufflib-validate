/**
 * Unit tests for rufflib-validate 0.0.1
 * A RuffLIB library for succinctly validating JavaScript values.
 * https://richplastow.com/rufflib-validate
 * @license MIT
 */


// rufflib-validate/src/validate.js

// Assembles the `Validate` class.


/* --------------------------------- Import --------------------------------- */

const VERSION = '0.0.1';
// Validate.prototype.foo = foo;


/* ---------------------------------- Tests --------------------------------- */

// Runs basic Validate tests.
function test(expect, Validate) {
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

// rufflib-validate/src/entry-point-for-tests.js

// Run each test. You can comment-out some during development, to help focus on
// individual tests. But make sure all tests are uncommented before committing.
function validateTest(expect, Validate) {

    test(expect, Validate);

}

export { validateTest as default };
