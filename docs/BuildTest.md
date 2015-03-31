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


## Testing

There is a comprehensive set of tests that cover almost every aspect of the *xtypejs* functionality. 

To view the js lint and code coverage reports, you can clone and test the project locally using `npm test` (after running `npm install` to install the dev dependencies). This will first build the library, generating a `dist` directory under the project directory, containing a minified version and associated source map file for *xtypejs*. It will then run js linting on *xtypejs* and also run the Jasmine spec tests against the library, generating a `build` directory under the project directory, containing the reports of the js lint, Jasmine tests, and code coverage analysis.

You can also use the link below to view and run the tests directly in your browser for the current head version of the library.

#### View and run the tests [here](https://rawgit.com/lucono/xtypejs/master/test/index.html) &nbsp; &lArr;
