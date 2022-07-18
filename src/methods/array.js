// rufflib-validate/src/methods/array.js

// Public method which validates an array.
// If `validator` is specified, the array must contain a single type.
export default function array(value, name, ...args) {
    this.err = null;
    if (this.skip) return true;

    // Deal with a value which is not an array.
    if (! Array.isArray(value)) {
        const n = typeof name === 'string'
            ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
                ? name
                : `'${name}'`
            : 'a value'
        ;

        this.err = value === null
            ? `${this.prefix}: ${n} is null not an array`
            : `${this.prefix}: ${n} is type '${typeof value}' not an array`
        ;
        return false;
    }

    // Short-circuit if `args` is empty (only two arguments were supplied).
    const argsLen = args.length;
    if (! argsLen) return true;

    // Determine the meaning of `args`.
    let min = 0;
    let max = Infinity;
    let validator = null;
    let recursiveArgs = [];

    // There are nine correct `args` configurations.
    // That includes two configurations which produce ‘min and validator’:
    // 1. `args` is empty or all nullish - no min, max or validator
    // 2. `args[0]` is a number, and the rest of args is nullish - just min
    // 3. `args[0]` and `args[1]` are both numbers, rest of args nullish - min and max
    // 4. `args[0]` is nullish, `args[1]` is number, rest of args nullish - just max
    // 5. `args[0]` and `[1]` numbers, `[2]` function, rest anything - min, max and validator
    // 6. `args[0]` number, `[1]` nullish, `[2]` function, rest anything - min and validator
    // 7. `args[0]` nullish, `[1]` number, `[2]` function, rest anything - max and validator
    // 8. `args[0]` is a function, and the rest of args is anything - just validator
    // 9. `args[0]` is number, `[1]` is function, rest anything - min and validator
    const type0 = typeof args[0];
    const arg0 = type0 === 'function'
        ? 'fn'
        : type0 === 'number'
            ? 'num'
            : args[0] == null
                ? 'null' // could be `undefined` or `null`
                : 'other'
    ;
    const type1 = typeof args[1];
    const arg1 = type1 === 'function'
        ? 'fn'
        : type1 === 'number'
            ? 'num'
            : args[1] == null
                ? 'null'
                : 'other'
    ;
    const type2 = typeof args[2];
    const arg2 = type2 === 'function'
        ? 'fn'
        : type2 === 'number'
            ? 'num'
            : args[2] == null
                ? 'null'
                : 'other'
    ;

    switch (`${arg0},${arg1},${arg2}`) {
        // 1. `args` is empty or all nullish - no min, max or validator
        case 'null,null,null':
            for (let i=3; i<argsLen; i++) {
                if (args[i] != null) {
                    this.err = `Validate.array() incorrectly invoked 1: args[${i}] not nullish!`;
                    throw Error(this.err);    
                }
            }
            return true;
        // 2. `args[0]` is a number, and the rest of args is nullish - just min
        case 'num,null,null':
            for (let i=3; i<argsLen; i++) {
                if (args[i] != null) {
                    this.err = `Validate.array() incorrectly invoked 2: args[${i}] not nullish!`;
                    throw Error(this.err);    
                }
            }
            min = args[0];
            break;
        // 3. `args[0]` and `args[1]` are both numbers, rest of args nullish - min and max
        case 'num,num,null':
            for (let i=3; i<argsLen; i++) {
                if (args[i] != null) {
                    this.err = `Validate.array() incorrectly invoked 3: args[${i}] not nullish!`;
                    throw Error(this.err);    
                }
            }
            min = args[0];
            max = args[1];
            break;
        // 4. `args[0]` is nullish, `args[1]` is number, rest of args nullish - just max
        case 'null,num,null':
            for (let i=3; i<argsLen; i++) {
                if (args[i] != null) {
                    this.err = `Validate.array() incorrectly invoked 4: args[${i}] not nullish!`;
                    throw Error(this.err);    
                }
            }
            max = args[1];
            break;
        // 5. `args[0]` and `[1]` numbers, `[2]` function, rest anything - min, max and validator
        case 'num,num,fn':
            min = args[0];
            max = args[1];
            validator = args[2];
            recursiveArgs = args.slice(3);
            break;
        // 6. `args[0]` number, `[1]` nullish, `[2]` function, rest anything - min and validator
        case 'num,null,fn':
            min = args[0];
            validator = args[2];
            recursiveArgs = args.slice(3);
            break;
        // 7. `args[0]` nullish, `[1]` number, `[2]` function, rest anything - max and validator
        case 'null,num,fn':
            max = args[1];
            validator = args[2];
            recursiveArgs = args.slice(3);
            break;
        default:
            // 8. `args[0]` is a function, and the rest of args is anything - just validator
            if (arg0 === 'fn') {
                validator = args[0];
                recursiveArgs = args.slice(1);
            }
            // 9. `args[0]` is number, `[1]` is function, rest anything - min and validator
            else if (arg0 === 'num' && arg1 === 'fn') {
                min = args[0];
                validator = args[1];
                recursiveArgs = args.slice(2);
            }
            // Any other configuration is incorrect.
            else {
                this.err = `Validate.array() incorrectly invoked 5: args is not one of the nine configurations!`;
                throw Error(this.err);
            }

    }

    // Guard against ‘not-a-number’ bugs.
    if (Number.isNaN(min)) {
        this.err = 'Validate.array() incorrectly invoked: min is NaN!';
        throw Error(this.err);
    }
    if (Number.isNaN(max)) {
        this.err = 'Validate.array() incorrectly invoked: max is NaN!';
        throw Error(this.err);
    }

    // Validate the array length.
    if (value.length < min) {
        const nm = name ? `'${name}'` : 'array';
        this.err = `${this.prefix}: ${nm} length ${value.length} is < ${min}`;
        return false;
    }
    if (value.length > max) {
        const nm = name ? `'${name}'` : 'array';
        this.err = `${this.prefix}: ${nm} length ${value.length} is > ${max}`;
        return false;
    }

    // If `validator` is nullish, no more validation is needed.
    if (validator == null) return true;

    // Validate each element in the `value` array.
    const n = name ? name : '';
    for (let i=0, l=value.length; i<l; i++) {
        // console.log(value[i], `${n}[${i}]`, validator, this.err, result);
        if (! validator.bind(this)(value[i], `${n}[${i}]`, ...recursiveArgs))
            return false;
    }

    return true;
}

// Tests Validate.array()
export function test(expect, Validate) {
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
    try{v.array([], 'empty', null, null, null, null, '') } catch (e) { exc = `${e}` }
    et(`v.array([], 'empty', null, null, null, null, '')`, exc)
        .is('Error: Validate.array() incorrectly invoked 1: args[4] not nullish!');
    et(`v.err`, v.err)
        .is('Validate.array() incorrectly invoked 1: args[4] not nullish!');
    try{v.array([], 'empty', 123, null, null, undefined, null, 0) } catch (e) { exc = `${e}` }
    et(`v.array([], 'empty', 123, null, null, undefined, null, 0)`, exc)
        .is('Error: Validate.array() incorrectly invoked 2: args[5] not nullish!');
    et(`v.err`, v.err)
        .is('Validate.array() incorrectly invoked 2: args[5] not nullish!');
    try{v.array([], 'empty', 123, 456, undefined, {}) } catch (e) { exc = `${e}` }
    et(`v.array([], 'empty', 123, 456, undefined, {})`, exc)
        .is('Error: Validate.array() incorrectly invoked 3: args[3] not nullish!');
    et(`v.err`, v.err)
        .is('Validate.array() incorrectly invoked 3: args[3] not nullish!');
    try{v.array([], 'empty', undefined, 456, undefined, undefined, 0, 0) } catch (e) { exc = `${e}` }
    et(`v.array([], 'empty', undefined, 456, undefined, undefined, 0, 0)`, exc)
        .is('Error: Validate.array() incorrectly invoked 4: args[4] not nullish!');
    et(`v.err`, v.err)
        .is('Validate.array() incorrectly invoked 4: args[4] not nullish!');
    try{v.array([], 'empty', null, 456, {}) } catch (e) { exc = `${e}` }
    et(`v.array([], 'empty', null, 456, {})`, exc)
        .is('Error: Validate.array() incorrectly invoked 5: args is not one of the nine configurations!');
    et(`v.err`, v.err)
        .is('Validate.array() incorrectly invoked 5: args is not one of the nine configurations!');
    try{v.array([], 'empty', '5') } catch (e) { exc = `${e}` }
    et(`v.array([], 'empty', '5')`, exc)
        .is('Error: Validate.array() incorrectly invoked 5: args is not one of the nine configurations!');
    et(`v.err`, v.err)
        .is('Validate.array() incorrectly invoked 5: args is not one of the nine configurations!');
    try{v.array([], 'empty', 0/0, null, null, undefined, null) } catch (e) { exc = `${e}` }
    et(`v.array([], 'empty', 0/0, null, null, undefined, null)`, exc)
        .is('Error: Validate.array() incorrectly invoked: min is NaN!');
    try{v.array([], 'empty', 0, 0/0, null, null, undefined, null) } catch (e) { exc = `${e}` }
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
