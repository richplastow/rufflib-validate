// Configuration, used by `rollup -c` during `npm run build`.

import { homepage, description, license, name, version } from './package.json';
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
        input: 'src/main.js',
        output: {
            banner,
            file: 'dist/rufflib-validate.es.js',
            format: 'es',
        }
    },
    {
        input: 'dist/rufflib-validate.es.js',
        output: {
            file: 'dist/rufflib-validate.umd.es5.min.js',
            format: 'umd',
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
        input: 'src/main-test.js',
        output: {
            banner: banner.replace(' * ', ' * Unit tests for '),
            file: 'docs/test/rufflib-validate-test.es.js',
            format: 'es',
        }
    },
    {
        input: 'docs/test/rufflib-validate-test.es.js',
        output: {
            file: 'docs/test/rufflib-validate-test.umd.js',
            format: 'umd',
            name: 'rufflib.validate.test' // `rufflib.validate.test(expect, Validate)`
        },
        // See https://babeljs.io/docs/en/babel-preset-env
        plugins: [babel({ babelHelpers: 'bundled' })]
    }

];
