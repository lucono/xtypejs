# xtypejs - Name scheme: `shortened-camel`

### Installation with npm

```sh
npm install xtypejs-name-scheme-shortened-camel --save
```

### NodeJs import and setup

```js
var xtype = require('xtypejs');
var xtypejsShortenedCamelNameScheme = require('xtypejs-name-scheme-shortened-camel');

// Either: Simple setup

xtype.options.setNameScheme(xtypejsShortenedCamelNameScheme);

// Or: To first register name scheme internally for later
// reference by name, for switching between name schemes:

xtype.ext.registerNameScheme('shortened-camel', xtypejsShortenedCamelNameScheme);
xtype.options.setNameScheme('shortened-camel');

// Scheme is now active here
```

### HTML script tag import and setup

```html
<!--
    Include name scheme script after xtypejs script 
    to automatically register the name scheme into
    xtypejs with the default scheme name: 'shortened-camel'
-->

<script src="path/to/xtype.js"></script>
<script src="path/to/xtypejs-name-scheme-shortened-camel.js"></script>

<script>
    xtype.options.setNameScheme('shortened-camel');
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
`undefined`          | `undef`
`nan`                | `nan`
`symbol`             | `symb`
`function`           | `func`
`date`               | `date`
`error`              | `err`
`regexp`             | `regex`
`boolean`            | `bool`
`true`               | `true`
`false`              | `false`
`string`             | `str`
`whitespace`         | `space`
`single_char_string` | `oneCharStr`
`multi_char_string`  | `multiCharStr`
`empty_string`       | `emptyStr`
`blank_string`       | `blankStr`
`non_empty_string`   | `nonEmptyStr`
`non_blank_string`   | `nonBlankStr`
`number`             | `num`
`positive_number`    | `posNum`
`negative_number`    | `negNum`
`zero`               | `zero`
`non_positive_number`| `nonPosNum`
`non_negative_number`| `nonNegNum`
`non_zero_number`    | `nonZeroNum`
`integer`            | `int`
`positive_integer`   | `posInt`
`negative_integer`   | `negInt`
`float`              | `float`
`positive_float`     | `posFloat`
`negative_float`     | `negFloat`
`infinite_number`    | `inf`
`positive_infinity`  | `posInf`
`negative_infinity`  | `negInf`
`non_infinite_number`| `nonInfNum`
`array`              | `arr`
`empty_array`        | `emptyArr`
`single_elem_array`  | `oneElemArr`
`multi_elem_array`   | `multiElemArr`
`non_empty_array`    | `nonEmptyArr`
`object`             | `obj`
`empty_object`       | `emptyObj`
`single_prop_object` | `onePropObj`
`multi_prop_object`  | `multiPropObj`
`non_empty_object`   | `nonEmptyObj`
`primitive`          | `prim`
`nothing`            | `nil`
`any`                | `any`
`none`               | `none`