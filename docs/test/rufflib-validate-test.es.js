/**
 * Unit tests for rufflib-validate 2.0.2
 * A RuffLIB library for succinctly validating JavaScript values.
 * https://richplastow.com/rufflib-validate
 * @license MIT
 */


// rufflib-validate/src/methods/array.js

// Tests Validate.array()
function test$8(expect, Validate) {
    const et = expect.that;

    expect.section('array()');

    const v = new Validate('arr()');
    let exc;

    // Basic ok.
    et(`v.array([], 'empty')`,
        v.array([], 'empty')).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.array([1,2,3], 'nums')`,
        v.array([1,2,3], 'nums')).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.array([1,2,3], 'nums', 3, 4)`,
        v.array([1,2,3], 'nums', 3, 4)).is(true);
    et(`v.err`, v.err).is(null);

    // Nullish.
    et(`v.array(undefined, 'undef')`,
        v.array(undefined, 'undef')).is(false);
    et(`v.err`, v.err).is(`arr(): 'undef' is type 'undefined' not an array`);
    et(`v.array(null)`,
        v.array(null)).is(false);
    et(`v.err`, v.err).is(`arr(): a value is null not an array`);

    // Incorrect `args`, throws an error.
    try{v.array([], 'empty', null, null, null, null, ''); } catch (e) { exc = `${e}`; }
    et(`v.array([], 'empty', null, null, null, null, '')`, exc)
        .is('Error: Validate.array() incorrectly invoked 1: args[4] not nullish!');
    et(`v.err`, v.err)
        .is('Validate.array() incorrectly invoked 1: args[4] not nullish!');
    try{v.array([], 'empty', 123, null, null, undefined, null, 0); } catch (e) { exc = `${e}`; }
    et(`v.array([], 'empty', 123, null, null, undefined, null, 0)`, exc)
        .is('Error: Validate.array() incorrectly invoked 2: args[5] not nullish!');
    et(`v.err`, v.err)
        .is('Validate.array() incorrectly invoked 2: args[5] not nullish!');
    try{v.array([], 'empty', 123, 456, undefined, {}); } catch (e) { exc = `${e}`; }
    et(`v.array([], 'empty', 123, 456, undefined, {})`, exc)
        .is('Error: Validate.array() incorrectly invoked 3: args[3] not nullish!');
    et(`v.err`, v.err)
        .is('Validate.array() incorrectly invoked 3: args[3] not nullish!');
    try{v.array([], 'empty', undefined, 456, undefined, undefined, 0, 0); } catch (e) { exc = `${e}`; }
    et(`v.array([], 'empty', undefined, 456, undefined, undefined, 0, 0)`, exc)
        .is('Error: Validate.array() incorrectly invoked 4: args[4] not nullish!');
    et(`v.err`, v.err)
        .is('Validate.array() incorrectly invoked 4: args[4] not nullish!');
    try{v.array([], 'empty', null, 456, {}); } catch (e) { exc = `${e}`; }
    et(`v.array([], 'empty', null, 456, {})`, exc)
        .is('Error: Validate.array() incorrectly invoked 5: args is not one of the nine configurations!');
    et(`v.err`, v.err)
        .is('Validate.array() incorrectly invoked 5: args is not one of the nine configurations!');
    try{v.array([], 'empty', '5'); } catch (e) { exc = `${e}`; }
    et(`v.array([], 'empty', '5')`, exc)
        .is('Error: Validate.array() incorrectly invoked 5: args is not one of the nine configurations!');
    et(`v.err`, v.err)
        .is('Validate.array() incorrectly invoked 5: args is not one of the nine configurations!');
    try{v.array([], 'empty', 0/0, null, null, undefined, null); } catch (e) { exc = `${e}`; }
    et(`v.array([], 'empty', 0/0, null, null, undefined, null)`, exc)
        .is('Error: Validate.array() incorrectly invoked: min is NaN!');
    try{v.array([], 'empty', 0, 0/0, null, null, undefined, null); } catch (e) { exc = `${e}`; }
    et(`v.array([], 'empty', 0, 0/0, null, null, undefined, null)`, exc)
        .is('Error: Validate.array() incorrectly invoked: max is NaN!');

    // Basic invalid.
    et(`v.array(0, 'zero')`,
        v.array(0, 'zero')).is(false);
    et(`v.err`, v.err).is(`arr(): 'zero' is type 'number' not an array`);
    et(`v.array('1,2,3')`,
        v.array('1,2,3')).is(false);
    et(`v.err`, v.err).is(`arr(): a value is type 'string' not an array`);
    et(`v.array([1,2], 'nums', 3, 4)`,
        v.array([1,2], 'nums', 3, 4)).is(false);
    et(`v.err`, v.err).is(`arr(): 'nums' length 2 is < 3`);
    et(`v.array([1,2,3,4,5], null, 3, 4)`,
        v.array([1,2,3,4,5], null, 3, 4)).is(false);
    et(`v.err`, v.err).is(`arr(): array length 5 is > 4`);

    // Array of booleans ok.
    et(`v.array([], 'empty', v.boolean)`,
        v.array([], 'empty', v.boolean)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.array([true,false,true], 'bools', v.boolean)`,
        v.array([true,false,true], 'bools', v.boolean)).is(true);
    et(`v.err`, v.err).is(null);

    // Array of booleans invalid.
    et(`v.array([10], 'ten', v.boolean)`,
        v.array([10], 'ten', v.boolean)).is(false);
    et(`v.err`, v.err).is(`arr(): 'ten[0]' is type 'number' not 'boolean'`);
    et(`v.array([true,0,true], null, v.boolean)`,
        v.array([true,0,true], null, v.boolean)).is(false);
    et(`v.err`, v.err).is(`arr(): '[1]' is type 'number' not 'boolean'`);

    // Array of integers ok.
    et(`v.array([0,1,2,3,4], 'count', v.integer)`,
        v.array([0,1,2,3,4], 'count', v.integer)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.array([0,1,2,3,4], 0, v.integer, 0, 4)`,
        v.array([0,1,2,3,4], 0, v.integer, 0, 4)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.array([0,1,2,3,4], 'count', v.integer, [6,5,4,3,2,1,0])`,
        v.array([0,1,2,3,4], 'count', v.integer, [6,5,4,3,2,1,0])).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.array([0,2,4,8], 'evens', v.integer, {test:n=>n%2===0})`,
        v.array([0,2,4,8], 'evens', v.integer, {test:n=>n%2===0})).is(true);
    et(`v.err`, v.err).is(null);

    // Array of integers invalid.
    et(`v.array([[]], 'subarray', v.integer)`,
        v.array([[]], 'subarray', v.integer)).is(false);
    et(`v.err`, v.err).is(`arr(): 'subarray[0]' is an array not type 'number'`);
    et(`v.array([0,1,2,3,4.0001], null, v.integer)`,
        v.array([0,1,2,3,4.0001], null, v.integer)).is(false);
    et(`v.err`, v.err).is(`arr(): '[4]' 4.0001 is not an integer`);
    et(`v.array([0,1,2,3,4], null, v.integer, 2, 4)`,
        v.array([0,1,2,3,4], null, v.integer, 2, 4)).is(false);
    et(`v.err`, v.err).is(`arr(): '[0]' 0 is < 2`);
    et(`v.array([0,1,2,3,4], 'count', v.integer, 0, 3)`,
        v.array([0,1,2,3,4], 'count', v.integer, 0, 3)).is(false);
    et(`v.err`, v.err).is(`arr(): 'count[4]' 4 is > 3`);
    et(`v.array([0,1,2,3,4], 'count', v.integer, [6,5,4,3,7777777,1,0])`,
        v.array([0,1,2,3,4], 'count', v.integer, [6,5,4,3,7777777,1,0])).is(false);
    et(`v.err`, v.err).is(`arr(): 'count[2]' 2 is not in [6,5,4,3,777...,1,0]`);
    et(`v.array([0,2,4,5], 'evens', v.integer, {test:n=>n%2===0})`,
        v.array([0,2,4,5], 'evens', v.integer, {test:n=>n%2===0})).is(false);
        et(`v.err`, v.err).passes(/^arr\(\): 'evens\[3]' 5 fails /);

    // Array of numbers ok.
    et(`v.array([-0.25,0,0.25], 'quarters', v.number)`,
        v.array([-0.25,0,0.25], 'quarters', v.number)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.array([-0.25,0,0.25], {}, v.number, -0.25, 0.25)`,
        v.array([-0.25,0,0.25], {}, v.number, -0.25, 0.25)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.array([-0.25,0,0.25], 'quarters', v.number, [-0.25,0,0.25])`,
        v.array([-0.25,0,0.25], 'quarters', v.number, [-0.25,0,0.25])).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.array([-Infinity,Infinity], 'infs', v.number, {test:n=>n<-9e99||n>9e99})`,
        v.array([-Infinity,Infinity], 'infs', v.number, {test:n=>n<-9e99||n>9e99})).is(true);
    et(`v.err`, v.err).is(null);

    // Array of numbers invalid.
    et(`v.array([-0.25,0,null,0.25], '', v.number)`,
        v.array([-0.25,0,null,0.25], '', v.number)).is(false);
    et(`v.err`, v.err).is(`arr(): '[2]' is null not type 'number'`);
    et(`v.array([-0.25,0,0.25,NaN], null, v.number)`,
        v.array([-0.25,0,0.25,NaN], null, v.number)).is(false);
    et(`v.err`, v.err).is(`arr(): '[3]' is NaN, not a valid number`);
    et(`v.array([-0.25,0,0.25], undefined, v.number, -0.25, -0.1)`,
        v.array([-0.25,0,0.25], undefined, v.number, -0.25, -0.1)).is(false);
    et(`v.err`, v.err).is(`arr(): '[1]' 0 is > -0.1`);
    const quarters = [-0.25,0,0.25];
    quarters.length = 6;
    et(`v.array([${quarters}], 'quarters', v.number, -0.25, 0.25)`,
        v.array(quarters, 'quarters', v.number, -0.25, 0.25)).is(false);
    et(`v.err`, v.err).is(`arr(): 'quarters[3]' is type 'undefined' not 'number'`);
    et(`v.array([-0.25,0,0.25], 'quarters', v.number, [6,5,4,3,7777777,1,0])`,
        v.array([-0.25,0,0.25], 'quarters', v.number, [6,5,4,3,7777777,1,0])).is(false);
    et(`v.err`, v.err).is(`arr(): 'quarters[0]' -0.25 is not in [6,5,4,3,777...,1,0]`);
    et(`v.array([-Infinity,Infinity,9e99], 'infs', v.number, {test:n=>n<-9e99||n>9e99})`,
        v.array([-Infinity,Infinity,9e99], 'infs', v.number, {test:n=>n<-9e99||n>9e99})).is(false);
    et(`v.err`, v.err).passes(/^arr\(\): 'infs\[2\]' 9e\+99 fails /);

    // Array of strings ok.
    et(`v.array(['one','two','three'], 'count', v.string)`,
        v.array(['one','two','three'], 'count', v.string)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.array(['one','two','three'], 0, v.string, 3, 5)`,
        v.array(['one','two','three'], 0, v.string, 3, 5)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.array(['two','three'], 'count', v.string, ['one','two','three'])`,
        v.array(['two','three'], 'count', v.string, ['one','two','three'])).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.array(['two','three'], false, v.string, /^[a-z]+$/)`,
        v.array(['two','three'], false, v.string, /^[a-z]+$/)).is(true);
    et(`v.err`, v.err).is(null);

    // Array of strings invalid.
    et(`v.array(['one',2,'three'], 'count', v.string)`,
        v.array(['one',2,'three'], 'count', v.string)).is(false);
    et(`v.err`, v.err).is(`arr(): 'count[1]' is type 'number' not 'string'`);
    et(`v.array(['one','two',['three']], true, v.string)`,
        v.array(['one','two',['three']], true, v.string)).is(false);
    et(`v.err`, v.err).is(`arr(): 'true[2]' is an array not type 'string'`);
    et(`v.array(['one','two','three'], null, v.string, 4, 4)`,
        v.array(['one','two','three'], null, v.string, 4, 4)).is(false);
    et(`v.err`, v.err).is(`arr(): '[0]' length 3 is < 4`);
    et(`v.array(['one','two','three'], 'count', v.string, 0, 3)`,
        v.array(['one','two','three'], 'count', v.string, 0, 3)).is(false);
    et(`v.err`, v.err).is(`arr(): 'count[2]' length 5 is > 3`);
    et(`v.array(['one','two','three'], 'count', v.string, [6,5,4,3,'one',1,0])`,
        v.array(['one','two','three'], 'count', v.string, [6,5,4,3,'one',1,0])).is(false);
    et(`v.err`, v.err).is(`arr(): 'count[1]' "two" is not in [6,5,4,3,one,1,0]`);
    et(`v.array(['one','two','THREE'], 'count', v.string, /^[a-z]+$/)`,
        v.array(['one','two','THREE'], 'count', v.string, /^[a-z]+$/)).is(false);
    et(`v.err`, v.err).is(`arr(): 'count[2]' "THREE" fails /^[a-z]+$/`);

    // Array of array of booleans ok.
    et(`v.array([[true, false],[],[true]], 'grid', v.array, v.boolean)`,
        v.array([[true, false],[],[true]], 'grid', v.array, v.boolean)).is(true);
    et(`v.err`, v.err).is(null);

    // Array of array of booleans fail.
    et(`v.array([[true, false],[],[123]], 'grid', v.array, v.boolean)`,
        v.array([[true, false],[],[123]], 'grid', v.array, v.boolean)).is(false);
    et(`v.err`, v.err).is(`arr(): 'grid[2][0]' is type 'number' not 'boolean'`);

    // The nine configurations ok.
    // 1. `args` is empty or all nullish - no min, max or validator
    et(`v.array([false,123,[],'anything'], 'arr', null, undefined, null, null)`,
        v.array([false,123,[],'anything'], 'arr', null, undefined, null, null)).is(true);
    et(`v.err`, v.err).is(null);
    // 2. `args[0]` is a number, and the rest of args is nullish - just min
    et(`v.array([false,123,[],'anything'], 'arr', 4, null, null, undefined)`,
        v.array([false,123,[],'anything'], 'arr', 4, null, null, undefined)).is(true);
    et(`v.err`, v.err).is(null);
    // 3. `args[0]` and `args[1]` are both numbers, rest of args nullish - min and max
    et(`v.array([false,123,[],'anything'], 'arr', 2, 4, undefined, undefined, null)`,
        v.array([false,123,[],'anything'], 'arr', 2, 4, undefined, undefined, null)).is(true);
    et(`v.err`, v.err).is(null);
    // 4. `args[0]` is nullish, `args[1]` is number, rest of args nullish - just max
    et(`v.array([false,123,[],'anything'], 'arr', null, 8, null, null, null)`,
        v.array([false,123,[],'anything'], 'arr', null, 8, null, null, null)).is(true);
    et(`v.err`, v.err).is(null);
    // 5. `args[0]` and `[1]` numbers, `[2]` function, rest anything - min, max and validator
    et(`v.array([false], 'arr', 0, 1, v.boolean, 'ignored', 'in this case')`,
        v.array([false], 'arr', 0, 1, v.boolean, 'ignored', 'in this case')).is(true);
    et(`v.err`, v.err).is(null);
    // 6. `args[0]` number, `[1]` nullish, `[2]` function, rest anything - min and validator
    et(`v.array([false], 'arr', 1, null, ()=>true, 'ignored', 'in this case')`,
        v.array([false], 'arr', 1, null, ()=>true, 'ignored', 'in this case')).is(true);
    et(`v.err`, v.err).is(null);
    // 7. `args[0]` nullish, `[1]` number, `[2]` function, rest anything - max and validator
    et(`v.array([false,0], 'arr', null, 2, el=>el!=null, 'ignored', 'in this case')`,
        v.array([false,0], 'arr', null, 2, el=>el!=null, 'ignored', 'in this case')).is(true);
    et(`v.err`, v.err).is(null);
    // 8. `args[0]` is a function, and the rest of args is anything - just validator
    et(`v.array([[250],[300,200]], 'arr', v.array, v.number, 200, 300)`,
        v.array([[250],[300,200]], 'arr', v.array, v.number, 200, 300)).is(true);
    et(`v.err`, v.err).is(null);
    // 9. `args[0]` is number, `[1]` is function, rest anything - min and validator
    et(`v.array([[250],[300,200]], 'arr', 2, v.array, v.number, 200, 300)`,
        v.array([[250],[300,200]], 'arr', 2, v.array, v.number, 200, 300)).is(true);
    et(`v.err`, v.err).is(null);

    // The eight configurations which can fail.
    // 2. `args[0]` is a number, and the rest of args is nullish - just min
    et(`v.array([false,123,[],'anything'], 'arr', 5, null, null, undefined)`,
        v.array([false,123,[],'anything'], 'arr', 5, null, null, undefined)).is(false);
    et(`v.err`, v.err).is(`arr(): 'arr' length 4 is < 5`);
    // 3. `args[0]` and `args[1]` are both numbers, rest of args nullish - min and max
    et(`v.array([false,123,[],'anything'], 'arr', 5, 5, undefined, undefined, null)`,
        v.array([false,123,[],'anything'], 'arr', 5, 5, undefined, undefined, null)).is(false);
    et(`v.err`, v.err).is(`arr(): 'arr' length 4 is < 5`);
    et(`v.array([false,123,[],'anything'], 'arr', 2, 3, undefined, undefined, null)`,
        v.array([false,123,[],'anything'], 'arr', 2, 3, undefined, undefined, null)).is(false);
    et(`v.err`, v.err).is(`arr(): 'arr' length 4 is > 3`);
    // 4. `args[0]` is nullish, `args[1]` is number, rest of args nullish - just max
    et(`v.array([false,123,[],'anything'], 'arr', null, 0, null, null, null)`,
        v.array([false,123,[],'anything'], 'arr', null, 0, null, null, null)).is(false);
    et(`v.err`, v.err).is(`arr(): 'arr' length 4 is > 0`);
    // 5. `args[0]` and `[1]` numbers, `[2]` function, rest anything - min, max and validator
    et(`v.array([false], 'arr', 2, 2, v.boolean, 'ignored', 'in this case')`,
        v.array([false], 'arr', 2, 2, v.boolean, 'ignored', 'in this case')).is(false);
    et(`v.err`, v.err).is(`arr(): 'arr' length 1 is < 2`);
    et(`v.array([false], 'arr', 0, 0, v.boolean, 'ignored', 'in this case')`,
        v.array([false], 'arr', 0, 0, v.boolean, 'ignored', 'in this case')).is(false);
    et(`v.err`, v.err).is(`arr(): 'arr' length 1 is > 0`);
    et(`v.array([false], 'arr', 0, 1, v.integer, 'ignored', 'in this case')`,
        v.array([false], 'arr', 0, 1, v.integer, 'ignored', 'in this case')).is(false);
    et(`v.err`, v.err).is(`arr(): 'arr[0]' is type 'boolean' not 'number'`);
    // 6. `args[0]` number, `[1]` nullish, `[2]` function, rest anything - min and validator
    et(`v.array([false], 'arr', 1.01, null, ()=>true, 'ignored', 'in this case')`,
        v.array([false], 'arr', 1.01, null, ()=>true, 'ignored', 'in this case')).is(false);
    et(`v.err`, v.err).is(`arr(): 'arr' length 1 is < 1.01`);
    et(`v.array([false], 'arr', 1, null, ()=>false, 'ignored', 'in this case')`,
        v.array([false], 'arr', 1, null, ()=>false, 'ignored', 'in this case')).is(false);
    et(`v.err`, v.err).is(null); // `()=>false` does not set `v.err`
    // 7. `args[0]` nullish, `[1]` number, `[2]` function, rest anything - max and validator
    et(`v.array([false,null], 'arr', null, 1.99, el=>el!=null, 'ignored', 'in this case')`,
        v.array([false,null], 'arr', null, 1.99, el=>el!=null, 'ignored', 'in this case')).is(false);
    et(`v.err`, v.err).is(`arr(): 'arr' length 2 is > 1.99`);
    et(`v.array([false,undefined], 'arr', null, 2, el=>el!=null, 'ignored', 'in this case')`,
        v.array([false,undefined], 'arr', null, 2, el=>el!=null, 'ignored', 'in this case')).is(false);
    et(`v.err`, v.err).is(null); // `el=>el!=null` does not set `v.err`
    // 8. `args[0]` is a function, and the rest of args is anything - just validator
    et(`v.array([[250],[300,200]], 'arr', v.array, v.number, 200, 300)`,
        v.array([[250],[300,280,10,200]], 'arr', v.array, v.number, 200, 300)).is(false);
    et(`v.err`, v.err).is(`arr(): 'arr[1][2]' 10 is < 200`);
    // 9. `args[0]` is number, `[1]` is function, rest anything - min and validator
    et(`v.array([[250],[300,200]], 'arr', 3, v.array, v.number, 200, 300)`,
        v.array([[250],[300,200]], 'arr', 3, v.array, v.number, 200, 300)).is(false);
    et(`v.err`, v.err).is(`arr(): 'arr' length 2 is < 3`);
    et(`v.array([[255.5555],[300,200]], 'arr', 2, v.array, v.integer, 200, 300)`,
        v.array([[255.5555],[300,200]], 'arr', 2, v.array, v.integer, 200, 300)).is(false);
    et(`v.err`, v.err).is(`arr(): 'arr[0][0]' 255.5555 is not an integer`);

}

// rufflib-validate/src/methods/boolean.js

// Tests Validate.boolean()
function test$7(expect, Validate) {
    const et = expect.that;

    expect.section('boolean()');

    const v = new Validate('bool()');

    // Ok.
    et(`v.boolean(true, 'true')`,
        v.boolean(true, 'true')).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.boolean(false, 'false')`,
        v.boolean(false, 'false')).is(true);
    et(`v.err`, v.err).is(null);

    // Nullish.
    et(`v.boolean(undefined, 'undef')`,
        v.boolean(undefined, 'undef')).is(false);
    et(`v.err`, v.err).is(`bool(): 'undef' is type 'undefined' not 'boolean'`);
    et(`v.boolean(null)`,
        v.boolean(null)).is(false);
    et(`v.err`, v.err).is(`bool(): a value is null not type 'boolean'`);

    // Invalid.
    et(`v.boolean(0, 'zero')`,
        v.boolean(0, 'zero')).is(false);
    et(`v.err`, v.err).is(`bool(): 'zero' is type 'number' not 'boolean'`);
    et(`v.boolean([1,2,3], 'array')`,
        v.boolean([1,2,3], 'array')).is(false);
    et(`v.err`, v.err).is(`bool(): 'array' is an array not type 'boolean'`);
}

// rufflib-validate/src/methods/class.js


/* ---------------------------------- Tests --------------------------------- */

// Tests Validate.class()
function test$6(expect, Validate) {
    const et = expect.that;

    expect.section('class()');

    const v = new Validate('fnc()');

    // Basic ok.
    class EmptyClass {}
    class FooBarClass { static foo = 'bar' }
    et(`v.class(EmptyClass, 'EmptyClass')`,
        v.class(EmptyClass, 'EmptyClass')).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.class(Error, 'nativeError')`,
        v.class(Error, 'nativeError')).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.class(Array, 'nativeArray', {_meta:{}, length:{ kind:'number' }})`,
        v.class(Array, 'nativeArray', {_meta:{}, length:{ kind:'number' }})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.class(FooBarClass, 'FooBarClass', {_meta:{}, foo:{ kind:'string', rule:/^bar$/ }})`,
        v.class(FooBarClass, 'FooBarClass', {_meta:{}, foo:{ kind:'string', rule:/^bar$/ }})).is(true);
    et(`v.err`, v.err).is(null);

    // Basic invalid.
    et(`v.class(undefined, 'undef')`,
        v.class(undefined, 'undef')).is(false);
    et(`v.err`, v.err).is(`fnc(): 'undef' is type 'undefined' not 'function'`);
    et(`v.class(null)`,
        v.class(null)).is(false);
    et(`v.err`, v.err).is(`fnc(): a value is null not type 'function'`);
    et(`v.class(100, 'hundred')`,
        v.class(100, 'hundred')).is(false);
    et(`v.err`, v.err).is(`fnc(): 'hundred' is type 'number' not 'function'`);
    et(`v.class([1,2,3])`,
        v.class([1,2,3])).is(false);
    et(`v.err`, v.err).is(`fnc(): a value is an array not type 'function'`);
    et(`v.class(FooBarClass, 'FooBarClass', {_meta:{}, foo:{ kind:'string', rule:/^ABC$/ }})`,
        v.class(FooBarClass, 'FooBarClass', {_meta:{}, foo:{ kind:'string', rule:/^ABC$/ }})).is(false);
    et(`v.err`, v.err).is(`fnc(): 'FooBarClass.foo' "bar" fails /^ABC$/`);
    et(`v.class(EmptyClass, undefined, {_meta:{}, no_such_prop:{ kind:'boolean' }})`,
        v.class(EmptyClass, undefined, {_meta:{}, no_such_prop:{ kind:'boolean' }})).is(false);
    et(`v.err`, v.err).is(`fnc(): 'no_such_prop' of a value is type 'undefined' not 'boolean'`);

    // Beyond this, `Validate.class()` behaves line `Validate.object()`,
    // which has plenty more tests.
}

// rufflib-validate/src/methods/integer.js

// Tests Validate.integer()
function test$5(expect, Validate) {
    const et = expect.that;

    expect.section('integer()');

    const v = new Validate('int()');
    let exc;

    // Basic ok.
    et(`v.integer(10, 'ten')`,
        v.integer(10, 'ten')).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.integer(-3.2e9, 'minusHuge')`,
        v.integer(-3.2e9, 'minusHuge')).is(true);
    et(`v.err`, v.err).is(null);

    // Nullish.
    et(`v.integer(undefined, 'undef')`,
        v.integer(undefined, 'undef')).is(false);
    et(`v.err`, v.err).is(`int(): 'undef' is type 'undefined' not 'number'`);
    et(`v.integer(null)`,
        v.integer(null)).is(false);
    et(`v.err`, v.err).is(`int(): a value is null not type 'number'`);

    // Basic invalid.
    et(`v.integer(true, 'true')`,
        v.integer(true, 'true')).is(false);
    et(`v.err`, v.err).is(`int(): 'true' is type 'boolean' not 'number'`);
    et(`v.integer(NaN, 'NaN')`,
        v.integer(NaN, 'NaN')).is(false);
    et(`v.err`, v.err).is(`int(): 'NaN' is NaN, not a valid number`);
    et(`v.integer(Infinity, /why-rx-here?!/)`,
        v.integer(Infinity, /why-rx-here?!/)).is(false);
    et(`v.err`, v.err).is(`int(): number Infinity is not an integer`);
    et(`v.integer(-Infinity)`,
        v.integer(-Infinity)).is(false);
    et(`v.err`, v.err).is(`int(): number -Infinity is not an integer`);
    et(`v.integer(1e-1)`,
        v.integer(1e-1)).is(false);
    et(`v.err`, v.err).is(`int(): number 0.1 is not an integer`);

    // Set ok. @TODO maybe don’t ignore the `max` argument?
    et(`v.integer(-10, undefined, [0, null, -10], 3) // max 3 is ignored`,
        v.integer(-10, undefined, [0, null, -10], 3)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.integer(0, 'zero', [0, null, -10])`,
        v.integer(0, 'zero', [0, null, -10])).is(true);
    et(`v.err`, v.err).is(null);

    // Set invalid.
    et(`v.integer(0, 'zero', ["0", Infinity, -1.23456789, 10])`,
        v.integer(0, 'zero', ["0", Infinity, -1.23456789, 10])).is(false);
    et(`v.err`, v.err).is(`int(): 'zero' 0 is not in [0,Infinity,...9,10]`);
    et(`v.integer(1.23e4, null, [])`,
        v.integer(1.23e4, null, [])).is(false);
    et(`v.err`, v.err).is(`int(): number 12300 is not in []`);

    // Rule ok. @TODO maybe don’t ignore the `max` argument?
    et(`v.integer(10, 'ten', {test:n=>n==10}, 3) // max 3 is ignored`,
        v.integer(10, 'ten', {test:n=>n==10}, 3)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.integer(-55.5e5, null, {test:()=>true})`,
        v.integer(-55.5e5, null, {test:()=>true})).is(true);
    et(`v.err`, v.err).is(null);

    // Rule invalid.
    et(`v.integer(1.23, undefined, {test:n=>n==1.23})`,
        v.integer(1.23, undefined, {test:n=>n==1.23})).is(false);
    et(`v.err`, v.err).is(`int(): number 1.23 is not an integer`);
    et(`v.integer(55, 'britvic', {test:()=>false})`,
        v.integer(55, 'britvic', {test:()=>false})).is(false);
    et(`v.err`, v.err).passes(/^int\(\): 'britvic' 55 fails /);

    // Minimum ok.
    et(`v.integer(10, 'ten', 10)`,
        v.integer(10, 'ten', 10)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.integer(-9.999e97, 'minusHuge', -9.999e98)`,
        v.integer(-9.999e97, 'minusHuge', -9.999e98)).is(true);
    et(`v.err`, v.err).is(null);

    // Minimum NaN throws an error. @TODO maybe 'Validate.integer() incorrectly ...'
    try{ v.integer(10, 'ten', NaN); } catch (e) { exc = `${e}`; }
    et(`v.integer(10, 'ten', NaN)`, exc)
        .is('Error: Validate.number() incorrectly invoked: min is NaN!');
    et(`v.err`, v.err)
        .is('Validate.number() incorrectly invoked: min is NaN!');

    // Minimum invalid.
    et(`v.integer(10, null, 20)`,
        v.integer(10, null, 20)).is(false);
    et(`v.err`, v.err).is(`int(): number 10 is < 20`);
    et(`v.integer(-Infinity, 'minusInf', -1.23)`,
        v.integer(-Infinity, 'minusInf', -1.23)).is(false);
    et(`v.err`, v.err).is(`int(): 'minusInf' -Infinity is < -1.23`);

    // Maximum ok. @TODO maybe throw an error if max > min
    et(`v.integer(10, /name-is-ignored/, 10, 10)`,
        v.integer(10, /name-is-ignored/, 10, 10)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.integer(10, 'ten', null, 55.555)`,
        v.integer(10, 'ten', null, 55.555)).is(true);
    et(`v.err`, v.err).is(null);

    // Maximum NaN throws an error. @TODO maybe 'Validate.integer() incorrectly ...'
    try{ v.integer(10, 'ten', 3, NaN); } catch (e) { exc = `${e}`; }
    et(`v.integer(10, 'ten', 3, NaN)`, exc)
        .is('Error: Validate.number() incorrectly invoked: max is NaN!');
    et(`v.err`, v.err)
        .is('Validate.number() incorrectly invoked: max is NaN!');

    // Maximum invalid.
    et(`v.integer(-1.23, null, -3.33, -2.5)`,
        v.integer(-1.23, null, -3.33, -2.5)).is(false);
    et(`v.err`, v.err).is(`int(): number -1.23 is > -2.5`);
    et(`v.integer(9e99, 'huge', 4e99, 8e99)`,
        v.integer(9e99, 'huge', 4e99, 8e99)).is(false);
    et(`v.err`, v.err).is(`int(): 'huge' 9e+99 is > 8e+99`);
}

// rufflib-validate/src/methods/number.js

// Tests Validate.number()
function test$4(expect, Validate) {
    const et = expect.that;

    expect.section('number()');

    const v = new Validate('num()');
    let exc;

    // Basic ok.
    et(`v.number(10, 'ten')`,
        v.number(10, 'ten')).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.number(-3.14, 'minusPi')`,
        v.number(-3.14, 'minusPi')).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.number(-Infinity, 'minusInfinity')`,
        v.number(-Infinity, 'minusInfinity')).is(true);
    et(`v.err`, v.err).is(null);

    // Nullish.
    et(`v.number()`,
        v.number()).is(false);
    et(`v.err`, v.err).is(`num(): a value is type 'undefined' not 'number'`);
    et(`v.number(null, 'null')`,
        v.number(null, 'null')).is(false);
    et(`v.err`, v.err).is(`num(): 'null' is null not type 'number'`);

    // Basic invalid.
    et(`v.number(true, 'true')`,
        v.number(true, 'true')).is(false);
    et(`v.err`, v.err).is(`num(): 'true' is type 'boolean' not 'number'`);
    et(`v.number(NaN, 'NaN')`,
        v.number(NaN, 'NaN')).is(false);
    et(`v.err`, v.err).is(`num(): 'NaN' is NaN, not a valid number`);

    // Set ok. @TODO maybe don’t ignore the `max` argument?
    et(`v.number(10, undefined, [Infinity, -2.2, 10], 3) // max 3 is ignored`,
        v.number(10, undefined, [Infinity, -2.2, 10], 3)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.number(Infinity, 'positiveInf', [Infinity, -2.2, 10])`,
        v.number(Infinity, 'positiveInf', [Infinity, -2.2, 10])).is(true);
    et(`v.err`, v.err).is(null);

    // Set invalid.
    et(`v.number(0, 'zero', [[0], Infinity, -1.23456789, 10])`,
        v.number(0, 'zero', [[0], Infinity, -1.23456789, 10])).is(false);
    et(`v.err`, v.err).is(`num(): 'zero' 0 is not in [0,Infinity,...9,10]`);
    et(`v.number(-Infinity, null, [])`,
        v.number(-Infinity, null, [])).is(false);
    et(`v.err`, v.err).is(`num(): number -Infinity is not in []`);

    // Rule ok. @TODO maybe don’t ignore the `max` argument?
    et(`v.number(10, 'ten', {test:n=>n==10}, 3) // max 3 is ignored`,
        v.number(10, 'ten', {test:n=>n==10}, 3)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.number(Infinity, null, {test:()=>1})`,
        v.number(Infinity, null, {test:()=>1})).is(true);
    et(`v.err`, v.err).is(null);

    // Rule invalid.
    et(`v.number(0, undefined, {test:n=>n==10||n==Infinity})`,
        v.number(0, undefined, {test:n=>n==10||n==Infinity})).is(false);
    et(`v.err`, v.err).passes(/^num\(\): number 0 fails /);
    et(`v.number(-Infinity, 'minusInf', {test:()=>0})`,
        v.number(-Infinity, 'minusInf', {test:()=>0})).is(false);
    et(`v.err`, v.err).passes(/^num\(\): 'minusInf' -Infinity fails /);

    // Minimum ok.
    et(`v.number(10, 'ten', 10)`,
        v.number(10, 'ten', 10)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.number(Infinity, 'positiveInf', -1.23)`,
        v.number(Infinity, 'positiveInf', -1.23)).is(true);
    et(`v.err`, v.err).is(null);

    // Minimum NaN throws an error.
    try{ v.number(10, 'ten', NaN); } catch (e) { exc = `${e}`; }
    et(`v.number(10, 'ten', NaN)`, exc)
        .is('Error: Validate.number() incorrectly invoked: min is NaN!');
    et(`v.err`, v.err)
        .is('Validate.number() incorrectly invoked: min is NaN!');

    // Minimum invalid.
    et(`v.number(10, null, 20)`,
        v.number(10, null, 20)).is(false);
    et(`v.err`, v.err).is(`num(): number 10 is < 20`);
    et(`v.number(-Infinity, 'minusInf', -1.23)`,
        v.number(-Infinity, 'minusInf', -1.23)).is(false);
    et(`v.err`, v.err).is(`num(): 'minusInf' -Infinity is < -1.23`);

    // Maximum ok. @TODO maybe throw an error if max > min
    et(`v.number(10, /name-is-ignored/, 10, 10)`,
        v.number(10, /name-is-ignored/, 10, 10)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.number(10, 'ten', null, 55.555)`,
        v.number(10, 'ten', null, 55.555)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.number(Infinity, 'positiveInf', -1.23, Infinity)`,
        v.number(Infinity, 'positiveInf', -1.23, Infinity)).is(true);
    et(`v.err`, v.err).is(null);

    // Maximum NaN throws an error.
    try{ v.number(10, 'ten', 3, NaN); } catch (e) { exc = `${e}`; }
    et(`v.number(10, 'ten', 3, NaN)`, exc)
        .is('Error: Validate.number() incorrectly invoked: max is NaN!');
    et(`v.err`, v.err)
        .is('Validate.number() incorrectly invoked: max is NaN!');

    // Maximum invalid.
    et(`v.number(-1.23, null, -3.33, -2.5)`,
        v.number(-1.23, null, -3.33, -2.5)).is(false);
    et(`v.err`, v.err).is(`num(): number -1.23 is > -2.5`);
    et(`v.number(9e99, 'huge', 4e99, 8e99)`,
        v.number(9e99, 'huge', 4e99, 8e99)).is(false);
    et(`v.err`, v.err).is(`num(): 'huge' 9e+99 is > 8e+99`);
}

// rufflib-validate/src/methods/object.js


/* ---------------------------------- Tests --------------------------------- */

// Tests Validate.object()
function test$3(expect, Validate) {
    const et = expect.that;

    expect.section('object()');

    const v = new Validate('obj()');
    const OK = 'Did not encounter an exception';
    let exc = OK;

    // Basic ok.
    et(`v.object({}, 'empty')`,
        v.object({}, 'empty')).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({a:1,b:2,c:3}, 'nums')`,
        v.object({a:1,b:2,c:3}, 'nums')).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({}, 'nums', {_meta:{}})`,
        v.object({}, 'nums', {_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);

    // Basic invalid.
    et(`v.object(100, 'hundred')`,
        v.object(100, 'hundred')).is(false);
    et(`v.err`, v.err).is(`obj(): 'hundred' is type 'number' not 'object'`);
    et(`v.object([1,2,3])`,
        v.object([1,2,3])).is(false);
    et(`v.err`, v.err).is(`obj(): a value is an array not an object`);

    // Nullish.
    et(`v.object(undefined, 'undef')`,
        v.object(undefined, 'undef')).is(false);
    et(`v.err`, v.err).is(`obj(): 'undef' is type 'undefined' not 'object'`);
    et(`v.object(null)`,
        v.object(null)).is(false);
    et(`v.err`, v.err).is(`obj(): a value is null not an object`);
    et(`v.object([], 'emptyArray')`,
        v.object([], 'emptyArray')).is(false);
    et(`v.err`, v.err).is(`obj(): 'emptyArray' is an array not an object`);

    // Incorrect `schema`, basic property errors.
    try{v.object({}, 'empty', null); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'empty', null)`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema' is null not an object`);
    try{v.object({}, 'e', []); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', [])`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema' is an array not an object`);
    try{v.object({}, 'e', {}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta' is type 'undefined' not an object`);
    try{v.object({}, undefined, {_meta:null}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, undefined, {_meta:null})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta' is null not an object`);
    try{v.object({}, 'e', {_meta:123}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {_meta:123})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta' is type 'number' not an object`);
    try{v.object({}, undefined, {_meta:[]}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, undefined, {_meta:[]})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta' is an array not an object`);
    try{v.object({}, 'e', {a:1, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {a:1, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.a' is type 'number' not an object`);
    try{v.object({}, 'e', {a:{_meta:true}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {a:{_meta:true}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.a._meta' is type 'boolean' not an object`);
    try{v.object({}, 'e', {Foo:{_meta:[]}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {Foo:{_meta:[]}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.Foo._meta' is an array not an object`);
    try{v.object({}, 'e', {num:{}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {num:{}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.num.kind' not recognised`);
    try{v.object({}, 'e', {outer:{_meta:{},inner:{}}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {outer:{_meta:{},inner:{}}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.outer.inner.kind' not recognised`);

    // Incorrect `schema`, _meta.inst invalid.
    try{v.object({}, 'e', {_meta:{inst:[]}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {_meta:{inst:[]}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta.inst' is an array not type 'function'`);
    try{v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:NaN}}}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:NaN}}}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.mid.inner._meta.inst' is type 'number' not type 'function'`);
    try{v.object({}, 'e', {_meta:{inst:{}}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {_meta:{inst:{}}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta.inst' is type 'object' not type 'function'`);
    try{v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:null}}}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:null}}}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.mid.inner._meta.inst' is null not type 'function'`);
    class UndefinedName { static name = undefined }
    try{v.object({}, 'e', {_meta:{inst:UndefinedName}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {_meta:{inst:namelessFunct}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta.inst.name' is type 'undefined' not 'string'`);
    class FunctionName { static name = x => x + 1 }
    try{v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:FunctionName}}}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:FunctionName}}}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.mid.inner._meta.inst.name' is type 'function' not 'string'`);
    class MathObjectName { static name = Math }
    try{v.object({}, 'e', {_meta:{inst:MathObjectName}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {_meta:{inst:MathObjectName}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta.inst.name' is type 'object' not 'string'`);
    class ArrayName { static name = ['a','bc'] }
    try{v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:ArrayName}}}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:ArrayName}}}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.mid.inner._meta.inst.name' is an array not 'string'`);

    // Incorrect `schema`, value properties are never allowed to be `null`.
    try{v.object({}, 'e', {BOOL:{fallback:null,kind:'boolean'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {BOOL:{fallback:null,kind:'boolean'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL.fallback' is null`);
    try{v.object({}, 'e', {n:{max:null,kind:'number'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {n:{max:null,kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.n.max' is null`);
    try{v.object({}, 'e', {n:{min:null,kind:'number'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {n:{min:null,kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.n.min' is null`);
    try{v.object({}, 'e', {n:{rule:null,kind:'number'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {n:{rule:null,kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.n.rule' is null`);
    try{v.object({}, 'e', {n:{set:null,kind:'number'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {n:{set:null,kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.n.set' is null`);

    // Incorrect `schema`, only 0 or 1 qualifiers allowed.
    try{v.object({}, 'e', {s:{max:1,rule:1,kind:'string'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {s:{max:1,rule:1,kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has '2' qualifiers, only 0 or 1 allowed`);
    try{v.object({}, 'e', {s:{min:1,set:1,kind:'string'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {s:{min:1,set:1,kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has '2' qualifiers, only 0 or 1 allowed`);
    try{v.object({}, 'e', {s:{min:1,max:1,set:1,kind:'string'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {s:{min:1,max:1,set:1,kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has '3' qualifiers, only 0 or 1 allowed`);
    try{v.object({}, 'e', {s:{min:1,max:1,rule:1,set:1,kind:'string'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {s:{min:1,max:1,rule:1,set:1,kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has '4' qualifiers, only 0 or 1 allowed`);

    // Incorrect `schema`, boolean.
    try{v.object({}, 'e', {BOOL:{fallback:0,kind:'boolean'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {BOOL:{fallback:0,kind:'boolean'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'number' fallback, not 'boolean' or 'undefined'`);
    try{v.object({}, 'e', {BOOL:{max:true,kind:'boolean'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {BOOL:{max:true,kind:'boolean'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'boolean' max, not 'undefined'`);
    try{v.object({}, 'e', {BOOL:{min:1,kind:'boolean'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {BOOL:{min:1,kind:'boolean'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'number' min, not 'undefined'`);
    try{v.object({}, 'e', {BOOL:{rule:{},kind:'boolean'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {BOOL:{rule:{},kind:'boolean'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'object' rule, not 'undefined'`);
    try{v.object({}, 'e', {BOOL:{set:[],kind:'boolean'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {BOOL:{set:[],kind:'boolean'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'array' set, not 'undefined'`);

    // Incorrect `schema`, integer and number.
    try{v.object({}, 'e', {i:{fallback:[],kind:'integer'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {i:{fallback:[],kind:'integer'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.i' has 'array' fallback, not 'number' or 'undefined'`);
    try{v.object({}, 'e', {n:{max:true,kind:'number'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {n:{max:true,kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.n' has 'boolean' max, not 'number' or 'undefined'`);
    try{v.object({}, 'e', {int:{min:[],kind:'integer'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {int:{min:[]],kind:'integer'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.int' has 'array' min, not 'number' or 'undefined'`);
    try{v.object({}, 'e', {NUM:{rule:1,kind:'number'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {NUM:{rule:1,kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.NUM' has 'number' rule, not 'object' or 'undefined'`);
    try{v.object({}, 'e', {NUM:{rule:{},kind:'number'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {NUM:{rule:{},kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.NUM' has 'undefined' rule.test, not 'function'`);
    try{v.object({}, 'e', {INT:{set:0,kind:'integer'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {INT:{set:0,kind:'integer'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.INT' has 'number' set, not an array or 'undefined'`);
    try{v.object({}, 'e', {n:{set:[1,'2',3],kind:'number'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {n:{set:[1,'2',3],kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.n' has 'string' set[1], not 'number'`);

    // Incorrect `schema`, string.
    try{v.object({}, 'e', {s:{fallback:1,kind:'string'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {s:{fallback:1,kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has 'number' fallback, not 'string' or 'undefined'`);
    try{v.object({}, 'e', {str:{max:[],kind:'string'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {str:{max:[],kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.str' has 'array' max, not 'number' or 'undefined'`);
    try{v.object({}, 'e', {S:{min:{},kind:'string'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {S:{min:{}],kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.S' has 'object' min, not 'number' or 'undefined'`);
    try{v.object({}, 'e', {STR:{rule:'1',kind:'string'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {STR:{rule:'1',kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.STR' has 'string' rule, not 'object' or 'undefined'`);
    try{v.object({}, 'e', {_s:{rule:{test:[]},kind:'string'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {_s:{rule:{test:[]},kind:'string'}, _meta:{}})`, exc) // @TODO '...has 'array' rule.test...'
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._s' has 'object' rule.test, not 'function'`);
    try{v.object({}, 'e', {_:{set:0,kind:'string'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {_:{set:0,kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._' has 'number' set, not an array or 'undefined'`);
    try{v.object({}, 'e', {string:{set:[1,'2',3],kind:'string'}, _meta:{}}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({}, 'e', {string:{set:[1,'2',3],kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.string' has 'number' set[0], not 'string'`);

    // Boolean ok.
    et(`v.object({basic:false}, 'basicBool', {basic:{kind:'boolean'},_meta:{}})`,
        v.object({basic:false}, 'basicBool', {basic:{kind:'boolean'},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({foo:{bar:true}}, undefined, {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:true}}, undefined, {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({}, 'hasFooFallback', {foo:{fallback:true,kind:'boolean'},_meta:{}})`,
        v.object({}, 'hasFooFallback', {foo:{fallback:true,kind:'boolean'},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({foo:false}, undefined, {foo:{fallback:true,kind:'boolean'},_meta:{}})`,
        v.object({foo:false}, undefined, {foo:{fallback:true,kind:'boolean'},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({A:{b:true,c:false,D:{e:true}},f:true}, 'complexBool', {_meta:{}, ... kind:'boolean'}})`,
        v.object({A:{b:true,c:false,D:{e:true}},f:true}, 'complexBool', {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'boolean'},
            D:{_meta:{},e:{kind:'boolean'}}},f:{kind:'boolean'}
        })).is(true);
    et(`v.err`, v.err).is(null);

    // Boolean invalid.
    et(`v.object({B:123}, 'o', {B:{kind:'boolean'},_meta:{}})`,
        v.object({B:123}, 'o', {B:{kind:'boolean'},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'o.B' is type 'number' not 'boolean'`);
    et(`v.object({basic:[false]}, 'basicBool', {basic:{kind:'boolean'},_meta:{}})`,
        v.object({basic:[false]}, 'basicBool', {basic:{kind:'boolean'},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'basicBool.basic' is an array not type 'boolean'`);
    et(`v.object({bar:true}, undefined, {basic:{kind:'boolean'},_meta:{}})`,
        v.object({bar:true}, undefined, {basic:{kind:'boolean'},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'basic' of a value is type 'undefined' not 'boolean'`);
    et(`v.object({foo:{BAR:true}}, 'nestedBool', {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})`,
        v.object({foo:{BAR:true}}, 'nestedBool', {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'nestedBool.foo.bar' is type 'undefined' not 'boolean'`);
    et(`v.object({foo:{bar:null}}, undefined, {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:null}}, undefined, {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'foo.bar' of a value is null not type 'boolean'`);
    et(`v.object({foo:[]}, 'hasFooFallback', {foo:{fallback:true,kind:'boolean'},_meta:{}})`,
        v.object({foo:[]}, 'hasFooFallback', {foo:{fallback:true,kind:'boolean'},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'hasFooFallback.foo' is an array not type 'boolean'`);
    et(`v.object({foo:null}, undefined, {foo:{fallback:true,kind:'boolean'},_meta:{}})`,
        v.object({foo:null}, undefined, {foo:{fallback:true,kind:'boolean'},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'foo' of a value is null not type 'boolean'`);
    et(`v.object({A:{b:true,c:123,D:{e:true}},f:true}, 'complexBool', {_meta:{}, ... kind:'boolean'}})`,
        v.object({A:{b:true,c:123,D:{e:true}},f:true}, 'complexBool', {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'boolean'},
            D:{_meta:{},e:{kind:'boolean'}}},f:{kind:'boolean'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'complexBool.A.c' is type 'number' not 'boolean'`);
    et(`v.object({f:false,A:{c:true,b:false,D:{E:true}}}, undefined, {_meta:{}, ... kind:'boolean'}})`,
        v.object({f:false,A:{c:true,b:false,D:{E:true}}}, undefined, {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'boolean'},
            D:{_meta:{},e:{kind:'boolean'}}},f:{kind:'boolean'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'A.D.e' of a value is type 'undefined' not 'boolean'`);

    // Instanceof ok.
    class EmptyClass {}    const emptyClassInst = new EmptyClass();
    et(`v.object(emptyClassInst, 'emptyClassInst', {_meta:{}})`,
        v.object(emptyClassInst, 'emptyClassInst', {_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object(emptyClassInst, 'emptyClassInst', {_meta:{inst:EmptyClass}})`,
        v.object(emptyClassInst, 'emptyClassInst', {_meta:{inst:EmptyClass}})).is(true);
    et(`v.err`, v.err).is(null);

    // Instanceof invalid.
    et(`v.object({}, 'plainObject', {_meta:{inst:EmptyClass}})`,
        v.object({}, 'plainObject', {_meta:{inst:EmptyClass}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'plainObject' is not an instance of 'EmptyClass'`);
    class FooBarClass { foo = 'bar' }    const fooBarClassInst = new FooBarClass();
    et(`v.object(fooBarClassInst, 'fooBarClassInst', {_meta:{inst:EmptyClass}})`,
        v.object(fooBarClassInst, 'fooBarClassInst', {_meta:{inst:EmptyClass}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'fooBarClassInst' is not an instance of 'EmptyClass'`);
    et(`v.object(fooBarClassInst, null, {_meta:{inst:EmptyClass}})`,
        v.object(fooBarClassInst, null, {_meta:{inst:EmptyClass}})).is(false);
    et(`v.err`, v.err).is(`obj(): the top level object is not an instance of 'EmptyClass'`);
    et(`v.object({ bar:fooBarClassInst }, 'foo', {_meta:{}, bar:{_meta:{inst:EmptyClass}}})`,
        v.object({ bar:fooBarClassInst }, 'foo', {_meta:{}, bar:{_meta:{inst:EmptyClass}}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'foo.bar' is not an instance of 'EmptyClass'`);
    et(`v.object({ bar:fooBarClassInst }, null, {_meta:{}, bar:{_meta:{inst:EmptyClass}}})`,
        v.object({ bar:fooBarClassInst }, null, {_meta:{}, bar:{_meta:{inst:EmptyClass}}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'bar' of the top level object is not an instance of 'EmptyClass'`);

    // Integer ok.
    et(`v.object({basic:1}, 'minMaxInt', {basic:{kind:'integer',min:1,max:1},_meta:{}})`,
        v.object({basic:1}, 'minMaxInt', {basic:{kind:'integer',min:1,max:1},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({basic:1}, 'ruleInt', {basic:{kind:'integer',rule:{test:n=>n==1}},_meta:{}})`,
        v.object({basic:1}, 'ruleInt', {basic:{kind:'integer',rule:{test:n=>n==1}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({basic:1}, 'setInt', {basic:{kind:'integer',set:[-4,1,77]},_meta:{}})`,
        v.object({basic:1}, 'setInt', {basic:{kind:'integer',set:[-4,1,77]},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({foo:{bar:44}}, undefined, {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:44}}, undefined, {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({}, 'hasFooFallback', {foo:{fallback:0,kind:'integer'},_meta:{}})`,
        v.object({}, 'hasFooFallback', {foo:{fallback:0,kind:'integer'},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({A:{b:0,c:1,D:{e:-2}},f:9e9}, 'complexInt', {_meta:{}, ... kind:'integer'}})`,
        v.object({A:{b:0,c:1,D:{e:-2}},f:9e9}, 'complexInt', {
            _meta:{},A:{_meta:{},b:{kind:'integer'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'integer'}}},f:{kind:'integer'}
        })).is(true);
    et(`v.err`, v.err).is(null);

    // Integer invalid.
    et(`v.object({basic:2}, 'minMaxInt', {basic:{kind:'integer',min:1,max:1},_meta:{}})`,
        v.object({basic:2}, 'minMaxInt', {basic:{kind:'integer',min:1,max:1},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'minMaxInt.basic' 2 is > 1`);
    et(`v.object({basic:0}, undefined, {basic:{kind:'integer',min:1,max:1},_meta:{}})`,
        v.object({basic:0}, undefined, {basic:{kind:'integer',min:1,max:1},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'basic' of a value 0 is < 1`);
    et(`v.object({basic:1.5}, 'ruleInt', {basic:{kind:'integer',rule:{test:n=>n==1}},_meta:{}})`,
        v.object({basic:1.5}, 'ruleInt', {basic:{kind:'integer',rule:{test:n=>n==1}},_meta:{}})).is(false);
    et(`v.err`, v.err).passes(/^obj\(\): 'ruleInt\.basic' 1\.5 fails /);
    et(`v.object({basic:1}, undefined, {basic:{kind:'integer',rule:{test:n=>n<-99999999||n>5555555}},_meta:{}})`,
        v.object({basic:1}, undefined, {basic:{kind:'integer',rule:{test:n=>n<-99999999||n>5555555}},_meta:{}})).is(false);
    et(`v.err`, v.err).passes(/^obj\(\): 'basic' of a value 1 fails /);
    et(`v.object({basic:1}, 'setInt', {basic:{kind:'integer',set:[-44444444,0,77777777]},_meta:{}})`,
        v.object({basic:1}, 'setInt', {basic:{kind:'integer',set:[-44444444,0,77777777]},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'setInt.basic' 1 is not in [-44444444,0...7777]`);
    et(`v.object({basic:0}, undefined, {basic:{kind:'integer',set:[-4,1,77]},_meta:{}})`,
        v.object({basic:0}, undefined, {basic:{kind:'integer',set:[-4,1,77]},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'basic' of a value 0 is not in [-4,1,77]`);
    et(`v.object({foo:{bar:'44'}}, 'nestedInt', {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:'44'}}, 'nestedInt', {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'nestedInt.foo.bar' is type 'string' not 'number'`);
    et(`v.object({foo:{bar:44.444}}, undefined, {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:44.444}}, undefined, {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'foo.bar' of a value 44.444 is not an integer`);
    et(`v.object({foo:-0.001}, 'hasFooFallback', {foo:{fallback:0,kind:'integer'},_meta:{}})`,
        v.object({foo:-0.001}, 'hasFooFallback', {foo:{fallback:0,kind:'integer'},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'hasFooFallback.foo' -0.001 is not an integer`);
    et(`v.object({A:{b:0,c:1,D:{e:-2}},f:9e-9}, 'complexInt', {_meta:{}, ... kind:'integer'}})`,
        v.object({A:{b:0,c:1,D:{e:[]}},f:9e9}, 'complexInt', {
            _meta:{},A:{_meta:{},b:{kind:'integer'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'integer'}}},f:{kind:'integer'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'complexInt.A.D.e' is an array not type 'number'`);
    et(`v.object({A:{b:0,c:1,D:{e:-2}},f:9e-9}, undefined, {_meta:{}, ... kind:'integer'}})`,
        v.object({A:{b:0,c:1,D:{e:-2}},f:9e-9}, undefined, {
            _meta:{},A:{_meta:{},b:{kind:'integer'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'integer'}}},f:{kind:'integer'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'f' of a value 9e-9 is not an integer`);

    // Number ok.
    et(`v.object({basic:-888.8}, 'maxNum', {basic:{kind:'number',max:-33.3},_meta:{}})`,
        v.object({basic:-888.8}, 'maxNum', {basic:{kind:'number',max:-33.3},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({basic:-55.555}, 'minNum', {basic:{kind:'number',min:-99},_meta:{}})`,
        v.object({basic:-55.555}, 'minNum', {basic:{kind:'number',min:-99},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({basic:1.23}, 'ruleNum', {basic:{kind:'number',rule:{test:n=>n>1.2&&n<1.3}},_meta:{}})`,
        v.object({basic:1.23}, 'ruleNum', {basic:{kind:'number',rule:{test:n=>n>1.2&&n<1.3}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({foo:{bar:-0}}, undefined, {foo:{bar:{kind:'number',set:[0]},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:-0}}, undefined, {foo:{bar:{kind:'number',set:[0]},_meta:{}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({foo:{}}, 'hasFooBarFallback', {foo:{bar:{kind:'number',fallback:-9.876},_meta:{}},_meta:{}})`,
        v.object({foo:{}}, 'hasFooBarFallback', {foo:{bar:{kind:'number',fallback:-9.876},_meta:{}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({A:{b:0,c:-Infinity,D:{e:-2.2222}},f:9e9}, 'complexNum', {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:0,c:-Infinity,D:{e:-2.2222}},f:9e9}, 'complexNum', {
            _meta:{},A:{_meta:{},b:{kind:'number'},c:{kind:'number'},
            D:{_meta:{},e:{kind:'number'}}},f:{kind:'number'}
        })).is(true);
    et(`v.err`, v.err).is(null);

    // Number invalid.
    et(`v.object({basic:-8.8}, 'maxNum', {basic:{kind:'number',max:-33.3},_meta:{}})`,
        v.object({basic:-8.8}, 'maxNum', {basic:{kind:'number',max:-33.3},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'maxNum.basic' -8.8 is > -33.3`);
    et(`v.object({basic:-Infinity}, undefined, {basic:{kind:'number',min:-99},_meta:{}})`,
        v.object({basic:-Infinity}, undefined, {basic:{kind:'number',min:-99},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'basic' of a value -Infinity is < -99`);
    et(`v.object({basic:1.3}, 'ruleNum', {basic:{kind:'number',rule:{test:n=>n>1.2&&n<1.3}},_meta:{}})`,
        v.object({basic:1.3}, 'ruleNum', {basic:{kind:'number',rule:{test:n=>n>1.2&&n<1.3}},_meta:{}})).is(false);
    et(`v.err`, v.err).passes(/^obj\(\): 'ruleNum\.basic' 1\.3 fails /);
    et(`v.object({foo:{bar:0}}, undefined, {foo:{bar:{kind:'number',set:[-0.0001]},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:-0}}, undefined, {foo:{bar:{kind:'number',set:[]},_meta:{}},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'foo.bar' of a value 0 is not in []`);
    et(`v.object({foo:{bar:{}}}, 'hasFooBarFallback', {foo:{bar:{kind:'number',fallback:-9.876},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:{}}}, 'hasFooBarFallback', {foo:{bar:{kind:'number',fallback:-9.876},_meta:{}},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'hasFooBarFallback.foo.bar' is type 'object' not 'number'`);
    et(`v.object({A:null}, 'numstedNum', {_meta:{},A:{_meta:{},b:{kind:'number'}}})`,
        v.object({A:null}, 'numstedNum', {_meta:{},A:{_meta:{},b:{kind:'number'}}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'numstedNum.A' is null not an object`);
    et(`v.object({A:{b:0,c:-Infinity,D:[]},f:9e9}, 'complexNum', {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:0,c:-Infinity,D:[]},f:9e9}, 'complexNum', {
            _meta:{},A:{_meta:{},b:{kind:'number'},c:{kind:'number'},
            D:{_meta:{},e:{kind:'number'}}},f:{kind:'number'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'complexNum.A.D' is an array not an object`);
    et(`v.object({A:{b:0,c:-Infinity,D:1},f:9e9}, undefined, {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:0,c:-Infinity,D:1},f:9e9}, undefined, {
            _meta:{},A:{_meta:{},b:{kind:'number'},c:{kind:'number'},
            D:{_meta:{},e:{kind:'number'}}},f:{kind:'number'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'A.D' of a value is type 'number' not an object`);

    // String ok.
    et(`v.object({a:'a'}, 'minMaxStr', {a:{kind:'string',min:1,max:1},_meta:{}})`,
        v.object({a:'a'}, 'minMaxStr', {a:{kind:'string',min:1,max:1},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({a:'a'}, 'ruleStr', {a:{kind:'string',rule:{test:s=>s=='a'}},_meta:{}})`,
        v.object({a:'a'}, 'ruleStr', {a:{kind:'string',rule:{test:s=>s=='a'}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({a:'a'}, 'setStr', {a:{kind:'string',set:['a','b','c']},_meta:{}})`,
        v.object({a:'a'}, 'setStr', {a:{kind:'string',set:['a','b','c']},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({foo:{bar:'a',baz:'b'}}, undefined, {foo:{bar:{kind:'string'},baz:{kind:'string'},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:'a',baz:'b'}}, undefined, {foo:{bar:{kind:'string'},baz:{kind:'string'},_meta:{}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({}, 'hasFooFallback', {foo:{fallback:'a',kind:'string'},_meta:{}})`,
        v.object({}, 'hasFooFallback', {foo:{fallback:'a',kind:'string'},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({A:{b:'b',c:'c',D:{e:'e'}},f:''}, 'complexStr', {_meta:{}, ... kind:'string'}})`,
        v.object({A:{b:'b',c:'c',D:{e:'e'}},f:''}, 'complexStr', {
            _meta:{},A:{_meta:{},b:{kind:'string'},c:{kind:'string'},
            D:{_meta:{},e:{kind:'string'}}},f:{kind:'string'}
        })).is(true);
    et(`v.err`, v.err).is(null);

    // String invalid.
    et(`v.object({a:''}, 'minMaxStr', {a:{kind:'string',min:1,max:1},_meta:{}})`,
        v.object({a:''}, 'minMaxStr', {a:{kind:'string',min:1,max:1},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'minMaxStr.a' length 0 is < 1`);
    et(`v.object({a:'abc'}, undefined, {a:{kind:'string',min:1,max:1},_meta:{}})`,
        v.object({a:'abc'}, undefined, {a:{kind:'string',min:1,max:1},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'a' of a value length 3 is > 1`);
    et(`v.object({a:'A'}, 'ruleStr', {a:{kind:'string',rule:{test:s=>s=='a'}},_meta:{}})`,
        v.object({a:'A'}, 'ruleStr', {a:{kind:'string',rule:{test:s=>s=='a'}},_meta:{}})).is(false);
    et(`v.err`, v.err).passes(/^obj\(\): 'ruleStr.a' "A" fails /);
    et(`v.object({a:'d'}, undefined, {a:{kind:'string',set:['a','b','c']},_meta:{}})`,
        v.object({a:'d'}, undefined, {a:{kind:'string',set:['a','b','c']},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'a' of a value "d" is not in [a,b,c]`);
    et(`v.object({foo:{bar:'a',baz:[]}}, 'nestedStr', {foo:{bar:{kind:'string'},baz:{kind:'string'},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:'a',baz:[]}}, 'nestedStr', {foo:{bar:{kind:'string'},baz:{kind:'string'},_meta:{}},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'nestedStr.foo.baz' is an array not type 'string'`);
    et(`v.object({foo:true}, 'hasFooFallback', {foo:{fallback:'a',kind:'string'},_meta:{}})`,
        v.object({foo:true}, 'hasFooFallback', {foo:{fallback:'a',kind:'string'},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'hasFooFallback.foo' is type 'boolean' not 'string'`);
    et(`v.object({A:{b:'b',c:'c',D:{e:undefined}},f:''}, 'complexStr', {_meta:{}, ... kind:'string'}})`,
        v.object({A:{b:'b',c:'c',D:{e:undefined}},f:''}, 'complexStr', {
            _meta:{},A:{_meta:{},b:{kind:'string'},c:{kind:'string'},
            D:{_meta:{},e:{kind:'string'}}},f:{kind:'string'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'complexStr.A.D.e' is type 'undefined' not 'string'`);

    // Mixed ok.
    et(`v.object({A:{b:false,c:-9,D:{e:''}},f:1e-3}, 'complexNum', {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:false,c:-9,D:{e:''}},f:1e-3}, 'complexNum', {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'string'}}},f:{kind:'number'}
        })).is(true);
    et(`v.err`, v.err).is(null);

    // Mixed invalid.
    et(`v.object({A:{b:null,c:-9,D:{e:''}},f:1e-3}, 'complexNum', {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:null,c:-9,D:{e:''}},f:1e-3}, 'complexNum', {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'string'}}},f:{kind:'number'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'complexNum.A.b' is null not type 'boolean'`);
    et(`v.object({A:{b:false,c:1.1,D:{e:''}},f:1e-3}, undefined, {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:false,c:1.1,D:{e:''}},f:1e-3}, undefined, {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'string'}}},f:{kind:'number'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'A.c' of a value 1.1 is not an integer`);
    et(`v.object({A:{b:false,c:-9,D:{e:{}}},f:1e-3}, 'complexNum', {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:false,c:-9,D:{e:{}}},f:1e-3}, 'complexNum', {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'string'}}},f:{kind:'number'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'complexNum.A.D.e' is type 'object' not 'string'`);
    et(`v.object({A:{b:false,c:-9,D:{e:''}},f:[]}, undefined, {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:false,c:-9,D:{e:''}},f:[]}, undefined, {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'string'}}},f:{kind:'number'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'f' of a value is an array not type 'number'`);

}

// rufflib-validate/src/methods/schema.js


/* ---------------------------------- Tests --------------------------------- */

// Tests Validate.schema().
function test$2(expect, Validate) {
    const et = expect.that;

    expect.section('schema()');

    const v = new Validate('sma()');
    const OK = 'Did not encounter an exception';
    let exc = OK;

    // Basic ok.
    et(`v.schema({_meta:{}}, 'empty')`,
        v.schema({_meta:{}}, 'empty')).is(true);
    et(`v.err`, v.err).is(null);

    // Basic invalid.
    et(`v.schema(100, 'hundred')`,
        v.schema(100, 'hundred')).is(false);
    et(`v.err`, v.err).is(`sma(): 'hundred' is type 'number' not an object`);
    et(`v.schema([1,2,3])`,
        v.schema([1,2,3])).is(false);
    et(`v.err`, v.err).is(`sma(): the schema is an array not an object`);

    // Nullish.
    et(`v.schema(undefined, 'undef')`,
        v.schema(undefined, 'undef')).is(false);
    et(`v.err`, v.err).is(`sma(): 'undef' is type 'undefined' not an object`);
    et(`v.schema(null, 'empty')`,
        v.schema(null, 'empty')).is(false);
    et(`v.err`, v.err).is(`sma(): 'empty' is null not an object`);
    et(`v.schema(null)`,
        v.schema(null)).is(false);
    et(`v.err`, v.err).is(`sma(): the schema is null not an object`);
    et(`v.schema([], 'emptyArray')`,
        v.schema([], 'emptyArray')).is(false);
    et(`v.err`, v.err).is(`sma(): 'emptyArray' is an array not an object`);

    // Incorrect `metaSchema`.
    try{v.schema({_meta:{}}, 's', 123); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({_meta:{}}, 's', 123)`, exc)
        .is(`Error: Validate.schema() incorrectly invoked: sma(): `
          + `optional 'metaSchema' is type 'number' not an object`);
    try{v.schema({_meta:{}}, undefined, []); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({_meta:{}}, undefined, [])`, exc)
        .is(`Error: Validate.schema() incorrectly invoked: sma(): `
          + `optional 'metaSchema' is an array not an object`);
    try{v.schema({_meta:{}}, 's', {}); exc = OK; } catch (e) { exc = `${e}`; }
    et(`v.object({_meta:{}}, 's', {})`, exc) // @TODO make it clearer what went wrong, for the developer
        .is(`Error: Validate.object() incorrectly invoked: sma(): `
          + `'schema._meta' is type 'undefined' not an object`);

    // Schema invalid, basic property errors.
    et(`v.schema({}, 's')`,
        v.schema({}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's._meta' is type 'undefined' not an object`);
    et(`v.schema({_meta:[]})`,
        v.schema({_meta:[]})).is(false);
    et(`v.err`, v.err).is(`sma(): top level '_meta' of the schema is an array not an object`);
    et(`v.schema({_meta:null}, 's')`,
        v.schema({_meta:null}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's._meta' is null not an object`);
    et(`v.schema({_meta:{},foo:{_meta:123}}, 'MY_SCHEMA')`,
        v.schema({_meta:{},foo:{_meta:123}}, 'MY_SCHEMA')).is(false);
    et(`v.err`, v.err).is(`sma(): 'MY_SCHEMA.foo._meta' is type 'number' not an object`);
    et(`v.schema({_meta:{},foo:{_meta:[1,2,3]}}, undefined)`,
        v.schema({_meta:{},foo:{_meta:[1,2,3]}}, undefined)).is(false);
    et(`v.err`, v.err).is(`sma(): 'foo._meta' of the schema is an array not an object`);
    et(`v.schema({_meta:null})`,
        v.schema({_meta:null})).is(false);
    et(`v.err`, v.err).is(`sma(): top level '_meta' of the schema is null not an object`);
    et(`v.schema({_meta:{},a:{_meta:{},b:{_meta:{}}},c:{_meta:{},d:{_meta:{}},e:{_meta:[]}}})`,
        v.schema({_meta:{},a:{_meta:{},b:{_meta:{}}},c:{_meta:{},d:{_meta:{}},e:{_meta:[]}}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'c.e._meta' of the schema is an array not an object`);
    et(`v.schema({a:1, _meta:{}}, 'schema')`,
        v.schema({a:1, _meta:{}}, 'schema')).is(false);
    et(`v.err`, v.err).is(`sma(): 'schema.a' is type 'number' not an object`);
    et(`v.schema({a:null, _meta:{}}, null)`,
        v.schema({a:null, _meta:{}}, null)).is(false);
    et(`v.err`, v.err).is(`sma(): 'a' of the schema is null not an object`);
    et(`v.schema({a:{_meta:true}, _meta:{}}, 's')`,
        v.schema({a:{_meta:true}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.a._meta' is type 'boolean' not an object`);
    et(`v.schema({Foo:{_meta:[]}, _meta:{}}, 's')`,
        v.schema({Foo:{_meta:[]}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.Foo._meta' is an array not an object`);
    et(`v.schema({num:{}, _meta:{}}, 's')`,
        v.schema({num:{}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.num.kind' not recognised`);
    et(`v.schema({num:{kind:123}, _meta:{}})`,
        v.schema({num:{kind:123}, _meta:{}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'num.kind' of the schema not recognised`);
    et(`v.schema({outer:{_meta:{},inner:{}}, _meta:{}}, 's')`,
        v.schema({outer:{_meta:{},inner:{}}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.outer.inner.kind' not recognised`);

    // Invalid because of schema’s _meta.inst.
    et(`v.schema({_meta:{inst:[]}})`,
        v.schema({_meta:{inst:[]}})).is(false);
    et(`v.err`, v.err).is(`sma(): top level '._meta.inst' of the schema is an array not type 'function'`);
    et(`v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:NaN}}}})`,
        v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:NaN}}}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'mid.inner._meta.inst' of the schema is type 'number' not type 'function'`);
    et(`v.schema({_meta:{inst:{}}}, 'checkInstanceof')`,
        v.schema({_meta:{inst:{}}}, 'checkInstanceof')).is(false);
    et(`v.err`, v.err).is(`sma(): 'checkInstanceof._meta.inst' is type 'object' not type 'function'`);
    et(`v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:null}}}}, 'outer')`,
        v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:null}}}}, 'outer')).is(false);
    et(`v.err`, v.err).is(`sma(): 'outer.mid.inner._meta.inst' is null not type 'function'`);
    class UndefinedName { static name = undefined }
    et(`v.schema({_meta:{inst:UndefinedName}})`,
        v.schema({_meta:{inst:UndefinedName}})).is(false);
    et(`v.err`, v.err).is(`sma(): top level '._meta.inst.name' of the schema is type 'undefined' not 'string'`);
    class FunctionName { static name = x => x + 1 }
    et(`v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:FunctionName}}}})`,
        v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:FunctionName}}}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'mid.inner._meta.inst.name' of the schema is type 'function' not 'string'`);
    class MathObjectName { static name = Math }
    et(`v.schema({_meta:{inst:MathObjectName}}, 'checkInstanceof')`,
        v.schema({_meta:{inst:MathObjectName}}, 'checkInstanceof')).is(false);
    et(`v.err`, v.err).is(`sma(): 'checkInstanceof._meta.inst.name' is type 'object' not 'string'`);
    class ArrayName { static name = ['a','bc'] }
    et(`v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:ArrayName}}}}, 'outer')`,
        v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:ArrayName}}}}, 'outer')).is(false);
    et(`v.err`, v.err).is(`sma(): 'outer.mid.inner._meta.inst.name' is an array not 'string'`);

    // Invalid because of metaSchema.
    et(`v.schema({_meta:{}}, 's', {_meta:{},foo:{kind:'string'}})`,
        v.schema({_meta:{}}, 's', {_meta:{},foo:{kind:'string'}})).is(false);
    et(`v.err`, v.err).is(`sma(): 's._meta.foo' is type 'undefined' not 'string'`);
    et(`v.schema({_meta:{foo:{bar:1.25}}}, undefined, {_meta:{},foo:{_meta:{},bar:{kind:'integer'}}})`,
        v.schema({_meta:{foo:{bar:1.25}}}, undefined, {_meta:{},foo:{_meta:{},bar:{kind:'integer'}}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'top level _meta.foo.bar' 1.25 is not an integer`);
    et(`v.schema({_meta:{foo:'ok'},sub:{_meta:{foo:''}}}, 's', {_meta:{},foo:{kind:'string',min:1}})`,
        v.schema({_meta:{foo:'ok'},sub:{_meta:{foo:''}}}, 's', {_meta:{},foo:{kind:'string',min:1}})).is(false);
    et(`v.err`, v.err).is(`sma(): 's.sub._meta.foo' length 0 is < 1`);
    et(`v.schema({_meta:{foo:'ok'},sub:{_meta:{FOO:'a'}}}, undefined, {_meta:{},foo:{kind:'string'}})`,
        v.schema({_meta:{foo:'ok'},sub:{_meta:{FOO:'a'}}}, undefined, {_meta:{},foo:{kind:'string'}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'sub._meta.foo' is type 'undefined' not 'string'`);

    // Passes metaSchema.
    et(`v.schema({_meta:{}}, 's', {_meta:{}})`,
        v.schema({_meta:{}}, 's', {_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);

    // Schema invalid, value properties are never allowed to be `null`.
    et(`v.schema({BOOL:{fallback:null,kind:'boolean'}, _meta:{}}, 's')`,
        v.schema({BOOL:{fallback:null,kind:'boolean'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.BOOL.fallback' is null`);
    et(`v.schema({n:{max:null,kind:'number'}, _meta:{}}))`,
        v.schema({n:{max:null,kind:'number'}, _meta:{}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'n.max' of the schema is null`);
    et(`v.schema({n:{min:null,kind:'number'}, _meta:{}}, 's')`,
        v.schema({n:{min:null,kind:'number'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.n.min' is null`);
    et(`v.schema({n:{rule:null,kind:'number'}, _meta:{}}, 0)`,
        v.schema({n:{rule:null,kind:'number'}, _meta:{}}, 0)).is(false);
    et(`v.err`, v.err).is(`sma(): 'n.rule' of the schema is null`);
    et(`v.schema({n:{set:null,kind:'number'}, _meta:{}}, 's')`,
        v.schema({n:{set:null,kind:'number'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.n.set' is null`);

    // Schema invalid, only 0 or 1 qualifiers allowed.
    et(`v.schema({str:{max:1,rule:1,kind:'string'}, _meta:{}}, 's')`,
        v.schema({str:{max:1,rule:1,kind:'string'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.str' has '2' qualifiers, only 0 or 1 allowed`);
    et(`v.schema({str:{min:1,set:1,kind:'string'}, _meta:{}}, undefined)`,
        v.schema({str:{min:1,set:1,kind:'string'}, _meta:{}}, undefined)).is(false);
    et(`v.err`, v.err).is(`sma(): 'str' of the schema has '2' qualifiers, only 0 or 1 allowed`);
    et(`v.schema({str:{min:1,max:1,set:1,kind:'string'}, _meta:{}}, 's')`,
        v.schema({str:{min:1,max:1,set:1,kind:'string'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.str' has '3' qualifiers, only 0 or 1 allowed`);
    et(`v.schema({str:{min:1,max:1,rule:1,set:1,kind:'string'}, _meta:{}})`,
        v.schema({str:{min:1,max:1,rule:1,set:1,kind:'string'}, _meta:{}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'str' of the schema has '4' qualifiers, only 0 or 1 allowed`);

    // Schema invalid, boolean.
    et(`v.schema({BOOL:{fallback:0,kind:'boolean'}, _meta:{}}, 's')`,
        v.schema({BOOL:{fallback:0,kind:'boolean'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.BOOL' has 'number' fallback, not 'boolean' or 'undefined'`);
    et(`v.schema({BOOL:{max:true,kind:'boolean'}, _meta:{}}, false)`,
        v.schema({BOOL:{max:true,kind:'boolean'}, _meta:{}}, false)).is(false);
    et(`v.err`, v.err).is(`sma(): 'BOOL' of the schema has 'boolean' max, not 'undefined'`);
    et(`v.schema({BOOL:{min:1,kind:'boolean'}, _meta:{}}, 's')`,
        v.schema({BOOL:{min:1,kind:'boolean'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.BOOL' has 'number' min, not 'undefined'`);
    et(`v.schema({BOOL:{rule:{},kind:'boolean'}, _meta:{}})`,
        v.schema({BOOL:{rule:{},kind:'boolean'}, _meta:{}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'BOOL' of the schema has 'object' rule, not 'undefined'`);
    et(`v.schema({BOOL:{set:[],kind:'boolean'}, _meta:{}}, 's')`,
        v.schema({BOOL:{set:[],kind:'boolean'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.BOOL' has 'array' set, not 'undefined'`);

    // Schema invalid, integer and number.
    et(`v.schema({i:{fallback:[],kind:'integer'}, _meta:{}}, 's')`,
        v.schema({i:{fallback:[],kind:'integer'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.i' has 'array' fallback, not 'number' or 'undefined'`);
    et(`v.schema({n:{max:true,kind:'number'}, _meta:{}}, -0)`,
        v.schema({n:{max:true,kind:'number'}, _meta:{}}, -0)).is(false);
    et(`v.err`, v.err).is(`sma(): 'n' of the schema has 'boolean' max, not 'number' or 'undefined'`);
    et(`v.schema({int:{min:[],kind:'integer'}, _meta:{}}, 's')`,
        v.schema({int:{min:[],kind:'integer'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.int' has 'array' min, not 'number' or 'undefined'`);
    et(`v.schema({NUM:{rule:1,kind:'number'}, _meta:{}}, undefined)`,
        v.schema({NUM:{rule:1,kind:'number'}, _meta:{}}, undefined)).is(false);
    et(`v.err`, v.err).is(`sma(): 'NUM' of the schema has 'number' rule, not 'object' or 'undefined'`);
    et(`v.schema({NUM:{rule:{},kind:'number'}, _meta:{}}, 's')`,
        v.schema({NUM:{rule:{},kind:'number'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.NUM' has 'undefined' rule.test, not 'function'`);
    et(`v.schema({INT:{set:0,kind:'integer'}, _meta:{}})`,
        v.schema({INT:{set:0,kind:'integer'}, _meta:{}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'INT' of the schema has 'number' set, not an array or 'undefined'`);
    et(`v.schema({n:{set:[1,'2',3],kind:'number'}, _meta:{}}, 's')`,
        v.schema({n:{set:[1,'2',3],kind:'number'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.n' has 'string' set[1], not 'number'`);

    // Schema invalid, string.
    et(`v.schema({s:{fallback:1,kind:'string'}, _meta:{}}, 's')`,
        v.schema({s:{fallback:1,kind:'string'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.s' has 'number' fallback, not 'string' or 'undefined'`);
    et(`v.schema({str:{max:[],kind:'string'}, _meta:{}}, null)`,
        v.schema({str:{max:[],kind:'string'}, _meta:{}}, null)).is(false);
    et(`v.err`, v.err).is(`sma(): 'str' of the schema has 'array' max, not 'number' or 'undefined'`);
    et(`v.schema({S:{min:{},kind:'string'}, _meta:{}}, 's')`,
        v.schema({S:{min:{},kind:'string'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.S' has 'object' min, not 'number' or 'undefined'`);
    et(`v.schema({STR:{rule:'1',kind:'string'}, _meta:{}}, '')`,
        v.schema({STR:{rule:'1',kind:'string'}, _meta:{}}, '')).is(false);
    et(`v.err`, v.err).is(`sma(): 'STR' of the schema has 'string' rule, not 'object' or 'undefined'`);
    et(`v.schema({_s:{rule:{test:[]},kind:'string'}, _meta:{}}, 's')`, // @TODO '...has 'array' rule.test...'
        v.schema({_s:{rule:{test:[]},kind:'string'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's._s' has 'object' rule.test, not 'function'`);
    et(`v.schema({_:{set:0,kind:'string'}, _meta:{}})`,
        v.schema({_:{set:0,kind:'string'}, _meta:{}})).is(false);
    et(`v.err`, v.err).is(`sma(): '_' of the schema has 'number' set, not an array or 'undefined'`);
    et(`v.schema({string:{set:[1,'2',3],kind:'string'}, _meta:{}}, 's')`,
        v.schema({string:{set:[1,'2',3],kind:'string'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.string' has 'number' set[0], not 'string'`);

}

// rufflib-validate/src/methods/string.js

// Tests Validate.string()
function test$1(expect, Validate) {
    const et = expect.that;

    expect.section('string()');

    const v = new Validate('str()');
    let err;

    // Basic ok.
    et(`v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet')`,
        v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet')).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.string('', 'empty')`,
        v.string('', 'empty')).is(true);
    et(`v.err`, v.err).is(null);

    // Nullish.
    et(`v.string()`,
        v.string()).is(false);
    et(`v.err`, v.err).is(`str(): a value is type 'undefined' not 'string'`);
    et(`v.string(null, 'null')`,
        v.string(null, 'null')).is(false);
    et(`v.err`, v.err).is(`str(): 'null' is null not type 'string'`);

    // Basic invalid.
    et(`v.string(10, 'ten')`,
        v.string(10, 'ten')).is(false);
    et(`v.err`, v.err).is(`str(): 'ten' is type 'number' not 'string'`);
    et(`v.string(NaN, 'NaN')`,
        v.string(NaN, 'NaN')).is(false);
    et(`v.err`, v.err).is(`str(): 'NaN' is type 'number' not 'string'`);
    et(`v.string(['a'], 'array')`,
        v.string(['a'], 'array')).is(false);
    et(`v.err`, v.err).is(`str(): 'array' is an array not type 'string'`);
    et(`v.string(Math, undefined)`,
        v.string(Math, undefined)).is(false);
    et(`v.err`, v.err).is(`str(): a value is type 'object' not 'string'`);

    // Set ok. @TODO maybe don’t ignore the `max` argument?
    et(`v.string('Foobar', undefined, ['Baz','Foobar'], 3) // max 3 is ignored`,
        v.string('Foobar', undefined, ['Baz','Foobar'], 3)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.string('', 'blank', [''])`,
        v.string('', 'blank', [''])).is(true);
    et(`v.err`, v.err).is(null);

    // Set invalid.
    et(`v.string('FOOBAR', 'CapsFoobar', ['Baz','Abcdefgi','Foobar'])`,
        v.string('FOOBAR', 'CapsFoobar', ['Baz','Abcdefgi','Foobar'])).is(false);
    et(`v.err`, v.err).is(`str(): 'CapsFoobar' "FOOBAR" is not in [Baz,Abcdefg...obar]`);
    et(`v.string('', null, [])`,
        v.string('', null, [])).is(false);
    et(`v.err`, v.err).is(`str(): string "" is not in []`);

    // Rule ok. @TODO maybe don’t ignore the `max` argument?
    et(`v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet', /[a-z]{26}/, 3) // max 3 is ignored`,
        v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet', /[a-z]{26}/, 3)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.string('Foobar', 0, {test:function(s){return s[0]==='F'}})`,
        v.string('Foobar', 0, {test:function(s){return s[0]==='F'}})).is(true);
    et(`v.err`, v.err).is(null);

    // Rule invalid.
    et(`v.string('abcdefghIJKLMNOPQRstuvwxyz', null, /[a-z]{26}/)`,
        v.string('abcdefghIJKLMNOPQRstuvwxyz', null, /[a-z]{26}/)).is(false);
    et(`v.err`, v.err).is(`str(): string "abcdefghIJK...wxyz" fails /[a-z]{26}/`);
    et(`v.string('foobar', 'foobarLowercase', {test:function(s){return s[0]==='F'}})`,
        v.string('foobar', 'foobarLowercase', {test:function(s){return s[0]==='F'}})).is(false);
    et(`v.err`, v.err).passes(/^str\(\): 'foobarLowercase' "foobar" fails function/);

    // Minimum ok. @TODO maybe throw an error if negative or non-integer min
    et(`v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet', 26)`,
        v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet', 26)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.string('', null, -3)`,
        v.string('', null, -3)).is(true);
    et(`v.err`, v.err).is(null);

    // Minimum NaN throws an error.
    try{ v.string('abc', 'abc', NaN); } catch (e) { err = `${e}`; }
    et(`v.string('abc', 'abc', NaN)`, err)
        .is('Error: Validate.string() incorrectly invoked: min is NaN!');
    et(`v.err`, v.err)
        .is('Validate.string() incorrectly invoked: min is NaN!');

    // Minimum invalid.
    et(`v.string('abc', null, 4)`,
        v.string('abc', null, 4)).is(false);
    et(`v.err`, v.err).is(`str(): string length 3 is < 4`);
    et(`v.string('', 'blank', 0.1)`,
        v.string('', 'blank', 0.1)).is(false);
    et(`v.err`, v.err).is(`str(): 'blank' length 0 is < 0.1`);

    // Maximum ok. @TODO maybe throw an error if max > min, or negative or non-integer max
    et(`v.string('abc', /name-is-ignored/, 3, 3)`,
        v.string('abc', /name-is-ignored/, 3, 3)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.string('10', 'ten', null, 55.555)`,
        v.string('10', 'ten', null, 55.555)).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.string('', 'blank', -1.23, -0) // note JavaScript supports negative zero`,
        v.string('', 'blank', -1.23, -0)).is(true);
    et(`v.err`, v.err).is(null);

    // Maximum NaN throws an error.
    try{ v.string('10', 'tenStr', 2, NaN); } catch (e) { err = `${e}`; }
    et(`v.string('10', 'tenStr', 2, NaN)`, err)
        .is('Error: Validate.string() incorrectly invoked: max is NaN!');
    et(`v.err`, v.err)
        .is('Validate.string() incorrectly invoked: max is NaN!');

    // Maximum invalid.
    et(`v.string('abc', null, 3, 2)`,
        v.string('abc', null, 3, 2)).is(false);
    et(`v.err`, v.err).is(`str(): string length 3 is > 2`);
    et(`v.string('', 'blank', -0.2, -0.1)`,
        v.string('', 'blank', -0.2, -0.1)).is(false);
    et(`v.err`, v.err).is(`str(): 'blank' length 0 is > -0.1`);
}

// rufflib-validate/src/validate.js

// Assembles the `Validate` class.


/* --------------------------------- Import --------------------------------- */

const NAME = 'Validate';
const VERSION = '2.0.2';


/* ---------------------------------- Tests --------------------------------- */

// Runs basic tests on Validate.
function test(expect, Validate) {
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

// rufflib-validate/src/main-test.js

// Run each test. You can comment-out some during development, to help focus on
// individual tests. But make sure all tests are uncommented before committing.
function validateTest(expect, Validate) {

    test(expect, Validate);

    test$8(expect, Validate);
    test$7(expect, Validate);
    test$6(expect, Validate);
    test$5(expect, Validate);
    test$4(expect, Validate);
    test$3(expect, Validate);
    test$2(expect, Validate);
    test$1(expect, Validate);

}

export { validateTest as default };
