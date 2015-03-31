# xtypejs - Supported Types

#### [Back to Home](//github.com/lucono/xtypejs) &nbsp; &lArr;

## Simple Types

 ||
------------- | -------------- |
`null`        | The null value
`undefined`   | An undefined value 
`nan`         | The NaN value 
`string`      | A string primitive or object
`number`      | A number primitive or object
`boolean`     | A boolean primitive or object
`symbol`      | A symbol value
`array`       | An array object
`function`    | A function object
`date`        | A date object
`error`       | An object of any of the error types
`regexp`      | A regular expression object
`object`      | All other objects that are not one of the other specific object types
  
## Extended Types

 ||
-------------------- | -------------- |
**Strings**          | |
`empty_string`       | A string with zero characters
`whitespace`         | A string with one or more of only whitespace characters
`single_char_string` | A string with exactly one non-whitespace character and zero or more whitespace characters
`multi_char_string`  | A string with more than one non-whitespace character and zero or more whitespace characters
**Numbers**          | |
`positive_integer`   | A finite whole number primitive or object greater than zero
`positive_float`     | A finite number primitive or object greater than zero with a fractional component
`positive_infinity`  | A number primitive or object with the value of the JavaScript positive Infinity
`negative_integer`   | A finite whole number primitive or object less than zero
`negative_float`     | A finite number primitive or object less than zero with a fractional component
`negative_infinity`  | A number primitive or object with the value of the JavaScript negative Infinity
`zero`               | A number primitive or object equal to zero
**Booleans**         | |
`true`               | The boolean primitive or object that is *true*
`false`              | The boolean primitive or object that is *false*
**Arrays**           | |
`empty_array`        | An array with no elements
`single_elem_array`  | An array with exactly one element
`multi_elem_array`   | An array with more than one element
**Objects**          | |
`empty_object`       | An object with no own properties
`single_prop_object` | An object with exactly one own property
`multi_prop_object`  | An object with more than one own property
  
## Composite Types

The following *xtypejs* built-in types are derived from a combination of simple or extended types. From any combination of extended types, it is possible to derive any number of additional types which capture the specific type and data parameters that are relevant to the particular concerns of an application for the purposes of type checking, data validation, and possibly more. Composite types can also be combined with each other to form new composite types. 

 |||
-------------------- | ----------- | --- |
**Strings**          | **Description** | **Composition**
`blank_string`       | A string with zero or more of only whitespace characters | `empty_string` \| `whitespace`
`non_blank_string`   | A string with at least one non-whitespace character | `single_char_string` \| `multi_char_string`
`non_empty_string`   | A string with at least one whitespace or other character | `whitespace` \| `single_char_string` \| `multi_char_string`
**Numbers**          | | |
`positive_number`    | A number primitive or object greater than zero | `positive_integer` \| `positive_float` \| `positive_infinity`
`negative_number`    | A number primitive or object less than zero | `negative_integer` \| `negative_float` \| `negative_infinity`
`integer`            | A number primitive or object with a whole number value | `positive_integer` \| `negative_integer` \| `zero`
`float`              | A number primitive or object with a fractional component | `positive_float` \| `negative_float`
`infinite_number`    | A number primitive or object with a positive or negative infinite value | `positive_infinity` \| `negative_infinity`
`non_infinite_number`| A number primitive or object with a non-infinite value | `integer` \| `float`
`non_positive_number`| A number primitive or object less than or equal to zero | `negative_number` \| `zero`
`non_negative_number`| A number primitive or object greater than or equal to zero | `positive_number` \| `zero`
`non_zero_number`    | A number primitive or object with a value other than zero | `positive_number` \| `negative_number`
**Objects / Arrays** | | |
`non_empty_object`   | An object with one or more own properties | `single_prop_object` \| `multi_prop_object`
`non_empty_array`    | An array with one or more elements | `single_elem_array` \| `multi_elem_array`
**Others**           | | |
`nothing`            | A variable containing no value | `null` \| `undefined`
`primitive`          | A primitive type other than `null` or `undefined` | `string` \| `number` \| `boolean` \| `symbol`
`any`                | Any of the simple or extended types | *All simple and extended types*
`none`               | Not of any type | -
  
## Instance Types

 ||
-------------------------- | --- |
*Any constructor function* | Any constructor function is an Instance type. Each constructor function is the Instance type for objects of the constructor.


