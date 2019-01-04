# xtypejs - Name scheme: `camel`

### Installation with npm

```sh
npm install xtypejs-name-scheme-camel --save
```

### NodeJs import and setup

```js
var xtype = require('xtypejs');
var xtypejsCamelNameScheme = require('xtypejs-name-scheme-camel');

// Either: Simple setup

xtype.options.setNameScheme(xtypejsCamelNameScheme);

// Or: To first register name scheme internally for later
// reference by name, for switching between name schemes:

xtype.ext.registerNameScheme('camel', xtypejsCamelNameScheme);
xtype.options.setNameScheme('camel');

// Scheme is now active here
```

### HTML script tag import and setup

```html
<!--
    Include name scheme script after xtypejs script 
    to automatically register the name scheme into
    xtypejs with the default scheme name: 'camel'
-->

<script src="path/to/xtype.js"></script>
<script src="path/to/xtypejs-name-scheme-camel.js"></script>

<script>
    xtype.options.setNameScheme('camel');
    // Scheme is now active here
</script>
```

### Usage

For general documentation on using custom name schemes, see:

* [Registering a custom name scheme](https://xtype.js.org/guide/registering_custom_name_scheme)
* [Switching back to the default name scheme](https://xtype.js.org/guide/switching_back_to_default_name_scheme)
* [registerNameScheme method](https://xtype.js.org/api/registerNameScheme)
* [setNameScheme method](https://xtype.js.org/api/setNameScheme)

### Type names in scheme
---

Type Default Name    | Name in Scheme
:------------------  | :------------
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