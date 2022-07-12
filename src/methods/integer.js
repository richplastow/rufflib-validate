// rufflib-validate/src/methods/integer.js

// Public method which validates an integer like `10` or `-3.2e9`.
// Positive and negative infinity are not integers, and neither is `NaN`.
//
// `minSetOrRule` is optional, and allows either a minimum integer, a set of
// valid integers, or an object containing a `test()` function.
// If `minSetOrRule` is an integer, undefined or null, then (optional) `max` is
// the maximum valid integer.
export default function integer(value, name, minSetOrRule, max) {
    this.err = null;
    if (this.skip) return true;

    // If `value` is not a valid number, then it can’t be a valid integer.
    if (! this.number(value, name, minSetOrRule, max)) return false;

    // Otherwise, check that `value` is an integer.
    if (0 !== value % 1) {
        const n = typeof name === 'string'
            ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
                ? name
                : `'${name}'`
            : 'number'
        ;

        this.err = `${this.prefix}: ${n} ${value} is not an integer`;
        return false;
    }

    return true;
}

// Tests Validate.integer()
export function test(xp, Validate) {
    xp().section('integer()');

    const v = new Validate('int()');
    let exc;

    // Basic ok.
    xp(`v.integer(10, 'ten')`,
        v.integer(10, 'ten')).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.integer(-3.2e9, 'minusHuge')`,
        v.integer(-3.2e9, 'minusHuge')).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Nullish.
    xp(`v.integer(undefined, 'undef')`,
        v.integer(undefined, 'undef')).toBe(false);
    xp(`v.err`, v.err).toBe(`int(): 'undef' is type 'undefined' not 'number'`);
    xp(`v.integer(null)`,
        v.integer(null)).toBe(false);
    xp(`v.err`, v.err).toBe(`int(): a value is null not type 'number'`);

    // Basic invalid.
    xp(`v.integer(true, 'true')`,
        v.integer(true, 'true')).toBe(false);
    xp(`v.err`, v.err).toBe(`int(): 'true' is type 'boolean' not 'number'`);
    xp(`v.integer(NaN, 'NaN')`,
        v.integer(NaN, 'NaN')).toBe(false);
    xp(`v.err`, v.err).toBe(`int(): 'NaN' is NaN, not a valid number`);
    xp(`v.integer(Infinity, /why-rx-here?!/)`,
        v.integer(Infinity, /why-rx-here?!/)).toBe(false);
    xp(`v.err`, v.err).toBe(`int(): number Infinity is not an integer`);
    xp(`v.integer(-Infinity)`,
        v.integer(-Infinity)).toBe(false);
    xp(`v.err`, v.err).toBe(`int(): number -Infinity is not an integer`);
    xp(`v.integer(1e-1)`,
        v.integer(1e-1)).toBe(false);
    xp(`v.err`, v.err).toBe(`int(): number 0.1 is not an integer`);

    // Set ok. @TODO maybe don’t ignore the `max` argument?
    xp(`v.integer(-10, undefined, [0, null, -10], 3) // max 3 is ignored`,
        v.integer(-10, undefined, [0, null, -10], 3)).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.integer(0, 'zero', [0, null, -10])`,
        v.integer(0, 'zero', [0, null, -10])).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Set invalid.
    xp(`v.integer(0, 'zero', ["0", Infinity, -1.23456789, 10])`,
        v.integer(0, 'zero', ["0", Infinity, -1.23456789, 10])).toBe(false);
    xp(`v.err`, v.err).toBe(`int(): 'zero' 0 is not in [0,Infinity,...9,10]`);
    xp(`v.integer(1.23e4, null, [])`,
        v.integer(1.23e4, null, [])).toBe(false);
    xp(`v.err`, v.err).toBe(`int(): number 12300 is not in []`);

    // Rule ok. @TODO maybe don’t ignore the `max` argument?
    xp(`v.integer(10, 'ten', {test:n=>n==10}, 3) // max 3 is ignored`,
        v.integer(10, 'ten', {test:n=>n==10}, 3)).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.integer(-55.5e5, null, {test:()=>true})`,
        v.integer(-55.5e5, null, {test:()=>true})).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Rule invalid.
    xp(`v.integer(1.23, undefined, {test:n=>n==1.23})`,
        v.integer(1.23, undefined, {test:n=>n==1.23})).toBe(false);
    xp(`v.err`, v.err).toBe(`int(): number 1.23 is not an integer`);
    xp(`v.integer(55, 'britvic', {test:()=>false})`,
        v.integer(55, 'britvic', {test:()=>false})).toBe(false);
    xp(`v.err`, v.err).toMatch(/^int\(\): 'britvic' 55 fails /);

    // Minimum ok.
    xp(`v.integer(10, 'ten', 10)`,
        v.integer(10, 'ten', 10)).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.integer(-9.999e97, 'minusHuge', -9.999e98)`,
        v.integer(-9.999e97, 'minusHuge', -9.999e98)).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Minimum NaN throws an error. @TODO maybe 'Validate.integer() incorrectly ...'
    try { v.integer(10, 'ten', NaN) } catch (e) { exc = `${e}` }
    xp(`v.integer(10, 'ten', NaN)`, exc)
        .toBe('Error: Validate.number() incorrectly invoked: min is NaN!');
    xp(`v.err`, v.err)
        .toBe('Validate.number() incorrectly invoked: min is NaN!');

    // Minimum invalid.
    xp(`v.integer(10, null, 20)`,
        v.integer(10, null, 20)).toBe(false);
    xp(`v.err`, v.err).toBe(`int(): number 10 is < 20`);
    xp(`v.integer(-Infinity, 'minusInf', -1.23)`,
        v.integer(-Infinity, 'minusInf', -1.23)).toBe(false);
    xp(`v.err`, v.err).toBe(`int(): 'minusInf' -Infinity is < -1.23`);

    // Maximum ok. @TODO maybe throw an error if max > min
    xp(`v.integer(10, /name-is-ignored/, 10, 10)`,
        v.integer(10, /name-is-ignored/, 10, 10)).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.integer(10, 'ten', null, 55.555)`,
        v.integer(10, 'ten', null, 55.555)).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Maximum NaN throws an error. @TODO maybe 'Validate.integer() incorrectly ...'
    try { v.integer(10, 'ten', 3, NaN) } catch (e) { exc = `${e}` }
    xp(`v.integer(10, 'ten', 3, NaN)`, exc)
        .toBe('Error: Validate.number() incorrectly invoked: max is NaN!');
    xp(`v.err`, v.err)
        .toBe('Validate.number() incorrectly invoked: max is NaN!');

    // Maximum invalid.
    xp(`v.integer(-1.23, null, -3.33, -2.5)`,
        v.integer(-1.23, null, -3.33, -2.5)).toBe(false);
    xp(`v.err`, v.err).toBe(`int(): number -1.23 is > -2.5`);
    xp(`v.integer(9e99, 'huge', 4e99, 8e99)`,
        v.integer(9e99, 'huge', 4e99, 8e99)).toBe(false);
    xp(`v.err`, v.err).toBe(`int(): 'huge' 9e+99 is > 8e+99`);
}
