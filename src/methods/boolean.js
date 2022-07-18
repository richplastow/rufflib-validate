// rufflib-validate/src/methods/boolean.js

// Public method which validates boolean `true` or `false`.
export default function boolean(value, name) {
    this.err = null;
    if (this.skip) return true;

    return this._type(value, name, 'boolean')
}

// Tests Validate.boolean()
export function test(expect, Validate) {
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
