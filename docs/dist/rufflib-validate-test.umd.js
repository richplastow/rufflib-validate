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
   * Unit tests for rufflib-validate 1.0.0
   * A RuffLIB library for succinctly validating JavaScript values.
   * https://richplastow.com/rufflib-validate
   * @license MIT
   */
  // rufflib-validate/src/methods/array.js
  // Tests Validate.array()
  function test$7(xp, Validate) {
    xp().section('array()');
    var v = new Validate('arr()');
    var exc; // Basic ok.

    xp("v.array([], 'empty')", v.array([], 'empty')).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.array([1,2,3], 'nums')", v.array([1, 2, 3], 'nums')).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.array([1,2,3], 'nums', 3, 4)", v.array([1, 2, 3], 'nums', 3, 4)).toBe(true);
    xp("v.err", v.err).toBe(null); // Nullish.

    xp("v.array(undefined, 'undef')", v.array(undefined, 'undef')).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'undef' is type 'undefined' not an array");
    xp("v.array(null)", v.array(null)).toBe(false);
    xp("v.err", v.err).toBe("arr(): a value is null not an array"); // Incorrect `args`, throws an error.

    try {
      v.array([], 'empty', null, null, null, null, '');
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.array( [], 'empty', null, null, null, null, '')", exc).toBe('Error: Validate.array() incorrectly invoked 1: args[4] not nullish!');
    xp("v.err", v.err).toBe('Validate.array() incorrectly invoked 1: args[4] not nullish!');

    try {
      v.array([], 'empty', 123, null, null, undefined, null, 0);
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.array( [], 'empty', 123, null, null, undefined, null, 0)", exc).toBe('Error: Validate.array() incorrectly invoked 2: args[5] not nullish!');
    xp("v.err", v.err).toBe('Validate.array() incorrectly invoked 2: args[5] not nullish!');

    try {
      v.array([], 'empty', 123, 456, undefined, {});
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.array( [], 'empty', 123, 456, undefined, {})", exc).toBe('Error: Validate.array() incorrectly invoked 3: args[3] not nullish!');
    xp("v.err", v.err).toBe('Validate.array() incorrectly invoked 3: args[3] not nullish!');

    try {
      v.array([], 'empty', undefined, 456, undefined, undefined, 0, 0);
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.array( [], 'empty', undefined, 456, undefined, undefined, 0, 0)", exc).toBe('Error: Validate.array() incorrectly invoked 4: args[4] not nullish!');
    xp("v.err", v.err).toBe('Validate.array() incorrectly invoked 4: args[4] not nullish!');

    try {
      v.array([], 'empty', null, 456, {});
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.array( [], 'empty', null, 456, {})", exc).toBe('Error: Validate.array() incorrectly invoked 5: args is not one of the nine configurations!');
    xp("v.err", v.err).toBe('Validate.array() incorrectly invoked 5: args is not one of the nine configurations!');

    try {
      v.array([], 'empty', '5');
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.array( [], 'empty', '5')", exc).toBe('Error: Validate.array() incorrectly invoked 5: args is not one of the nine configurations!');
    xp("v.err", v.err).toBe('Validate.array() incorrectly invoked 5: args is not one of the nine configurations!');

    try {
      v.array([], 'empty', 0 / 0, null, null, undefined, null);
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.array( [], 'empty', 0/0, null, null, undefined, null)", exc).toBe('Error: Validate.array() incorrectly invoked: min is NaN!');

    try {
      v.array([], 'empty', 0, 0 / 0, null, null, undefined, null);
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.array( [], 'empty', 0, 0/0, null, null, undefined, null)", exc).toBe('Error: Validate.array() incorrectly invoked: max is NaN!'); // Basic invalid.

    xp("v.array(0, 'zero')", v.array(0, 'zero')).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'zero' is type 'number' not an array");
    xp("v.array('1,2,3')", v.array('1,2,3')).toBe(false);
    xp("v.err", v.err).toBe("arr(): a value is type 'string' not an array");
    xp("v.array([1,2], 'nums', 3, 4)", v.array([1, 2], 'nums', 3, 4)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'nums' length 2 is < 3");
    xp("v.array([1,2,3,4,5], null, 3, 4)", v.array([1, 2, 3, 4, 5], null, 3, 4)).toBe(false);
    xp("v.err", v.err).toBe("arr(): array length 5 is > 4"); // Array of booleans ok.

    xp("v.array([], 'empty', v.boolean)", v.array([], 'empty', v["boolean"])).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.array([true,false,true], 'bools', v.boolean)", v.array([true, false, true], 'bools', v["boolean"])).toBe(true);
    xp("v.err", v.err).toBe(null); // Array of booleans invalid.

    xp("v.array([10], 'ten', v.boolean)", v.array([10], 'ten', v["boolean"])).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'ten[0]' is type 'number' not 'boolean'");
    xp("v.array([true,0,true], null, v.boolean)", v.array([true, 0, true], null, v["boolean"])).toBe(false);
    xp("v.err", v.err).toBe("arr(): '[1]' is type 'number' not 'boolean'"); // Array of integers ok.

    xp("v.array([0,1,2,3,4], 'count', v.integer)", v.array([0, 1, 2, 3, 4], 'count', v.integer)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.array([0,1,2,3,4], 0, v.integer, 0, 4)", v.array([0, 1, 2, 3, 4], 0, v.integer, 0, 4)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.array([0,1,2,3,4], 'count', v.integer, [6,5,4,3,2,1,0])", v.array([0, 1, 2, 3, 4], 'count', v.integer, [6, 5, 4, 3, 2, 1, 0])).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.array([0,2,4,8], 'evens', v.integer, {test:n=>n%2===0})", v.array([0, 2, 4, 8], 'evens', v.integer, {
      test: function test(n) {
        return n % 2 === 0;
      }
    })).toBe(true);
    xp("v.err", v.err).toBe(null); // Array of integers invalid.

    xp("v.array([[]], 'subarray', v.integer)", v.array([[]], 'subarray', v.integer)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'subarray[0]' is an array not type 'number'");
    xp("v.array([0,1,2,3,4.0001], null, v.integer)", v.array([0, 1, 2, 3, 4.0001], null, v.integer)).toBe(false);
    xp("v.err", v.err).toBe("arr(): '[4]' 4.0001 is not an integer");
    xp("v.array([0,1,2,3,4], null, v.integer, 2, 4)", v.array([0, 1, 2, 3, 4], null, v.integer, 2, 4)).toBe(false);
    xp("v.err", v.err).toBe("arr(): '[0]' 0 is < 2");
    xp("v.array([0,1,2,3,4], 'count', v.integer, 0, 3)", v.array([0, 1, 2, 3, 4], 'count', v.integer, 0, 3)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'count[4]' 4 is > 3");
    xp("v.array([0,1,2,3,4], 'count', v.integer, [6,5,4,3,7777777,1,0])", v.array([0, 1, 2, 3, 4], 'count', v.integer, [6, 5, 4, 3, 7777777, 1, 0])).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'count[2]' 2 is not in [6,5,4,3,777...,1,0]");
    xp("v.array([0,2,4,5], 'evens', v.integer, {test:n=>n%2===0})", v.array([0, 2, 4, 5], 'evens', v.integer, {
      test: function test(n) {
        return n % 2 === 0;
      }
    })).toBe(false);
    xp("v.err", v.err).toMatch(/^arr\(\): 'evens\[3]' 5 fails /); // Array of numbers ok.

    xp("v.array([-0.25,0,0.25], 'quarters', v.number)", v.array([-0.25, 0, 0.25], 'quarters', v.number)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.array([-0.25,0,0.25], {}, v.number, -0.25, 0.25)", v.array([-0.25, 0, 0.25], {}, v.number, -0.25, 0.25)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.array([-0.25,0,0.25], 'quarters', v.number, [-0.25,0,0.25])", v.array([-0.25, 0, 0.25], 'quarters', v.number, [-0.25, 0, 0.25])).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.array([-Infinity,Infinity], 'infs', v.number, {test:n=>n<-9e99||n>9e99})", v.array([-Infinity, Infinity], 'infs', v.number, {
      test: function test(n) {
        return n < -9e99 || n > 9e99;
      }
    })).toBe(true);
    xp("v.err", v.err).toBe(null); // Array of numbers invalid.

    xp("v.array([-0.25,0,null,0.25], '', v.number)", v.array([-0.25, 0, null, 0.25], '', v.number)).toBe(false);
    xp("v.err", v.err).toBe("arr(): '[2]' is null not type 'number'");
    xp("v.array([-0.25,0,0.25,NaN], null, v.number)", v.array([-0.25, 0, 0.25, NaN], null, v.number)).toBe(false);
    xp("v.err", v.err).toBe("arr(): '[3]' is NaN, not a valid number");
    xp("v.array([-0.25,0,0.25], undefined, v.number, -0.25, -0.1)", v.array([-0.25, 0, 0.25], undefined, v.number, -0.25, -0.1)).toBe(false);
    xp("v.err", v.err).toBe("arr(): '[1]' 0 is > -0.1");
    var quarters = [-0.25, 0, 0.25];
    quarters.length = 6;
    xp("v.array([".concat(quarters, "], 'quarters', v.number, -0.25, 0.25)"), v.array(quarters, 'quarters', v.number, -0.25, 0.25)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'quarters[3]' is type 'undefined' not 'number'");
    xp("v.array([-0.25,0,0.25], 'quarters', v.number, [6,5,4,3,7777777,1,0])", v.array([-0.25, 0, 0.25], 'quarters', v.number, [6, 5, 4, 3, 7777777, 1, 0])).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'quarters[0]' -0.25 is not in [6,5,4,3,777...,1,0]");
    xp("v.array([-Infinity,Infinity,9e99], 'infs', v.number, {test:n=>n<-9e99||n>9e99})", v.array([-Infinity, Infinity, 9e99], 'infs', v.number, {
      test: function test(n) {
        return n < -9e99 || n > 9e99;
      }
    })).toBe(false);
    xp("v.err", v.err).toMatch(/^arr\(\): 'infs\[2\]' 9e\+99 fails /); // Array of strings ok.

    xp("v.array(['one','two','three'], 'count', v.string)", v.array(['one', 'two', 'three'], 'count', v.string)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.array(['one','two','three'], 0, v.string, 3, 5)", v.array(['one', 'two', 'three'], 0, v.string, 3, 5)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.array(['two','three'], 'count', v.string, ['one','two','three'])", v.array(['two', 'three'], 'count', v.string, ['one', 'two', 'three'])).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.array(['two','three'], false, v.string, /^[a-z]+$/)", v.array(['two', 'three'], false, v.string, /^[a-z]+$/)).toBe(true);
    xp("v.err", v.err).toBe(null); // Array of strings invalid.

    xp("v.array(['one',2,'three'], 'count', v.string)", v.array(['one', 2, 'three'], 'count', v.string)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'count[1]' is type 'number' not 'string'");
    xp("v.array(['one','two',['three']], true, v.string)", v.array(['one', 'two', ['three']], true, v.string)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'true[2]' is an array not type 'string'");
    xp("v.array(['one','two','three'], null, v.string, 4, 4)", v.array(['one', 'two', 'three'], null, v.string, 4, 4)).toBe(false);
    xp("v.err", v.err).toBe("arr(): '[0]' length 3 is < 4");
    xp("v.array(['one','two','three'], 'count', v.string, 0, 3)", v.array(['one', 'two', 'three'], 'count', v.string, 0, 3)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'count[2]' length 5 is > 3");
    xp("v.array(['one','two','three'], 'count', v.string, [6,5,4,3,'one',1,0])", v.array(['one', 'two', 'three'], 'count', v.string, [6, 5, 4, 3, 'one', 1, 0])).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'count[1]' \"two\" is not in [6,5,4,3,one,1,0]");
    xp("v.array(['one','two','THREE'], 'count', v.string, /^[a-z]+$/)", v.array(['one', 'two', 'THREE'], 'count', v.string, /^[a-z]+$/)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'count[2]' \"THREE\" fails /^[a-z]+$/"); // Array of array of booleans ok.

    xp("v.array([[true, false],[],[true]], 'grid', v.array, v.boolean)", v.array([[true, false], [], [true]], 'grid', v.array, v["boolean"])).toBe(true);
    xp("v.err", v.err).toBe(null); // Array of array of booleans fail.

    xp("v.array([[true, false],[],[123]], 'grid', v.array, v.boolean)", v.array([[true, false], [], [123]], 'grid', v.array, v["boolean"])).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'grid[2][0]' is type 'number' not 'boolean'"); // The nine configurations ok.
    // 1. `args` is empty or all nullish - no min, max or validator

    xp("v.array([false,123,[],'anything'], 'arr', null, undefined, null, null)", v.array([false, 123, [], 'anything'], 'arr', null, undefined, null, null)).toBe(true);
    xp("v.err", v.err).toBe(null); // 2. `args[0]` is a number, and the rest of args is nullish - just min

    xp("v.array([false,123,[],'anything'], 'arr', 4, null, null, undefined)", v.array([false, 123, [], 'anything'], 'arr', 4, null, null, undefined)).toBe(true);
    xp("v.err", v.err).toBe(null); // 3. `args[0]` and `args[1]` are both numbers, rest of args nullish - min and max

    xp("v.array([false,123,[],'anything'], 'arr', 2, 4, undefined, undefined, null)", v.array([false, 123, [], 'anything'], 'arr', 2, 4, undefined, undefined, null)).toBe(true);
    xp("v.err", v.err).toBe(null); // 4. `args[0]` is nullish, `args[1]` is number, rest of args nullish - just max

    xp("v.array([false,123,[],'anything'], 'arr', null, 8, null, null, null)", v.array([false, 123, [], 'anything'], 'arr', null, 8, null, null, null)).toBe(true);
    xp("v.err", v.err).toBe(null); // 5. `args[0]` and `[1]` numbers, `[2]` function, rest anything - min, max and validator

    xp("v.array([false], 'arr', 0, 1, v.boolean, 'ignored', 'in this case')", v.array([false], 'arr', 0, 1, v["boolean"], 'ignored', 'in this case')).toBe(true);
    xp("v.err", v.err).toBe(null); // 6. `args[0]` number, `[1]` nullish, `[2]` function, rest anything - min and validator

    xp("v.array([false], 'arr', 1, null, ()=>true, 'ignored', 'in this case')", v.array([false], 'arr', 1, null, function () {
      return true;
    }, 'ignored', 'in this case')).toBe(true);
    xp("v.err", v.err).toBe(null); // 7. `args[0]` nullish, `[1]` number, `[2]` function, rest anything - max and validator

    xp("v.array([false,0], 'arr', null, 2, el=>el!=null, 'ignored', 'in this case')", v.array([false, 0], 'arr', null, 2, function (el) {
      return el != null;
    }, 'ignored', 'in this case')).toBe(true);
    xp("v.err", v.err).toBe(null); // 8. `args[0]` is a function, and the rest of args is anything - just validator

    xp("v.array([[250],[300,200]], 'arr', v.array, v.number, 200, 300)", v.array([[250], [300, 200]], 'arr', v.array, v.number, 200, 300)).toBe(true);
    xp("v.err", v.err).toBe(null); // 9. `args[0]` is number, `[1]` is function, rest anything - min and validator

    xp("v.array([[250],[300,200]], 'arr', 2, v.array, v.number, 200, 300)", v.array([[250], [300, 200]], 'arr', 2, v.array, v.number, 200, 300)).toBe(true);
    xp("v.err", v.err).toBe(null); // The eight configurations which can fail.
    // 2. `args[0]` is a number, and the rest of args is nullish - just min

    xp("v.array([false,123,[],'anything'], 'arr', 5, null, null, undefined)", v.array([false, 123, [], 'anything'], 'arr', 5, null, null, undefined)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'arr' length 4 is < 5"); // 3. `args[0]` and `args[1]` are both numbers, rest of args nullish - min and max

    xp("v.array([false,123,[],'anything'], 'arr', 5, 5, undefined, undefined, null)", v.array([false, 123, [], 'anything'], 'arr', 5, 5, undefined, undefined, null)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'arr' length 4 is < 5");
    xp("v.array([false,123,[],'anything'], 'arr', 2, 3, undefined, undefined, null)", v.array([false, 123, [], 'anything'], 'arr', 2, 3, undefined, undefined, null)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'arr' length 4 is > 3"); // 4. `args[0]` is nullish, `args[1]` is number, rest of args nullish - just max

    xp("v.array([false,123,[],'anything'], 'arr', null, 0, null, null, null)", v.array([false, 123, [], 'anything'], 'arr', null, 0, null, null, null)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'arr' length 4 is > 0"); // 5. `args[0]` and `[1]` numbers, `[2]` function, rest anything - min, max and validator

    xp("v.array([false], 'arr', 2, 2, v.boolean, 'ignored', 'in this case')", v.array([false], 'arr', 2, 2, v["boolean"], 'ignored', 'in this case')).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'arr' length 1 is < 2");
    xp("v.array([false], 'arr', 0, 0, v.boolean, 'ignored', 'in this case')", v.array([false], 'arr', 0, 0, v["boolean"], 'ignored', 'in this case')).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'arr' length 1 is > 0");
    xp("v.array([false], 'arr', 0, 1, v.integer, 'ignored', 'in this case')", v.array([false], 'arr', 0, 1, v.integer, 'ignored', 'in this case')).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'arr[0]' is type 'boolean' not 'number'"); // 6. `args[0]` number, `[1]` nullish, `[2]` function, rest anything - min and validator

    xp("v.array([false], 'arr', 1.01, null, ()=>true, 'ignored', 'in this case')", v.array([false], 'arr', 1.01, null, function () {
      return true;
    }, 'ignored', 'in this case')).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'arr' length 1 is < 1.01");
    xp("v.array([false], 'arr', 1, null, ()=>false, 'ignored', 'in this case')", v.array([false], 'arr', 1, null, function () {
      return false;
    }, 'ignored', 'in this case')).toBe(false);
    xp("v.err", v.err).toBe(null); // `()=>false` does not set `v.err`
    // 7. `args[0]` nullish, `[1]` number, `[2]` function, rest anything - max and validator

    xp("v.array([false,null], 'arr', null, 1.99, el=>el!=null, 'ignored', 'in this case')", v.array([false, null], 'arr', null, 1.99, function (el) {
      return el != null;
    }, 'ignored', 'in this case')).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'arr' length 2 is > 1.99");
    xp("v.array([false,undefined], 'arr', null, 2, el=>el!=null, 'ignored', 'in this case')", v.array([false, undefined], 'arr', null, 2, function (el) {
      return el != null;
    }, 'ignored', 'in this case')).toBe(false);
    xp("v.err", v.err).toBe(null); // `el=>el!=null` does not set `v.err`
    // 8. `args[0]` is a function, and the rest of args is anything - just validator

    xp("v.array([[250],[300,200]], 'arr', v.array, v.number, 200, 300)", v.array([[250], [300, 280, 10, 200]], 'arr', v.array, v.number, 200, 300)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'arr[1][2]' 10 is < 200"); // 9. `args[0]` is number, `[1]` is function, rest anything - min and validator

    xp("v.array([[250],[300,200]], 'arr', 3, v.array, v.number, 200, 300)", v.array([[250], [300, 200]], 'arr', 3, v.array, v.number, 200, 300)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'arr' length 2 is < 3");
    xp("v.array([[255.5555],[300,200]], 'arr', 2, v.array, v.integer, 200, 300)", v.array([[255.5555], [300, 200]], 'arr', 2, v.array, v.integer, 200, 300)).toBe(false);
    xp("v.err", v.err).toBe("arr(): 'arr[0][0]' 255.5555 is not an integer");
  } // rufflib-validate/src/methods/boolean.js
  // Tests Validate.boolean()


  function test$6(xp, Validate) {
    xp().section('boolean()');
    var v = new Validate('bool()'); // Ok.

    xp("v.boolean(true, 'true')", v["boolean"](true, 'true')).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.boolean(false, 'false')", v["boolean"](false, 'false')).toBe(true);
    xp("v.err", v.err).toBe(null); // Nullish.

    xp("v.boolean(undefined, 'undef')", v["boolean"](undefined, 'undef')).toBe(false);
    xp("v.err", v.err).toBe("bool(): 'undef' is type 'undefined' not 'boolean'");
    xp("v.boolean(null)", v["boolean"](null)).toBe(false);
    xp("v.err", v.err).toBe("bool(): a value is null not type 'boolean'"); // Invalid.

    xp("v.boolean(0, 'zero')", v["boolean"](0, 'zero')).toBe(false);
    xp("v.err", v.err).toBe("bool(): 'zero' is type 'number' not 'boolean'");
    xp("v.boolean([1,2,3], 'array')", v["boolean"]([1, 2, 3], 'array')).toBe(false);
    xp("v.err", v.err).toBe("bool(): 'array' is an array not type 'boolean'");
  } // rufflib-validate/src/methods/integer.js
  // Tests Validate.integer()


  function test$5(xp, Validate) {
    xp().section('integer()');
    var v = new Validate('int()');
    var exc; // Basic ok.

    xp("v.integer(10, 'ten')", v.integer(10, 'ten')).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.integer(-3.2e9, 'minusHuge')", v.integer(-3.2e9, 'minusHuge')).toBe(true);
    xp("v.err", v.err).toBe(null); // Nullish.

    xp("v.integer(undefined, 'undef')", v.integer(undefined, 'undef')).toBe(false);
    xp("v.err", v.err).toBe("int(): 'undef' is type 'undefined' not 'number'");
    xp("v.integer(null)", v.integer(null)).toBe(false);
    xp("v.err", v.err).toBe("int(): a value is null not type 'number'"); // Basic invalid.

    xp("v.integer(true, 'true')", v.integer(true, 'true')).toBe(false);
    xp("v.err", v.err).toBe("int(): 'true' is type 'boolean' not 'number'");
    xp("v.integer(NaN, 'NaN')", v.integer(NaN, 'NaN')).toBe(false);
    xp("v.err", v.err).toBe("int(): 'NaN' is NaN, not a valid number");
    xp("v.integer(Infinity, /why-rx-here?!/)", v.integer(Infinity, /why-rx-here?!/)).toBe(false);
    xp("v.err", v.err).toBe("int(): number Infinity is not an integer");
    xp("v.integer(-Infinity)", v.integer(-Infinity)).toBe(false);
    xp("v.err", v.err).toBe("int(): number -Infinity is not an integer");
    xp("v.integer(1e-1)", v.integer(1e-1)).toBe(false);
    xp("v.err", v.err).toBe("int(): number 0.1 is not an integer"); // Set ok. @TODO maybe don’t ignore the `max` argument?

    xp("v.integer(-10, undefined, [0, null, -10], 3) // max 3 is ignored", v.integer(-10, undefined, [0, null, -10], 3)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.integer(0, 'zero', [0, null, -10])", v.integer(0, 'zero', [0, null, -10])).toBe(true);
    xp("v.err", v.err).toBe(null); // Set invalid.

    xp("v.integer(0, 'zero', [\"0\", Infinity, -1.23456789, 10])", v.integer(0, 'zero', ["0", Infinity, -1.23456789, 10])).toBe(false);
    xp("v.err", v.err).toBe("int(): 'zero' 0 is not in [0,Infinity,...9,10]");
    xp("v.integer(1.23e4, null, [])", v.integer(1.23e4, null, [])).toBe(false);
    xp("v.err", v.err).toBe("int(): number 12300 is not in []"); // Rule ok. @TODO maybe don’t ignore the `max` argument?

    xp("v.integer(10, 'ten', {test:n=>n==10}, 3) // max 3 is ignored", v.integer(10, 'ten', {
      test: function test(n) {
        return n == 10;
      }
    }, 3)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.integer(-55.5e5, null, {test:()=>true})", v.integer(-55.5e5, null, {
      test: function test() {
        return true;
      }
    })).toBe(true);
    xp("v.err", v.err).toBe(null); // Rule invalid.

    xp("v.integer(1.23, undefined, {test:n=>n==1.23})", v.integer(1.23, undefined, {
      test: function test(n) {
        return n == 1.23;
      }
    })).toBe(false);
    xp("v.err", v.err).toBe("int(): number 1.23 is not an integer");
    xp("v.integer(55, 'britvic', {test:()=>false})", v.integer(55, 'britvic', {
      test: function test() {
        return false;
      }
    })).toBe(false);
    xp("v.err", v.err).toMatch(/^int\(\): 'britvic' 55 fails /); // Minimum ok.

    xp("v.integer(10, 'ten', 10)", v.integer(10, 'ten', 10)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.integer(-9.999e97, 'minusHuge', -9.999e98)", v.integer(-9.999e97, 'minusHuge', -9.999e98)).toBe(true);
    xp("v.err", v.err).toBe(null); // Minimum NaN throws an error. @TODO maybe 'Validate.integer() incorrectly ...'

    try {
      v.integer(10, 'ten', NaN);
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.integer(10, 'ten', NaN)", exc).toBe('Error: Validate.number() incorrectly invoked: min is NaN!');
    xp("v.err", v.err).toBe('Validate.number() incorrectly invoked: min is NaN!'); // Minimum invalid.

    xp("v.integer(10, null, 20)", v.integer(10, null, 20)).toBe(false);
    xp("v.err", v.err).toBe("int(): number 10 is < 20");
    xp("v.integer(-Infinity, 'minusInf', -1.23)", v.integer(-Infinity, 'minusInf', -1.23)).toBe(false);
    xp("v.err", v.err).toBe("int(): 'minusInf' -Infinity is < -1.23"); // Maximum ok. @TODO maybe throw an error if max > min

    xp("v.integer(10, /name-is-ignored/, 10, 10)", v.integer(10, /name-is-ignored/, 10, 10)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.integer(10, 'ten', null, 55.555)", v.integer(10, 'ten', null, 55.555)).toBe(true);
    xp("v.err", v.err).toBe(null); // Maximum NaN throws an error. @TODO maybe 'Validate.integer() incorrectly ...'

    try {
      v.integer(10, 'ten', 3, NaN);
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.integer(10, 'ten', 3, NaN)", exc).toBe('Error: Validate.number() incorrectly invoked: max is NaN!');
    xp("v.err", v.err).toBe('Validate.number() incorrectly invoked: max is NaN!'); // Maximum invalid.

    xp("v.integer(-1.23, null, -3.33, -2.5)", v.integer(-1.23, null, -3.33, -2.5)).toBe(false);
    xp("v.err", v.err).toBe("int(): number -1.23 is > -2.5");
    xp("v.integer(9e99, 'huge', 4e99, 8e99)", v.integer(9e99, 'huge', 4e99, 8e99)).toBe(false);
    xp("v.err", v.err).toBe("int(): 'huge' 9e+99 is > 8e+99");
  } // rufflib-validate/src/methods/number.js
  // Tests Validate.number()


  function test$4(xp, Validate) {
    xp().section('number()');
    var v = new Validate('num()');
    var exc; // Basic ok.

    xp("v.number(10, 'ten')", v.number(10, 'ten')).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.number(-3.14, 'minusPi')", v.number(-3.14, 'minusPi')).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.number(-Infinity, 'minusInfinity')", v.number(-Infinity, 'minusInfinity')).toBe(true);
    xp("v.err", v.err).toBe(null); // Nullish.

    xp("v.number()", v.number()).toBe(false);
    xp("v.err", v.err).toBe("num(): a value is type 'undefined' not 'number'");
    xp("v.number(null, 'null')", v.number(null, 'null')).toBe(false);
    xp("v.err", v.err).toBe("num(): 'null' is null not type 'number'"); // Basic invalid.

    xp("v.number(true, 'true')", v.number(true, 'true')).toBe(false);
    xp("v.err", v.err).toBe("num(): 'true' is type 'boolean' not 'number'");
    xp("v.number(NaN, 'NaN')", v.number(NaN, 'NaN')).toBe(false);
    xp("v.err", v.err).toBe("num(): 'NaN' is NaN, not a valid number"); // Set ok. @TODO maybe don’t ignore the `max` argument?

    xp("v.number(10, undefined, [Infinity, -2.2, 10], 3) // max 3 is ignored", v.number(10, undefined, [Infinity, -2.2, 10], 3)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.number(Infinity, 'positiveInf', [Infinity, -2.2, 10])", v.number(Infinity, 'positiveInf', [Infinity, -2.2, 10])).toBe(true);
    xp("v.err", v.err).toBe(null); // Set invalid.

    xp("v.number(0, 'zero', [[0], Infinity, -1.23456789, 10])", v.number(0, 'zero', [[0], Infinity, -1.23456789, 10])).toBe(false);
    xp("v.err", v.err).toBe("num(): 'zero' 0 is not in [0,Infinity,...9,10]");
    xp("v.number(-Infinity, null, [])", v.number(-Infinity, null, [])).toBe(false);
    xp("v.err", v.err).toBe("num(): number -Infinity is not in []"); // Rule ok. @TODO maybe don’t ignore the `max` argument?

    xp("v.number(10, 'ten', {test:n=>n==10}, 3) // max 3 is ignored", v.number(10, 'ten', {
      test: function test(n) {
        return n == 10;
      }
    }, 3)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.number(Infinity, null, {test:()=>1})", v.number(Infinity, null, {
      test: function test() {
        return 1;
      }
    })).toBe(true);
    xp("v.err", v.err).toBe(null); // Rule invalid.

    xp("v.number(0, undefined, {test:n=>n==10||n==Infinity})", v.number(0, undefined, {
      test: function test(n) {
        return n == 10 || n == Infinity;
      }
    })).toBe(false);
    xp("v.err", v.err).toMatch(/^num\(\): number 0 fails /);
    xp("v.number(-Infinity, 'minusInf', {test:()=>0})", v.number(-Infinity, 'minusInf', {
      test: function test() {
        return 0;
      }
    })).toBe(false);
    xp("v.err", v.err).toMatch(/^num\(\): 'minusInf' -Infinity fails /); // Minimum ok.

    xp("v.number(10, 'ten', 10)", v.number(10, 'ten', 10)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.number(Infinity, 'positiveInf', -1.23)", v.number(Infinity, 'positiveInf', -1.23)).toBe(true);
    xp("v.err", v.err).toBe(null); // Minimum NaN throws an error.

    try {
      v.number(10, 'ten', NaN);
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.number(10, 'ten', NaN)", exc).toBe('Error: Validate.number() incorrectly invoked: min is NaN!');
    xp("v.err", v.err).toBe('Validate.number() incorrectly invoked: min is NaN!'); // Minimum invalid.

    xp("v.number(10, null, 20)", v.number(10, null, 20)).toBe(false);
    xp("v.err", v.err).toBe("num(): number 10 is < 20");
    xp("v.number(-Infinity, 'minusInf', -1.23)", v.number(-Infinity, 'minusInf', -1.23)).toBe(false);
    xp("v.err", v.err).toBe("num(): 'minusInf' -Infinity is < -1.23"); // Maximum ok. @TODO maybe throw an error if max > min

    xp("v.number(10, /name-is-ignored/, 10, 10)", v.number(10, /name-is-ignored/, 10, 10)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.number(10, 'ten', null, 55.555)", v.number(10, 'ten', null, 55.555)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.number(Infinity, 'positiveInf', -1.23, Infinity)", v.number(Infinity, 'positiveInf', -1.23, Infinity)).toBe(true);
    xp("v.err", v.err).toBe(null); // Maximum NaN throws an error.

    try {
      v.number(10, 'ten', 3, NaN);
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.number(10, 'ten', 3, NaN)", exc).toBe('Error: Validate.number() incorrectly invoked: max is NaN!');
    xp("v.err", v.err).toBe('Validate.number() incorrectly invoked: max is NaN!'); // Maximum invalid.

    xp("v.number(-1.23, null, -3.33, -2.5)", v.number(-1.23, null, -3.33, -2.5)).toBe(false);
    xp("v.err", v.err).toBe("num(): number -1.23 is > -2.5");
    xp("v.number(9e99, 'huge', 4e99, 8e99)", v.number(9e99, 'huge', 4e99, 8e99)).toBe(false);
    xp("v.err", v.err).toBe("num(): 'huge' 9e+99 is > 8e+99");
  } // rufflib-validate/src/methods/object.js

  /* ---------------------------------- Tests --------------------------------- */
  // Tests Validate.object()


  function test$3(xp, Validate) {
    xp().section('object()');
    var v = new Validate('obj()');
    var OK = 'Did not encounter an exception';
    var exc = OK; // Basic ok.

    xp("v.object({}, 'empty')", v.object({}, 'empty')).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({a:1,b:2,c:3}, 'nums')", v.object({
      a: 1,
      b: 2,
      c: 3
    }, 'nums')).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({}, 'nums', {_meta:{}})", v.object({}, 'nums', {
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null); // Basic invalid.

    xp("v.object(100, 'hundred')", v.object(100, 'hundred')).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'hundred' is type 'number' not 'object'");
    xp("v.object([1,2,3])", v.object([1, 2, 3])).toBe(false);
    xp("v.err", v.err).toBe("obj(): a value is an array not an object"); // Nullish.

    xp("v.object(undefined, 'undef')", v.object(undefined, 'undef')).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'undef' is type 'undefined' not 'object'");
    xp("v.object(null)", v.object(null)).toBe(false);
    xp("v.err", v.err).toBe("obj(): a value is null not an object");
    xp("v.object([], 'emptyArray')", v.object([], 'emptyArray')).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'emptyArray' is an array not an object"); // Incorrect `schema`, basic property errors.

    try {
      v.object({}, 'empty', null);
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'empty', null)", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema' is null not an object");

    try {
      v.object({}, 'e', []);
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', [])", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema' is an array not an object");

    try {
      v.object({}, 'e', {});
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema._meta' is type 'undefined' not an object");

    try {
      v.object({}, undefined, {
        _meta: null
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, undefined, {_meta:null})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema._meta' is null not an object");

    try {
      v.object({}, 'e', {
        _meta: 123
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {_meta:123})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema._meta' is type 'number' not an object");

    try {
      v.object({}, undefined, {
        _meta: []
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, undefined, {_meta:[]})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema._meta' is an array not an object");

    try {
      v.object({}, 'e', {
        a: 1,
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {a:1, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.a' is type 'number' not an object");

    try {
      v.object({}, 'e', {
        a: {
          _meta: true
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {a:{_meta:true}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.a._meta' is type 'boolean' not an object");

    try {
      v.object({}, 'e', {
        Foo: {
          _meta: []
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {Foo:{_meta:[]}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.Foo._meta' is an array not an object");

    try {
      v.object({}, 'e', {
        num: {},
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {num:{}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.num.kind' not recognised");

    try {
      v.object({}, 'e', {
        outer: {
          _meta: {},
          inner: {}
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {outer:{_meta:{},inner:{}}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.outer.inner.kind' not recognised"); // Incorrect `schema`, value properties are never allowed to be `null`.

    try {
      v.object({}, 'e', {
        BOOL: {
          fallback: null,
          kind: 'boolean'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {BOOL:{fallback:null,kind:'boolean'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL.fallback' is null");

    try {
      v.object({}, 'e', {
        n: {
          max: null,
          kind: 'number'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {n:{max:null,kind:'number'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.n.max' is null");

    try {
      v.object({}, 'e', {
        n: {
          min: null,
          kind: 'number'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {n:{min:null,kind:'number'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.n.min' is null");

    try {
      v.object({}, 'e', {
        n: {
          rule: null,
          kind: 'number'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {n:{rule:null,kind:'number'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.n.rule' is null");

    try {
      v.object({}, 'e', {
        n: {
          set: null,
          kind: 'number'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {n:{set:null,kind:'number'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.n.set' is null"); // Incorrect `schema`, only 0 or 1 qualifiers allowed.

    try {
      v.object({}, 'e', {
        s: {
          max: 1,
          rule: 1,
          kind: 'string'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {s:{max:1,rule:1,kind:'string'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has '2' qualifiers, only 0 or 1 allowed");

    try {
      v.object({}, 'e', {
        s: {
          min: 1,
          set: 1,
          kind: 'string'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {s:{min:1,set:1,kind:'string'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has '2' qualifiers, only 0 or 1 allowed");

    try {
      v.object({}, 'e', {
        s: {
          min: 1,
          max: 1,
          set: 1,
          kind: 'string'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {s:{min:1,max:1,set:1,kind:'string'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has '3' qualifiers, only 0 or 1 allowed");

    try {
      v.object({}, 'e', {
        s: {
          min: 1,
          max: 1,
          rule: 1,
          set: 1,
          kind: 'string'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {s:{min:1,max:1,rule:1,set:1,kind:'string'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has '4' qualifiers, only 0 or 1 allowed"); // Incorrect `schema`, boolean.

    try {
      v.object({}, 'e', {
        BOOL: {
          fallback: 0,
          kind: 'boolean'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {BOOL:{fallback:0,kind:'boolean'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'number' fallback, not 'boolean' or 'undefined'");

    try {
      v.object({}, 'e', {
        BOOL: {
          max: true,
          kind: 'boolean'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {BOOL:{max:true,kind:'boolean'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'boolean' max, not 'undefined'");

    try {
      v.object({}, 'e', {
        BOOL: {
          min: 1,
          kind: 'boolean'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {BOOL:{min:1,kind:'boolean'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'number' min, not 'undefined'");

    try {
      v.object({}, 'e', {
        BOOL: {
          rule: {},
          kind: 'boolean'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {BOOL:{rule:{},kind:'boolean'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'object' rule, not 'undefined'");

    try {
      v.object({}, 'e', {
        BOOL: {
          set: [],
          kind: 'boolean'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {BOOL:{set:[],kind:'boolean'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'array' set, not 'undefined'"); // Incorrect `schema`, integer and number.

    try {
      v.object({}, 'e', {
        i: {
          fallback: [],
          kind: 'integer'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {i:{fallback:[],kind:'integer'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.i' has 'array' fallback, not 'number' or 'undefined'");

    try {
      v.object({}, 'e', {
        n: {
          max: true,
          kind: 'number'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {n:{max:true,kind:'number'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.n' has 'boolean' max, not 'number' or 'undefined'");

    try {
      v.object({}, 'e', {
        "int": {
          min: [],
          kind: 'integer'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {int:{min:[]],kind:'integer'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.int' has 'array' min, not 'number' or 'undefined'");

    try {
      v.object({}, 'e', {
        NUM: {
          rule: 1,
          kind: 'number'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {NUM:{rule:1,kind:'number'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.NUM' has 'number' rule, not 'object' or 'undefined'");

    try {
      v.object({}, 'e', {
        NUM: {
          rule: {},
          kind: 'number'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {NUM:{rule:{},kind:'number'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.NUM' has 'undefined' rule.test, not 'function'");

    try {
      v.object({}, 'e', {
        INT: {
          set: 0,
          kind: 'integer'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {INT:{set:0,kind:'integer'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.INT' has 'number' set, not an array or 'undefined'");

    try {
      v.object({}, 'e', {
        n: {
          set: [1, '2', 3],
          kind: 'number'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {n:{set:[1,'2',3],kind:'number'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.n' has 'string' set[1], not 'number'"); // Incorrect `schema`, string.

    try {
      v.object({}, 'e', {
        s: {
          fallback: 1,
          kind: 'string'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {s:{fallback:1,kind:'string'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has 'number' fallback, not 'string' or 'undefined'");

    try {
      v.object({}, 'e', {
        str: {
          max: [],
          kind: 'string'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {str:{max:[],kind:'string'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.str' has 'array' max, not 'number' or 'undefined'");

    try {
      v.object({}, 'e', {
        S: {
          min: {},
          kind: 'string'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {S:{min:{}],kind:'string'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.S' has 'object' min, not 'number' or 'undefined'");

    try {
      v.object({}, 'e', {
        STR: {
          rule: '1',
          kind: 'string'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {STR:{rule:'1',kind:'string'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.STR' has 'string' rule, not 'object' or 'undefined'");

    try {
      v.object({}, 'e', {
        _s: {
          rule: {
            test: []
          },
          kind: 'string'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {_s:{rule:{test:[]},kind:'string'}, _meta:{}})", exc) // @TODO '...has 'array' rule.test...'
    .toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema._s' has 'object' rule.test, not 'function'");

    try {
      v.object({}, 'e', {
        _: {
          set: 0,
          kind: 'string'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {_:{set:0,kind:'string'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema._' has 'number' set, not an array or 'undefined'");

    try {
      v.object({}, 'e', {
        string: {
          set: [1, '2', 3],
          kind: 'string'
        },
        _meta: {}
      });
      exc = OK;
    } catch (e) {
      exc = "".concat(e);
    }

    xp("v.object( {}, 'e', {string:{set:[1,'2',3],kind:'string'}, _meta:{}})", exc).toBe("Error: Validate.object() incorrectly invoked: obj(): 'schema.string' has 'number' set[0], not 'string'"); // Boolean ok.

    xp("v.object({basic:false}, 'basicBool', {basic:{kind:'boolean'},_meta:{}})", v.object({
      basic: false
    }, 'basicBool', {
      basic: {
        kind: 'boolean'
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({foo:{bar:true}}, undefined, {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})", v.object({
      foo: {
        bar: true
      }
    }, undefined, {
      foo: {
        bar: {
          kind: 'boolean'
        },
        _meta: {}
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({}, 'hasFooFallback', {foo:{fallback:true,kind:'boolean'},_meta:{}})", v.object({}, 'hasFooFallback', {
      foo: {
        fallback: true,
        kind: 'boolean'
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({foo:false}, undefined, {foo:{fallback:true,kind:'boolean'},_meta:{}})", v.object({
      foo: false
    }, undefined, {
      foo: {
        fallback: true,
        kind: 'boolean'
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({A:{b:true,c:false,D:{e:true}},f:true}, 'complexBool', {_meta:{}, ... kind:'boolean'}})", v.object({
      A: {
        b: true,
        c: false,
        D: {
          e: true
        }
      },
      f: true
    }, 'complexBool', {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'boolean'
        },
        c: {
          kind: 'boolean'
        },
        D: {
          _meta: {},
          e: {
            kind: 'boolean'
          }
        }
      },
      f: {
        kind: 'boolean'
      }
    })).toBe(true);
    xp("v.err", v.err).toBe(null); // Boolean invalid.

    xp("v.object({B:123}, 'o', {B:{kind:'boolean'},_meta:{}})", v.object({
      B: 123
    }, 'o', {
      B: {
        kind: 'boolean'
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'o.B' is type 'number' not 'boolean'");
    xp("v.object({basic:[false]}, 'basicBool', {basic:{kind:'boolean'},_meta:{}})", v.object({
      basic: [false]
    }, 'basicBool', {
      basic: {
        kind: 'boolean'
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'basicBool.basic' is an array not type 'boolean'");
    xp("v.object({bar:true}, undefined, {basic:{kind:'boolean'},_meta:{}})", v.object({
      bar: true
    }, undefined, {
      basic: {
        kind: 'boolean'
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'basic' of a value is type 'undefined' not 'boolean'");
    xp("v.object({foo:{BAR:true}}, 'nestedBool', {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})", v.object({
      foo: {
        BAR: true
      }
    }, 'nestedBool', {
      foo: {
        bar: {
          kind: 'boolean'
        },
        _meta: {}
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'nestedBool.foo.bar' is type 'undefined' not 'boolean'");
    xp("v.object({foo:{bar:null}}, undefined, {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})", v.object({
      foo: {
        bar: null
      }
    }, undefined, {
      foo: {
        bar: {
          kind: 'boolean'
        },
        _meta: {}
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'foo.bar' of a value is null not type 'boolean'");
    xp("v.object({foo:[]}, 'hasFooFallback', {foo:{fallback:true,kind:'boolean'},_meta:{}})", v.object({
      foo: []
    }, 'hasFooFallback', {
      foo: {
        fallback: true,
        kind: 'boolean'
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'hasFooFallback.foo' is an array not type 'boolean'");
    xp("v.object({foo:null}, undefined, {foo:{fallback:true,kind:'boolean'},_meta:{}})", v.object({
      foo: null
    }, undefined, {
      foo: {
        fallback: true,
        kind: 'boolean'
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'foo' of a value is null not type 'boolean'");
    xp("v.object({A:{b:true,c:123,D:{e:true}},f:true}, 'complexBool', {_meta:{}, ... kind:'boolean'}})", v.object({
      A: {
        b: true,
        c: 123,
        D: {
          e: true
        }
      },
      f: true
    }, 'complexBool', {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'boolean'
        },
        c: {
          kind: 'boolean'
        },
        D: {
          _meta: {},
          e: {
            kind: 'boolean'
          }
        }
      },
      f: {
        kind: 'boolean'
      }
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'complexBool.A.c' is type 'number' not 'boolean'");
    xp("v.object({f:false,A:{c:true,b:false,D:{E:true}}}, undefined, {_meta:{}, ... kind:'boolean'}})", v.object({
      f: false,
      A: {
        c: true,
        b: false,
        D: {
          E: true
        }
      }
    }, undefined, {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'boolean'
        },
        c: {
          kind: 'boolean'
        },
        D: {
          _meta: {},
          e: {
            kind: 'boolean'
          }
        }
      },
      f: {
        kind: 'boolean'
      }
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'A.D.e' of a value is type 'undefined' not 'boolean'"); // Integer ok.

    xp("v.object({basic:1}, 'minMaxInt', {basic:{kind:'integer',min:1,max:1},_meta:{}})", v.object({
      basic: 1
    }, 'minMaxInt', {
      basic: {
        kind: 'integer',
        min: 1,
        max: 1
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({basic:1}, 'ruleInt', {basic:{kind:'integer',rule:{test:n=>n==1}},_meta:{}})", v.object({
      basic: 1
    }, 'ruleInt', {
      basic: {
        kind: 'integer',
        rule: {
          test: function test(n) {
            return n == 1;
          }
        }
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({basic:1}, 'setInt', {basic:{kind:'integer',set:[-4,1,77]},_meta:{}})", v.object({
      basic: 1
    }, 'setInt', {
      basic: {
        kind: 'integer',
        set: [-4, 1, 77]
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({foo:{bar:44}}, undefined, {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})", v.object({
      foo: {
        bar: 44
      }
    }, undefined, {
      foo: {
        bar: {
          kind: 'integer'
        },
        _meta: {}
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({}, 'hasFooFallback', {foo:{fallback:0,kind:'integer'},_meta:{}})", v.object({}, 'hasFooFallback', {
      foo: {
        fallback: 0,
        kind: 'integer'
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({A:{b:0,c:1,D:{e:-2}},f:9e9}, 'complexInt', {_meta:{}, ... kind:'integer'}})", v.object({
      A: {
        b: 0,
        c: 1,
        D: {
          e: -2
        }
      },
      f: 9e9
    }, 'complexInt', {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'integer'
        },
        c: {
          kind: 'integer'
        },
        D: {
          _meta: {},
          e: {
            kind: 'integer'
          }
        }
      },
      f: {
        kind: 'integer'
      }
    })).toBe(true);
    xp("v.err", v.err).toBe(null); // Integer invalid.

    xp("v.object({basic:2}, 'minMaxInt', {basic:{kind:'integer',min:1,max:1},_meta:{}})", v.object({
      basic: 2
    }, 'minMaxInt', {
      basic: {
        kind: 'integer',
        min: 1,
        max: 1
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'minMaxInt.basic' 2 is > 1");
    xp("v.object({basic:0}, undefined, {basic:{kind:'integer',min:1,max:1},_meta:{}})", v.object({
      basic: 0
    }, undefined, {
      basic: {
        kind: 'integer',
        min: 1,
        max: 1
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'basic' of a value 0 is < 1");
    xp("v.object({basic:1.5}, 'ruleInt', {basic:{kind:'integer',rule:{test:n=>n==1}},_meta:{}})", v.object({
      basic: 1.5
    }, 'ruleInt', {
      basic: {
        kind: 'integer',
        rule: {
          test: function test(n) {
            return n == 1;
          }
        }
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toMatch(/^obj\(\): 'ruleInt\.basic' 1\.5 fails /);
    xp("v.object({basic:1}, undefined, {basic:{kind:'integer',rule:{test:n=>n<-99999999||n>5555555}},_meta:{}})", v.object({
      basic: 1
    }, undefined, {
      basic: {
        kind: 'integer',
        rule: {
          test: function test(n) {
            return n < -99999999 || n > 5555555;
          }
        }
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toMatch(/^obj\(\): 'basic' of a value 1 fails /);
    xp("v.object({basic:1}, 'setInt', {basic:{kind:'integer',set:[-44444444,0,77777777]},_meta:{}})", v.object({
      basic: 1
    }, 'setInt', {
      basic: {
        kind: 'integer',
        set: [-44444444, 0, 77777777]
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'setInt.basic' 1 is not in [-44444444,0...7777]");
    xp("v.object({basic:0}, undefined, {basic:{kind:'integer',set:[-4,1,77]},_meta:{}})", v.object({
      basic: 0
    }, undefined, {
      basic: {
        kind: 'integer',
        set: [-4, 1, 77]
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'basic' of a value 0 is not in [-4,1,77]");
    xp("v.object({foo:{bar:'44'}}, 'nestedInt', {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})", v.object({
      foo: {
        bar: '44'
      }
    }, 'nestedInt', {
      foo: {
        bar: {
          kind: 'integer'
        },
        _meta: {}
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'nestedInt.foo.bar' is type 'string' not 'number'");
    xp("v.object({foo:{bar:44.444}}, undefined, {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})", v.object({
      foo: {
        bar: 44.444
      }
    }, undefined, {
      foo: {
        bar: {
          kind: 'integer'
        },
        _meta: {}
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'foo.bar' of a value 44.444 is not an integer");
    xp("v.object({foo:-0.001}, 'hasFooFallback', {foo:{fallback:0,kind:'integer'},_meta:{}})", v.object({
      foo: -0.001
    }, 'hasFooFallback', {
      foo: {
        fallback: 0,
        kind: 'integer'
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'hasFooFallback.foo' -0.001 is not an integer");
    xp("v.object({A:{b:0,c:1,D:{e:-2}},f:9e-9}, 'complexInt', {_meta:{}, ... kind:'integer'}})", v.object({
      A: {
        b: 0,
        c: 1,
        D: {
          e: []
        }
      },
      f: 9e9
    }, 'complexInt', {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'integer'
        },
        c: {
          kind: 'integer'
        },
        D: {
          _meta: {},
          e: {
            kind: 'integer'
          }
        }
      },
      f: {
        kind: 'integer'
      }
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'complexInt.A.D.e' is an array not type 'number'");
    xp("v.object({A:{b:0,c:1,D:{e:-2}},f:9e-9}, undefined, {_meta:{}, ... kind:'integer'}})", v.object({
      A: {
        b: 0,
        c: 1,
        D: {
          e: -2
        }
      },
      f: 9e-9
    }, undefined, {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'integer'
        },
        c: {
          kind: 'integer'
        },
        D: {
          _meta: {},
          e: {
            kind: 'integer'
          }
        }
      },
      f: {
        kind: 'integer'
      }
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'f' of a value 9e-9 is not an integer"); // Number ok.

    xp("v.object({basic:-888.8}, 'maxNum', {basic:{kind:'number',max:-33.3},_meta:{}})", v.object({
      basic: -888.8
    }, 'maxNum', {
      basic: {
        kind: 'number',
        max: -33.3
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({basic:-55.555}, 'minNum', {basic:{kind:'number',min:-99},_meta:{}})", v.object({
      basic: -55.555
    }, 'minNum', {
      basic: {
        kind: 'number',
        min: -99
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({basic:1.23}, 'ruleNum', {basic:{kind:'number',rule:{test:n=>n>1.2&&n<1.3}},_meta:{}})", v.object({
      basic: 1.23
    }, 'ruleNum', {
      basic: {
        kind: 'number',
        rule: {
          test: function test(n) {
            return n > 1.2 && n < 1.3;
          }
        }
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({foo:{bar:-0}}, undefined, {foo:{bar:{kind:'number',set:[0]},_meta:{}},_meta:{}})", v.object({
      foo: {
        bar: -0
      }
    }, undefined, {
      foo: {
        bar: {
          kind: 'number',
          set: [0]
        },
        _meta: {}
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({foo:{}}, 'hasFooBarFallback', {foo:{bar:{kind:'number',fallback:-9.876},_meta:{}},_meta:{}})", v.object({
      foo: {}
    }, 'hasFooBarFallback', {
      foo: {
        bar: {
          kind: 'number',
          fallback: -9.876
        },
        _meta: {}
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({A:{b:0,c:-Infinity,D:{e:-2.2222}},f:9e9}, 'complexNum', {_meta:{}, ... kind:'number'}})", v.object({
      A: {
        b: 0,
        c: -Infinity,
        D: {
          e: -2.2222
        }
      },
      f: 9e9
    }, 'complexNum', {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'number'
        },
        c: {
          kind: 'number'
        },
        D: {
          _meta: {},
          e: {
            kind: 'number'
          }
        }
      },
      f: {
        kind: 'number'
      }
    })).toBe(true);
    xp("v.err", v.err).toBe(null); // Number invalid.

    xp("v.object({basic:-8.8}, 'maxNum', {basic:{kind:'number',max:-33.3},_meta:{}})", v.object({
      basic: -8.8
    }, 'maxNum', {
      basic: {
        kind: 'number',
        max: -33.3
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'maxNum.basic' -8.8 is > -33.3");
    xp("v.object({basic:-Infinity}, undefined, {basic:{kind:'number',min:-99},_meta:{}})", v.object({
      basic: -Infinity
    }, undefined, {
      basic: {
        kind: 'number',
        min: -99
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'basic' of a value -Infinity is < -99");
    xp("v.object({basic:1.3}, 'ruleNum', {basic:{kind:'number',rule:{test:n=>n>1.2&&n<1.3}},_meta:{}})", v.object({
      basic: 1.3
    }, 'ruleNum', {
      basic: {
        kind: 'number',
        rule: {
          test: function test(n) {
            return n > 1.2 && n < 1.3;
          }
        }
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toMatch(/^obj\(\): 'ruleNum\.basic' 1\.3 fails /);
    xp("v.object({foo:{bar:0}}, undefined, {foo:{bar:{kind:'number',set:[-0.0001]},_meta:{}},_meta:{}})", v.object({
      foo: {
        bar: -0
      }
    }, undefined, {
      foo: {
        bar: {
          kind: 'number',
          set: []
        },
        _meta: {}
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'foo.bar' of a value 0 is not in []");
    xp("v.object({foo:{bar:{}}}, 'hasFooBarFallback', {foo:{bar:{kind:'number',fallback:-9.876},_meta:{}},_meta:{}})", v.object({
      foo: {
        bar: {}
      }
    }, 'hasFooBarFallback', {
      foo: {
        bar: {
          kind: 'number',
          fallback: -9.876
        },
        _meta: {}
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'hasFooBarFallback.foo.bar' is type 'object' not 'number'");
    xp("v.object({A:null}, 'numstedNum', {_meta:{},A:{_meta:{},b:{kind:'number'}}})", v.object({
      A: null
    }, 'numstedNum', {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'number'
        }
      }
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'numstedNum.A' is null not an object");
    xp("v.object({A:{b:0,c:-Infinity,D:[]},f:9e9}, 'complexNum', {_meta:{}, ... kind:'number'}})", v.object({
      A: {
        b: 0,
        c: -Infinity,
        D: []
      },
      f: 9e9
    }, 'complexNum', {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'number'
        },
        c: {
          kind: 'number'
        },
        D: {
          _meta: {},
          e: {
            kind: 'number'
          }
        }
      },
      f: {
        kind: 'number'
      }
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'complexNum.A.D' is an array not an object");
    xp("v.object({A:{b:0,c:-Infinity,D:1},f:9e9}, undefined, {_meta:{}, ... kind:'number'}})", v.object({
      A: {
        b: 0,
        c: -Infinity,
        D: 1
      },
      f: 9e9
    }, undefined, {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'number'
        },
        c: {
          kind: 'number'
        },
        D: {
          _meta: {},
          e: {
            kind: 'number'
          }
        }
      },
      f: {
        kind: 'number'
      }
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'A.D' of a value is type 'number' not an object"); // String ok.

    xp("v.object({a:'a'}, 'minMaxStr', {a:{kind:'string',min:1,max:1},_meta:{}})", v.object({
      a: 'a'
    }, 'minMaxStr', {
      a: {
        kind: 'string',
        min: 1,
        max: 1
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({a:'a'}, 'ruleStr', {a:{kind:'string',rule:{test:s=>s=='a'}},_meta:{}})", v.object({
      a: 'a'
    }, 'ruleStr', {
      a: {
        kind: 'string',
        rule: {
          test: function test(s) {
            return s == 'a';
          }
        }
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({a:'a'}, 'setStr', {a:{kind:'string',set:['a','b','c']},_meta:{}})", v.object({
      a: 'a'
    }, 'setStr', {
      a: {
        kind: 'string',
        set: ['a', 'b', 'c']
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({foo:{bar:'a',baz:'b'}}, undefined, {foo:{bar:{kind:'string'},baz:{kind:'string'},_meta:{}},_meta:{}})", v.object({
      foo: {
        bar: 'a',
        baz: 'b'
      }
    }, undefined, {
      foo: {
        bar: {
          kind: 'string'
        },
        baz: {
          kind: 'string'
        },
        _meta: {}
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({}, 'hasFooFallback', {foo:{fallback:'a',kind:'string'},_meta:{}})", v.object({}, 'hasFooFallback', {
      foo: {
        fallback: 'a',
        kind: 'string'
      },
      _meta: {}
    })).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.object({A:{b:'b',c:'c',D:{e:'e'}},f:''}, 'complexStr', {_meta:{}, ... kind:'string'}})", v.object({
      A: {
        b: 'b',
        c: 'c',
        D: {
          e: 'e'
        }
      },
      f: ''
    }, 'complexStr', {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'string'
        },
        c: {
          kind: 'string'
        },
        D: {
          _meta: {},
          e: {
            kind: 'string'
          }
        }
      },
      f: {
        kind: 'string'
      }
    })).toBe(true);
    xp("v.err", v.err).toBe(null); // String invalid.

    xp("v.object({a:''}, 'minMaxStr', {a:{kind:'string',min:1,max:1},_meta:{}})", v.object({
      a: ''
    }, 'minMaxStr', {
      a: {
        kind: 'string',
        min: 1,
        max: 1
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'minMaxStr.a' length 0 is < 1");
    xp("v.object({a:'abc'}, undefined, {a:{kind:'string',min:1,max:1},_meta:{}})", v.object({
      a: 'abc'
    }, undefined, {
      a: {
        kind: 'string',
        min: 1,
        max: 1
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'a' of a value length 3 is > 1");
    xp("v.object({a:'A'}, 'ruleStr', {a:{kind:'string',rule:{test:s=>s=='a'}},_meta:{}})", v.object({
      a: 'A'
    }, 'ruleStr', {
      a: {
        kind: 'string',
        rule: {
          test: function test(s) {
            return s == 'a';
          }
        }
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toMatch(/^obj\(\): 'ruleStr.a' "A" fails /);
    xp("v.object({a:'d'}, undefined, {a:{kind:'string',set:['a','b','c']},_meta:{}})", v.object({
      a: 'd'
    }, undefined, {
      a: {
        kind: 'string',
        set: ['a', 'b', 'c']
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'a' of a value \"d\" is not in [a,b,c]");
    xp("v.object({foo:{bar:'a',baz:[]}}, 'nestedStr', {foo:{bar:{kind:'string'},baz:{kind:'string'},_meta:{}},_meta:{}})", v.object({
      foo: {
        bar: 'a',
        baz: []
      }
    }, 'nestedStr', {
      foo: {
        bar: {
          kind: 'string'
        },
        baz: {
          kind: 'string'
        },
        _meta: {}
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'nestedStr.foo.baz' is an array not type 'string'");
    xp("v.object({foo:true}, 'hasFooFallback', {foo:{fallback:'a',kind:'string'},_meta:{}})", v.object({
      foo: true
    }, 'hasFooFallback', {
      foo: {
        fallback: 'a',
        kind: 'string'
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'hasFooFallback.foo' is type 'boolean' not 'string'");
    xp("v.object({A:{b:'b',c:'c',D:{e:undefined}},f:''}, 'complexStr', {_meta:{}, ... kind:'string'}})", v.object({
      A: {
        b: 'b',
        c: 'c',
        D: {
          e: undefined
        }
      },
      f: ''
    }, 'complexStr', {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'string'
        },
        c: {
          kind: 'string'
        },
        D: {
          _meta: {},
          e: {
            kind: 'string'
          }
        }
      },
      f: {
        kind: 'string'
      }
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'complexStr.A.D.e' is type 'undefined' not 'string'"); // Mixed ok.

    xp("v.object({A:{b:false,c:-9,D:{e:''}},f:1e-3}, 'complexNum', {_meta:{}, ... kind:'number'}})", v.object({
      A: {
        b: false,
        c: -9,
        D: {
          e: ''
        }
      },
      f: 1e-3
    }, 'complexNum', {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'boolean'
        },
        c: {
          kind: 'integer'
        },
        D: {
          _meta: {},
          e: {
            kind: 'string'
          }
        }
      },
      f: {
        kind: 'number'
      }
    })).toBe(true);
    xp("v.err", v.err).toBe(null); // Mixed invalid.

    xp("v.object({A:{b:null,c:-9,D:{e:''}},f:1e-3}, 'complexNum', {_meta:{}, ... kind:'number'}})", v.object({
      A: {
        b: null,
        c: -9,
        D: {
          e: ''
        }
      },
      f: 1e-3
    }, 'complexNum', {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'boolean'
        },
        c: {
          kind: 'integer'
        },
        D: {
          _meta: {},
          e: {
            kind: 'string'
          }
        }
      },
      f: {
        kind: 'number'
      }
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'complexNum.A.b' is null not type 'boolean'");
    xp("v.object({A:{b:false,c:1.1,D:{e:''}},f:1e-3}, undefined, {_meta:{}, ... kind:'number'}})", v.object({
      A: {
        b: false,
        c: 1.1,
        D: {
          e: ''
        }
      },
      f: 1e-3
    }, undefined, {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'boolean'
        },
        c: {
          kind: 'integer'
        },
        D: {
          _meta: {},
          e: {
            kind: 'string'
          }
        }
      },
      f: {
        kind: 'number'
      }
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'A.c' of a value 1.1 is not an integer");
    xp("v.object({A:{b:false,c:-9,D:{e:{}}},f:1e-3}, 'complexNum', {_meta:{}, ... kind:'number'}})", v.object({
      A: {
        b: false,
        c: -9,
        D: {
          e: {}
        }
      },
      f: 1e-3
    }, 'complexNum', {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'boolean'
        },
        c: {
          kind: 'integer'
        },
        D: {
          _meta: {},
          e: {
            kind: 'string'
          }
        }
      },
      f: {
        kind: 'number'
      }
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'complexNum.A.D.e' is type 'object' not 'string'");
    xp("v.object({A:{b:false,c:-9,D:{e:''}},f:[]}, undefined, {_meta:{}, ... kind:'number'}})", v.object({
      A: {
        b: false,
        c: -9,
        D: {
          e: ''
        }
      },
      f: []
    }, undefined, {
      _meta: {},
      A: {
        _meta: {},
        b: {
          kind: 'boolean'
        },
        c: {
          kind: 'integer'
        },
        D: {
          _meta: {},
          e: {
            kind: 'string'
          }
        }
      },
      f: {
        kind: 'number'
      }
    })).toBe(false);
    xp("v.err", v.err).toBe("obj(): 'f' of a value is an array not type 'number'");
  } // rufflib-validate/src/methods/schema.js

  /* ---------------------------------- Tests --------------------------------- */
  // Tests Validate.schema().


  function test$2(xp, Validate) {
    xp().section('schema()');
    var v = new Validate('sma()'); // Basic ok.

    xp("v.schema({_meta:{}}, 'empty')", v.schema({
      _meta: {}
    }, 'empty')).toBe(true);
    xp("v.err", v.err).toBe(null); // Basic invalid.

    xp("v.schema(100, 'hundred')", v.schema(100, 'hundred')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'hundred' is type 'number' not an object");
    xp("v.schema([1,2,3])", v.schema([1, 2, 3])).toBe(false);
    xp("v.err", v.err).toBe("sma(): unnamed schema is an array not an object"); // Nullish.

    xp("v.schema(undefined, 'undef')", v.schema(undefined, 'undef')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'undef' is type 'undefined' not an object");
    xp("v.schema(null, 'empty')", v.schema(null, 'empty')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'empty' is null not an object");
    xp("v.schema(null)", v.schema(null)).toBe(false);
    xp("v.err", v.err).toBe("sma(): unnamed schema is null not an object");
    xp("v.schema([], 'emptyArray')", v.schema([], 'emptyArray')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'emptyArray' is an array not an object"); // Schema invalid, basic property errors.

    xp("v.schema({}, 's')", v.schema({}, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's._meta' is type 'undefined' not an object");
    xp("v.schema({_meta:[]})", v.schema({
      _meta: []
    })).toBe(false);
    xp("v.err", v.err).toBe("sma(): unnamed schema '._meta' is an array not an object");
    xp("v.schema({_meta:null}, 's')", v.schema({
      _meta: null
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's._meta' is null not an object");
    xp("v.schema({_meta:{},foo:{_meta:123}}, 'MY_SCHEMA')", v.schema({
      _meta: {},
      foo: {
        _meta: 123
      }
    }, 'MY_SCHEMA')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'MY_SCHEMA.foo._meta' is type 'number' not an object");
    xp("v.schema({_meta:{},foo:{_meta:[1,2,3]}}, undefined)", v.schema({
      _meta: {},
      foo: {
        _meta: [1, 2, 3]
      }
    }, undefined)).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'foo._meta' of the schema is an array not an object");
    xp("v.schema({_meta:null})", v.schema({
      _meta: null
    })).toBe(false);
    xp("v.err", v.err).toBe("sma(): unnamed schema '._meta' is null not an object");
    xp("v.schema({_meta:{},a:{_meta:{},b:{_meta:{}}},c:{_meta:{},d:{_meta:{}},e:{_meta:[]}}})", v.schema({
      _meta: {},
      a: {
        _meta: {},
        b: {
          _meta: {}
        }
      },
      c: {
        _meta: {},
        d: {
          _meta: {}
        },
        e: {
          _meta: []
        }
      }
    })).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'c.e._meta' of the schema is an array not an object");
    xp("v.schema({a:1, _meta:{}}, 'schema')", v.schema({
      a: 1,
      _meta: {}
    }, 'schema')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'schema.a' is type 'number' not an object");
    xp("v.schema({a:null, _meta:{}}, null)", v.schema({
      a: null,
      _meta: {}
    }, null)).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'a' of the schema is null not an object");
    xp("v.schema({a:{_meta:true}, _meta:{}}, 's')", v.schema({
      a: {
        _meta: true
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.a._meta' is type 'boolean' not an object");
    xp("v.schema({Foo:{_meta:[]}, _meta:{}}, 's')", v.schema({
      Foo: {
        _meta: []
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.Foo._meta' is an array not an object");
    xp("v.schema({num:{}, _meta:{}}, 's')", v.schema({
      num: {},
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.num.kind' not recognised");
    xp("v.schema({num:{kind:123}, _meta:{}})", v.schema({
      num: {
        kind: 123
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'num.kind' of the schema not recognised");
    xp("v.schema({outer:{_meta:{},inner:{}}, _meta:{}}, 's')", v.schema({
      outer: {
        _meta: {},
        inner: {}
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.outer.inner.kind' not recognised"); // Schema invalid, value properties are never allowed to be `null`.

    xp("v.schema({BOOL:{fallback:null,kind:'boolean'}, _meta:{}}, 's')", v.schema({
      BOOL: {
        fallback: null,
        kind: 'boolean'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.BOOL.fallback' is null");
    xp("v.schema({n:{max:null,kind:'number'}, _meta:{}}))", v.schema({
      n: {
        max: null,
        kind: 'number'
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'n.max' of the schema is null");
    xp("v.schema({n:{min:null,kind:'number'}, _meta:{}}, 's')", v.schema({
      n: {
        min: null,
        kind: 'number'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.n.min' is null");
    xp("v.schema({n:{rule:null,kind:'number'}, _meta:{}}, 0)", v.schema({
      n: {
        rule: null,
        kind: 'number'
      },
      _meta: {}
    }, 0)).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'n.rule' of the schema is null");
    xp("v.schema({n:{set:null,kind:'number'}, _meta:{}}, 's')", v.schema({
      n: {
        set: null,
        kind: 'number'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.n.set' is null"); // Schema invalid, only 0 or 1 qualifiers allowed.

    xp("v.schema({str:{max:1,rule:1,kind:'string'}, _meta:{}}, 's')", v.schema({
      str: {
        max: 1,
        rule: 1,
        kind: 'string'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.str' has '2' qualifiers, only 0 or 1 allowed");
    xp("v.schema({str:{min:1,set:1,kind:'string'}, _meta:{}}, undefined)", v.schema({
      str: {
        min: 1,
        set: 1,
        kind: 'string'
      },
      _meta: {}
    }, undefined)).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'str' of the schema has '2' qualifiers, only 0 or 1 allowed");
    xp("v.schema({str:{min:1,max:1,set:1,kind:'string'}, _meta:{}}, 's')", v.schema({
      str: {
        min: 1,
        max: 1,
        set: 1,
        kind: 'string'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.str' has '3' qualifiers, only 0 or 1 allowed");
    xp("v.schema({str:{min:1,max:1,rule:1,set:1,kind:'string'}, _meta:{}})", v.schema({
      str: {
        min: 1,
        max: 1,
        rule: 1,
        set: 1,
        kind: 'string'
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'str' of the schema has '4' qualifiers, only 0 or 1 allowed"); // Schema invalid, boolean.

    xp("v.schema({BOOL:{fallback:0,kind:'boolean'}, _meta:{}}, 's')", v.schema({
      BOOL: {
        fallback: 0,
        kind: 'boolean'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.BOOL' has 'number' fallback, not 'boolean' or 'undefined'");
    xp("v.schema({BOOL:{max:true,kind:'boolean'}, _meta:{}}, false)", v.schema({
      BOOL: {
        max: true,
        kind: 'boolean'
      },
      _meta: {}
    }, false)).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'BOOL' of the schema has 'boolean' max, not 'undefined'");
    xp("v.schema({BOOL:{min:1,kind:'boolean'}, _meta:{}}, 's')", v.schema({
      BOOL: {
        min: 1,
        kind: 'boolean'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.BOOL' has 'number' min, not 'undefined'");
    xp("v.schema({BOOL:{rule:{},kind:'boolean'}, _meta:{}})", v.schema({
      BOOL: {
        rule: {},
        kind: 'boolean'
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'BOOL' of the schema has 'object' rule, not 'undefined'");
    xp("v.schema({BOOL:{set:[],kind:'boolean'}, _meta:{}}, 's')", v.schema({
      BOOL: {
        set: [],
        kind: 'boolean'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.BOOL' has 'array' set, not 'undefined'"); // Schema invalid, integer and number.

    xp("v.schema({i:{fallback:[],kind:'integer'}, _meta:{}}, 's')", v.schema({
      i: {
        fallback: [],
        kind: 'integer'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.i' has 'array' fallback, not 'number' or 'undefined'");
    xp("v.schema({n:{max:true,kind:'number'}, _meta:{}}, -0)", v.schema({
      n: {
        max: true,
        kind: 'number'
      },
      _meta: {}
    }, -0)).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'n' of the schema has 'boolean' max, not 'number' or 'undefined'");
    xp("v.schema({int:{min:[],kind:'integer'}, _meta:{}}, 's')", v.schema({
      "int": {
        min: [],
        kind: 'integer'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.int' has 'array' min, not 'number' or 'undefined'");
    xp("v.schema({NUM:{rule:1,kind:'number'}, _meta:{}}, undefined)", v.schema({
      NUM: {
        rule: 1,
        kind: 'number'
      },
      _meta: {}
    }, undefined)).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'NUM' of the schema has 'number' rule, not 'object' or 'undefined'");
    xp("v.schema({NUM:{rule:{},kind:'number'}, _meta:{}}, 's')", v.schema({
      NUM: {
        rule: {},
        kind: 'number'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.NUM' has 'undefined' rule.test, not 'function'");
    xp("v.schema({INT:{set:0,kind:'integer'}, _meta:{}})", v.schema({
      INT: {
        set: 0,
        kind: 'integer'
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'INT' of the schema has 'number' set, not an array or 'undefined'");
    xp("v.schema({n:{set:[1,'2',3],kind:'number'}, _meta:{}}, 's')", v.schema({
      n: {
        set: [1, '2', 3],
        kind: 'number'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.n' has 'string' set[1], not 'number'"); // Schema invalid, string.

    xp("v.schema({s:{fallback:1,kind:'string'}, _meta:{}}, 's')", v.schema({
      s: {
        fallback: 1,
        kind: 'string'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.s' has 'number' fallback, not 'string' or 'undefined'");
    xp("v.schema({str:{max:[],kind:'string'}, _meta:{}}, null)", v.schema({
      str: {
        max: [],
        kind: 'string'
      },
      _meta: {}
    }, null)).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'str' of the schema has 'array' max, not 'number' or 'undefined'");
    xp("v.schema({S:{min:{},kind:'string'}, _meta:{}}, 's')", v.schema({
      S: {
        min: {},
        kind: 'string'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.S' has 'object' min, not 'number' or 'undefined'");
    xp("v.schema({STR:{rule:'1',kind:'string'}, _meta:{}}, '')", v.schema({
      STR: {
        rule: '1',
        kind: 'string'
      },
      _meta: {}
    }, '')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 'STR' of the schema has 'string' rule, not 'object' or 'undefined'");
    xp("v.schema({_s:{rule:{test:[]},kind:'string'}, _meta:{}}, 's')", // @TODO '...has 'array' rule.test...'
    v.schema({
      _s: {
        rule: {
          test: []
        },
        kind: 'string'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's._s' has 'object' rule.test, not 'function'");
    xp("v.schema({_:{set:0,kind:'string'}, _meta:{}})", v.schema({
      _: {
        set: 0,
        kind: 'string'
      },
      _meta: {}
    })).toBe(false);
    xp("v.err", v.err).toBe("sma(): '_' of the schema has 'number' set, not an array or 'undefined'");
    xp("v.schema({string:{set:[1,'2',3],kind:'string'}, _meta:{}}, 's')", v.schema({
      string: {
        set: [1, '2', 3],
        kind: 'string'
      },
      _meta: {}
    }, 's')).toBe(false);
    xp("v.err", v.err).toBe("sma(): 's.string' has 'number' set[0], not 'string'");
  } // rufflib-validate/src/methods/string.js
  // Tests Validate.string()


  function test$1(xp, Validate) {
    xp().section('string()');
    var v = new Validate('str()');
    var err; // Basic ok.

    xp("v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet')", v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet')).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.string('', 'empty')", v.string('', 'empty')).toBe(true);
    xp("v.err", v.err).toBe(null); // Nullish.

    xp("v.string()", v.string()).toBe(false);
    xp("v.err", v.err).toBe("str(): a value is type 'undefined' not 'string'");
    xp("v.string(null, 'null')", v.string(null, 'null')).toBe(false);
    xp("v.err", v.err).toBe("str(): 'null' is null not type 'string'"); // Basic invalid.

    xp("v.string(10, 'ten')", v.string(10, 'ten')).toBe(false);
    xp("v.err", v.err).toBe("str(): 'ten' is type 'number' not 'string'");
    xp("v.string(NaN, 'NaN')", v.string(NaN, 'NaN')).toBe(false);
    xp("v.err", v.err).toBe("str(): 'NaN' is type 'number' not 'string'");
    xp("v.string(['a'], 'array')", v.string(['a'], 'array')).toBe(false);
    xp("v.err", v.err).toBe("str(): 'array' is an array not type 'string'");
    xp("v.string(Math, undefined)", v.string(Math, undefined)).toBe(false);
    xp("v.err", v.err).toBe("str(): a value is type 'object' not 'string'"); // Set ok. @TODO maybe don’t ignore the `max` argument?

    xp("v.string('Foobar', undefined, ['Baz','Foobar'], 3) // max 3 is ignored", v.string('Foobar', undefined, ['Baz', 'Foobar'], 3)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.string('', 'blank', [''])", v.string('', 'blank', [''])).toBe(true);
    xp("v.err", v.err).toBe(null); // Set invalid.

    xp("v.string('FOOBAR', 'CapsFoobar', ['Baz','Abcdefgi','Foobar'])", v.string('FOOBAR', 'CapsFoobar', ['Baz', 'Abcdefgi', 'Foobar'])).toBe(false);
    xp("v.err", v.err).toBe("str(): 'CapsFoobar' \"FOOBAR\" is not in [Baz,Abcdefg...obar]");
    xp("v.string('', null, [])", v.string('', null, [])).toBe(false);
    xp("v.err", v.err).toBe("str(): string \"\" is not in []"); // Rule ok. @TODO maybe don’t ignore the `max` argument?

    xp("v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet', /[a-z]{26}/, 3) // max 3 is ignored", v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet', /[a-z]{26}/, 3)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.string('Foobar', 0, {test:function(s){return s[0]==='F'}})", v.string('Foobar', 0, {
      test: function test(s) {
        return s[0] === 'F';
      }
    })).toBe(true);
    xp("v.err", v.err).toBe(null); // Rule invalid.

    xp("v.string('abcdefghIJKLMNOPQRstuvwxyz', null, /[a-z]{26}/)", v.string('abcdefghIJKLMNOPQRstuvwxyz', null, /[a-z]{26}/)).toBe(false);
    xp("v.err", v.err).toBe("str(): string \"abcdefghIJK...wxyz\" fails /[a-z]{26}/");
    xp("v.string('foobar', 'foobarLowercase', {test:function(s){return s[0]==='F'}})", v.string('foobar', 'foobarLowercase', {
      test: function test(s) {
        return s[0] === 'F';
      }
    })).toBe(false);
    xp("v.err", v.err).toMatch(/^str\(\): 'foobarLowercase' "foobar" fails function/); // Minimum ok. @TODO maybe throw an error if negative or non-integer min

    xp("v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet', 26)", v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet', 26)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.string('', null, -3)", v.string('', null, -3)).toBe(true);
    xp("v.err", v.err).toBe(null); // Minimum NaN throws an error.

    try {
      v.string('abc', 'abc', NaN);
    } catch (e) {
      err = "".concat(e);
    }

    xp("v.string('abc', 'abc', NaN)", err).toBe('Error: Validate.string() incorrectly invoked: min is NaN!');
    xp("v.err", v.err).toBe('Validate.string() incorrectly invoked: min is NaN!'); // Minimum invalid.

    xp("v.string('abc', null, 4)", v.string('abc', null, 4)).toBe(false);
    xp("v.err", v.err).toBe("str(): string length 3 is < 4");
    xp("v.string('', 'blank', 0.1)", v.string('', 'blank', 0.1)).toBe(false);
    xp("v.err", v.err).toBe("str(): 'blank' length 0 is < 0.1"); // Maximum ok. @TODO maybe throw an error if max > min, or negative or non-integer max

    xp("v.string('abc', /name-is-ignored/, 3, 3)", v.string('abc', /name-is-ignored/, 3, 3)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.string('10', 'ten', null, 55.555)", v.string('10', 'ten', null, 55.555)).toBe(true);
    xp("v.err", v.err).toBe(null);
    xp("v.string('', 'blank', -1.23, -0) // note JavaScript supports negative zero", v.string('', 'blank', -1.23, -0)).toBe(true);
    xp("v.err", v.err).toBe(null); // Maximum NaN throws an error.

    try {
      v.string('10', 'tenStr', 2, NaN);
    } catch (e) {
      err = "".concat(e);
    }

    xp("v.string('10', 'tenStr', 2, NaN)", err).toBe('Error: Validate.string() incorrectly invoked: max is NaN!');
    xp("v.err", v.err).toBe('Validate.string() incorrectly invoked: max is NaN!'); // Maximum invalid.

    xp("v.string('abc', null, 3, 2)", v.string('abc', null, 3, 2)).toBe(false);
    xp("v.err", v.err).toBe("str(): string length 3 is > 2");
    xp("v.string('', 'blank', -0.2, -0.1)", v.string('', 'blank', -0.2, -0.1)).toBe(false);
    xp("v.err", v.err).toBe("str(): 'blank' length 0 is > -0.1");
  } // rufflib-validate/src/validate.js
  // Assembles the `Validate` class.

  /* --------------------------------- Import --------------------------------- */


  var VERSION = '1.0.0';
  /* ---------------------------------- Tests --------------------------------- */
  // Runs basic tests on Validate.

  function test(expect, Validate) {
    expect().section('Validate basics');
    expect("typeof Validate // in JavaScript, a class is type 'function'", _typeof(Validate)).toBe('function');
    expect("Validate.VERSION", Validate.VERSION).toBe(VERSION);
    expect("typeof new Validate()", _typeof(new Validate())).toBe('object');
    expect("new Validate()", new Validate()).toHave({
      err: null,
      prefix: '(anon)',
      skip: false
    });
    expect("new Validate('foo()', true)", new Validate('foo()', true)).toHave({
      err: null,
      prefix: 'foo()',
      skip: true
    });
    expect().section('Typical usage');

    function sayOk(n, allowInvalid) {
      var v = new Validate('sayOk()', allowInvalid);
      if (!v.number(n, 'n', 100)) return v.err;
      return 'ok!';
    }

    expect("sayOk(123)", sayOk(123)).toBe('ok!');
    expect("sayOk(null)", sayOk(null)).toBe("sayOk(): 'n' is null not type 'number'");
    expect("sayOk(3)", sayOk(3)).toBe("sayOk(): 'n' 3 is < 100");
    expect('sayOk(3, true) // test that the `skip` argument is working', sayOk(3, true)) // @TODO test that skip works with all methods
    .toBe('ok!');
  } // rufflib-validate/src/entry-point-for-tests.js
  // Run each test. You can comment-out some during development, to help focus on
  // individual tests. But make sure all tests are uncommented before committing.


  function validateTest(expect, Validate) {
    test(expect, Validate);
    test$7(expect, Validate);
    test$6(expect, Validate);
    test$5(expect, Validate);
    test$4(expect, Validate);
    test$3(expect, Validate);
    test$2(expect, Validate);
    test$1(expect, Validate);
  }

  return validateTest;

}));
