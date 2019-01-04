# xtypejs - Name scheme: `compact`

### Installation with npm

```sh
npm install xtypejs-name-scheme-compact --save
```

### NodeJs import and setup

```js
var xtype = require('xtypejs');
var xtypejsCompactNameScheme = require('xtypejs-name-scheme-compact');

// Either: Simple setup

xtype.options.setNameScheme(xtypejsCompactNameScheme);

// Or: To first register name scheme internally for later
// reference by name, for switching between name schemes:

xtype.ext.registerNameScheme('compact', xtypejsCompactNameScheme);
xtype.options.setNameScheme('compact');

// Scheme is now active here
```

### HTML script tag import and setup

```html
<!--
    Include name scheme script after xtypejs script 
    to automatically register the name scheme into
    xtypejs with the default scheme name: 'compact'
-->

<script src="path/to/xtype.js"></script>
<script src="path/to/xtypejs-name-scheme-compact.js"></script>

<script>
    xtype.options.setNameScheme('compact');
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
`whitespace`         | `str_`
`single_char_string` | `str1`
`multi_char_string`  | `str2+`
`empty_string`       | `str0`
`blank_string`       | `str0_`
`non_empty_string`   | `-str0`
`non_blank_string`   | `-str0_`
`number`             | `num`
`positive_number`    | `num+`
`negative_number`    | `num-`
`zero`               | `num0`
`non_positive_number`| `-num+`
`non_negative_number`| `-num-`
`non_zero_number`    | `-num0`
`integer`            | `int`
`positive_integer`   | `int+`
`negative_integer`   | `int-`
`float`              | `float`
`positive_float`     | `float+`
`negative_float`     | `float-`
`infinite_number`    | `inf`
`positive_infinity`  | `inf+`
`negative_infinity`  | `inf-`
`non_infinite_number`| `-inf`
`array`              | `arr`
`empty_array`        | `arr0`
`single_elem_array`  | `arr1`
`multi_elem_array`   | `arr2+`
`non_empty_array`    | `-arr0`
`object`             | `obj`
`empty_object`       | `obj0`
`single_prop_object` | `obj1`
`multi_prop_object`  | `obj2+`
`non_empty_object`   | `-obj0`
`primitive`          | `prim`
`nothing`            | `nil`
`any`                | `any`
`none`               | `none`