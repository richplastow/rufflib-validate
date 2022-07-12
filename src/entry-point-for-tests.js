// rufflib-validate/src/entry-point-for-tests.js

// Entry point for running the unit tests in Validate’s source files.
// Also used for building Validate’s unit test distribution files.

import { test as testValidate } from './validate.js';

// Run each test. You can comment-out some during development, to help focus on
// individual tests. But make sure all tests are uncommented before committing.
export default function validateTest(expect, Validate) {

    testValidate(expect, Validate);

}
