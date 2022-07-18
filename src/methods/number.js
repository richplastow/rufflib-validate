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
export function test(expect, Validate) {
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
    try{ v.number(10, 'ten', NaN) } catch (e) { exc = `${e}` }
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
    try{ v.number(10, 'ten', 3, NaN) } catch (e) { exc = `${e}` }
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
