### [![xtypejs Logo](http://xtype.js.org/assets/img/xtype-logo.png)](http://xtype.js.org/) <a href="https://travis-ci.org/lucono/xtypejs"><img align="right" src="https://travis-ci.org/lucono/xtypejs.svg?branch=master"></a>

### Overview

- Provides concise, performant, readable, data and type validation, with close to 40 highly efficient, data-validating pseudo types for JavaScript.
- Improves application efficiency and readability by unifying the most basic but common data and type validations in JavaScript apps, into single, concise, highly optimized operations.
- Employs bitwise operations, data pre-processing, and memory-efficient memoization for fast, robust performance in small and large apps and libraries.
- Supports CommonJS and AMD environments, as well as regular HTML script tag.

### Go from this:

```js
function searchEmployees(value) {
    if (typeof value === 'string') {
         if (value.trim().length > 1) {
            return EmployeeDB.searchByName(value);
        } else if (value.trim().length === 1) {
            return EmployeeDB.searchByMiddleInitial(value);
        } else {
            return { error: 'Invalid search value supplied' };
        }
    } else if (typeof value === 'object' && value !== null) {
        if (Object.keys(value).length === 1) {
            return EmployeeDB.searchByFieldValuePair(value);
        } else if (Object.keys(value).length > 1) {
            return { error: 'Search by multiple fields not supported' };
        } else {
            return { error: 'Invalid search value supplied' };
        }
    } else if (typeof value === 'number') {
        if (!isNaN(value) && isFinite(value) && value > 0 && value % 1 === 0) {
            return EmployeeDB.searchByEmployeeNumber(value);
        } else {
            return { error: 'Invalid employee number supplied' };
        }
    } else if (typeof value === 'undefined' || value === null) {
        return { error: 'No search value supplied' };
    } else {
        return { error: 'Invalid search value supplied' };
    }
}
```

### To concise, performant, readable, data validation:

```js
function searchEmployees(value) {
    switch (xtype.which(value, 'str2+ str1 int+ obj1 obj2+ num nil')) {
        case 'str2+':
            return EmployeeDB.searchByName(value);
        case 'str1':
            return EmployeeDB.searchByMiddleInitial(value);
        case 'int+':
            return EmployeeDB.searchByEmployeeNumber(value);
        case 'obj1':
            return EmployeeDB.searchByFieldValuePair(value);
        case 'obj2+':
            return { error: 'Search by multiple fields not supported' };
        case 'num':
            return { error: 'Invalid employee number supplied' };
        case 'nil':
            return { error: 'No search value supplied' };
        default:
            return { error: 'Invalid search value supplied' };
    }
}
```

## &nbsp;

#### Dependencies

None.


#### Build / Test

See [here](https://github.com/lucono/xtypejs/tree/master/test).


#### License

MIT license.


#### Website

Visit the website for usage guide, examples, API documentation, and download.

#### **[xtype.js.org](http://xtype.js.org/)**
