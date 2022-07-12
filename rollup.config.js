// Configuration, used by `rollup -c` during `npm run build`.

import { homepage, description, license, name, version }
    from './package.json';
import copy from 'rollup-plugin-copy';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const banner = `/**\n`
    + ` * ${name} ${version}\n` // will be ' * Unit tests for ...' in test files
    + ` * ${description}\n`
    + ` * ${homepage}\n`
    + ` * @license ${license}\n`
    + ` */\n\n`;

export default [

    // Build Validate’s distribution files. Tree-shaking should remove all tests.
    {
        input: 'src/entry-point-main.js',
        output: {
            banner,
            file: 'docs/dist/rufflib-validate.es.js',
            format: 'es', // eg for `node docs/run-nodejs-tests.js`
        }
    },
    {
        input: 'docs/dist/rufflib-validate.es.js',
        output: {
            file: 'docs/dist/rufflib-validate.umd.es5.min.js',
            format: 'umd', // eg for `docs/index.html` in legacy browsers
            name: 'rufflib.validate.main', // `var Validate = rufflib.validate.main`
        },
        // See https://babeljs.io/docs/en/babel-preset-env
        // and https://github.com/terser/terser#minify-options
        plugins: [
            babel({ babelHelpers: 'bundled' }),
            terser({ keep_classnames:true })
        ]
    },

    // Build unit test distribution files.
    {
        input: 'src/entry-point-for-tests.js',
        output: {
            banner: banner.replace(' * ', ' * Unit tests for '),
            file: 'docs/dist/rufflib-validate-test.es.js',
            format: 'es', // eg for `node docs/run-nodejs-tests.js`
        }
    },
    {
        input: 'docs/dist/rufflib-validate-test.es.js',
        output: {
            file: 'docs/dist/rufflib-validate-test.umd.js',
            format: 'umd', // eg for `docs/run-browser-tests.html` in legacy browsers
            name: 'rufflib.validate.test' // `rufflib.validate.test(validate, Expect)`
        },
        // See https://babeljs.io/docs/en/babel-preset-env
        plugins: [
            babel({ babelHelpers: 'bundled' }),
            copy({
                targets: [{
                    src: 'node_modules/rufflib-expect/docs/dist/rufflib-expect.umd.es5.min.js',
                    dest: 'docs/lib'
                }]
            })
        ]
    }

];
