// rufflib-validate/src/methods/_type.js

// Private method which runs simple validation based on `typeof`.
export default function _type(value, name, typeStr) {
    const type = typeof value;
    if (type === typeStr) return true;
    const n = typeof name === 'string'
        ? name.slice(-11) === ' of a value' // @TODO improve this slow and arbitrary hack!
            ? name
            : `'${name}'`
        : 'a value'
    ;
    this.err = value === null
        ? `${this.prefix}: ${n} is null not type '${typeStr}'`
        : Array.isArray(value)
            ? `${this.prefix}: ${n} is an array not type '${typeStr}'`
            : `${this.prefix}: ${n} is type '${type}' not '${typeStr}'`
    ;
    return false;
}
