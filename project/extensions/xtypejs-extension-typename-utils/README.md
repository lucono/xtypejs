# xtypejs Extension - Type Name Utilities

This extension provides the xtypejs type name utility API methods, which provides a way to enumerate all available types in xtypejs either by name or by id, and to convert between them.

The methods provided are:

* `xtype.util.nameToId`
* `xtype.util.idToName`
* `xtype.util.typeNames`
* `xtype.util.typeIds`

### Installation with npm

```sh
npm install xtypejs-extension-typename-utils --save
```

### NodeJs import and setup

```js
var xtype = require('xtypejs');
var xtypejsTypeNameUtilsExtension = require('xtypejs-extension-typename-utils');

// The type name utility methods are NOT available here

xtype.ext.registerExtension(xtypejsTypeNameUtilsExtension);

// The type name utility methods are now available here
```

### HTML script tag import and setup

 Include the extension script after the xtypejs script to automatically register the extension into xtypejs without exporting any globals. This relies on xtypejs being available in the `xtype` global variable.

```html
<script src="path/to/xtype.js"></script>
<script src="path/to/xtypejs-extension-typename-utils.js"></script>

<script>
    // The type name utility methods are available here
</script>
```

If the extension script needs to be included before the xtypejs script, or the `xtype` global is not available (or is using a different variable name) when the extension script is included, the extension will be exported instead to a global variable named `xtypejsTypeNameUtilsExtension`, which must then be manually registered into xtypejs as an extension.

```html
<!--
    Assume 'xtype' global variable not available here. The following
    exports global variable 'xtypejsTypeNameUtilsExtension'
-->
<script src="path/to/xtypejs-extension-typename-utils.js"></script>

<!-- Other things here... -->

<script>
    // Assume xtypejs later available here in variable 'myXtype'
    myXtype.ext.registerExtension(xtypejsTypeNameUtilsExtension);

    // The type name utility methods are now available here
</script>
```

### Usage

For usage, see:

* `xtype.util.nameToId` - *[doc](http://xtype.js.org/api/nameToId)*
* `xtype.util.idToName` - *[doc](http://xtype.js.org/api/idToName)*
* `xtype.util.typeNames` - *[doc](http://xtype.js.org/api/typeNames)*
* `xtype.util.typeIds` - *[doc](http://xtype.js.org/api/typeIds)*

### Preventing name collisions

If the HTML script tag was used to import the extension script in a browser environment and in the absence of xtypejs in the `xtype` global variable, the extension will be exported to a global variable named `xtypejsTypeNameUtilsExtension`. The `noConflict` method of the exported extension can be used to reassign the extension to a different namespace or variable name, and return the global `xtypejsTypeNameUtilsExtension` variable to its previous value prior to including the extension script.

```js
var myExtension = xtypejsTypeNameUtilsExtension.noConflict();

/*
 * myExtension is now xtypejsTypeNameUtilsExtension, while 
 * xtypejsTypeNameUtilsExtension variable is now returned to
 * its original value prior to inclusion of the extension script.
 */ 
```