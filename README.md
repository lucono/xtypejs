# xtypejs [![Build Status](https://travis-ci.org/lucono/xtypejs.svg?branch=master)](https://travis-ci.org/lucono/xtypejs)

*xtypejs* extends the standard JavaScript types with new data-validating pseudo types, while also normalizing all the irregularities of working with JavaScript types. With data-validating pseudo types, it unifies type checking and some of the most commonly required basic data validations in JavaScript applications, into a single concise and efficient operation.

It is fast and robust, internally employing bitwise operations and memory-efficient memoization techniques to provide good overall performance in small, medium and large applications and libraries.

## Features

* Implements a rich set of intuitive data-validating pseudo-types.
* Determines the simple, extended, or custom type of any value.
* Supports compounding of existing types to produce custom new data-validating types.
* Supports instance types to provide broader, more complex type and data validation checks. 
* Very flexible, with custom name schemes and other library options.
* Supports CommonJS and AMD environments, as well as regular HTML script tag.
* High performance, with no dependencies.
* Well tested and documented.


## Installation

### npm

```
npm install xtypejs --save
```

**From github**

```
npm install git://github.com/lucono/xtypejs.git
```

### bower

```
bower install xtypejs --save
```
  
**From github**

```
bower install git://github.com/lucono/xtypejs.git
```


## Supported Types
  
 | | | |
-------------------------- | ---------------------- | ----------------------- | -----------------
**Basic**                  | **String**             | **Number**              | `positive_integer`
`null`                     | `string`               | `number`                | `negative_integer`
`undefined`                | `whitespace`           | `integer`               | `positive_float`
`nan`                      | `single_char_string`   | `float`                 | `negative_float`
`symbol`                   | `multi_char_string`    | `positive_number`       | `positive_infinity`
`function`                 | `empty_string`         | `negative_number`       | `negative_infinity`
`date`                     | `blank_string`         | `infinite_number`       | `non_positive_number`
`error`                    | `non_empty_string`     | `zero`                  | `non_negative_number`
`regexp`                   | `non_blank_string`     | `non_zero_number`       | `non_infinite_number`
**Object**                 | **Array**              | **Boolean**             | **Other**
`object`                   | `array`                | `boolean`               | `primitive`
`empty_object`             | `empty_array`          | `true`                  | `nothing`
`single_prop_object`       | `single_elem_array`    | `false`                 | `any`
`multi_prop_object`        | `multi_elem_array`     |                         | `none`
`non_empty_object`         | `non_empty_array`      |                         |   

There are also *Instance Types*, which include any constructor function, and *Custom Types*, which can be derived from various combinations of the *xtypejs* built-in types.
  
**More on the supported types at** ***[xtype.js.org](http://xtype.js.org)*** &nbsp; &lArr;


## Sample Usage

```js
/* Importing the library */

var xtype = require('xtypejs');         // (node.js). See docs for AMD and others.
```

```js
/* Getting the simple type of a value */

xtype.type(null)          === 'null';
xtype.type(undefined)     === 'undefined';
xtype.type(NaN)           === 'nan';
xtype.type([])            === 'array';
xtype.type({})            === 'object';
xtype.type(new Date())    === 'date';
xtype.type(function() {}) === 'function';
```

```js
/* Getting the extended type of a value */

xtype(5)      === 'positive_integer';    // Value is number, positive and integer
xtype('')     === 'empty_string';        // Value is string and empty
xtype({})     === 'empty_object';        // Value is object and has no properties

/*
 * Every type also has a corresponding compact name. So switching to the
 * compact name scheme, a less verbose equivalent of the type checks above:
 */

xtype(5)      === 'int+';               // 'int+' is same as 'positive_integer'
xtype('')     === 'str0';               // 'str0' is same as 'empty_string'
xtype({})     === 'obj0';               // 'obj0' is same as 'empty_object'
```

```js
/* Validate sets of values */

xtype.none.isNan(7, 2.5, NaN, 0, -5)        === false;
xtype.any.isZero(7, 2.5, NaN, 0, -5)        === true;
xtype.all.isPositiveInteger(3, 5.1, 7)      === false;

xtype.some.isFloat(3, 5.5, 7)               === true;       // Some but not all are float
xtype.some.isFloat(2.5, 8.5, 2.1)           === false;      // All are float, not some
xtype.all.isNonZeroNumber(4, -20, 8.5)      === true;
```

```js
/* Return true if data is any of several types */
    
xtype.is(data, 'non_empty_object, single_elem_array, positive_integer');
    
/* OR using compact name scheme: */
    
xtype.is(data, '-obj0 arr1 int+');

/*
 * Display a product using a received value that must be a product
 * name string, a product Id number, or an actual product instance.
 */
    
if (! xtype.is(value, [xtype.MULTI_CHAR_STRING, xtype.POSITIVE_INTEGER, Product])) {
    // Handle cannot display product
}
```

```js
/*
 * Switch on the result of xtype.which() to handle only valid input scenarios
 * without first performing extensive type checking and data validations.
 */
  
switch (xtype.which(value, ['multi_char_string', 'positive_integer', Product])) {

    case 'multi_char_string':
        // Fetch and display product using value as the product name
        
    case 'positive_integer':
        // Fetch and display product using value as the product id
        
    case Product:
        // value is a Product object, so just display it
        
    default:
        // Handle invalid value.. cannot display product
}
```
  
**See more usage and examples at** ***[xtype.js.org](http://xtype.js.org)*** &nbsp; &lArr;


## API

*xtypejs* comes with a comprehensive and intuitive API which provides validations, normalized type checking, customization and configuration, as well as extensibility to suit the specific needs of any application.
  
**See the API docs at** ***[xtype.js.org](http://xtype.js.org)*** &nbsp; &lArr;


## Building

To build the project, clone it locally and run the following command:

```
npm install && grunt build
```

This will install the dev dependencies and then build the library, generating a `dist` directory under the project root, containing the source and minified versions and associated source map file for *xtypejs*. To not bundle the compact name scheme in the final minified version, set the `$XTYPE_JS_BUNDLE_COMPACT_NAME_SCHEME$` global def variable to `false` in the uglify options of the `Gruntfile` before building the project.


## Testing

There are comprehensive tests that cover almost every aspect of the *xtypejs* functionality. The link below can also be used to view and run the tests directly in the browser for the current head version of the library.

For more comprehensive tests with reports, including js lint and code coverage reports, you can clone the project and run the tests. The following command will install the dev dependencies and run the tests:

```
npm install && npm test
```

After installing the dependencies, this will first build the library, generating a `dist` directory under the project root, containing minified and source versions of the library, as well as a source map file. It will then perform the following actions:

* Creates a `build` directory under the project root directory.
* Runs js linting on the source version of *xtypejs* in the `dist` directory and generates an HTML report under the `build` directory.
* Runs the Jasmine spec tests for the source library in node.
* Runs the Jasmine spec tests for the minified library in node.
* Runs the Jasmine spec tests and code coverage for the source library in chrome.
* Runs the Jasmine spec tests and code coverage for the source library in firefox.
* Runs the Jasmine spec tests for the minified library in chrome.
* Runs the Jasmine spec tests for the minified library in firefox.

HTML reports are generated under the `build` directory for the js linting results, the jasmine tests for the source and minified libraries in chrome and firefox, and the code coverage reports for the source library in chrome and firefox.

**Run the tests directly in your browser** ***[here](https://rawgit.com/lucono/xtypejs/master/test/index.html)*** &nbsp; &lArr;


## Dependencies

*xtypejs* has no dependencies.


## Notes

#### Source vs. Minified version

*xtypejs* is implemented as a single file, which can be used with or without prior minification in both CommonJS and AMD based environments, as well as in a browser via regular script tag.


## License

Licensed under the terms of the MIT license.

**See full license** ***[here](https://github.com/lucono/xtypejs/blob/master/LICENSE)*** &nbsp; &lArr;
