# RuffLIB Validate

__A RuffLIB library for succinctly validating JavaScript values.__

▶&nbsp; __Version:__ 2.0.4  
▶&nbsp; __Homepage:__ <https://richplastow.com/rufflib-validate>  
▶&nbsp; __NPM:__ <https://www.npmjs.com/package/rufflib-validate>  
▶&nbsp; __Repo:__ <https://github.com/richplastow/rufflib-validate>  
▶&nbsp; __Tests:__ <https://richplastow.com/rufflib-validate/test/run-browser-tests.html>  


### Typical usage:

```js
import Validate from 'rufflib-validate';

function sayOk(n, allowInvalid) {
    const v = new Validate('sayOk()', allowInvalid);
    if (!v.number(n, 'n', 100)) return v.err;
    return 'ok!';
}

sayOk(123); // ok!
sayOk(null); // sayOk(): 'n' is null not type 'number'
sayOk(3); // 'n' 3 is < 100
sayOk(3, true); // ok! (less safe, but faster)
```


## Dev, Test and Build

Run the test suite in ‘src/docs/’, while working on this library:  
`npm test --src`  
`npm start --src --open --test`  

Build the minified and unminified bundles in ‘dist/’ and ‘docs/’:  
`npm run build`

Run the test suite in ‘docs/’, after a build:  
`npm test`  
`npm start --open --test`  
