# xtypejs - API

#### [Back to Home](//github.com/lucono/xtypejs) &nbsp; &lArr;


### Primary Methods
---

#### xtype(`item`)
Gets the extended type of an item, or the simple type if the item type has no extended types.
  
Argument       | Type          | Description  
:------------- | :------------ | :-------------------
`item`         | any           | The item/value of which the type is to be determined.
**Return**     | string        | The name of the extended type of `item`, or its simple type if there is no matching extended type.
  
&nbsp; 
  
---
  
#### xtype.type(`item`)
Gets the simple type of an item.
  
Argument       | Type          | Description  
:------------- | :------------ | :-------------------
`item`         | any           | The item/value of which the type is to be determined.
**Return**     | string        | The name of the simple type of `item`.
  
&nbsp; 
  
---
  
#### xtype.typeOf(`item`)
Gets the type of an item, including more specific types of `object` that are native to the host environment, and which are not one of the *xtypejs* built-in types, such as `global`, `Arguments`, browser host HTML element object types, etc. For the *xtypejs* built-in types, this method will return the same results as the *xtype.type(`item`)* method.
  
Argument       | Type          | Description  
:------------- | :------------ | :-------------------
`item`         | any           | The item/value of which the type is to be determined.
**Return**     | string        | The name of the type of `item`, including types that are not one of the *xtypejs* built-in types.
  
&nbsp; 
  
---
  
#### xtype.which(`item`, `types`)
Gets the matching type of an item from a list of simple, extended and/or instance types.
  
Argument       | Type             | Description  
:------------- | :--------------- | :-------------------
`item`         | any              | The item/value of which the type is to be matched.
`types`        | string           | A single or delimited list of several type names against which `item` is to be matched.
               | array            | An array of any combination of the type names or Ids, and/or instance types against which `item` is to be matched.
               | number&nbsp;*    | A single or OR'ed expression of several type Ids as a single combined type, against which `item` is to be matched.
               | function&nbsp;*  | A single instance type against which `item` is to be matched.
**Return**     | string           | The matching type of `item` if the matching type was provided as a type name string in the `types` list argument, or the `none` type if there was no match. 
               | number           | The matching type of `item` if the matching type was provided as a type Id in the `types` argument, or the `none` type if there was no match. 
               | function         | The matching type of `item` if the matching type was provided as an instance type in the `types` argument, or the `none` type if there was no match.
\* Note that for versions of the `types` argument, the `types` argument is treated not as a list of types, but as a single type against which `item` is to be matched, therefore returning either the value of the `types` argument if the type of `item` matches, or else returning the `none` type.
  
&nbsp; 
  
---
  
#### xtype.is(`item`, `types`)
Checks whether an item matches any of a list of simple, extended and/or instance types.
  
Argument       | Type          | Description  
:------------- | :------------ | :-------------------
`item`         | any           | The item/value of which the type is to be checked.
`types`        | string        | A single or delimited list of several type names against which `item` is to be checked. By default, the delimiter is a comma, whitespace or pipe character, or any consecutive sequence of any number and combination of the three. For instance, a comma can be used alone, or a comma followed by a space.
               | number        | A single or OR'ed expression of several type Ids against which `item` is to be checked.
               | function      | A single instance type against which `item` is to be checked.
               | array         | An array of any combination of the simple or extended type names or Ids, and/or instance types against which `item` is to be checked. ***Note:*** Individual array entries of type names cannot be delimited strings of several type names, but must each correspond to exactly one type name. However, individual array entries of type Ids can each contain a single type Id or an OR'ed expression of several type Ids. Individual instance type entries must be a single function per entry.
**Return**     | boolean       | Returns true if `item` matches *any* of the type or types represented in the `types` parameter, or false otherwise.
  
&nbsp; 
  
---
  
#### xtype.is*\<Type\>*(`item`)
These are a set of methods each of which checks whether an item matches a particular simple or extended *Type*.
  
Argument       | Type          | Description  
:------------- | :------------ | :-------------------
`item`         | any           | The item/value of which the type is to be checked.
**Return**     | boolean       | Returns true if `item` matches the specific *Type*, or false otherwise.
  
#### is*\<Type\>* : Method List
  
 |||                                             
:------------------------- | :-------------------------- | :-------------------------
**Basic**                  | **Number**                  | **String** 
isNull(`item`)             | isNumber(`item`)            | isString(`item`) 
isUndefined(`item`)        | isInteger(`item`)           | isWhitespace(`item`) 
isNan(`item`)              | isFloat(`item`)             | isSingleCharString(`item`) 
isDate(`item`)             | isPositiveNumber(`item`)    | isMultiCharString(`item`) 
isSymbol(`item`)           | isPositiveInteger(`item`)   | isEmptyString(`item`) 
isFunction(`item`)         | isPositiveFloat(`item`)     | isNonEmptyString(`item`) 
isRegexp(`item`)           | isPositiveInfinity(`item`)  | isBlalnkString(`item`) 
isError(`item`)            | isNegativeNumber(`item`)    | isNonBlankString(`item`) 
**Object**                 | isNegativeInteger(`item`)   | **Boolean**         
isObject(`item`)           | isNegativeFloat(`item`)     | isBoolean(`item`)   
isEmptyobject(`item`)      | isNegativeInfinity(`item`)  | isTrue(`item`)      
isSinglePropObject(`item`) | isZero(`item`)              | isFalse(`item`)     
isMultiPropObject(`item`)  | isNonZeroNumber(`item`)     | **Other**                 
**Array**                  | isNonPositiveNumber(`item`) | isPrimitive(`item`)        
isArray(`item`)            | isNonNegativeNumber(`item`) | isNothing(`item`)          
isEmptyArray(`item`)       | isInfiniteNumber(`item`)    | isAny(`item`)              
isSinbleElemArray(`item`)  | isNonInfiniteNumber(`item`) | isNone(`item`)
isMultiElemArray(`item`)   |                             | 
  
**Note about `isNan` method**: The `isNan(item)` method checks whether an item is the NaN value. It will only return true if the value of `item` actually represents the NaN value, and not necessarily if it is a non-numeric value, such as a string, whose value would not be a valid number. There is an important difference between the behavior of this method and the JavaScript *isNaN* function, which can also return true for values that are entirely not of the `number` type. Please see the notes section of the documentation for more details.

&nbsp; 
  
---
  
#### xtype.registerTypes(`typesData`, `compactSchemeData`)
Adds one or more custom types to *xtypejs*.
  
Argument       | Type           | Required  | Description  
:------------- | :------------- | :-------- | :-------------------
`typesData`    | object         | Required  | An object containing the custom types to be added.
`compactNames` | object         | Optional  | An object containing the compact names for the custom types to be added.
**Return**     | undefined      |           | Does not return a value.
  
#### Argument: `typesData`
  
                   | Type          | Required     | Description
:------------------| :------------ | :----------- | :-------------------
*object properties*| -             | -            | Each own property of the `typesData` object argument represents the name of a new type to be added, which must be all lowercase and can only contain alphanumeric characters and the underscore character. It must also not conflict with the names of any of the existing types in *xtypejs*.
*object values*    | number        | Required     | The value of each own property of the `typesData` object argument must be a numeric value of a derivation from the type Ids of a number of existing *xtypejs* types, resulting in a new unique type Id value for which there is not an already existing value in *xtypejs*.
  
#### Argument: `compactSchemeData`
  
                   | Type          | Required     | Description
:------------------| :------------ | :----------- | :-------------------
*object properties*| -             | -            | Each own property of the `compactSchemeData` object argument should correspond to the name of a new type in the `typesData` object that is to be added, for which the compact name is to be set.
*object values*    | string        | Required     | The value of each own property of the `compactSchemeData` object argument is the string to be used as the compact name of the corresponding type to be added. It must not conflict with any of the existing compact type names in *xtypejs*.
  
&nbsp; 
  
---
  
#### xtype.setOptions(`optionsData`)
Sets one or more *xtypejs* options.
  
Argument       | Type           | Description  
:------------- | :------------- | :-------------------
`optionsData`  | object         | An object whose properties are used to set various *xtypejs* options.
**Return**     | undefined      | Does not return a value.
  
#### Argument: `options`
  
Property           | Type          | Required     | Description
:------------------| :------------ | :----------- | :-------------------
`delimiterPattern` | string        | Optional     | The regular expression pattern to be used in recognizing how type name expression strings containing several type names are delimited. **Note:** This is not a regular expression object, but a regular expression pattern string.
`namingScheme`     | string        | Optional     | The name of an inbuilt type name scheme to be used in identifying type names. This can be `'default'` for the default type name scheme, or `'compact'` for the compact name scheme (if the compact name scheme was not unbundled).
                   | object        | Optional     | An object representing a custom name scheme to be used. Properties of the object whose keys correspond to the default name of a valid type will cause the value of the property to be used instead as the name of the type. The object does not have to contain a property for every default type name, and type names for which the object does not contain a property will not be changed.


### Utility Methods
---

#### xtype.nameToId(`type`)
Gets the type Id/constant corresponding to a specific type name.
  
Argument       | Type          | Description  
:------------- | :------------ | :-------------------
`type`         | string        | The name of a single simple or extended type.
**Return**     | number        | The type Id/constant corresponding to the type name specified by `type`.
  
&nbsp; 
  
---
  
#### xtype.idToName(`type`)
Gets the type name corresponding to a single type Id/constant.
  
Argument       | Type          | Description  
:------------- | :------------ | :-------------------
`type`         | number        | The type Id/constant of a single simple or extended type.
**Return**     | string        | The type name corresponding to the type Id/constant specified by `type`.


### Properties
---

#### xtype.*\<TypeId\>* - (Type Id Constants)
Type Ids or constants are properties on the **xtypejs** module which have numeric values corresponding to each of the simple or extended types. 

Property - *TypeId*        | Type     | Corresponding Type   | Compact Name
:------------------------- | :------- | :------------------  | ------------
xtype.`NULL`               | number   | `null`               | `null`
xtype.`UNDEFINED`          | number   | `undefined`          | `undef`
xtype.`NAN`                | number   | `nan`                | `nan`
xtype.`SYMBOL`             | number   | `symbol`             | `symb`
xtype.`FUNCTION`           | number   | `function`           | `func`
xtype.`DATE`               | number   | `date`               | `date`
xtype.`ERROR`              | number   | `error`              | `err`
xtype.`REGEXP`             | number   | `regexp`             | `regex`
**Boolean**                |          |                      |
xtype.`BOOLEAN`            | number   | `boolean`            | `bool`
xtype.`TRUE`               | number   | `true`               | `true`
xtype.`FALSE`              | number   | `false`              | `false`
**String**                 |          |                      |
xtype.`STRING`             | number   | `string`             | `str`
xtype.`WHITESPACE`         | number   | `whitespace`         | `str_`
xtype.`SINGLE_CHAR_STRING` | number   | `single_char_string` | `str1`
xtype.`MULTI_CHAR_STRING`  | number   | `multi_char_string`  | `str2+`
xtype.`EMPTY_STRING`       | number   | `empty_string`       | `str0`
xtype.`BLANK_STRING`       | number   | `blank_string`       | `str0_`
xtype.`NON_EMPTY_STRING`   | number   | `non_empty_string`   | `-str0`
xtype.`NON_BLANK_STRING`   | number   | `non_blank_string`   | `-str0_`
**Number**                 |          |                      |
xtype.`NUMBER`             | number   | `number`             | `num`
xtype.`POSITIVE_NUMBER`    | number   | `positive_number`    | `num+`
xtype.`NEGATIVE_NUMBER`    | number   | `negative_number`    | `num-`
xtype.`ZERO`               | number   | `zero`               | `num0`
xtype.`NON_POSITIVE_NUMBER`| number   | `non_positive_number`| `-num+`
xtype.`NONNEGATIVE_NUMBER` | number   | `non_negative_number`| `-num-`
xtype.`NON_ZERO_NUMBER`    | number   | `non_zero_number`    | `-num0`
xtype.`INTEGER`            | number   | `integer`            | `int`
xtype.`POSITIVE_INTEGER`   | number   | `positive_integer`   | `int+`
xtype.`NEGATIVE_INTEGER`   | number   | `negative_integer`   | `int-`
xtype.`FLOAT`              | number   | `float`              | `float`
xtype.`POSITIVE_FLOAT`     | number   | `positive_float`     | `float+`
xtype.`NEGATIVE_FLOAT`     | number   | `negative_float`     | `float-`
xtype.`INFINITE_NUMBER`    | number   | `infinite_number`    | `inf`
xtype.`POSITIVE_INFINITY`  | number   | `positive_infinity`  | `inf+`
xtype.`NEGATIVE_INFINITY`  | number   | `negative_infinity`  | `inf-`
xtype.`NON_INFINITE_NUMBER`| number   | `non_infinite_number`| `-inf`
**Array**                  |          |                      |
xtype.`ARRAY`              | number   | `array`              | `arr`
xtype.`EMPTY_ARRAY`        | number   | `empty_array`        | `arr0`
xtype.`SINGLE_ELEM_ARRAY`  | number   | `single_elem_array`  | `arr1`
xtype.`MULTI_ELEM_ARRAY`   | number   | `multi_elem_array`   | `arr2+`
xtype.`NON_EMPTY_ARRAY`    | number   | `non_empty_array`    | `-arr0`
**Object**                 |          |                      |
xtype.`OBJECT`             | number   | `object`             | `obj`
xtype.`EMPTY_OBJECT`       | number   | `empty_object`       | `obj0`
xtype.`SINGLE_PROP_OBJECT` | number   | `single_prop_object` | `obj1`
xtype.`MULTI_PROP_OBJECT`  | number   | `multi_prop_object`  | `obj2+`
xtype.`NON_EMPTY_OBJECT`   | number   | `non_empty_object`   | `-obj0`
**Other**                  |          |                      |
xtype.`PRIMITIVE`          | number   | `primitive`          | `prim`
xtype.`NOTHING`            | number   | `nothing`            | `nil`
xtype.`ANY`                | number   | `any`                | `any`
xtype.`NONE`               | number   | `none`               | `none`
