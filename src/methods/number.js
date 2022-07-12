// rufflib-validate/src/methods/number.js

// Public method which validates a number like `10` or `-3.14`.
// Positive and negative infinity are numbers, but `NaN` is not.
//
// `minSetOrRule` is optional, and allows either a minimum number, a set of
// valid numbers, or an object containing a `test()` function.
// If `minSetOrRule` is a number, undefined or null, then (optional) `max` is
// the maximum valid number.
export default function number(value, name, minSetOrRule, max) {
    this.err = null;
    if (this.skip) return true;

    // Deal with the simple cases where `value` is not a valid number.
    if (! this._type(value, name, 'number')) return false;
    if (Number.isNaN(value)) {
        this.err = `${this.prefix}: '${name}' is NaN, not a valid number`;
        return false;
    }

    const msorIsObj = typeof minSetOrRule === 'object' && minSetOrRule != null;
    const n = typeof name === 'string'
        ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
            ? name
            : `'${name}'`
        : 'number'
    ;

    // If `minSetOrRule` is an array, treat it as a set of valid numbers.
    if (msorIsObj && Array.isArray(minSetOrRule)) {
        if (-1 !== minSetOrRule.indexOf(value)) return true;
        let arr = `[${minSetOrRule}]`;
        arr = arr.length < 21 ? arr : `${arr.slice(0,12)}...${arr.slice(-5)}`;
        this.err = `${this.prefix}: ${n} ${value} is not in ${arr}`;
        return false;
    }

    // If `minSetOrRule` is a rule, run the test function.
    if (msorIsObj && typeof minSetOrRule.test === 'function') {
        if (minSetOrRule.test(value)) return true;
        let tst = `${minSetOrRule.test}`;
        tst = tst.length < 21 ? tst : `${tst.slice(0,12)}...${tst.slice(-5)}`;
        this.err = `${this.prefix}: ${n} ${value} fails ${tst}`;
        return false;
    }

    // If `minSetOrRule` is a valid number, treat it as the minimum valid number.
    if (typeof minSetOrRule === 'number') {
        const min = minSetOrRule;
        if (Number.isNaN(min)) {
            this.err = 'Validate.number() incorrectly invoked: min is NaN!';
            throw Error(this.err);
        }
        if (value < min) {
            this.err = `${this.prefix}: ${n} ${value} is < ${min}`;
            return false;
        }
    }

    // Here, `minSetOrRule` can be ignored. If `max` is a valid number, treat it
    // as the minimum valid number.
    if (typeof max === 'number') {
        if (Number.isNaN(max)) {
            this.err = 'Validate.number() incorrectly invoked: max is NaN!';
            throw Error(this.err);
        }
        if (value > max) {
            this.err = `${this.prefix}: ${n} ${value} is > ${max}`;
            return false;
        }
    }

    // The number is valid, yay!
    return true;
}

// Tests Validate.number()
export function test(xp, Validate) {
    xp().section('number()');

    const v = new Validate('num()');
    let exc;

    // Basic ok.
    xp(`v.number(10, 'ten')`,
        v.number(10, 'ten')).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.number(-3.14, 'minusPi')`,
        v.number(-3.14, 'minusPi')).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.number(-Infinity, 'minusInfinity')`,
        v.number(-Infinity, 'minusInfinity')).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Nullish.
    xp(`v.number()`,
        v.number()).toBe(false);
    xp(`v.err`, v.err).toBe(`num(): a value is type 'undefined' not 'number'`);
    xp(`v.number(null, 'null')`,
        v.number(null, 'null')).toBe(false);
    xp(`v.err`, v.err).toBe(`num(): 'null' is null not type 'number'`);

    // Basic invalid.
    xp(`v.number(true, 'true')`,
        v.number(true, 'true')).toBe(false);
    xp(`v.err`, v.err).toBe(`num(): 'true' is type 'boolean' not 'number'`);
    xp(`v.number(NaN, 'NaN')`,
        v.number(NaN, 'NaN')).toBe(false);
    xp(`v.err`, v.err).toBe(`num(): 'NaN' is NaN, not a valid number`);

    // Set ok. @TODO maybe don’t ignore the `max` argument?
    xp(`v.number(10, undefined, [Infinity, -2.2, 10], 3) // max 3 is ignored`,
        v.number(10, undefined, [Infinity, -2.2, 10], 3)).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.number(Infinity, 'positiveInf', [Infinity, -2.2, 10])`,
        v.number(Infinity, 'positiveInf', [Infinity, -2.2, 10])).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Set invalid.
    xp(`v.number(0, 'zero', [[0], Infinity, -1.23456789, 10])`,
        v.number(0, 'zero', [[0], Infinity, -1.23456789, 10])).toBe(false);
    xp(`v.err`, v.err).toBe(`num(): 'zero' 0 is not in [0,Infinity,...9,10]`);
    xp(`v.number(-Infinity, null, [])`,
        v.number(-Infinity, null, [])).toBe(false);
    xp(`v.err`, v.err).toBe(`num(): number -Infinity is not in []`);

    // Rule ok. @TODO maybe don’t ignore the `max` argument?
    xp(`v.number(10, 'ten', {test:n=>n==10}, 3) // max 3 is ignored`,
        v.number(10, 'ten', {test:n=>n==10}, 3)).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.number(Infinity, null, {test:()=>1})`,
        v.number(Infinity, null, {test:()=>1})).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Rule invalid.
    xp(`v.number(0, undefined, {test:n=>n==10||n==Infinity})`,
        v.number(0, undefined, {test:n=>n==10||n==Infinity})).toBe(false);
    xp(`v.err`, v.err).toMatch(/^num\(\): number 0 fails /);
    xp(`v.number(-Infinity, 'minusInf', {test:()=>0})`,
        v.number(-Infinity, 'minusInf', {test:()=>0})).toBe(false);
    xp(`v.err`, v.err).toMatch(/^num\(\): 'minusInf' -Infinity fails /);

    // Minimum ok.
    xp(`v.number(10, 'ten', 10)`,
        v.number(10, 'ten', 10)).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.number(Infinity, 'positiveInf', -1.23)`,
        v.number(Infinity, 'positiveInf', -1.23)).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Minimum NaN throws an error.
    try { v.number(10, 'ten', NaN) } catch (e) { exc = `${e}` }
    xp(`v.number(10, 'ten', NaN)`, exc)
        .toBe('Error: Validate.number() incorrectly invoked: min is NaN!');
    xp(`v.err`, v.err)
        .toBe('Validate.number() incorrectly invoked: min is NaN!');

    // Minimum invalid.
    xp(`v.number(10, null, 20)`,
        v.number(10, null, 20)).toBe(false);
    xp(`v.err`, v.err).toBe(`num(): number 10 is < 20`);
    xp(`v.number(-Infinity, 'minusInf', -1.23)`,
        v.number(-Infinity, 'minusInf', -1.23)).toBe(false);
    xp(`v.err`, v.err).toBe(`num(): 'minusInf' -Infinity is < -1.23`);

    // Maximum ok. @TODO maybe throw an error if max > min
    xp(`v.number(10, /name-is-ignored/, 10, 10)`,
        v.number(10, /name-is-ignored/, 10, 10)).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.number(10, 'ten', null, 55.555)`,
        v.number(10, 'ten', null, 55.555)).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.number(Infinity, 'positiveInf', -1.23, Infinity)`,
        v.number(Infinity, 'positiveInf', -1.23, Infinity)).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Maximum NaN throws an error.
    try { v.number(10, 'ten', 3, NaN) } catch (e) { exc = `${e}` }
    xp(`v.number(10, 'ten', 3, NaN)`, exc)
        .toBe('Error: Validate.number() incorrectly invoked: max is NaN!');
    xp(`v.err`, v.err)
        .toBe('Validate.number() incorrectly invoked: max is NaN!');

    // Maximum invalid.
    xp(`v.number(-1.23, null, -3.33, -2.5)`,
        v.number(-1.23, null, -3.33, -2.5)).toBe(false);
    xp(`v.err`, v.err).toBe(`num(): number -1.23 is > -2.5`);
    xp(`v.number(9e99, 'huge', 4e99, 8e99)`,
        v.number(9e99, 'huge', 4e99, 8e99)).toBe(false);
    xp(`v.err`, v.err).toBe(`num(): 'huge' 9e+99 is > 8e+99`);
}
