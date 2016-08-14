# xtypejs Extension - Custom Types

This extension provides the xtypejs registerType API, and custom types functionality.

See the xtypejs [registerType API](http://xtype.js.org/api/registerType) for usage documentation.

### Installation with npm

```sh
npm install xtypejs-extension-custom-types --save
```

### NodeJs import and setup

```js
var xtype = require('xtypejs');
var xtypejsCustomTypesExtension = require('xtypejs-extension-custom-types');

// xtype.ext.registerType method is NOT available here

xtype.ext.registerExtension(xtypejsCustomTypesExtension);

// xtype.ext.registerType method is now available here
```

### HTML script tag import and setup

 Include the extension script after the xtypejs script to automatically register the extension into xtypejs without exporting any globals. This relies on xtypejs being available in the `xtype` global variable.

```html
<script src="path/to/xtype.js"></script>
<script src="path/to/xtypejs-extension-custom-types.js"></script>

<script>
    // xtype.ext.registerType method is available here
</script>
```

If the extension script needs to be included before the xtypejs script, or the `xtype` global is not available (or is using a different variable name) when the extension script is included, the extension will be exported instead to a global variable named `xtypejsCustomTypesExtension`, which must then be manually registered into xtypejs as an extension.

```html
<!--
    Assume 'xtype' global variable not available here. The following
    exports global variable 'xtypejsCustomTypesExtension'
-->
<script src="path/to/xtypejs-extension-custom-types.js"></script>

<!-- Other things here... -->

<script>
    // Assume xtypejs later available here in variable 'myXtype'
    myXtype.ext.registerExtension(xtypejsCustomTypesExtension);

    // xtype.ext.registerType method is now available here
</script>
```

### Preventing name collisions

If the HTML script tag was used to import the extension script in a browser environment and in the absence of xtypejs in the `xtype` global variable, the extension will be exported to a global variable named `xtypejsCustomTypesExtension`. The `noConflict` method of the exported extension can be used to reassign the extension to a different namespace or variable name, and return the global `xtypejsCustomTypesExtension` variable to its previous value prior to including the extension script.

```js
var myExtension = xtypejsCustomTypesExtension.noConflict();

/*
 * myExtension is now xtypejsCustomTypesExtension, while 
 * xtypejsCustomTypesExtension variable is now returned to
 * its original value prior to inclusion of the extension script.
 */ 
```