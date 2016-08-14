# xtypejs - Name scheme: `shortened`

### Installation with npm

```sh
npm install xtypejs-name-scheme-shortened --save
```

### NodeJs import and setup

```js
var xtype = require('xtypejs');
var xtypejsShortenedNameScheme = require('xtypejs-name-scheme-shortened');

// Either: Simple setup

xtype.options.setNameScheme(xtypejsShortenedNameScheme);

// Or: To first register name scheme internally for later
// reference by name, for switching between name schemes:

xtype.ext.registerNameScheme('shortened', xtypejsShortenedNameScheme);
xtype.options.setNameScheme('shortened');

// Scheme is now active here
```

### HTML script tag import and setup

```html
<!--
    Include name scheme script after xtypejs script 
    to automatically register the name scheme into
    xtypejs with the default scheme name: 'shortened'
-->

<script src="path/to/xtype.js"></script>
<script src="path/to/xtypejs-name-scheme-shortened.js"></script>

<script>
    xtype.options.setNameScheme('shortened');
    // Scheme is now active here
</script>
```

### Usage

For general documentation on using custom name schemes, see:

* [Registering a custom name scheme](http://xtype.js.org/guide/registering_custom_name_scheme)
* [Switching back to the default name scheme](http://xtype.js.org/guide/switching_back_to_default_name_scheme)
* [registerNameScheme method](http://xtype.js.org/api/registerNameScheme)
* [setNameScheme method](http://xtype.js.org/api/setNameScheme)

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
`single_char_string` | `one_char_str`
`multi_char_string`  | `multi_char_str`
`empty_string`       | `empty_str`
`blank_string`       | `blank_str`
`non_empty_string`   | `non_empty_str`
`non_blank_string`   | `non_blank_str`
`number`             | `num`
`positive_number`    | `pos_num`
`negative_number`    | `neg_num`
`zero`               | `zero`
`non_positive_number`| `non_pos_num`
`non_negative_number`| `non_neg_num`
`non_zero_number`    | `non_zero_num`
`integer`            | `int`
`positive_integer`   | `pos_int`
`negative_integer`   | `neg_int`
`float`              | `float`
`positive_float`     | `pos_float`
`negative_float`     | `neg_float`
`infinite_number`    | `inf`
`positive_infinity`  | `pos_inf`
`negative_infinity`  | `neg_inf`
`non_infinite_number`| `non_inf_num`
`array`              | `arr`
`empty_array`        | `empty_arr`
`single_elem_array`  | `one_elem_arr`
`multi_elem_array`   | `multi_elem_arr`
`non_empty_array`    | `non_empty_arr`
`object`             | `obj`
`empty_object`       | `empty_obj`
`single_prop_object` | `one_prop_obj`
`multi_prop_object`  | `multi_prop_obj`
`non_empty_object`   | `non_empty_obj`
`primitive`          | `prim`
`nothing`            | `nil`
`any`                | `any`
`none`               | `none`