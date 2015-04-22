# xtypejs - Testing

#### [Back to Home](//github.com/lucono/xtypejs) &nbsp; &lArr;

## Testing

There's a comprehensive set of tests that cover almost every aspect of the *xtypejs* functionality. You can use the link at the bottom to view and run the tests directly in your browser for the current head version of the library.

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

HTML reports are generated under the `build` directory for the js linting results, the jasmine tests for the source and minified libraries in chrome and firefox, and the code coverate reports for the source library in chrome and firefox.

**Run the tests directly in your browser** ***[here](https://rawgit.com/lucono/xtypejs/master/test/index.html)*** &nbsp; &lArr;
