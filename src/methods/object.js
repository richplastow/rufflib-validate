// rufflib-validate/src/methods/object.js

import { S, U } from '../constants.js';


/* --------------------------------- Method --------------------------------- */

// Public method which validates a plain object.
export default function object(value, name, schema) {
    this.err = null;
    if (this.skip) return true;

    const n = typeof name === S
        ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
            ? name
            : `'${name}'`
        : 'a value'
    ;

    // Deal with a value which is not a plain object.
    if (value === null) {
        this.err = `${this.prefix}: ${n} is null not an object`;
        return false;
    }
    if (Array.isArray(value)) {
        this.err = `${this.prefix}: ${n} is an array not an object`;
        return false;
    }
    if (! this._type(value, name, 'object')) return false;

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

// Tests Validate.object()
export function test(expect, Validate) {
    const et = expect.that;

    expect.section('object()');

    const v = new Validate('obj()');
    const OK = 'Did not encounter an exception';
    let exc = OK;

    // Basic ok.
    et(`v.object({}, 'empty')`,
        v.object({}, 'empty')).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({a:1,b:2,c:3}, 'nums')`,
        v.object({a:1,b:2,c:3}, 'nums')).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({}, 'nums', {_meta:{}})`,
        v.object({}, 'nums', {_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);

    // Basic invalid.
    et(`v.object(100, 'hundred')`,
        v.object(100, 'hundred')).is(false);
    et(`v.err`, v.err).is(`obj(): 'hundred' is type 'number' not 'object'`);
    et(`v.object([1,2,3])`,
        v.object([1,2,3])).is(false);
    et(`v.err`, v.err).is(`obj(): a value is an array not an object`);

    // Nullish.
    et(`v.object(undefined, 'undef')`,
        v.object(undefined, 'undef')).is(false);
    et(`v.err`, v.err).is(`obj(): 'undef' is type 'undefined' not 'object'`);
    et(`v.object(null)`,
        v.object(null)).is(false);
    et(`v.err`, v.err).is(`obj(): a value is null not an object`);
    et(`v.object([], 'emptyArray')`,
        v.object([], 'emptyArray')).is(false);
    et(`v.err`, v.err).is(`obj(): 'emptyArray' is an array not an object`);

    // Incorrect `schema`, basic property errors.
    try{v.object({}, 'empty', null); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'empty', null)`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema' is null not an object`);
    try{v.object({}, 'e', []); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', [])`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema' is an array not an object`);
    try{v.object({}, 'e', {}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta' is type 'undefined' not an object`);
    try{v.object({}, undefined, {_meta:null}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, undefined, {_meta:null})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta' is null not an object`);
    try{v.object({}, 'e', {_meta:123}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {_meta:123})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta' is type 'number' not an object`);
    try{v.object({}, undefined, {_meta:[]}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, undefined, {_meta:[]})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta' is an array not an object`);
    try{v.object({}, 'e', {a:1, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {a:1, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.a' is type 'number' not an object`);
    try{v.object({}, 'e', {a:{_meta:true}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {a:{_meta:true}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.a._meta' is type 'boolean' not an object`);
    try{v.object({}, 'e', {Foo:{_meta:[]}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {Foo:{_meta:[]}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.Foo._meta' is an array not an object`);
    try{v.object({}, 'e', {num:{}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {num:{}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.num.kind' not recognised`);
    try{v.object({}, 'e', {outer:{_meta:{},inner:{}}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {outer:{_meta:{},inner:{}}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.outer.inner.kind' not recognised`);

    // Incorrect `schema`, _meta.inst invalid.
    try{v.object({}, 'e', {_meta:{inst:[]}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {_meta:{inst:[]}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta.inst' is an array not type 'function'`);
    try{v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:NaN}}}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:NaN}}}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.mid.inner._meta.inst' is type 'number' not type 'function'`);
    try{v.object({}, 'e', {_meta:{inst:{}}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {_meta:{inst:{}}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta.inst' is type 'object' not type 'function'`);
    try{v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:null}}}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:null}}}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.mid.inner._meta.inst' is null not type 'function'`);
    class UndefinedName { static name = undefined }
    try{v.object({}, 'e', {_meta:{inst:UndefinedName}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {_meta:{inst:namelessFunct}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta.inst.name' is type 'undefined' not 'string'`);
    class FunctionName { static name = x => x + 1 }
    try{v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:FunctionName}}}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:FunctionName}}}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.mid.inner._meta.inst.name' is type 'function' not 'string'`);
    class MathObjectName { static name = Math }
    try{v.object({}, 'e', {_meta:{inst:MathObjectName}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {_meta:{inst:MathObjectName}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._meta.inst.name' is type 'object' not 'string'`);
    class ArrayName { static name = ['a','bc'] }
    try{v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:ArrayName}}}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {_meta:{},mid:{_meta:{},inner:{_meta:{inst:ArrayName}}}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.mid.inner._meta.inst.name' is an array not 'string'`);

    // Incorrect `schema`, value properties are never allowed to be `null`.
    try{v.object({}, 'e', {BOOL:{fallback:null,kind:'boolean'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {BOOL:{fallback:null,kind:'boolean'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL.fallback' is null`);
    try{v.object({}, 'e', {n:{max:null,kind:'number'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {n:{max:null,kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.n.max' is null`);
    try{v.object({}, 'e', {n:{min:null,kind:'number'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {n:{min:null,kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.n.min' is null`);
    try{v.object({}, 'e', {n:{rule:null,kind:'number'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {n:{rule:null,kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.n.rule' is null`);
    try{v.object({}, 'e', {n:{set:null,kind:'number'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {n:{set:null,kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.n.set' is null`);

    // Incorrect `schema`, only 0 or 1 qualifiers allowed.
    try{v.object({}, 'e', {s:{max:1,rule:1,kind:'string'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {s:{max:1,rule:1,kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has '2' qualifiers, only 0 or 1 allowed`);
    try{v.object({}, 'e', {s:{min:1,set:1,kind:'string'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {s:{min:1,set:1,kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has '2' qualifiers, only 0 or 1 allowed`);
    try{v.object({}, 'e', {s:{min:1,max:1,set:1,kind:'string'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {s:{min:1,max:1,set:1,kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has '3' qualifiers, only 0 or 1 allowed`);
    try{v.object({}, 'e', {s:{min:1,max:1,rule:1,set:1,kind:'string'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {s:{min:1,max:1,rule:1,set:1,kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has '4' qualifiers, only 0 or 1 allowed`);

    // Incorrect `schema`, boolean.
    try{v.object({}, 'e', {BOOL:{fallback:0,kind:'boolean'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {BOOL:{fallback:0,kind:'boolean'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'number' fallback, not 'boolean' or 'undefined'`);
    try{v.object({}, 'e', {BOOL:{max:true,kind:'boolean'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {BOOL:{max:true,kind:'boolean'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'boolean' max, not 'undefined'`);
    try{v.object({}, 'e', {BOOL:{min:1,kind:'boolean'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {BOOL:{min:1,kind:'boolean'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'number' min, not 'undefined'`);
    try{v.object({}, 'e', {BOOL:{rule:{},kind:'boolean'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {BOOL:{rule:{},kind:'boolean'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'object' rule, not 'undefined'`);
    try{v.object({}, 'e', {BOOL:{set:[],kind:'boolean'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {BOOL:{set:[],kind:'boolean'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.BOOL' has 'array' set, not 'undefined'`);

    // Incorrect `schema`, integer and number.
    try{v.object({}, 'e', {i:{fallback:[],kind:'integer'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {i:{fallback:[],kind:'integer'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.i' has 'array' fallback, not 'number' or 'undefined'`);
    try{v.object({}, 'e', {n:{max:true,kind:'number'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {n:{max:true,kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.n' has 'boolean' max, not 'number' or 'undefined'`);
    try{v.object({}, 'e', {int:{min:[],kind:'integer'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {int:{min:[]],kind:'integer'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.int' has 'array' min, not 'number' or 'undefined'`);
    try{v.object({}, 'e', {NUM:{rule:1,kind:'number'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {NUM:{rule:1,kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.NUM' has 'number' rule, not 'object' or 'undefined'`);
    try{v.object({}, 'e', {NUM:{rule:{},kind:'number'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {NUM:{rule:{},kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.NUM' has 'undefined' rule.test, not 'function'`);
    try{v.object({}, 'e', {INT:{set:0,kind:'integer'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {INT:{set:0,kind:'integer'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.INT' has 'number' set, not an array or 'undefined'`);
    try{v.object({}, 'e', {n:{set:[1,'2',3],kind:'number'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {n:{set:[1,'2',3],kind:'number'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.n' has 'string' set[1], not 'number'`);

    // Incorrect `schema`, string.
    try{v.object({}, 'e', {s:{fallback:1,kind:'string'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {s:{fallback:1,kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.s' has 'number' fallback, not 'string' or 'undefined'`);
    try{v.object({}, 'e', {str:{max:[],kind:'string'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {str:{max:[],kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.str' has 'array' max, not 'number' or 'undefined'`);
    try{v.object({}, 'e', {S:{min:{},kind:'string'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {S:{min:{}],kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.S' has 'object' min, not 'number' or 'undefined'`);
    try{v.object({}, 'e', {STR:{rule:'1',kind:'string'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {STR:{rule:'1',kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.STR' has 'string' rule, not 'object' or 'undefined'`);
    try{v.object({}, 'e', {_s:{rule:{test:[]},kind:'string'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {_s:{rule:{test:[]},kind:'string'}, _meta:{}})`, exc) // @TODO '...has 'array' rule.test...'
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._s' has 'object' rule.test, not 'function'`);
    try{v.object({}, 'e', {_:{set:0,kind:'string'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {_:{set:0,kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema._' has 'number' set, not an array or 'undefined'`);
    try{v.object({}, 'e', {string:{set:[1,'2',3],kind:'string'}, _meta:{}}); exc = OK } catch (e) { exc = `${e}` }
    et(`v.object({}, 'e', {string:{set:[1,'2',3],kind:'string'}, _meta:{}})`, exc)
        .is(`Error: Validate.object() incorrectly invoked: obj(): 'schema.string' has 'number' set[0], not 'string'`);

    // Boolean ok.
    et(`v.object({basic:false}, 'basicBool', {basic:{kind:'boolean'},_meta:{}})`,
        v.object({basic:false}, 'basicBool', {basic:{kind:'boolean'},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({foo:{bar:true}}, undefined, {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:true}}, undefined, {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({}, 'hasFooFallback', {foo:{fallback:true,kind:'boolean'},_meta:{}})`,
        v.object({}, 'hasFooFallback', {foo:{fallback:true,kind:'boolean'},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({foo:false}, undefined, {foo:{fallback:true,kind:'boolean'},_meta:{}})`,
        v.object({foo:false}, undefined, {foo:{fallback:true,kind:'boolean'},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({A:{b:true,c:false,D:{e:true}},f:true}, 'complexBool', {_meta:{}, ... kind:'boolean'}})`,
        v.object({A:{b:true,c:false,D:{e:true}},f:true}, 'complexBool', {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'boolean'},
            D:{_meta:{},e:{kind:'boolean'}}},f:{kind:'boolean'}
        })).is(true);
    et(`v.err`, v.err).is(null);

    // Boolean invalid.
    et(`v.object({B:123}, 'o', {B:{kind:'boolean'},_meta:{}})`,
        v.object({B:123}, 'o', {B:{kind:'boolean'},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'o.B' is type 'number' not 'boolean'`);
    et(`v.object({basic:[false]}, 'basicBool', {basic:{kind:'boolean'},_meta:{}})`,
        v.object({basic:[false]}, 'basicBool', {basic:{kind:'boolean'},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'basicBool.basic' is an array not type 'boolean'`);
    et(`v.object({bar:true}, undefined, {basic:{kind:'boolean'},_meta:{}})`,
        v.object({bar:true}, undefined, {basic:{kind:'boolean'},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'basic' of a value is type 'undefined' not 'boolean'`);
    et(`v.object({foo:{BAR:true}}, 'nestedBool', {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})`,
        v.object({foo:{BAR:true}}, 'nestedBool', {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'nestedBool.foo.bar' is type 'undefined' not 'boolean'`);
    et(`v.object({foo:{bar:null}}, undefined, {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:null}}, undefined, {foo:{bar:{kind:'boolean'},_meta:{}},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'foo.bar' of a value is null not type 'boolean'`);
    et(`v.object({foo:[]}, 'hasFooFallback', {foo:{fallback:true,kind:'boolean'},_meta:{}})`,
        v.object({foo:[]}, 'hasFooFallback', {foo:{fallback:true,kind:'boolean'},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'hasFooFallback.foo' is an array not type 'boolean'`);
    et(`v.object({foo:null}, undefined, {foo:{fallback:true,kind:'boolean'},_meta:{}})`,
        v.object({foo:null}, undefined, {foo:{fallback:true,kind:'boolean'},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'foo' of a value is null not type 'boolean'`);
    et(`v.object({A:{b:true,c:123,D:{e:true}},f:true}, 'complexBool', {_meta:{}, ... kind:'boolean'}})`,
        v.object({A:{b:true,c:123,D:{e:true}},f:true}, 'complexBool', {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'boolean'},
            D:{_meta:{},e:{kind:'boolean'}}},f:{kind:'boolean'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'complexBool.A.c' is type 'number' not 'boolean'`);
    et(`v.object({f:false,A:{c:true,b:false,D:{E:true}}}, undefined, {_meta:{}, ... kind:'boolean'}})`,
        v.object({f:false,A:{c:true,b:false,D:{E:true}}}, undefined, {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'boolean'},
            D:{_meta:{},e:{kind:'boolean'}}},f:{kind:'boolean'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'A.D.e' of a value is type 'undefined' not 'boolean'`);

    // Instanceof ok.
    class EmptyClass {};
    const emptyClassInst = new EmptyClass();
    et(`v.object(emptyClassInst, 'emptyClassInst', {_meta:{}})`,
        v.object(emptyClassInst, 'emptyClassInst', {_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object(emptyClassInst, 'emptyClassInst', {_meta:{inst:EmptyClass}})`,
        v.object(emptyClassInst, 'emptyClassInst', {_meta:{inst:EmptyClass}})).is(true);
    et(`v.err`, v.err).is(null);

    // Instanceof invalid.
    et(`v.object({}, 'plainObject', {_meta:{inst:EmptyClass}})`,
        v.object({}, 'plainObject', {_meta:{inst:EmptyClass}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'plainObject' is not an instance of 'EmptyClass'`);
    class FooBarClass { foo = 'bar' };
    const fooBarClassInst = new FooBarClass();
    et(`v.object(fooBarClassInst, 'fooBarClassInst', {_meta:{inst:EmptyClass}})`,
        v.object(fooBarClassInst, 'fooBarClassInst', {_meta:{inst:EmptyClass}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'fooBarClassInst' is not an instance of 'EmptyClass'`);
    et(`v.object(fooBarClassInst, null, {_meta:{inst:EmptyClass}})`,
        v.object(fooBarClassInst, null, {_meta:{inst:EmptyClass}})).is(false);
    et(`v.err`, v.err).is(`obj(): the top level object is not an instance of 'EmptyClass'`);
    et(`v.object({ bar:fooBarClassInst }, 'foo', {_meta:{}, bar:{_meta:{inst:EmptyClass}}})`,
        v.object({ bar:fooBarClassInst }, 'foo', {_meta:{}, bar:{_meta:{inst:EmptyClass}}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'foo.bar' is not an instance of 'EmptyClass'`);
    et(`v.object({ bar:fooBarClassInst }, null, {_meta:{}, bar:{_meta:{inst:EmptyClass}}})`,
        v.object({ bar:fooBarClassInst }, null, {_meta:{}, bar:{_meta:{inst:EmptyClass}}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'bar' of the top level object is not an instance of 'EmptyClass'`);

    // Integer ok.
    et(`v.object({basic:1}, 'minMaxInt', {basic:{kind:'integer',min:1,max:1},_meta:{}})`,
        v.object({basic:1}, 'minMaxInt', {basic:{kind:'integer',min:1,max:1},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({basic:1}, 'ruleInt', {basic:{kind:'integer',rule:{test:n=>n==1}},_meta:{}})`,
        v.object({basic:1}, 'ruleInt', {basic:{kind:'integer',rule:{test:n=>n==1}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({basic:1}, 'setInt', {basic:{kind:'integer',set:[-4,1,77]},_meta:{}})`,
        v.object({basic:1}, 'setInt', {basic:{kind:'integer',set:[-4,1,77]},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({foo:{bar:44}}, undefined, {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:44}}, undefined, {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({}, 'hasFooFallback', {foo:{fallback:0,kind:'integer'},_meta:{}})`,
        v.object({}, 'hasFooFallback', {foo:{fallback:0,kind:'integer'},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({A:{b:0,c:1,D:{e:-2}},f:9e9}, 'complexInt', {_meta:{}, ... kind:'integer'}})`,
        v.object({A:{b:0,c:1,D:{e:-2}},f:9e9}, 'complexInt', {
            _meta:{},A:{_meta:{},b:{kind:'integer'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'integer'}}},f:{kind:'integer'}
        })).is(true);
    et(`v.err`, v.err).is(null);

    // Integer invalid.
    et(`v.object({basic:2}, 'minMaxInt', {basic:{kind:'integer',min:1,max:1},_meta:{}})`,
        v.object({basic:2}, 'minMaxInt', {basic:{kind:'integer',min:1,max:1},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'minMaxInt.basic' 2 is > 1`);
    et(`v.object({basic:0}, undefined, {basic:{kind:'integer',min:1,max:1},_meta:{}})`,
        v.object({basic:0}, undefined, {basic:{kind:'integer',min:1,max:1},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'basic' of a value 0 is < 1`);
    et(`v.object({basic:1.5}, 'ruleInt', {basic:{kind:'integer',rule:{test:n=>n==1}},_meta:{}})`,
        v.object({basic:1.5}, 'ruleInt', {basic:{kind:'integer',rule:{test:n=>n==1}},_meta:{}})).is(false);
    et(`v.err`, v.err).passes(/^obj\(\): 'ruleInt\.basic' 1\.5 fails /);
    et(`v.object({basic:1}, undefined, {basic:{kind:'integer',rule:{test:n=>n<-99999999||n>5555555}},_meta:{}})`,
        v.object({basic:1}, undefined, {basic:{kind:'integer',rule:{test:n=>n<-99999999||n>5555555}},_meta:{}})).is(false);
    et(`v.err`, v.err).passes(/^obj\(\): 'basic' of a value 1 fails /);
    et(`v.object({basic:1}, 'setInt', {basic:{kind:'integer',set:[-44444444,0,77777777]},_meta:{}})`,
        v.object({basic:1}, 'setInt', {basic:{kind:'integer',set:[-44444444,0,77777777]},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'setInt.basic' 1 is not in [-44444444,0...7777]`);
    et(`v.object({basic:0}, undefined, {basic:{kind:'integer',set:[-4,1,77]},_meta:{}})`,
        v.object({basic:0}, undefined, {basic:{kind:'integer',set:[-4,1,77]},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'basic' of a value 0 is not in [-4,1,77]`);
    et(`v.object({foo:{bar:'44'}}, 'nestedInt', {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:'44'}}, 'nestedInt', {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'nestedInt.foo.bar' is type 'string' not 'number'`);
    et(`v.object({foo:{bar:44.444}}, undefined, {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:44.444}}, undefined, {foo:{bar:{kind:'integer'},_meta:{}},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'foo.bar' of a value 44.444 is not an integer`);
    et(`v.object({foo:-0.001}, 'hasFooFallback', {foo:{fallback:0,kind:'integer'},_meta:{}})`,
        v.object({foo:-0.001}, 'hasFooFallback', {foo:{fallback:0,kind:'integer'},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'hasFooFallback.foo' -0.001 is not an integer`);
    et(`v.object({A:{b:0,c:1,D:{e:-2}},f:9e-9}, 'complexInt', {_meta:{}, ... kind:'integer'}})`,
        v.object({A:{b:0,c:1,D:{e:[]}},f:9e9}, 'complexInt', {
            _meta:{},A:{_meta:{},b:{kind:'integer'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'integer'}}},f:{kind:'integer'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'complexInt.A.D.e' is an array not type 'number'`);
    et(`v.object({A:{b:0,c:1,D:{e:-2}},f:9e-9}, undefined, {_meta:{}, ... kind:'integer'}})`,
        v.object({A:{b:0,c:1,D:{e:-2}},f:9e-9}, undefined, {
            _meta:{},A:{_meta:{},b:{kind:'integer'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'integer'}}},f:{kind:'integer'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'f' of a value 9e-9 is not an integer`);

    // Number ok.
    et(`v.object({basic:-888.8}, 'maxNum', {basic:{kind:'number',max:-33.3},_meta:{}})`,
        v.object({basic:-888.8}, 'maxNum', {basic:{kind:'number',max:-33.3},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({basic:-55.555}, 'minNum', {basic:{kind:'number',min:-99},_meta:{}})`,
        v.object({basic:-55.555}, 'minNum', {basic:{kind:'number',min:-99},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({basic:1.23}, 'ruleNum', {basic:{kind:'number',rule:{test:n=>n>1.2&&n<1.3}},_meta:{}})`,
        v.object({basic:1.23}, 'ruleNum', {basic:{kind:'number',rule:{test:n=>n>1.2&&n<1.3}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({foo:{bar:-0}}, undefined, {foo:{bar:{kind:'number',set:[0]},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:-0}}, undefined, {foo:{bar:{kind:'number',set:[0]},_meta:{}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({foo:{}}, 'hasFooBarFallback', {foo:{bar:{kind:'number',fallback:-9.876},_meta:{}},_meta:{}})`,
        v.object({foo:{}}, 'hasFooBarFallback', {foo:{bar:{kind:'number',fallback:-9.876},_meta:{}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({A:{b:0,c:-Infinity,D:{e:-2.2222}},f:9e9}, 'complexNum', {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:0,c:-Infinity,D:{e:-2.2222}},f:9e9}, 'complexNum', {
            _meta:{},A:{_meta:{},b:{kind:'number'},c:{kind:'number'},
            D:{_meta:{},e:{kind:'number'}}},f:{kind:'number'}
        })).is(true);
    et(`v.err`, v.err).is(null);

    // Number invalid.
    et(`v.object({basic:-8.8}, 'maxNum', {basic:{kind:'number',max:-33.3},_meta:{}})`,
        v.object({basic:-8.8}, 'maxNum', {basic:{kind:'number',max:-33.3},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'maxNum.basic' -8.8 is > -33.3`);
    et(`v.object({basic:-Infinity}, undefined, {basic:{kind:'number',min:-99},_meta:{}})`,
        v.object({basic:-Infinity}, undefined, {basic:{kind:'number',min:-99},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'basic' of a value -Infinity is < -99`);
    et(`v.object({basic:1.3}, 'ruleNum', {basic:{kind:'number',rule:{test:n=>n>1.2&&n<1.3}},_meta:{}})`,
        v.object({basic:1.3}, 'ruleNum', {basic:{kind:'number',rule:{test:n=>n>1.2&&n<1.3}},_meta:{}})).is(false);
    et(`v.err`, v.err).passes(/^obj\(\): 'ruleNum\.basic' 1\.3 fails /);
    et(`v.object({foo:{bar:0}}, undefined, {foo:{bar:{kind:'number',set:[-0.0001]},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:-0}}, undefined, {foo:{bar:{kind:'number',set:[]},_meta:{}},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'foo.bar' of a value 0 is not in []`);
    et(`v.object({foo:{bar:{}}}, 'hasFooBarFallback', {foo:{bar:{kind:'number',fallback:-9.876},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:{}}}, 'hasFooBarFallback', {foo:{bar:{kind:'number',fallback:-9.876},_meta:{}},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'hasFooBarFallback.foo.bar' is type 'object' not 'number'`);
    et(`v.object({A:null}, 'numstedNum', {_meta:{},A:{_meta:{},b:{kind:'number'}}})`,
        v.object({A:null}, 'numstedNum', {_meta:{},A:{_meta:{},b:{kind:'number'}}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'numstedNum.A' is null not an object`);
    et(`v.object({A:{b:0,c:-Infinity,D:[]},f:9e9}, 'complexNum', {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:0,c:-Infinity,D:[]},f:9e9}, 'complexNum', {
            _meta:{},A:{_meta:{},b:{kind:'number'},c:{kind:'number'},
            D:{_meta:{},e:{kind:'number'}}},f:{kind:'number'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'complexNum.A.D' is an array not an object`);
    et(`v.object({A:{b:0,c:-Infinity,D:1},f:9e9}, undefined, {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:0,c:-Infinity,D:1},f:9e9}, undefined, {
            _meta:{},A:{_meta:{},b:{kind:'number'},c:{kind:'number'},
            D:{_meta:{},e:{kind:'number'}}},f:{kind:'number'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'A.D' of a value is type 'number' not an object`);

    // String ok.
    et(`v.object({a:'a'}, 'minMaxStr', {a:{kind:'string',min:1,max:1},_meta:{}})`,
        v.object({a:'a'}, 'minMaxStr', {a:{kind:'string',min:1,max:1},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({a:'a'}, 'ruleStr', {a:{kind:'string',rule:{test:s=>s=='a'}},_meta:{}})`,
        v.object({a:'a'}, 'ruleStr', {a:{kind:'string',rule:{test:s=>s=='a'}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({a:'a'}, 'setStr', {a:{kind:'string',set:['a','b','c']},_meta:{}})`,
        v.object({a:'a'}, 'setStr', {a:{kind:'string',set:['a','b','c']},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({foo:{bar:'a',baz:'b'}}, undefined, {foo:{bar:{kind:'string'},baz:{kind:'string'},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:'a',baz:'b'}}, undefined, {foo:{bar:{kind:'string'},baz:{kind:'string'},_meta:{}},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({}, 'hasFooFallback', {foo:{fallback:'a',kind:'string'},_meta:{}})`,
        v.object({}, 'hasFooFallback', {foo:{fallback:'a',kind:'string'},_meta:{}})).is(true);
    et(`v.err`, v.err).is(null);
    et(`v.object({A:{b:'b',c:'c',D:{e:'e'}},f:''}, 'complexStr', {_meta:{}, ... kind:'string'}})`,
        v.object({A:{b:'b',c:'c',D:{e:'e'}},f:''}, 'complexStr', {
            _meta:{},A:{_meta:{},b:{kind:'string'},c:{kind:'string'},
            D:{_meta:{},e:{kind:'string'}}},f:{kind:'string'}
        })).is(true);
    et(`v.err`, v.err).is(null);

    // String invalid.
    et(`v.object({a:''}, 'minMaxStr', {a:{kind:'string',min:1,max:1},_meta:{}})`,
        v.object({a:''}, 'minMaxStr', {a:{kind:'string',min:1,max:1},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'minMaxStr.a' length 0 is < 1`);
    et(`v.object({a:'abc'}, undefined, {a:{kind:'string',min:1,max:1},_meta:{}})`,
        v.object({a:'abc'}, undefined, {a:{kind:'string',min:1,max:1},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'a' of a value length 3 is > 1`);
    et(`v.object({a:'A'}, 'ruleStr', {a:{kind:'string',rule:{test:s=>s=='a'}},_meta:{}})`,
        v.object({a:'A'}, 'ruleStr', {a:{kind:'string',rule:{test:s=>s=='a'}},_meta:{}})).is(false);
    et(`v.err`, v.err).passes(/^obj\(\): 'ruleStr.a' "A" fails /);
    et(`v.object({a:'d'}, undefined, {a:{kind:'string',set:['a','b','c']},_meta:{}})`,
        v.object({a:'d'}, undefined, {a:{kind:'string',set:['a','b','c']},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'a' of a value "d" is not in [a,b,c]`);
    et(`v.object({foo:{bar:'a',baz:[]}}, 'nestedStr', {foo:{bar:{kind:'string'},baz:{kind:'string'},_meta:{}},_meta:{}})`,
        v.object({foo:{bar:'a',baz:[]}}, 'nestedStr', {foo:{bar:{kind:'string'},baz:{kind:'string'},_meta:{}},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'nestedStr.foo.baz' is an array not type 'string'`);
    et(`v.object({foo:true}, 'hasFooFallback', {foo:{fallback:'a',kind:'string'},_meta:{}})`,
        v.object({foo:true}, 'hasFooFallback', {foo:{fallback:'a',kind:'string'},_meta:{}})).is(false);
    et(`v.err`, v.err).is(`obj(): 'hasFooFallback.foo' is type 'boolean' not 'string'`);
    et(`v.object({A:{b:'b',c:'c',D:{e:undefined}},f:''}, 'complexStr', {_meta:{}, ... kind:'string'}})`,
        v.object({A:{b:'b',c:'c',D:{e:undefined}},f:''}, 'complexStr', {
            _meta:{},A:{_meta:{},b:{kind:'string'},c:{kind:'string'},
            D:{_meta:{},e:{kind:'string'}}},f:{kind:'string'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'complexStr.A.D.e' is type 'undefined' not 'string'`);

    // Mixed ok.
    et(`v.object({A:{b:false,c:-9,D:{e:''}},f:1e-3}, 'complexNum', {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:false,c:-9,D:{e:''}},f:1e-3}, 'complexNum', {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'string'}}},f:{kind:'number'}
        })).is(true);
    et(`v.err`, v.err).is(null);

    // Mixed invalid.
    et(`v.object({A:{b:null,c:-9,D:{e:''}},f:1e-3}, 'complexNum', {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:null,c:-9,D:{e:''}},f:1e-3}, 'complexNum', {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'string'}}},f:{kind:'number'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'complexNum.A.b' is null not type 'boolean'`);
    et(`v.object({A:{b:false,c:1.1,D:{e:''}},f:1e-3}, undefined, {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:false,c:1.1,D:{e:''}},f:1e-3}, undefined, {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'string'}}},f:{kind:'number'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'A.c' of a value 1.1 is not an integer`);
    et(`v.object({A:{b:false,c:-9,D:{e:{}}},f:1e-3}, 'complexNum', {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:false,c:-9,D:{e:{}}},f:1e-3}, 'complexNum', {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'string'}}},f:{kind:'number'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'complexNum.A.D.e' is type 'object' not 'string'`);
    et(`v.object({A:{b:false,c:-9,D:{e:''}},f:[]}, undefined, {_meta:{}, ... kind:'number'}})`,
        v.object({A:{b:false,c:-9,D:{e:''}},f:[]}, undefined, {
            _meta:{},A:{_meta:{},b:{kind:'boolean'},c:{kind:'integer'},
            D:{_meta:{},e:{kind:'string'}}},f:{kind:'number'}
        })).is(false);
    et(`v.err`, v.err).is(`obj(): 'f' of a value is an array not type 'number'`);

}
