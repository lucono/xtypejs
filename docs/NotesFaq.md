# xtypejs - Notes / FAQ

#### [Back to Home](//github.com/lucono/xtypejs) &nbsp; &lArr;


### The `NONE` type
  
`NONE` is the composite type consisting of ***no*** types, which means that no value can actually ever match `NONE`. Therefore, `xtype.isNone(item)` will always be false for any value of `item`.


### The `ANY` type
  
`ANY` is the composite type consisting of ***all*** types, which means that all values will always match `ANY`. Therefore, `xtype.isAny(item)` will always be true for any value of `item`.


### JavaScript `isNaN` / ES6 `Number.isNaN` vs. *xtypejs* `xtype.isNan`
  
There is an important difference between the behavior of the *xtypejs* `xtype.isNan` method and JavaScript's `isNaN` function and `Number.isNaN` method. The *xtypejs* `xtype.isNan` method will only return true for values that represent the JavaScript `NaN` value. However, JavaScript's `isNaN` function can also return true for values that are entirely not of the `number` type because it first tries to coerce the value to a number, whereas JavaScript's `Number.isNaN` method will not try to coerce the value to a number but will return false for `Number` objects with `NaN` values.

So, the *xtypejs* `xtype.isNan` method will only return true for `number` types that do not have valid numeric values, and will not return true even for values that while not representing a valid numeric value, are of a non-`number` type such as `string`, or some other type. It does this consistently for both primitive and object number and non-number values.

For instance, consider two cases:

* The mathematical operation `(5 / 'a')` is a division that results in the `NaN` value because it attempts to divide a number by a ("non-numeric") string. So though the `typeof` of the result is `number`, its value is `NaN`. So any `NaN` check should ideally return true for this value, both in the primitive number case `(5 / 'a')` and the number object case (`new Number(5 / 'a')`).

* Consider a different value, the literal `'5a'`. It is of `string` type and not of `number` type, and therefore does not represent a failed value intended as a `number` value. It also is clearly not the `NaN` value. So any `NaN` check should ideally return false for this value in the string case (`'5a'`) and true for the number object case (`new Number('5a')`).
  
  Neither JavaScript's `isNaN` function nor the newer ECMAScript 6 `Number.isNaN` method get it right for both cases, and for the primitive and non-primitive cases.
   
  **Plain JavaScript**
  ```js
  typeof (5 / 'a')  === 'number';
  typeof '5a'       === 'string';
  
  // isNaN
  
  isNaN(5 / 'a')                     === true;   // right
  isNaN(new Number(5 / 'a'))         === true;   // right
  isNaN('5a')                        === true;   // wrong - coerced to number
  isNaN(new Number('5a'))            === true;   // right
  
  // Number.isNaN
  
  Number.isNaN(5 / 'a')              === true;   // right
  Number.isNaN(new Number(5 / 'a'))  === false;  // wrong - should be true
  Number.isNaN('5a')                 === false;  // right
  Number.isNaN(new Number('5a'))     === false;  // wrong - should be true
  ```
  
  **xtypejs**
  ```js
  // But xtypejs will return false for the string value as it does not
  // try to coerce it to number, and true for the number object versions
  // as they then represent numbers having non-valid number values:
  
  xtype.type(5 / 'a')  === 'nan';
  xtype.type('5a')     === 'string';
  
  xtype.isNan(5 / 'a')              === true;    // right
  xtype.isNan(new Number(5 / 'a'))  === true;    // right
  xtype.isNan('5a')                 === false;   // right - no coercion
  xtype.isNan(new Number('5a'))     === true;    // right
  ```


### Type expression strings vs. type Id expressions
  
  Internally, type matching is always performed with type Ids (or constants) for better performance. So, although a type can be checked using either of the following two methods:
  
```js
xtype.is(val, 'non_empty_object, non_empty_array, single_char_string')

xtype.is(val, xtype.NON_EMPTY_OBJECT | xtype.NON_EMPTY_ARRAY | xtype.SINGLE_CHAR_STRING)
```
  
The call:
  
```js
xtype.is(val, 'non_empty_object, non_empty_array, single_char_string')
```
  
will first convert the string parameter:
  
```js
'non_empty_object, non_empty_array, single_char_string'
```  
  
to the value of:
  
```js
(xtype.NON_EMPTY_OBJECT | xtype.NON_EMPTY_ARRAY | xtype.SINGLE_CHAR_STRING)
```  
  
which results in a single numeric value that is then used for the type check.
    
For improved performance, this numeric value is also then internally memoized for use in all subsequent calls for type checking, where the provided matching string is the same as the one previously used in the call. The memoization cache is capped at a small limit, and contains only previously used matching string primitives, and their equivalent numeric value primitives.  
  
Also, all the individual type checking functions internally use type Ids. So for instance, the following call:
  
```js
xtype.isSinglePropObject(val)
```
  
is less verbose, but same as:
    
```js
xtype.is(val, xtype.SINGLE_PROP_OBJECT)
```


### Source vs. Minified version

*xtypejs* is implemented as a single file, which can be used with or without prior minification in both CommonJS and AMD based environments, as well as in a browser via regular script tag.
