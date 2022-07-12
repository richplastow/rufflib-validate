(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.rufflib = global.rufflib || {}, global.rufflib.validate = global.rufflib.validate || {}, global.rufflib.validate.test = factory()));
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  /**
   * Unit tests for rufflib-validate 0.0.1
   * A RuffLIB library for succinctly validating JavaScript values.
   * https://richplastow.com/rufflib-validate
   * @license MIT
   */
  // rufflib-validate/src/validate.js
  // Assembles the `Validate` class.

  /* --------------------------------- Import --------------------------------- */
  var VERSION = '0.0.1'; // Validate.prototype.foo = foo;

  /* ---------------------------------- Tests --------------------------------- */
  // Runs basic Validate tests.

  function test(expect, Validate) {
    expect().section('Validate basics');
    expect("typeof Validate // in JavaScript, a class is type 'function'", _typeof(Validate)).toBe('function');
    expect("Validate.VERSION", Validate.VERSION).toBe(VERSION);
    expect("typeof new Validate()", _typeof(new Validate())).toBe('object');
    expect("new Validate()", new Validate()).toHave({
      foo: undefined
    });
  } // rufflib-validate/src/entry-point-for-tests.js
  // Run each test. You can comment-out some during development, to help focus on
  // individual tests. But make sure all tests are uncommented before committing.


  function validateTest(expect, Validate) {
    test(expect, Validate);
  }

  return validateTest;

}));
