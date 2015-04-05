# xtypejs [![Build Status](https://travis-ci.org/lucono/xtypejs.svg?branch=master)](https://travis-ci.org/lucono/xtypejs)

*xtypejs* is a JavaScript extended type and basic data validation library that enables concise and efficient verification of JavaScript values by using data-validating pseudo types that unify both the type checking and some of the most commonly required basic data validation checks in JavaScript applications into a single, concise and efficient operation.

It is fast and robust, internally employing bitwise operations and memory-efficient memoization techniques to provide good overall performance in small, medium and large applications and libraries.

## Features

* Determines the simple, extended, or custom type of any value.
* Implements a rich set of intuitive data-validating types for different types of values.
* Supports compounding of existing types to produce custom new data-validating types.
* Supports instance types to provide broader, more complex type and data validation checks. 
* Very flexible, with custom name schemes and other library options.
* Supports CommonJS and AMD environments, as well as regular HTML script tag.
* High performance, with no dependencies.
* Well tested and documented.


## Installation

```
npm install xtypejs --save
```
From github:

```
npm install git://github.com/lucono/xtypejs.git
```


## Supported Types
  
 | | 
-------------------------- | ---------------------- | --------------------------
**Basic**                  | **Number**             | **String** 
`null`                     | `number`               | `string`            
<code>&#117;ndefined</code>| `positive_number`      | `whitespace`        
`nan`                      | `negative_number`      | `single_char_string` 
`symbol`                   | `zero`                 | `multi_char_string` 
`function`                 | `non_positive_number`  | `empty_string`      
`date`                     | `non_negative_number`  | `blank_string`      
`error`                    | `non_zero_number`      | `non_empty_string`  
`regexp`                   | `integer`              | `non_blank_string`  
**Object**                 | `positive_integer`     | **Boolean**         
`object`                   | `negative_integer`     | `boolean`   
`empty_object`             | `float`                | `true`      
`single_prop_object`       | `positive_float`       | `false`     
`multi_prop_object`        | `negative_float`       | **Other**                 
`non_empty_object`         | `infinite_number`      | `primitive`       
**Array**                  | `positive_infinity`    | `nothing`         
`array`                    | `negative_infinity`    | `any`             
`empty_array`              | `non_infinite_number`  | `none`     
`single_elem_array`        | &nbsp;                 | &nbsp;
`multi_elem_array`         | &nbsp;                 | &nbsp;
`non_empty_array`          | &nbsp;                 | &nbsp;
  
  &nbsp;
**See the full docs for supported types** ***[here](https://github.com/lucono/xtypejs/blob/master/docs/SupportedTypes.md)*** &nbsp; &lArr;


## Sample Usage

```js
/* Importing the library */

var xtype = require('xtypejs');         // (node.js). See docs for AMD and script tag.

/* Getting the extended type of a value */

xtype(-2.5)   === 'negative_float';      // Value is number, negative and float
xtype('  ')   === 'whitespace';          // Value is string and blank
xtype({})     === 'empty_object';        // Value is object and is empty

/* Every type also has a corresponding compact name. So using compact names,
 * the following is a less verbose equivalent to the type checks above:
 */

xtype(-2.5)   === 'float-';             // 'float-' is same as 'negative_float'
xtype('  ')   === 'str_';               // 'str_' is same as 'whitespace'
xtype({})     === 'obj0';               // 'obj0' is same as 'empty_object'

/* Getting the simple type of a value */

xtype.type(null)          === 'null';
xtype.type(new Date())    === 'date';
xtype.type([])            === 'array';

/*
 * Returns true if data is an object AND contains at least one own property,
 * OR is an array AND has exactly one element, 
 * OR is a number AND is an integer AND is greater than zero.
 * Else returns false.
 */
    
xtype.is(data, 'non_empty_object, single_elem_array, positive_integer');
    
/* OR using compact name scheme: */
    
xtype.is(data, '-obj0 arr1 int+');

/*
 * Display a product using a received value that must be a product
 * name string, a product Id number, or an actual product instance.
 */
    
if (! xtype.is(value, [xtype.MULTI_CHAR_STRING, xtype.POSITIVE_INTEGER, Product])) {
    /* Handle cannot display product */
}
```
  
**See full usage and example docs** ***[here](https://github.com/lucono/xtypejs/blob/master/docs/Usage.md)*** &nbsp; &lArr;


## API

The *xtypejs* API provides methods to get the simple or extended type of a value, get the native type of any primitive or object value, verify whether a value matches a set of simple or complex mix of types in a single call, get the matching type of a value from a list of specific types which are interesting to the application, perform other type-related checks and verifications, and change various *xtypejs* options, including using custom name schemes.
  
**See the API documentation** ***[here](https://github.com/lucono/xtypejs/blob/master/docs/API.md)*** &nbsp; &lArr;


## Testing
  
```
npm test
```

See the link below for more testing details and how to run the tests directly in your browser for the current head version of the library.
  
**More testing details** ***[here](//github.com/lucono/xtypejs/tree/master/test)*** &nbsp; &lArr;


## Notes
  
See the Notes and FAQ docs for notes on special pseudo types such as `NONE` and `ANY`, the special handling of the `NaN` value by *xtypejs*, and more.

**See important library notes and FAQ** ***[here](https://github.com/lucono/xtypejs/blob/master/docs/NotesFaq.md)*** &nbsp; &lArr;


## License

Licensed under the terms of the MIT license.


