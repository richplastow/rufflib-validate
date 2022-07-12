// rufflib-validate/src/methods/boolean.js

// Public method which validates boolean `true` or `false`.
export default function boolean(value, name) {
    this.err = null;
    if (this.skip) return true;

    return this._type(value, name, 'boolean')
}

// Tests Validate.boolean()
export function test(xp, Validate) {
    xp().section('boolean()');

    const v = new Validate('bool()');

    // Ok.
    xp(`v.boolean(true, 'true')`,
        v.boolean(true, 'true')).toBe(true);
    xp(`v.err`, v.err).toBe(null);
    xp(`v.boolean(false, 'false')`,
        v.boolean(false, 'false')).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Nullish.
    xp(`v.boolean(undefined, 'undef')`,
        v.boolean(undefined, 'undef')).toBe(false);
    xp(`v.err`, v.err).toBe(`bool(): 'undef' is type 'undefined' not 'boolean'`);
    xp(`v.boolean(null)`,
        v.boolean(null)).toBe(false);
    xp(`v.err`, v.err).toBe(`bool(): a value is null not type 'boolean'`);

    // Invalid.
    xp(`v.boolean(0, 'zero')`,
        v.boolean(0, 'zero')).toBe(false);
    xp(`v.err`, v.err).toBe(`bool(): 'zero' is type 'number' not 'boolean'`);
    xp(`v.boolean([1,2,3], 'array')`,
        v.boolean([1,2,3], 'array')).toBe(false);
    xp(`v.err`, v.err).toBe(`bool(): 'array' is an array not type 'boolean'`);
}
