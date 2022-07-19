// rufflib-validate/src/methods/schema.js

import { A, B, F, I, N, O, S, U } from '../constants.js';


/* --------------------------------- Method --------------------------------- */

// Public method which validates a schema object.
// The optional `metaSchema` argument defines properties which `_meta` objects
// must contain. If `metaSchema` is omitted, `_meta` can be an empty object.
export default function schema(value, name, metaSchema) {
    this.err = null;
    if (this.skip) return true;

    // If present, check that the `metaSchema` is a plain object.
    if (typeof metaSchema !== U) {
        if (metaSchema === null || typeof metaSchema !== O || Array.isArray(metaSchema)) {
            const is = getIs(metaSchema);
            throw Error(`Validate.schema() incorrectly invoked: ${this.prefix}: `
                + `optional 'metaSchema' is ${is} not an object`);
        }
    }

    // Recursively check that `value` is a correct `schema`.
    const err = checkSchemaCorrectness(value, name, [], metaSchema, this);
    if (err) {
        this.err = `${this.prefix}: ${err}`;
        return false;
    }

    return true;
}


/* --------------------------------- Helpers -------------------------------- */

// Checks that a given `schema` object is correctly formed.
// Returns a string if the schema is incorrect, or `null` if it’s correct.
// @TODO guard against cyclic objects
// @TODO make this into a private method, _checkSchemaCorrectness(), to avoid `that`
function checkSchemaCorrectness(sma, name, path, metaSchema, that) {

    // Check that the `schema` is a plain object.
    if (sma === null || typeof sma !== O || Array.isArray(sma)) {
        const is = getIs(sma);
        if (! name && path.length === 0)
            return `the schema is ${is} not an object`;
        if (! name)
            return `'${path.join('.')}' of the schema is ${is} not an object`;
        if (path.length === 0)
            return `'${name}' is ${is} not an object`;
        return `'${name}.${path.join('.')}' is ${is} not an object`;
    }

    // Check that its `_meta` value is a plain object.
    const _meta = sma._meta;
    if (_meta === null || typeof _meta !== O || Array.isArray(_meta)) {
        const is = getIs(_meta);
        if (! name && path.length === 0)
            return `top level '_meta' of the schema is ${is} not an object`;
        if (! name)
            return `'${path.join('.')}._meta' of the schema is ${is} not an object`;
        if (path.length === 0)
            return `'${name}._meta' is ${is} not an object`;
        return `'${name}.${path.join('.')}._meta' is ${is} not an object`;
    }

    // If the special `_meta.inst` value exists, chack that it is an object with
    // a `name` property.
    const inst = sma._meta.inst;
    if (typeof inst !== 'undefined') {
        if (inst === null || typeof inst !== F || Array.isArray(inst)) {
            const is = getIs(inst);
            if (! name && path.length === 0)
                return `top level '._meta.inst' of the schema is ${is} not type 'function'`;
            if (! name)
                return `'${path.join('.')}._meta.inst' of the schema is ${is} not type 'function'`;
            if (path.length === 0)
                return `'${name}._meta.inst' is ${is} not type 'function'`;
            return `'${name}.${path.join('.')}._meta.inst' is ${is} not type 'function'`;
        }
        if (typeof inst.name !== 'string') {
            const is = getIs(inst.name);
            if (! name && path.length === 0)
                return `top level '._meta.inst.name' of the schema is ${is} not 'string'`;
            if (! name)
                return `'${path.join('.')}._meta.inst.name' of the schema is ${is} not 'string'`;
            if (path.length === 0)
                return `'${name}._meta.inst.name' is ${is} not 'string'`;
            return `'${name}.${path.join('.')}._meta.inst.name' is ${is} not 'string'`;
        }
    }

    // Use `metaSchema` (if provided) to validate the `_meta` object.
    // @TODO

    // Check each key/value pair.
    for (let key in sma) {
        // Every value must be a plain object.
        const value = sma[key];
        if (value === null || typeof value !== O || Array.isArray(value)) {
            return fmtErr(name, path, key, `is ${getIs(value)} not an object`);
        }

        // Validate the special `_meta` property.
        if (key === '_meta') {
            if (metaSchema) {
                const n = name && path.length
                    ? `${name}.${path.join('.')}._meta`
                    : name
                        ? `${name}._meta`
                        : path.length
                            ? `${path.join('.')}._meta`
                            : `top level _meta`
                if (! that.object(value, n, metaSchema))
                    return that.err.slice(that.prefix.length + 2);
            }
            continue;
        }

        // Deal with a sub-schema.
        if (value._meta) {
            const err = checkSchemaCorrectness(value, name, [...path, key], metaSchema, that);
            if (err) return err;
            continue;
        }

        // Schema value properties are never allowed to be `null`.
        if (value.fallback === null)
            return fmtErr(name, path, key, `is null`, 'fallback');
        if (value.max      === null)
            return fmtErr(name, path, key, `is null`, 'max');
        if (value.min      === null)
            return fmtErr(name, path, key, `is null`, 'min');
        if (value.rule     === null)
            return fmtErr(name, path, key, `is null`, 'rule');
        if (value.set      === null)
            return fmtErr(name, path, key, `is null`, 'set');

        // Get handy shortcuts to schema value properties, and whether they’re undefined.
        const tf     = Array.isArray(value.fallback) ? A : typeof value.fallback;
        const tmax   = Array.isArray(value.max)      ? A : typeof value.max;
        const tmin   = Array.isArray(value.min)      ? A : typeof value.min;
        const tr     = Array.isArray(value.rule)     ? A : typeof value.rule;
        const ts     = Array.isArray(value.set)      ? A : typeof value.set;
        const tfnu   = tf   !== U;
        const tmaxnu = tmax !== U;
        const tminnu = tmin !== U;
        const trnu   = tr   !== U;
        const tsnu   = ts   !== U;

        // Only one of `max`, `min`, `rule` and `set` is allowed to exist...
        const qnum = tmaxnu + tminnu + trnu + tsnu;
        if (qnum > 1)
            if (qnum !== 2 || !tmaxnu || !tminnu) // ...apart from the min/max pair
                return fmtErr(name, path, key, `has '${qnum}' qualifiers, only 0 or 1 allowed`);

        // Deal with a value definition.
        const vk = value.kind;
        switch (vk) {
            case A: // array
                return '@TODO array';
            case B: // boolean
                if (tf !== B && tfnu) return fmtErr( // undefined fallback means value is mandatory
                    name, path, key, `has '${tf}' fallback, not '${B}' or '${U}'`);
                if (tmaxnu) return fmtErr(
                    name, path, key, `has '${tmax}' max, not '${U}'`);
                if (tminnu) return fmtErr(
                    name, path, key, `has '${tmin}' min, not '${U}'`);
                if (trnu) return fmtErr(
                    name, path, key, `has '${tr  }' rule, not '${U}'`);
                if (tsnu) return fmtErr(
                    name, path, key, `has '${ts  }' set, not '${U}'`);
                break;
            case I: // integer
            case N: // number
                if (tf !== N && tfnu) return fmtErr(
                    name, path, key, `has '${tf}' fallback, not '${N}' or '${U}'`);
                if (tmax !== N && tmaxnu) return fmtErr(
                    name, path, key, `has '${tmax}' max, not '${N}' or '${U}'`);
                if (tmin !== N && tminnu) return fmtErr(
                    name, path, key, `has '${tmin}' min, not '${N}' or '${U}'`);
                if (tr === O) {
                    const trt = typeof value.rule.test;
                    if (trt !== 'function') return fmtErr(
                        name, path, key, `has '${trt}' rule.test, not 'function'`);
                } else if (trnu) return fmtErr(
                    name, path, key, `has '${tr}' rule, not '${O}' or '${U}'`);
                if (ts === A) {
                    for (let i=0,l=value.set.length; i<l; i++) {
                        const tsi = typeof value.set[i];
                        if (tsi !== N) return fmtErr(
                            name, path, key, `has '${tsi}' set[${i}], not '${N}'`);
                    }
                } else if (tsnu) return fmtErr(
                    name, path, key, `has '${ts}' set, not an array or '${U}'`);
                break;
            case S: // string
                if (tf !== S && tfnu) return fmtErr(
                    name, path, key, `has '${tf}' fallback, not '${S}' or '${U}'`);
                if (tmax !== N && tmaxnu) return fmtErr(
                    name, path, key, `has '${tmax}' max, not '${N}' or '${U}'`);
                if (tmin !== N && tminnu) return fmtErr(
                    name, path, key, `has '${tmin}' min, not '${N}' or '${U}'`);
                if (tr === O) {
                    const trt = typeof value.rule.test;
                    if (trt !== 'function') return fmtErr(
                        name, path, key, `has '${trt}' rule.test, not 'function'`);
                } else if (trnu) return fmtErr(
                    name, path, key, `has '${tr}' rule, not '${O}' or '${U}'`);
                if (ts === A) {
                    for (let i=0,l=value.set.length; i<l; i++) {
                        const tsi = typeof value.set[i];
                        if (tsi !== S) return fmtErr(
                            name, path, key, `has '${tsi}' set[${i}], not '${S}'`);
                    }
                } else if (tsnu) return fmtErr(
                    name, path, key, `has '${ts}' set, not an array or '${U}'`);
                break;
            default:
                // if (! name)
                //     return `'${pks}.kind' of the schema not recognised`;
                // return `'${name}.${pks}.kind' not recognised`;
                return fmtErr(name, path, key, 'not recognised', 'kind');

        }
    }

    return null; // signifies a correct schema
}

// Formats an error message.
function fmtErr(
    name,    // the original `name` argument
    path,    // array containing path-segment strings
    key,     // path-segment to add between `path` and `end`
    body, // the main body of the error
    pathEnd, // [optional] path-segment to tack onto the end
) {
    return `'${name ? name+'.' : ''
        }${path.length === 0 ? '' : path.join('.')+'.'
        }${key ? key : ''
        }${pathEnd ? '.'+pathEnd : ''
        }'${name ? '' : ' of the schema'
        } ${body}`
    ;
}

// Returns a description of the type of a value.
function getIs(value) {
    return value === null
        ? 'null'
        : Array.isArray(value)
            ? 'an array'
            : `type '${typeof value}'`
    ;

}


/* ---------------------------------- Tests --------------------------------- */

// Tests Validate.schema().
export function test(expect, Validate) {
    const et = expect.that;

    expect.section('schema()');

    const v = new Validate('sma()');
    const OK = 'Did not encounter an exception';
    let exc = OK;

    // Basic ok.
    et(`v.schema({_meta:{}}, 'empty')`,
        v.schema({_meta:{}}, 'empty')).is(true);
    et(`v.err`, v.err).is(null);

    // Basic invalid.
    et(`v.schema(100, 'hundred')`,
        v.schema(100, 'hundred')).is(false);
    et(`v.err`, v.err).is(`sma(): 'hundred' is type 'number' not an object`);
    et(`v.schema([1,2,3])`,
        v.schema([1,2,3])).is(false);
    et(`v.err`, v.err).is(`sma(): the schema is an array not an object`);

    // Nullish.
    et(`v.schema(undefined, 'undef')`,
        v.schema(undefined, 'undef')).is(false);
    et(`v.err`, v.err).is(`sma(): 'undef' is type 'undefined' not an object`);
    et(`v.schema(null, 'empty')`,
        v.schema(null, 'empty')).is(false);
    et(`v.err`, v.err).is(`sma(): 'empty' is null not an object`);
    et(`v.schema(null)`,
        v.schema(null)).is(false);
    et(`v.err`, v.err).is(`sma(): the schema is null not an object`);
    et(`v.schema([], 'emptyArray')`,
        v.schema([], 'emptyArray')).is(false);
    et(`v.err`, v.err).is(`sma(): 'emptyArray' is an array not an object`);

    // Incorrect `metaSchema`.
    try{v.schema({_meta:{}}, 's', 123); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({_meta:{}}, 's', 123)`, exc)
        .is(`Error: Validate.schema() incorrectly invoked: sma(): `
          + `optional 'metaSchema' is type 'number' not an object`);
    try{v.schema({_meta:{}}, undefined, []); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({_meta:{}}, undefined, [])`, exc)
        .is(`Error: Validate.schema() incorrectly invoked: sma(): `
          + `optional 'metaSchema' is an array not an object`);
    try{v.schema({_meta:{}}, 's', {}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({_meta:{}}, 's', {})`, exc) // @TODO make it clearer what went wrong, for the developer
        .is(`Error: Validate.object() incorrectly invoked: sma(): `
          + `'schema._meta' is type 'undefined' not an object`);

    // Schema invalid, basic property errors.
    et(`v.schema({}, 's')`,
        v.schema({}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's._meta' is type 'undefined' not an object`);
    et(`v.schema({_meta:[]})`,
        v.schema({_meta:[]})).is(false);
    et(`v.err`, v.err).is(`sma(): top level '_meta' of the schema is an array not an object`);
    et(`v.schema({_meta:null}, 's')`,
        v.schema({_meta:null}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's._meta' is null not an object`);
    et(`v.schema({_meta:{},foo:{_meta:123}}, 'MY_SCHEMA')`,
        v.schema({_meta:{},foo:{_meta:123}}, 'MY_SCHEMA')).is(false);
    et(`v.err`, v.err).is(`sma(): 'MY_SCHEMA.foo._meta' is type 'number' not an object`);
    et(`v.schema({_meta:{},foo:{_meta:[1,2,3]}}, undefined)`,
        v.schema({_meta:{},foo:{_meta:[1,2,3]}}, undefined)).is(false);
    et(`v.err`, v.err).is(`sma(): 'foo._meta' of the schema is an array not an object`);
    et(`v.schema({_meta:null})`,
        v.schema({_meta:null})).is(false);
    et(`v.err`, v.err).is(`sma(): top level '_meta' of the schema is null not an object`);
    et(`v.schema({_meta:{},a:{_meta:{},b:{_meta:{}}},c:{_meta:{},d:{_meta:{}},e:{_meta:[]}}})`,
        v.schema({_meta:{},a:{_meta:{},b:{_meta:{}}},c:{_meta:{},d:{_meta:{}},e:{_meta:[]}}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'c.e._meta' of the schema is an array not an object`);
    et(`v.schema({a:1, _meta:{}}, 'schema')`,
        v.schema({a:1, _meta:{}}, 'schema')).is(false);
    et(`v.err`, v.err).is(`sma(): 'schema.a' is type 'number' not an object`);
    et(`v.schema({a:null, _meta:{}}, null)`,
        v.schema({a:null, _meta:{}}, null)).is(false);
    et(`v.err`, v.err).is(`sma(): 'a' of the schema is null not an object`);
    et(`v.schema({a:{_meta:true}, _meta:{}}, 's')`,
        v.schema({a:{_meta:true}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.a._meta' is type 'boolean' not an object`);
    et(`v.schema({Foo:{_meta:[]}, _meta:{}}, 's')`,
        v.schema({Foo:{_meta:[]}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.Foo._meta' is an array not an object`);
    et(`v.schema({num:{}, _meta:{}}, 's')`,
        v.schema({num:{}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.num.kind' not recognised`);
    et(`v.schema({num:{kind:123}, _meta:{}})`,
        v.schema({num:{kind:123}, _meta:{}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'num.kind' of the schema not recognised`);
    et(`v.schema({outer:{_meta:{},inner:{}}, _meta:{}}, 's')`,
        v.schema({outer:{_meta:{},inner:{}}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.outer.inner.kind' not recognised`);

    // Invalid because of schema’s _meta.inst.
    et(`v.schema({_meta:{inst:[]}})`,
        v.schema({_meta:{inst:[]}})).is(false);
    et(`v.err`, v.err).is(`sma(): top level '._meta.inst' of the schema is an array not type 'function'`);
    et(`v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:NaN}}}})`,
        v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:NaN}}}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'mid.inner._meta.inst' of the schema is type 'number' not type 'function'`);
    et(`v.schema({_meta:{inst:{}}}, 'checkInstanceof')`,
        v.schema({_meta:{inst:{}}}, 'checkInstanceof')).is(false);
    et(`v.err`, v.err).is(`sma(): 'checkInstanceof._meta.inst' is type 'object' not type 'function'`);
    et(`v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:null}}}}, 'outer')`,
        v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:null}}}}, 'outer')).is(false);
    et(`v.err`, v.err).is(`sma(): 'outer.mid.inner._meta.inst' is null not type 'function'`);
    class UndefinedName { static name = undefined }
    et(`v.schema({_meta:{inst:UndefinedName}})`,
        v.schema({_meta:{inst:UndefinedName}})).is(false);
    et(`v.err`, v.err).is(`sma(): top level '._meta.inst.name' of the schema is type 'undefined' not 'string'`);
    class FunctionName { static name = x => x + 1 }
    et(`v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:FunctionName}}}})`,
        v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:FunctionName}}}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'mid.inner._meta.inst.name' of the schema is type 'function' not 'string'`);
    class MathObjectName { static name = Math }
    et(`v.schema({_meta:{inst:MathObjectName}}, 'checkInstanceof')`,
        v.schema({_meta:{inst:MathObjectName}}, 'checkInstanceof')).is(false);
    et(`v.err`, v.err).is(`sma(): 'checkInstanceof._meta.inst.name' is type 'object' not 'string'`);
    class ArrayName { static name = ['a','bc'] }
    et(`v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:ArrayName}}}}, 'outer')`,
        v.schema({_meta:{},mid:{_meta:{},inner:{_meta:{inst:ArrayName}}}}, 'outer')).is(false);
    et(`v.err`, v.err).is(`sma(): 'outer.mid.inner._meta.inst.name' is an array not 'string'`);

    // Invalid because of metaSchema.
    et(`v.schema({_meta:{}}, 's', {_meta:{},foo:{kind:'string'}})`,
        v.schema({_meta:{}}, 's', {_meta:{},foo:{kind:'string'}})).is(false);
    et(`v.err`, v.err).is(`sma(): 's._meta.foo' is type 'undefined' not 'string'`);
    et(`v.schema({_meta:{foo:{bar:1.25}}}, undefined, {_meta:{},foo:{_meta:{},bar:{kind:'integer'}}})`,
        v.schema({_meta:{foo:{bar:1.25}}}, undefined, {_meta:{},foo:{_meta:{},bar:{kind:'integer'}}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'top level _meta.foo.bar' 1.25 is not an integer`);
    et(`v.schema({_meta:{foo:'ok'},sub:{_meta:{foo:''}}}, 's', {_meta:{},foo:{kind:'string',min:1}})`,
        v.schema({_meta:{foo:'ok'},sub:{_meta:{foo:''}}}, 's', {_meta:{},foo:{kind:'string',min:1}})).is(false);
    et(`v.err`, v.err).is(`sma(): 's.sub._meta.foo' length 0 is < 1`);
    et(`v.schema({_meta:{foo:'ok'},sub:{_meta:{FOO:'a'}}}, undefined, {_meta:{},foo:{kind:'string'}})`,
        v.schema({_meta:{foo:'ok'},sub:{_meta:{FOO:'a'}}}, undefined, {_meta:{},foo:{kind:'string'}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'sub._meta.foo' is type 'undefined' not 'string'`);

    // Passes metaSchema.
    et(`v.schema({_meta:{}}, 's', {_meta:{}})`,
        v.schema({_meta:{}}, 's', {_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);

    // Schema invalid, value properties are never allowed to be `null`.
    et(`v.schema({BOOL:{fallback:null,kind:'boolean'}, _meta:{}}, 's')`,
        v.schema({BOOL:{fallback:null,kind:'boolean'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.BOOL.fallback' is null`);
    et(`v.schema({n:{max:null,kind:'number'}, _meta:{}}))`,
        v.schema({n:{max:null,kind:'number'}, _meta:{}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'n.max' of the schema is null`);
    et(`v.schema({n:{min:null,kind:'number'}, _meta:{}}, 's')`,
        v.schema({n:{min:null,kind:'number'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.n.min' is null`);
    et(`v.schema({n:{rule:null,kind:'number'}, _meta:{}}, 0)`,
        v.schema({n:{rule:null,kind:'number'}, _meta:{}}, 0)).is(false);
    et(`v.err`, v.err).is(`sma(): 'n.rule' of the schema is null`);
    et(`v.schema({n:{set:null,kind:'number'}, _meta:{}}, 's')`,
        v.schema({n:{set:null,kind:'number'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.n.set' is null`);

    // Schema invalid, only 0 or 1 qualifiers allowed.
    et(`v.schema({str:{max:1,rule:1,kind:'string'}, _meta:{}}, 's')`,
        v.schema({str:{max:1,rule:1,kind:'string'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.str' has '2' qualifiers, only 0 or 1 allowed`);
    et(`v.schema({str:{min:1,set:1,kind:'string'}, _meta:{}}, undefined)`,
        v.schema({str:{min:1,set:1,kind:'string'}, _meta:{}}, undefined)).is(false);
    et(`v.err`, v.err).is(`sma(): 'str' of the schema has '2' qualifiers, only 0 or 1 allowed`);
    et(`v.schema({str:{min:1,max:1,set:1,kind:'string'}, _meta:{}}, 's')`,
        v.schema({str:{min:1,max:1,set:1,kind:'string'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.str' has '3' qualifiers, only 0 or 1 allowed`);
    et(`v.schema({str:{min:1,max:1,rule:1,set:1,kind:'string'}, _meta:{}})`,
        v.schema({str:{min:1,max:1,rule:1,set:1,kind:'string'}, _meta:{}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'str' of the schema has '4' qualifiers, only 0 or 1 allowed`);

    // Schema invalid, boolean.
    et(`v.schema({BOOL:{fallback:0,kind:'boolean'}, _meta:{}}, 's')`,
        v.schema({BOOL:{fallback:0,kind:'boolean'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.BOOL' has 'number' fallback, not 'boolean' or 'undefined'`);
    et(`v.schema({BOOL:{max:true,kind:'boolean'}, _meta:{}}, false)`,
        v.schema({BOOL:{max:true,kind:'boolean'}, _meta:{}}, false)).is(false);
    et(`v.err`, v.err).is(`sma(): 'BOOL' of the schema has 'boolean' max, not 'undefined'`);
    et(`v.schema({BOOL:{min:1,kind:'boolean'}, _meta:{}}, 's')`,
        v.schema({BOOL:{min:1,kind:'boolean'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.BOOL' has 'number' min, not 'undefined'`);
    et(`v.schema({BOOL:{rule:{},kind:'boolean'}, _meta:{}})`,
        v.schema({BOOL:{rule:{},kind:'boolean'}, _meta:{}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'BOOL' of the schema has 'object' rule, not 'undefined'`);
    et(`v.schema({BOOL:{set:[],kind:'boolean'}, _meta:{}}, 's')`,
        v.schema({BOOL:{set:[],kind:'boolean'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.BOOL' has 'array' set, not 'undefined'`);

    // Schema invalid, integer and number.
    et(`v.schema({i:{fallback:[],kind:'integer'}, _meta:{}}, 's')`,
        v.schema({i:{fallback:[],kind:'integer'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.i' has 'array' fallback, not 'number' or 'undefined'`);
    et(`v.schema({n:{max:true,kind:'number'}, _meta:{}}, -0)`,
        v.schema({n:{max:true,kind:'number'}, _meta:{}}, -0)).is(false);
    et(`v.err`, v.err).is(`sma(): 'n' of the schema has 'boolean' max, not 'number' or 'undefined'`);
    et(`v.schema({int:{min:[],kind:'integer'}, _meta:{}}, 's')`,
        v.schema({int:{min:[],kind:'integer'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.int' has 'array' min, not 'number' or 'undefined'`);
    et(`v.schema({NUM:{rule:1,kind:'number'}, _meta:{}}, undefined)`,
        v.schema({NUM:{rule:1,kind:'number'}, _meta:{}}, undefined)).is(false);
    et(`v.err`, v.err).is(`sma(): 'NUM' of the schema has 'number' rule, not 'object' or 'undefined'`);
    et(`v.schema({NUM:{rule:{},kind:'number'}, _meta:{}}, 's')`,
        v.schema({NUM:{rule:{},kind:'number'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.NUM' has 'undefined' rule.test, not 'function'`);
    et(`v.schema({INT:{set:0,kind:'integer'}, _meta:{}})`,
        v.schema({INT:{set:0,kind:'integer'}, _meta:{}})).is(false);
    et(`v.err`, v.err).is(`sma(): 'INT' of the schema has 'number' set, not an array or 'undefined'`);
    et(`v.schema({n:{set:[1,'2',3],kind:'number'}, _meta:{}}, 's')`,
        v.schema({n:{set:[1,'2',3],kind:'number'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.n' has 'string' set[1], not 'number'`);

    // Schema invalid, string.
    et(`v.schema({s:{fallback:1,kind:'string'}, _meta:{}}, 's')`,
        v.schema({s:{fallback:1,kind:'string'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.s' has 'number' fallback, not 'string' or 'undefined'`);
    et(`v.schema({str:{max:[],kind:'string'}, _meta:{}}, null)`,
        v.schema({str:{max:[],kind:'string'}, _meta:{}}, null)).is(false);
    et(`v.err`, v.err).is(`sma(): 'str' of the schema has 'array' max, not 'number' or 'undefined'`);
    et(`v.schema({S:{min:{},kind:'string'}, _meta:{}}, 's')`,
        v.schema({S:{min:{},kind:'string'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.S' has 'object' min, not 'number' or 'undefined'`);
    et(`v.schema({STR:{rule:'1',kind:'string'}, _meta:{}}, '')`,
        v.schema({STR:{rule:'1',kind:'string'}, _meta:{}}, '')).is(false);
    et(`v.err`, v.err).is(`sma(): 'STR' of the schema has 'string' rule, not 'object' or 'undefined'`);
    et(`v.schema({_s:{rule:{test:[]},kind:'string'}, _meta:{}}, 's')`, // @TODO '...has 'array' rule.test...'
        v.schema({_s:{rule:{test:[]},kind:'string'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's._s' has 'object' rule.test, not 'function'`);
    et(`v.schema({_:{set:0,kind:'string'}, _meta:{}})`,
        v.schema({_:{set:0,kind:'string'}, _meta:{}})).is(false);
    et(`v.err`, v.err).is(`sma(): '_' of the schema has 'number' set, not an array or 'undefined'`);
    et(`v.schema({string:{set:[1,'2',3],kind:'string'}, _meta:{}}, 's')`,
        v.schema({string:{set:[1,'2',3],kind:'string'}, _meta:{}}, 's')).is(false);
    et(`v.err`, v.err).is(`sma(): 's.string' has 'number' set[0], not 'string'`);

}
