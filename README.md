# xtypejs [![Build Status](https://travis-ci.org/lucono/xtypejs.svg?branch=master)](https://travis-ci.org/lucono/xtypejs)

*xtypejs* extends the standard JavaScript types with new data-validating pseudo types, while also normalizing all the irregularities of working with JavaScript types. It enables concise and efficient verification of JavaScript values by using data-validating pseudo types that unify both the type checking and some of the most commonly required basic data validation checks in JavaScript applications into a single, concise and efficient operation.

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
         
  
  &nbsp;
**See the full docs for supported types** ***[here](https://github.com/lucono/xtypejs/blob/master/docs/SupportedTypes.md)*** &nbsp; &lArr;


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
 * Every type also has a corresponding compact name. So using compact names,
 * the following is a less verbose equivalent to the type checks above:
 */

xtype(5)      === 'int+';               // 'int+' is same as 'positive_integer'
xtype('')     === 'str0';               // 'str0' is same as 'empty_string'
xtype({})     === 'obj0';               // 'obj0' is same as 'empty_object'
```

```js
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
  
**See full usage and example docs** ***[here](https://github.com/lucono/xtypejs/blob/master/docs/Usage.md)*** &nbsp; &lArr;


## API

The *xtypejs* API provides methods to get the simple or extended type of a value, get the native type of any primitive or object value, verify whether a value matches a set of simple or complex mix of types in a single call, get the matching type of a value from a list of specific types which are interesting to the application, perform other type-related checks and verifications, and change various *xtypejs* options, including using custom name schemes.
  
**See the API documentation** ***[here](https://github.com/lucono/xtypejs/blob/master/docs/API.md)*** &nbsp; &lArr;


## Testing
  
```
npm test
```

See the link below for more testing details, and to run the tests directly in your browser for the current head version of the library.
  
**More testing details** ***[here](//github.com/lucono/xtypejs/tree/master/test)*** &nbsp; &lArr;


## Notes

### `NaN` Handling
  
The classification of the JavaScript `NaN` value as the `number` type is rarely ever useful in JavaScript applications, and usually only creates many additional instances in an application where it becomes necessary to perform additional type and data checks that could have been avoided in the `number` context.

Because of this, *xtypejs* implements the special dedicated type `'nan'` (type Id `xtype.NAN`) for the JavaScript `NaN` value, that is completely decoupled and distinct from the `number` type, effectively eliminating the need for applications using *xtypejs* to explicitly handle `NaN` values whenever expecting `number` types. `NaN` values are particularly problematic in JavaScript applications because though they are reported as the `number` type by the JavaScript runtime, there is effectively little to nothing an application can do to make meaningful use of them in the expected `number` context.

The *xtypejs* approach helps by not only eliminating the effort of writing numerous checking and handling code for `NaN` values, but also helps keep the application code cleaner and more concise by eliminating the clutter that's almost always associated with these checks.
  
**See more important library notes and FAQ** ***[here](https://github.com/lucono/xtypejs/blob/master/docs/NotesFaq.md)*** &nbsp; &lArr;


## License

Licensed under the terms of the MIT license.

**See full license** ***[here](https://github.com/lucono/xtypejs/blob/master/LICENSE)*** &nbsp; &lArr;
