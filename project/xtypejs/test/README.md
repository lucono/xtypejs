# Building and Testing <a href="https://travis-ci.org/lucono/xtypejs"><img align="right" src="https://travis-ci.org/lucono/xtypejs.svg?branch=master"></a>

### Building

To build the project, clone it locally and run the following command from the *xtypejs* project root:

```
npm install && grunt build
```

This will install the dev dependencies and then build the library, generating a `dist` directory under the project root, containing the source and minified versions and associated source map file for *xtypejs*. To not bundle the compact name scheme in the final minified version, set the `$XTYPE_JS_BUNDLE_COMPACT_NAME_SCHEME$` global def variable to `false` in the uglify options of the `Gruntfile` before building the project.


### Testing

There are comprehensive tests that cover almost every aspect of the *xtypejs* functionality. The link below can also be used to view and run the tests directly in the browser for the current head version of the library.

For more comprehensive tests with reports, including js lint and code coverage reports, you can clone the project and run the tests. The following command will install the dev dependencies and run the tests:

```
npm install && npm test
```

After installing the dependencies, this will first build the library, generating a `dist` directory under the project root, containing minified and source versions of the library, as well as a source map file. It will then perform the following actions:

* Creates a `build` directory under the project root directory.
* Runs js linting on the source version of *xtypejs* in the `dist` directory and generates an HTML report under the `build` directory.
* Runs the Jasmine spec tests for the source library in node.
* Runs the Jasmine spec tests for the minified library in node.
* Runs the Jasmine spec tests and code coverage for the source library in chrome.
* Runs the Jasmine spec tests and code coverage for the source library in firefox.
* Runs the Jasmine spec tests for the minified library in chrome.
* Runs the Jasmine spec tests for the minified library in firefox.

HTML reports are generated under the `build` directory for the js linting results, the jasmine tests for the source and minified libraries in chrome and firefox, and the code coverage reports for the source library in chrome and firefox.

**Run the tests directly in your browser for the [dev version](http://htmlpreview.github.io/?https://github.com/lucono/xtypejs/blob/master/project/xtypejs/test/spec-dev.html) or the [dist version](http://htmlpreview.github.io/?https://github.com/lucono/xtypejs/blob/master/project/xtypejs/test/spec-dist.html).**


### Website

Visit the website for usage guide, examples, API documentation, and download.

#### **[xtype.js.org](http://xtype.js.org/)**
