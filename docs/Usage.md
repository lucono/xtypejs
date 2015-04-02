# xtypejs - Usage / Examples

#### [Back to Home](//github.com/lucono/xtypejs) &nbsp; &lArr;


#### Getting the extended type of a value

```js
xtype(-2.5)   === 'negative_float';      // Value is number, negative and float
xtype('  ')   === 'blank_string';        // Value is string and blank
xtype({})     === 'empty_object';        // Value is object and is empty
xtype(['hi']) === 'single_elem_array';   // Value is array, has exactly one element
```

#### Getting the simple type of a value

```js
xtype.type(null)          === 'null';
xtype.type(new Date())    === 'date';
xtype.type(function() {}) === 'function';
xtype.type([])            === 'array';
```

#### Checking values against combinations of various types

Complex type and data requirements can be checked using combinations of relevant simple and/or extended types.

```js
// Returns true if data is an object AND contains at least one own property,
// OR is an array AND has exactly one element, 
// OR is a number AND is an integer AND is greater than zero.
// Else returns false.
    
xtype.is(data, 'non_empty_object, single_elem_array, positive_integer');
    
// OR using compact name scheme:
    
xtype.is(data, '-obj0 arr1 int+');
```

#### Checking instance types along with other types
  
```js
// Display a product using a received value that must be a product
// name string, a product Id number, or an actual product instance.
    
if (! xtype.is(value, [xtype.MULTI_CHAR_STRING, xtype.POSITIVE_INTEGER, Product])) {
    /* Handle cannot display product */
}
```
  
```js
// Switch on the result of xtype.which() to handle only valid input scenarios
// without first performing extensive type checking and data validations.
    
switch (xtype.which(item, ['multi_char_string', 'positive_integer', Product])) {

    case 'multi_char_string':
        // Fetch and display product using item as the product name
        
    case 'positive_integer':
        // Fetch and display product using item as the product id
        
    case Product:
        // Product object received, so just display product
        
    default:
        // Handle invalid value.. cannot display product
}
```

#### Checking values in different ways

Different ways of checking values provide flexibility based on application needs.
  
```js
xtype.is(flag, 'single_char_string');
xtype.is(flag, xtype.SINGLE_CHAR_STRING);
xtype.isSingleCharString(flag);
    
xtype.is(flag, 'single_char_string, positive_number');
xtype.is(flag, xtype.SINGLE_CHAR_STRING | xtype.POSITIVE_NUMBER);
xtype.is(flag, ['single_char_string', xtype.POSITIVE_NUMBER]);
``` 

#### Checking if a value matches a specific type
  
```js
xtype.isSingleCharString('g') === true;
xtype.isNonEmptyObject({foo: 'bar'}) === true;
xtype.isSingleElemArray(['foo']) === true;
xtype.isFloat(2.50) === true;
xtype.isPositiveNumber(-2.5) === false;
``` 

#### Checking boolean values
  
```js
xtype.isTrue(23.5) === false;                // Truthy but not boolean
xtype.isTrue(new MyProduct()) === false;     // Any type can be checked
xtype.isTrue('true') === false;              // String is not boolean
xtype.isFalse('false') === false;            // String is not boolean

xtype.isTrue(true) === true;                 // Primitive true is actual true
xtype.isTrue(new Boolean(true)) === true;    // Object true is actual true
        
xtype.isFalse(false) === true;               // Primitive false is actual false
xtype.isFalse(new Boolean(false)) === true;  // Object false is actual false
```

#### More compound type examples
  
```js
// Compound type: 'non_empty_object, single_elem_array'
// Must be either an object or an array.
// If an object, must have at least one own property.
// If an array, must have exactly one element, no more or less.
    
xtype.is({a: 1, b: 2}, 'non_empty_object, single_elem_array') === true;
xtype.is({items: [ ]}, 'non_empty_object, single_elem_array') === true;
xtype.is(['Broadway'], 'non_empty_object, single_elem_array') === true;
xtype.is([{x:1, y:2}], 'non_empty_object, single_elem_array') === true;
    
xtype.is(['fruit', 5], 'non_empty_object, single_elem_array') === false;
xtype.is('California', 'non_empty_object, single_elem_array') === false;
xtype.is(new Object(), 'non_empty_object, single_elem_array') === false;
xtype.is([], 'non_empty_object, single_elem_array') === false;
```

#### Leveraging attributes of extended types when checking values

Using one or a combination of appropriate extended types can help leverage type-specific nuances to provide concise checking for specific aspects of data that are relevant to the application.
  
```js
// Suppose a single character application/operation flag is 
// expected. The single_char_string extended type will check if
// the value is a string and contains exactly one non-whitespace 
// character, regardless of whether it also contains other 
// characters, as long as the other characters are all whitespace.
    
xtype.isSingleCharString('t') === true;
xtype.isSingleCharString(' g ') === true;
xtype.isSingleCharString('  ') === false;
xtype.isSingleCharString('q1') === false;
xtype.isSingleCharString(new String(' z ')) === true;
```

#### Normalizing JavaScript type inconsistencies

With *xtypejs*, primitive values and objects of primitive types are consistently reported as primitives.
  
```js
// With regular JavaScript:

typeof 'foo' === 'string';
typeof new String('foo') === 'object';
0 === 0;
new Number(0) !== 0;
    
// Using xtypejs however will consistently report
// primitives and objects of primitive types
    
xtype.type('foo') === 'string';
xtype.type(new String('foo')) === 'string';
xtype.isZero(0) === true;
xtype.isZero(new Number(0)) === true;
    
xtype.isPrimitive('foo') === true;
xtype.isPrimitive(new String('foo')) === true;
```

#### Delimiting types in type expression strings

By default, you can use any combination of comma, space or pipe characters as type separators. *(A comma followed by a space might be most preferable, but is ultimately a matter of preference and application need)*.
  
```js
xtype.is(flag, 'single_char_string,positive_number');
xtype.is(flag, 'single_char_string positive_number'); 
xtype.is(flag, 'single_char_string|positive_number');
    
xtype.is(flag, 'single_char_string, positive_number');
xtype.is(flag, 'single_char_string | positive_number'); 
``` 

#### Using a custom delimiter

A custom regular expression pattern can also be used in place of the default delimiters. This can be useful in applications for which the default delimiters may not be ideal. For instance, if the type expressions are being stored as part of data validation metadata, but the default delimiter characters are problematic for the specific storage format being used.
  
```js
// You can set a custom pattern used as the type separator
// for string mode. You should ensure this does not conflict 
// with the characters in the type names of whichever type 
// name scheme is being used.
    
xtype.setOptions({separatorPattern: '/'});
    
xtype.is(0, 'zero/positive_number') === true;
xtype.is(25, 'zero/positive_number') === true;
xtype.is(-3, 'zero/positive_number') === false;
    
// We can also have:
    
xtype.setOptions({separatorPattern: '[\\s/]+'});
xtype.is(25, 'zero / positive_number') === true;
``` 

#### Switching to the compact name scheme
  
```js
xtype.setOptions({nameScheme: 'compact'});
    
xtype.is(25, 'num+') === true;               // Positive number
xtype.is({}, 'obj0') === true;               // Empty object
xtype.is('  ', 'str_') === true;             // Blank string
```

#### Using your own custom name scheme
  
```js
xtype.setOptions({
    nameScheme: {
        positive_number: 'pos_num', 
        empty_object: 'emp_obj', 
        blank_string: 'bl_str'
        /* ... */
    }
});
    
xtype.is(25, 'pos_num') === true;            // Positive number
xtype.is({}, 'emp_obj') === true;            // Empty object
xtype.is(' ', 'bl_str') === true;            // Blank string
```

#### Switching back to the default name scheme
  
```js
xtype.setOptions({nameScheme: 'default'});
```

---

**For more usage options, see the full API documentation** ***[here](API.md)*** &nbsp; &lArr;
