// rufflib-validate/src/run-nodejs-tests.js

/* ----------------------------- Imports and Env ---------------------------- */

import Expect from 'rufflib-expect';
import Validate from './main.js';
import validateTest from './main-test.js';

// `npm test --full` means we should show full test results.
const showFullResults = !! process.env.npm_config_full;

// `npm test --section=foo` means we should only run sections containing "foo".
const sectionMustContain = process.env.npm_config_section || '';


/* --------------------------------- Tests ---------------------------------- */

// Ensure that Validate.VERSION matches the current package.json version.
if (Validate.VERSION !== process.env.npm_package_version) throw Error(
    `Validate.VERSION '${Validate.VERSION}' !== package.json version`);

// Run the test suite.
const expect = new Expect('Validate Test Suite (src, NodeJS)');
validateTest(expect, Validate);

// Display the results.
console.log(expect.render('Ansi', sectionMustContain, showFullResults));

// Display handy hints.
console.log(`Hint: omit '--src' to run tests in docs/`);
console.log(`Hint: ${showFullResults ? 'omit' : 'use'} '--full' to ${
    showFullResults ? 'hide' : 'show'} full test results`);
console.log(`Hint: ${sectionMustContain ? 'omit' : 'use'} '--section=${
    sectionMustContain || 'foo'}' to ${
    sectionMustContain
        ? `stop filtering section titles using "${sectionMustContain}"`
        : 'show only sections with titles containing "foo"'}`
);

// Set the exit code to `0` if the test suite passed, which signifies that this
// script terminated without error. Otherwise set the exit code to `1`, which
// could be used to halt a CI/CD pipeline.
process.exit(expect.status === 'pass' ? 0 : 1);
