# xtypejs - Building and Testing

#### [Back to Home](//github.com/lucono/xtypejs) &nbsp; &lArr;

## Building

To build the project, clone the project locally and run the following command to install the dev dependencies:

```js
npm install
```

Then run the following command to build the project:

```js
grunt build
```

This will build the library, generating a `dist` directory under the project directory, containing a minified version and associated source map file for *xtypejs*. To not bundle the compact name scheme in the final minified version of *xtypejs*, set the `$XTYPE_JS_BUNDLE_COMPACT_NAME_SCHEME$` global def variable to `false` in the uglify options of the `Gruntfile` before building the project.

Similarly, if further size reduction is required, and the flexibility of using a custom name scheme or changing type expression string delimiters or registering custom types are not needed, then the `$XTYPE_JS_BUNDLE_OPTIONS_FEATURE$` global def variable can be set to false to unbundle the options feature during the build.
