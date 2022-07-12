// rufflib-validate/src/methods/schema.js

import { A, B, I, N, O, S, U } from '../constants.js';


/* --------------------------------- Method --------------------------------- */

// Public method which validates a schema object.
export default function schema(value, name) {
    this.err = null;
    if (this.skip) return true;

    // Recursively check that `value` is a correct `schema`.
    const err = checkSchemaCorrectness(value, name, []);
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
function checkSchemaCorrectness(sma, name, path) {

    // Check that the `schema` is a plain object.
    if (sma === null || typeof sma !== O || Array.isArray(sma)) {
        const is = getIs(sma);
        if (! name && path.length === 0)
            return `unnamed schema is ${is} not an object`;
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
            return `unnamed schema '._meta' is ${is} not an object`;
        if (! name)
            return `'${path.join('.')}._meta' of the schema is ${is} not an object`;
        if (path.length === 0)
            return `'${name}._meta' is ${is} not an object`;
        return `'${name}.${path.join('.')}._meta' is ${is} not an object`;
    }

    // Check each key/value pair.
    for (let key in sma) {
        if (key === '_meta') continue; // ignore the special `_meta` property

        // Every value must be a plain object.
        const value = sma[key];
        if (value === null || typeof value !== O || Array.isArray(value)) {
            return fmtErr(name, path, key, `is ${getIs(value)} not an object`);
        }

        // Deal with a sub-schema.
        if (value._meta) {
            const err = checkSchemaCorrectness(value, name, [...path, key]);
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
export function test(xp, Validate) {
    xp().section('schema()');

    const v = new Validate('sma()');

    // Basic ok.
    xp(`v.schema({_meta:{}}, 'empty')`,
        v.schema({_meta:{}}, 'empty')).toBe(true);
    xp(`v.err`, v.err).toBe(null);

    // Basic invalid.
    xp(`v.schema(100, 'hundred')`,
        v.schema(100, 'hundred')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'hundred' is type 'number' not an object`);
    xp(`v.schema([1,2,3])`,
        v.schema([1,2,3])).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): unnamed schema is an array not an object`);

    // Nullish.
    xp(`v.schema(undefined, 'undef')`,
        v.schema(undefined, 'undef')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'undef' is type 'undefined' not an object`);
    xp(`v.schema(null, 'empty')`,
        v.schema(null, 'empty')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'empty' is null not an object`);
    xp(`v.schema(null)`,
        v.schema(null)).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): unnamed schema is null not an object`);
    xp(`v.schema([], 'emptyArray')`,
        v.schema([], 'emptyArray')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'emptyArray' is an array not an object`);

    // Schema invalid, basic property errors.
    xp(`v.schema({}, 's')`,
        v.schema({}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's._meta' is type 'undefined' not an object`);
    xp(`v.schema({_meta:[]})`,
        v.schema({_meta:[]})).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): unnamed schema '._meta' is an array not an object`);
    xp(`v.schema({_meta:null}, 's')`,
        v.schema({_meta:null}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's._meta' is null not an object`);
    xp(`v.schema({_meta:{},foo:{_meta:123}}, 'MY_SCHEMA')`,
        v.schema({_meta:{},foo:{_meta:123}}, 'MY_SCHEMA')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'MY_SCHEMA.foo._meta' is type 'number' not an object`);
    xp(`v.schema({_meta:{},foo:{_meta:[1,2,3]}}, undefined)`,
        v.schema({_meta:{},foo:{_meta:[1,2,3]}}, undefined)).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'foo._meta' of the schema is an array not an object`);
    xp(`v.schema({_meta:null})`,
        v.schema({_meta:null})).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): unnamed schema '._meta' is null not an object`);
    xp(`v.schema({_meta:{},a:{_meta:{},b:{_meta:{}}},c:{_meta:{},d:{_meta:{}},e:{_meta:[]}}})`,
        v.schema({_meta:{},a:{_meta:{},b:{_meta:{}}},c:{_meta:{},d:{_meta:{}},e:{_meta:[]}}})).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'c.e._meta' of the schema is an array not an object`);
    xp(`v.schema({a:1, _meta:{}}, 'schema')`,
        v.schema({a:1, _meta:{}}, 'schema')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'schema.a' is type 'number' not an object`);
    xp(`v.schema({a:null, _meta:{}}, null)`,
        v.schema({a:null, _meta:{}}, null)).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'a' of the schema is null not an object`);
    xp(`v.schema({a:{_meta:true}, _meta:{}}, 's')`,
        v.schema({a:{_meta:true}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.a._meta' is type 'boolean' not an object`);
    xp(`v.schema({Foo:{_meta:[]}, _meta:{}}, 's')`,
        v.schema({Foo:{_meta:[]}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.Foo._meta' is an array not an object`);
    xp(`v.schema({num:{}, _meta:{}}, 's')`,
        v.schema({num:{}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.num.kind' not recognised`);
    xp(`v.schema({num:{kind:123}, _meta:{}})`,
        v.schema({num:{kind:123}, _meta:{}})).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'num.kind' of the schema not recognised`);
    xp(`v.schema({outer:{_meta:{},inner:{}}, _meta:{}}, 's')`,
        v.schema({outer:{_meta:{},inner:{}}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.outer.inner.kind' not recognised`);

    // Schema invalid, value properties are never allowed to be `null`.
    xp(`v.schema({BOOL:{fallback:null,kind:'boolean'}, _meta:{}}, 's')`,
        v.schema({BOOL:{fallback:null,kind:'boolean'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.BOOL.fallback' is null`);
    xp(`v.schema({n:{max:null,kind:'number'}, _meta:{}}))`,
        v.schema({n:{max:null,kind:'number'}, _meta:{}})).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'n.max' of the schema is null`);
    xp(`v.schema({n:{min:null,kind:'number'}, _meta:{}}, 's')`,
        v.schema({n:{min:null,kind:'number'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.n.min' is null`);
    xp(`v.schema({n:{rule:null,kind:'number'}, _meta:{}}, 0)`,
        v.schema({n:{rule:null,kind:'number'}, _meta:{}}, 0)).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'n.rule' of the schema is null`);
    xp(`v.schema({n:{set:null,kind:'number'}, _meta:{}}, 's')`,
        v.schema({n:{set:null,kind:'number'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.n.set' is null`);

    // Schema invalid, only 0 or 1 qualifiers allowed.
    xp(`v.schema({str:{max:1,rule:1,kind:'string'}, _meta:{}}, 's')`,
        v.schema({str:{max:1,rule:1,kind:'string'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.str' has '2' qualifiers, only 0 or 1 allowed`);
    xp(`v.schema({str:{min:1,set:1,kind:'string'}, _meta:{}}, undefined)`,
        v.schema({str:{min:1,set:1,kind:'string'}, _meta:{}}, undefined)).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'str' of the schema has '2' qualifiers, only 0 or 1 allowed`);
    xp(`v.schema({str:{min:1,max:1,set:1,kind:'string'}, _meta:{}}, 's')`,
        v.schema({str:{min:1,max:1,set:1,kind:'string'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.str' has '3' qualifiers, only 0 or 1 allowed`);
    xp(`v.schema({str:{min:1,max:1,rule:1,set:1,kind:'string'}, _meta:{}})`,
        v.schema({str:{min:1,max:1,rule:1,set:1,kind:'string'}, _meta:{}})).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'str' of the schema has '4' qualifiers, only 0 or 1 allowed`);

    // Schema invalid, boolean.
    xp(`v.schema({BOOL:{fallback:0,kind:'boolean'}, _meta:{}}, 's')`,
        v.schema({BOOL:{fallback:0,kind:'boolean'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.BOOL' has 'number' fallback, not 'boolean' or 'undefined'`);
    xp(`v.schema({BOOL:{max:true,kind:'boolean'}, _meta:{}}, false)`,
        v.schema({BOOL:{max:true,kind:'boolean'}, _meta:{}}, false)).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'BOOL' of the schema has 'boolean' max, not 'undefined'`);
    xp(`v.schema({BOOL:{min:1,kind:'boolean'}, _meta:{}}, 's')`,
        v.schema({BOOL:{min:1,kind:'boolean'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.BOOL' has 'number' min, not 'undefined'`);
    xp(`v.schema({BOOL:{rule:{},kind:'boolean'}, _meta:{}})`,
        v.schema({BOOL:{rule:{},kind:'boolean'}, _meta:{}})).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'BOOL' of the schema has 'object' rule, not 'undefined'`);
    xp(`v.schema({BOOL:{set:[],kind:'boolean'}, _meta:{}}, 's')`,
        v.schema({BOOL:{set:[],kind:'boolean'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.BOOL' has 'array' set, not 'undefined'`);

    // Schema invalid, integer and number.
    xp(`v.schema({i:{fallback:[],kind:'integer'}, _meta:{}}, 's')`,
        v.schema({i:{fallback:[],kind:'integer'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.i' has 'array' fallback, not 'number' or 'undefined'`);
    xp(`v.schema({n:{max:true,kind:'number'}, _meta:{}}, -0)`,
        v.schema({n:{max:true,kind:'number'}, _meta:{}}, -0)).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'n' of the schema has 'boolean' max, not 'number' or 'undefined'`);
    xp(`v.schema({int:{min:[],kind:'integer'}, _meta:{}}, 's')`,
        v.schema({int:{min:[],kind:'integer'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.int' has 'array' min, not 'number' or 'undefined'`);
    xp(`v.schema({NUM:{rule:1,kind:'number'}, _meta:{}}, undefined)`,
        v.schema({NUM:{rule:1,kind:'number'}, _meta:{}}, undefined)).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'NUM' of the schema has 'number' rule, not 'object' or 'undefined'`);
    xp(`v.schema({NUM:{rule:{},kind:'number'}, _meta:{}}, 's')`,
        v.schema({NUM:{rule:{},kind:'number'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.NUM' has 'undefined' rule.test, not 'function'`);
    xp(`v.schema({INT:{set:0,kind:'integer'}, _meta:{}})`,
        v.schema({INT:{set:0,kind:'integer'}, _meta:{}})).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'INT' of the schema has 'number' set, not an array or 'undefined'`);
    xp(`v.schema({n:{set:[1,'2',3],kind:'number'}, _meta:{}}, 's')`,
        v.schema({n:{set:[1,'2',3],kind:'number'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.n' has 'string' set[1], not 'number'`);

    // Schema invalid, string.
    xp(`v.schema({s:{fallback:1,kind:'string'}, _meta:{}}, 's')`,
        v.schema({s:{fallback:1,kind:'string'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.s' has 'number' fallback, not 'string' or 'undefined'`);
    xp(`v.schema({str:{max:[],kind:'string'}, _meta:{}}, null)`,
        v.schema({str:{max:[],kind:'string'}, _meta:{}}, null)).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'str' of the schema has 'array' max, not 'number' or 'undefined'`);
    xp(`v.schema({S:{min:{},kind:'string'}, _meta:{}}, 's')`,
        v.schema({S:{min:{},kind:'string'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.S' has 'object' min, not 'number' or 'undefined'`);
    xp(`v.schema({STR:{rule:'1',kind:'string'}, _meta:{}}, '')`,
        v.schema({STR:{rule:'1',kind:'string'}, _meta:{}}, '')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 'STR' of the schema has 'string' rule, not 'object' or 'undefined'`);
    xp(`v.schema({_s:{rule:{test:[]},kind:'string'}, _meta:{}}, 's')`, // @TODO '...has 'array' rule.test...'
        v.schema({_s:{rule:{test:[]},kind:'string'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's._s' has 'object' rule.test, not 'function'`);
    xp(`v.schema({_:{set:0,kind:'string'}, _meta:{}})`,
        v.schema({_:{set:0,kind:'string'}, _meta:{}})).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): '_' of the schema has 'number' set, not an array or 'undefined'`);
    xp(`v.schema({string:{set:[1,'2',3],kind:'string'}, _meta:{}}, 's')`,
        v.schema({string:{set:[1,'2',3],kind:'string'}, _meta:{}}, 's')).toBe(false);
    xp(`v.err`, v.err).toBe(`sma(): 's.string' has 'number' set[0], not 'string'`);

}
