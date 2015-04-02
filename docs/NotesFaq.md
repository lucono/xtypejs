# xtypejs - Notes / FAQ

#### [Back to Home](//github.com/lucono/xtypejs) &nbsp; &lArr;


### The `NONE` type
  
`NONE` is the composite type consisting of ***no*** types, which means that no value can actually ever match `NONE`. Therefore, `xtype.isNone(item)` will always be false for any value of `item`.


### The `ANY` type
  
`ANY` is the composite type consisting of ***all*** types, which means that all values will always match `ANY`. Therefore, `xtype.isAny(item)` will always be true for any value of `item`.
  
  
### `NaN` Handling
  
The JavaScript NaN value is rarely ever useful in JavaScript applications, and its presence usually only creates many additional instances in an application where it becomes necessary to perform additional type and data checking that are not relevant to the primary concern of the application.

Because of this, *xtypejs* implements the special dedicated type `'nan'` (type Id `xtype.NAN`) for the JavaScript `NaN` value, that is independent of the `number` type, effectively eliminating the need for applications using *xtypejs* to explicitly handle `NaN` values when expecting `number` types. `NaN` values are particularly a problem in applications because though they are reported as the `number` type by the JavaScript runtime, there is effectively little to nothing an application can do to make meaningful use of them in the expected `number` context. The *xtypejs* approach helps by not only eliminating the effort of writing checking and handling code for `NaN` values, but also helps keep the application code cleaner and more concise by eliminating the clutter that's almost always associated with these checks.


### JavaScript's `isNaN` vs. *xtypejs* `xtype.isNan`
  
There is an important difference between the behavior of the *xtypejs* `xtype.isNan` method and JavaScript's `isNaN` function. The *xtypejs* `xtype.isNan` method will only return true for values that represent the JavaScript *NaN* value. However, JavaScript's `isNaN` function can also return true for values that are entirely not of the `number` type.

So, the *xtypejs* `xtype.isNan` method will only return true for `number` types that do not have valid numeric values, and will not return true even for values that while not representing a valid numeric value, are of a non-`number` type such as `string`, or some other type.

For instance, the mathematical operation `(5 / 'a')` is a division that results in the *NaN* value because it attempts to divide a number by a (non-numeric) string. So though the `typeof` of the result is `number`, its value is *NaN*. JavaScript's `isNaN` function and the *xtypejs* `xtype.isNan` method both report it identically in this case, as being *NaN*.

```js
typeof (5 / 'a') === 'number';

isNaN(5 / 'a') === true;
isNaN(new Number(5 / 'a')) === true;

xtype.isNan(5 / 'a') === true;
xtype.isNan(new Number(5 / 'a')) === true;
```

But considering a different value, the literal `'5a'`, it is of `string` type and not of `number` type, and therefore does not represent a failed value intended as a `number` value. It also is clearly not the *NaN* value. However, JavaScript's `isNaN` function will return `true` for this value, but the *xtypejs* `xtype.isNan` method will return `false`. This behavior is the key difference between JavaScript's `isNaN` function and the *xtypejs* `xtype.isNan` method.

```js
typeof '5a' === 'string';

isNaN('5a') === true;
isNaN(new Number('5a')) === true;

// But xtypejs will return false for the string value 
// and true for the number object, as it is then no longer 
// a string, but now a Number with a non-valid value:

xtype.isNan('5a') === false;
xtype.isNan(new Number('5a')) === true;
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
