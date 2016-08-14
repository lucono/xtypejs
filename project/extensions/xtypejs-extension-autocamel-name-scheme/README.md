# xtypejs Extension - Auto Camel Name Scheme

This extension provides a virtual name scheme named `auto-camel`, which when is the active name scheme, automatically assigns a cemel-cased type name to all types in xtypejs, including all default and custom types.

### Installation

```sh
npm install xtypejs-extension-autocamel-name-scheme --save
```

### NodeJS import and setup

```js
var xtype = require('xtypejs');
var xtypejsAutoCamelNameSchemeExtension = require('xtypejs-extension-autocamel-name-scheme');

xtype.ext.registerExtension(xtypejsAutoCamelNameSchemeExtension);
xtype.options.setNameScheme('auto-camel');

/*
 * Scheme is now active here, and all default and custom types
 * in xtype will now automatically use a camel-converted
 * version of their registered names. For instance, for the
 * 'positive_number' type, the camel name 'positiveNumber'
 * should be used when referencing it in type expressions.
 */
```

### HTML script tag import and setup

 Include the extension script after the xtypejs script to automatically register the extension into xtypejs without exporting any globals. This relies on xtypejs being available in the `xtype` global variable.

```html
<script src="path/to/xtype.js"></script>
<script src="path/to/xtypejs-extension-autocamel-name-scheme.js"></script>

<script>
    xtype.options.setNameScheme('auto-camel');
    // Scheme is now active here
</script>
```

If the extension script needs to be included before the xtypejs script, or the `xtype` global is not available (or is using a different variable name) when the extension script is included, the extension will be exported instead to a global variable named `xtypejsAutoCamelNameSchemeExtension`, which must then be manually registered into xtypejs as an extension.

```html
<!--
    Assume 'xtype' global variable not available here. The following
    exports global variable 'xtypejsAutoCamelNameSchemeExtension'
-->
<script src="path/to/xtypejs-extension-autocamel-name-scheme.js"></script>

<!-- Other things here... -->

<script>
    // Assume xtypejs later available here in variable 'myXtype'
    myXtype.ext.registerExtension(xtypejsAutoCamelNameSchemeExtension);
    myXtype.options.setNameScheme('auto-camel');

    // Scheme is now active here
</script>
```

### Usage Example

All types, including newly registered custom types, will automatically use a camel-version of the type name if the `auto-camel` name scheme is the active scheme.

```js
xtype.options.setNameScheme('auto-camel');

// Registration of custom type 'app_flag' automatically
// uses the camel version of the name ('appFlag') instead:

xtype.registerType('app_flag', 'positive_integer, single_char_string');
xtype.which('g', 'appFlag') === 'appFlag';    // 'app_flag' type uses camel name 'appFlag'
```

### Preventing name collisions

If the HTML script tag was used to import the extension script in a browser environment and in the absence of xtypejs in the `xtype` global variable, the extension will be exported to a global variable named `xtypejsAutoCamelNameSchemeExtension`. The `noConflict` method of the exported extension can be used to reassign the extension to a different namespace or variable name, and return the global `xtypejsAutoCamelNameSchemeExtension` variable to its previous value prior to including the extension script.

```js
var myAutoCamel = xtypejsAutoCamelNameSchemeExtension.noConflict();

/*
 * myAutoCamel is now xtypejsAutoCamelNameSchemeExtension, while 
 * xtypejsAutoCamelNameSchemeExtension variable is now returned to
 * its original value prior to inclusion of the extension script.
 */ 
```


Type Default Name    | Name in Scheme
:------------------  | ------------
`null`               | `null`
`undefined`          | `undefined`
`nan`                | `nan`
`symbol`             | `symbol`
`function`           | `function`
`date`               | `date`
`error`              | `error`
`regexp`             | `regexp`
`boolean`            | `boolean`
`true`               | `true`
`false`              | `false`
`string`             | `string`
`whitespace`         | `whitespace`
`single_char_string` | `singleCharString`
`multi_char_string`  | `multiCharString`
`empty_string`       | `emptyString`
`blank_string`       | `blankString`
`non_empty_string`   | `nonEmptyString`
`non_blank_string`   | `nonBlankString`
`number`             | `number`
`positive_number`    | `positiveNumber`
`negative_number`    | `negativeNumber`
`zero`               | `zero`
`non_positive_number`| `nonPositiveNumber`
`non_negative_number`| `nonNegativeNumber`
`non_zero_number`    | `nonZeroNumber`
`integer`            | `integer`
`positive_integer`   | `positiveInteger`
`negative_integer`   | `negativeInteger`
`float`              | `float`
`positive_float`     | `positiveFloat`
`negative_float`     | `negativeFloat`
`infinite_number`    | `infiniteNumber`
`positive_infinity`  | `positiveInfinity`
`negative_infinity`  | `negativeInfinity`
`non_infinite_number`| `nonInfiniteNumber`
`array`              | `array`
`empty_array`        | `emptyArray`
`single_elem_array`  | `singleElemArray`
`multi_elem_array`   | `multiElemArray`
`non_empty_array`    | `nonEmptyArray`
`object`             | `object`
`empty_object`       | `emptyObject`
`single_prop_object` | `singlePropObject`
`multi_prop_object`  | `multiPropObject`
`non_empty_object`   | `nonEmptyObject`
`primitive`          | `primitive`
`nothing`            | `nothing`
`any`                | `any`
`none`               | `none`