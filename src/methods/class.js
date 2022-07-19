// rufflib-validate/src/methods/class.js

import { S, U } from '../constants.js';


/* --------------------------------- Method --------------------------------- */

// Public method which validates a class.
// Note the trailing underscore, because `class` is a reserved word in JavaScript.
export default function class_(value, name, schema) {
    this.err = null;
    if (this.skip) return true;

    const n = typeof name === S
        ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
            ? name
            : `'${name}'`
        : 'a value'
    ;

    // Deal with a value which is not a function.
    if (! this._type(value, name, 'function')) return false;

    // Short-circuit if only two arguments were supplied.
    if (typeof schema === U) return true;

    // Check that the `schema` argument is correct.
    // @TODO optionally bypass this, when performance is important
    const isCorrect = this.schema(schema, 'schema');
    if (! isCorrect) throw Error(`Validate.object() incorrectly invoked: ${this.err}`);

    // Validate `value` against the `schema`.
    if (! this._validateAgainstSchema(value, name, schema)) return false;

    return true;
}


/* ---------------------------------- Tests --------------------------------- */

// Tests Validate.class()
export function test(expect, Validate) {
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
