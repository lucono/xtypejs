# xtypejs Extension - Type Introspection

This extension provides various functions that enable an application to produce friendly UI messages, user prompts, logs, error messages and more related to various data and user input validation scenarios, as well as many other scenarios generally related to type and validation reporting.

The methods provided are:

* `xtype.util.typeNames`
* `xtype.util.typeFriendlyName`
* `xtype.util.typeDefaultName`
* `xtype.util.typeComposition`
* `xtype.util.typeNameToId`
* `xtype.util.typeIdToName`
* `xtype.util.typeIds`

### Installation with npm

```sh
npm install xtypejs-extension-introspection --save
```

### NodeJs import and setup

```js
var xtype = require('xtypejs');
var xtypejsIntrospectionExtension = require('xtypejs-extension-introspection');

// The type introspection methods are NOT available here

xtype.ext.registerExtension(xtypejsIntrospectionExtension);

// The type introspection methods are now available here
```

### HTML script tag import and setup

 Include the extension script after the xtypejs script to automatically register the extension into xtypejs without exporting any globals. This relies on xtypejs being available in the `xtype` global variable.

```html
<script src="path/to/xtype.js"></script>
<script src="path/to/xtypejs-extension-introspection.js"></script>

<script>
    // The type introspection methods are available here
</script>
```

If the extension script needs to be included before the xtypejs script, or the `xtype` global is not available (or is using a different variable name) when the extension script is included, the extension will be exported instead to a global variable named `xtypejsIntrospectionExtension`, which must then be manually registered into xtypejs as an extension.

```html
<!--
    Assume 'xtype' global variable not available here. The following
    exports global variable 'xtypejsIntrospectionExtension'
-->
<script src="path/to/xtypejs-extension-introspection.js"></script>

<!-- Other things here... -->

<script>
    // Assume xtypejs later available here in variable 'myXtype'
    myXtype.ext.registerExtension(xtypejsIntrospectionExtension);

    // The type introspection methods are now available here
</script>
```

### Usage

For usage, see:

* `xtype.util.typeNames` - *[doc](https://xtype.js.org/api/typeNames)*
* `xtype.util.typeFriendlyName` - *[doc](https://xtype.js.org/api/typeFriendlyName)*
* `xtype.util.typeDefaultName` - *[doc](https://xtype.js.org/api/typeDefaultName)*
* `xtype.util.typeComposition` - *[doc](https://xtype.js.org/api/typeComposition)*
* `xtype.util.typeNameToId` - *[doc](https://xtype.js.org/api/typeNameToId)*
* `xtype.util.typeIdToName` - *[doc](https://xtype.js.org/api/typeIdToName)*
* `xtype.util.typeIds` - *[doc](https://xtype.js.org/api/typeIds)*

### Preventing name collisions

If the HTML script tag was used to import the extension script in a browser environment and in the absence of xtypejs in the `xtype` global variable, the extension will be exported to a global variable named `xtypejsIntrospectionExtension`. The `noConflict` method of the exported extension can be used to reassign the extension to a different namespace or variable name, and return the global `xtypejsIntrospectionExtension` variable to its previous value prior to including the extension script.

```js
var myExtension = xtypejsIntrospectionExtension.noConflict();

/*
 * myExtension is now xtypejsIntrospectionExtension, while 
 * xtypejsIntrospectionExtension variable is now returned to
 * its original value prior to inclusion of the extension script.
 */ 
```