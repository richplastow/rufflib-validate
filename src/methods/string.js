// rufflib-validate/src/methods/string.js

// Public method which validates a string like "Abc" or "".
//
// `minSetOrRule` is optional, and allows either a minimum string length, a set
// of valid strings (for enums), or an object containing a `test()` function.
// Note that JavaScript RegExps are objects which contain a `test()` function.
// If `minSetOrRule` is a number, undefined or null, then (optional) `max` is
// the maximum valid string length.
export default function string(value, name, minSetOrRule, max) {
    this.err = null;
    if (this.skip) return true;

    // Deal with the simple cases where `value` is not a valid string.
    if (! this._type(value, name, 'string')) return false;

    const msorIsObj = typeof minSetOrRule === 'object' && minSetOrRule != null;
    const n = typeof name === 'string'
        ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
            ? name
            : `'${name}'`
        : 'string'
    ;

    // If `minSetOrRule` is an array, treat it as a set of valid strings.
    // This is a handy way of validating an enum.
    if (msorIsObj && Array.isArray(minSetOrRule)) {
        if (-1 !== minSetOrRule.indexOf(value)) return true;
        let val = `"${value}"`;
        val = val.length < 21 ? val : `${val.slice(0,12)}...${val.slice(-5)}`;
        let arr = `[${minSetOrRule}]`;
        arr = arr.length < 21 ? arr : `${arr.slice(0,12)}...${arr.slice(-5)}`;
        this.err = `${this.prefix}: ${n} ${val} is not in ${arr}`;
        return false;
    }

    // If `minSetOrRule` is a rule, run the test function.
    if (msorIsObj && typeof minSetOrRule.test === 'function') {
        if (minSetOrRule.test(value)) return true;
        let val = `"${value}"`;
        val = val.length < 21 ? val : `${val.slice(0,12)}...${val.slice(-5)}`;
        let tst = `${minSetOrRule instanceof RegExp ? minSetOrRule : minSetOrRule.test}`;
        tst = tst.length < 21 ? tst : `${tst.slice(0,12)}...${tst.slice(-5)}`;
        this.err = `${this.prefix}: ${n} ${val} fails ${tst}`;
        return false;
    }

    // If `minSetOrRule` is a valid number, treat it as the minimum valid number.
    if (typeof minSetOrRule === 'number') {
        const min = minSetOrRule;
        if (Number.isNaN(min)) {
            this.err = 'Validate.string() incorrectly invoked: min is NaN!';
            throw Error(this.err);
        }
        if (value.length < min) {
            this.err = `${this.prefix}: ${n} length ${value.length} is < ${min}`;
            return false;
        }
    }

    // Here, `minSetOrRule` can be ignored. If `max` is a valid number, treat it
    // as the minimum valid number.
    if (typeof max === 'number') {
        if (Number.isNaN(max)) {
            this.err = 'Validate.string() incorrectly invoked: max is NaN!';
            throw Error(this.err);
        }
        if (value.length > max) {
            this.err = `${this.prefix}: ${n} length ${value.length} is > ${max}`;
            return false;
        }
    }

    // The string is valid, yay!
    return true;
}

// Tests Validate.string()
export function test(xp, Validate) {
    xp().section('string()');

    const v = new Validate('str()');
    let err;

    // Basic ok.
    xp(`v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet')`,
        v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet')).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.string('', 'empty')`,
        v.string('', 'empty')).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Nullish.
    xp(`v.string()`,
        v.string()).toBe(false);
    xp(`v.err`, v.err).toBe(`str(): a value is type 'undefined' not 'string'`);
    xp(`v.string(null, 'null')`,
        v.string(null, 'null')).toBe(false);
    xp(`v.err`, v.err).toBe(`str(): 'null' is null not type 'string'`);

    // Basic invalid.
    xp(`v.string(10, 'ten')`,
        v.string(10, 'ten')).toBe(false);
    xp(`v.err`, v.err).toBe(`str(): 'ten' is type 'number' not 'string'`);
    xp(`v.string(NaN, 'NaN')`,
        v.string(NaN, 'NaN')).toBe(false);
    xp(`v.err`, v.err).toBe(`str(): 'NaN' is type 'number' not 'string'`);
    xp(`v.string(['a'], 'array')`,
        v.string(['a'], 'array')).toBe(false);
    xp(`v.err`, v.err).toBe(`str(): 'array' is an array not type 'string'`);
    xp(`v.string(Math, undefined)`,
        v.string(Math, undefined)).toBe(false);
    xp(`v.err`, v.err).toBe(`str(): a value is type 'object' not 'string'`);

    // Set ok. @TODO maybe don’t ignore the `max` argument?
    xp(`v.string('Foobar', undefined, ['Baz','Foobar'], 3) // max 3 is ignored`,
        v.string('Foobar', undefined, ['Baz','Foobar'], 3)).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.string('', 'blank', [''])`,
        v.string('', 'blank', [''])).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Set invalid.
    xp(`v.string('FOOBAR', 'CapsFoobar', ['Baz','Abcdefgi','Foobar'])`,
        v.string('FOOBAR', 'CapsFoobar', ['Baz','Abcdefgi','Foobar'])).toBe(false);
    xp(`v.err`, v.err).toBe(`str(): 'CapsFoobar' "FOOBAR" is not in [Baz,Abcdefg...obar]`);
    xp(`v.string('', null, [])`,
        v.string('', null, [])).toBe(false);
    xp(`v.err`, v.err).toBe(`str(): string "" is not in []`);

    // Rule ok. @TODO maybe don’t ignore the `max` argument?
    xp(`v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet', /[a-z]{26}/, 3) // max 3 is ignored`,
        v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet', /[a-z]{26}/, 3)).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.string('Foobar', 0, {test:function(s){return s[0]==='F'}})`,
        v.string('Foobar', 0, {test:function(s){return s[0]==='F'}})).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Rule invalid.
    xp(`v.string('abcdefghIJKLMNOPQRstuvwxyz', null, /[a-z]{26}/)`,
        v.string('abcdefghIJKLMNOPQRstuvwxyz', null, /[a-z]{26}/)).toBe(false);
    xp(`v.err`, v.err).toBe(`str(): string "abcdefghIJK...wxyz" fails /[a-z]{26}/`);
    xp(`v.string('foobar', 'foobarLowercase', {test:function(s){return s[0]==='F'}})`,
        v.string('foobar', 'foobarLowercase', {test:function(s){return s[0]==='F'}})).toBe(false);
    xp(`v.err`, v.err).toMatch(/^str\(\): 'foobarLowercase' "foobar" fails function/);

    // Minimum ok. @TODO maybe throw an error if negative or non-integer min
    xp(`v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet', 26)`,
        v.string('abcdefghijklmnopqrstuvwxyz', 'alphabet', 26)).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.string('', null, -3)`,
        v.string('', null, -3)).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Minimum NaN throws an error.
    try { v.string('abc', 'abc', NaN) } catch (e) { err = `${e}` }
    xp(`v.string('abc', 'abc', NaN)`, err)
        .toBe('Error: Validate.string() incorrectly invoked: min is NaN!');
    xp(`v.err`, v.err)
        .toBe('Validate.string() incorrectly invoked: min is NaN!');

    // Minimum invalid.
    xp(`v.string('abc', null, 4)`,
        v.string('abc', null, 4)).toBe(false);
    xp(`v.err`, v.err).toBe(`str(): string length 3 is < 4`);
    xp(`v.string('', 'blank', 0.1)`,
        v.string('', 'blank', 0.1)).toBe(false);
    xp(`v.err`, v.err).toBe(`str(): 'blank' length 0 is < 0.1`);

    // Maximum ok. @TODO maybe throw an error if max > min, or negative or non-integer max
    xp(`v.string('abc', /name-is-ignored/, 3, 3)`,
        v.string('abc', /name-is-ignored/, 3, 3)).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.string('10', 'ten', null, 55.555)`,
        v.string('10', 'ten', null, 55.555)).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.string('', 'blank', -1.23, -0) // note JavaScript supports negative zero`,
        v.string('', 'blank', -1.23, -0)).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Maximum NaN throws an error.
    try { v.string('10', 'tenStr', 2, NaN) } catch (e) { err = `${e}` }
    xp(`v.string('10', 'tenStr', 2, NaN)`, err)
        .toBe('Error: Validate.string() incorrectly invoked: max is NaN!');
    xp(`v.err`, v.err)
        .toBe('Validate.string() incorrectly invoked: max is NaN!');

    // Maximum invalid.
    xp(`v.string('abc', null, 3, 2)`,
        v.string('abc', null, 3, 2)).toBe(false);
    xp(`v.err`, v.err).toBe(`str(): string length 3 is > 2`);
    xp(`v.string('', 'blank', -0.2, -0.1)`,
        v.string('', 'blank', -0.2, -0.1)).toBe(false);
    xp(`v.err`, v.err).toBe(`str(): 'blank' length 0 is > -0.1`);
}
