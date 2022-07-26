// rufflib-validate/src/main-test.js
// (compare with rufflib-validate/main-test.js)

// Entry point for running the unit tests in Validate’s source files.
// Also used for building Validate’s unit test distribution files.

import { test as testValidate } from './validate.js';

import { test as testArray } from './methods/array.js';
import { test as testBoolean } from './methods/boolean.js';
import { test as testClass } from './methods/class.js';
import { test as testInteger } from './methods/integer.js';
import { test as testNumber } from './methods/number.js';
import { test as testObject } from './methods/object.js';
import { test as testSchema } from './methods/schema.js';
import { test as testString } from './methods/string.js';

// Run each test. You can comment-out some during development, to help focus on
// individual tests. But make sure all tests are uncommented before committing.
export default function validateTest(expect, Validate) {

    testValidate(expect, Validate);

    testArray(expect, Validate);
    testBoolean(expect, Validate);
    testClass(expect, Validate);
    testInteger(expect, Validate);
    testNumber(expect, Validate);
    testObject(expect, Validate);
    testSchema(expect, Validate);
    testString(expect, Validate);

}
