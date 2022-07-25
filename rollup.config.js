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
            file: 'dist/rufflib-validate.es.js', // a copy of this is used by...
            format: 'es', // ...`docs/run-nodejs-tests.js`
        }
    },
    {
        input: 'dist/rufflib-validate.es.js',
        output: {
            file: 'dist/rufflib-validate.umd.es5.min.js', // a copy of this is used by...
            format: 'umd', // ...`docs/run-browser-tests.html`
            name: 'rufflib.validate.main', // `var Validate = rufflib.validate.main`
        },
        // See https://babeljs.io/docs/en/babel-preset-env
        // and https://github.com/terser/terser#minify-options
        plugins: [
            babel({ babelHelpers: 'bundled' }),
            terser({ keep_classnames:true })
        ]
    },

    // Build unit test files.
    {
        input: 'src/entry-point-for-tests.js',
        output: {
            banner: banner.replace(' * ', ' * Unit tests for '),
            file: 'docs/test/rufflib-validate-test.es.js', // this is used by...
            format: 'es', // ...`docs/run-nodejs-tests.js`
        }
    },
    {
        input: 'docs/test/rufflib-validate-test.es.js',
        output: {
            file: 'docs/test/rufflib-validate-test.umd.js', // this is used by...
            format: 'umd', // ...`docs/run-browser-tests.html` in legacy browsers
            name: 'rufflib.validate.test' // `rufflib.validate.test(expect, Validate)`
        },
        // See https://babeljs.io/docs/en/babel-preset-env
        plugins: [
            babel({ babelHelpers: 'bundled' }),
            copy({
                outputFolder: 'docs/test',
                targets: [
                    'node_modules/rufflib-expect/dist/rufflib-expect.umd.es5.min.js',
                ]
            })
        ]
    }

];
