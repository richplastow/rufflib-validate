// rufflib-validate/src/methods/_validateAgainstSchema.js

import { A, B, I, N, O, S, U } from '../constants.js';

// Private method which runs recursive validation based on a `schema` object.
export default function _validateAgainstSchema(
    obj,     // the object to validate
    name,    // the `name` argument, passed in to the `object()` method
    schema,  // the schema to validate against
    path=[], // builds up a list of properties, as `_validateAgainstSchema()` recurses
) {

    // Validate each key/value pair.
    for (let key in schema) {
        if (key === '_meta') continue; // ignore the special `_meta` property

        // Get handy shortcuts to the value to validate, and the schema object
        // used to validate it.
        const value = obj[key];
        const tv = typeof value;
        const sch = schema[key];

        // Call `_validateAgainstSchema()` recursively if this is a sub-schema.
        if (sch._meta) {
            if (value === null || tv !== O || Array.isArray(value)) {
                const fName = formatName(name, path, key);
                const n = fName.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
                    ? fName
                    : `'${fName}'`
                ;
                const type = value === null
                    ? 'null'
                    : tv !== O
                        ? `type '${tv}'`
                        : 'an array'
                ;
                this.err = `${this.prefix}: ${n} is ${type} not an object`;
                return false;
            }
            if (! this._validateAgainstSchema(value, name, sch, path.concat(key))) return false;
            continue;
        }

        // Skip validation if a fallback exists and the value is undefined.
        const tf = typeof sch.fallback;
        const tfnu = tf !== U;
        const tvu = tv === U;
        if (tfnu && tvu) continue;

        // Format the name.
        // @TODO improve the logic so `type()` doesn’t have to check for " of a value"
        const fName = formatName(name, path, key);

        // Deal with a value definition.
        switch (sch.kind) {
            case A: // array
                return '@TODO array';
            case B: // boolean
                if (! this.boolean(value, fName)) return false;
                continue;
            case I: // integer
            case N: // number
            case S: // string
                const tmaxnu = typeof sch.max !== U;
                const tminnu = typeof sch.min !== U;
                if (tmaxnu && tminnu) { // specifies min and max
                    if (! this[sch.kind](value, fName, sch.min, sch.max)) return false;
                } else if (tminnu) { // just specifies a minimum value
                    if (! this[sch.kind](value, fName, sch.min)) return false;
                } else if (tmaxnu) { // just specifies maximum value
                    if (! this[sch.kind](value, fName, undefined, sch.max)) return false;
                } else if (sch.rule) { // just specifies a rule (an object containing a `test()`)
                    if (! this[sch.kind](value, fName, sch.rule)) return false;
                } else if (sch.set) { // just specifies an array of valid values
                    if (! this[sch.kind](value, fName, sch.set)) return false;
                } else { // no qualifiers
                    if (! this[sch.kind](value, fName)) return false;
                }
                continue;
            default:
                this.err = 'oops!!';
                throw Error(this.err);
        }
    }

    return true; // signifies that `obj` is valid
}

function formatName(name, path, key) {
    const pk = path.concat(key).join('.');
    if (typeof name === U)
        return `'${pk}' of a value`
    return `${name}.${pk}`
}
