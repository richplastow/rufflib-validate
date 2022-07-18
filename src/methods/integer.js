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
export function test(expect, Validate) {
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
    try{ v.integer(10, 'ten', NaN) } catch (e) { exc = `${e}` }
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
    try{ v.integer(10, 'ten', 3, NaN) } catch (e) { exc = `${e}` }
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
