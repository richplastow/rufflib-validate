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
export function test(expect, Validate) {
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
    try{ v.string('abc', 'abc', NaN) } catch (e) { err = `${e}` }
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
    try{ v.string('10', 'tenStr', 2, NaN) } catch (e) { err = `${e}` }
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
