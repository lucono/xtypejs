[![xtypejs Logo](http://xtype.js.org/assets/img/xtypejs-logo.png)](http://xtype.js.org/) <a href="https://travis-ci.org/lucono/xtypejs"><img align="right" src="https://travis-ci.org/lucono/xtypejs.svg?branch=master"></a>
#### Elegant, highly efficient data validation for JavaScript Apps

---

# Arbitrary Custom Types Support *(WIP)*

**Note**: *The examples in this documentation mostly use compact type names.*

Previously, xtypejs only allowed you to register composite simple and extended types (ie. built-in types), allowing you to specify the type Id for the composite type, which captured the composition of the new type:

```js
xtype.registerTypes({    
    non_negative_integer: {
        typeId: (xtype.NON_NEGATIVE_NUMBER & xtype.INTEGER),
        compactName: '-int-'
    }
});
```

## Enhancements To User-Defined Types

There is now extensive support for arbitrary custom types, and an enhanced mechanism for combining built-in types (ie. simple and extended types), instance types, and custom types (ie. custom-validated types), in a standard, unified way that works for all types, and allows combinations of arbitrary types (simple, extended, instance, and custom types), while also preserving the bitwise efficiency of combinations of the built-in (simple and extended) types, which are the only types that use type Ids.

The enhanced mechanism uses a `definition` field which is universal for defining new **named instance types**, arbitrary **custom types**, **simple** and **extended** types, and any composite of these types.


### Simple and Extended Types

The same `non_negative_integer` type registration example above would now look like the following:

```js
xtype.registerTypes({
    non_negative_integer: {
        definition: 'non_negative_number, integer',
        matchMode: 'all',
        compactName: '-int-'
    }
});
```

The value of the `matchMode` property can be `'any'` (the default if omitted), which causes the newly registered composite type validate successfully if ***any*** of the individual component types validate successfully for the value being validated, or it can be `'all'`, which causes the newly registered composite type to validate successfully only if ***all*** of the individual component types validate successfully for the value being validated.

After registering the new type, we can now use the name of the custom type in type expression strings, and a new `is<Type>` method with the camel-cased name of the new type will also become available on the xtype module for validating the type:

```js
xtype.is(value, '-int-');                   // true if value is a non-negative integer
xtype.isNonNegativeInteger(value);          // true if value is a non-negative integer
```

Finally, for new types **composed entirely of only the xtypejs built-in simple and/or extended types**, a unique type Id constant for the new type will also become available on the xtype module, with the uppercased name of the new type:

```js
xtype.NON_NEGATIVE_INTEGER;     // Has the value of (xtype.NON_NEGATIVE_NUMBER & xtype.INTEGER)
```

> **Note**: *Type Ids are only used by simple and extended types (the xtypejs built-in types) and their pre-defined or user-defined composites, and are not used by Instance and Custom types.*


### Instance Types

Before now, instance types could be validated, but could not be captured in a type expression string like you could with the xtypejs built-in simple and extended types. So with just the built-in simple and/or extended types, you could do this:

```js
switch (xtype.which(value, 'int+ str2+') {
    case 'int+':
        // Fetch and display product with value as the product Id number
        break;
        
    case 'str2+':
        // Fetch and display product with value as the product name string
        break;
        
    default:
        // Handle invalid value.. cannot display product
}
```

But to do something similar when there's an instance type involved, you'd have had to use an array to be able to capture the instance type (ie, the constructor function that identifies the instance type):

```js
switch (xtype.which(value, ['int+', 'str2+', Product]) {
    case 'int+':
        // Fetch and display product with value as the product Id number
        break;
        
    case 'str2+':
        // Fetch and display product with value as the product name string
        break;
        
    case Product:
        // value is already a Product object, so just display it
        
    default:
        // Handle invalid value.. cannot display product
}

// Same thing when using xtype.is:

var isValid = xtype.is(value, ['int+', 'str2+', Product]);
```

But the enhanced custom type definition mechanism now allows you to also register instance types, which then become **named instance types** for which the names are available for use in type expression strings.

So to re-implement the previous `Product` example using a registered instance type (ie, a *named instance type*), you can now have:


```js
xtype.registerTypes({    
    product: {
        definition: Product,
        compactName: 'prod'
    }
});

switch (xtype.which(value, 'int+ str2+ prod') {
    case 'int+':
        // Fetch and display product with value as the product Id number
        break;
        
    case 'str2+':
        // Fetch and display product with value as the product name string
        break;
        
    case 'prod':
        // value is already a Product object, so just display it
        
    default:
        // Handle invalid value.. cannot display product
}

// Same thing when using xtype.is:

var isValid = xtype.is(value, 'int+ str2+ prod');
```

We can also now use the name of the *named instance type* in type expression strings, and a new `is<Type>` method with the camel-cased name of the new type will also become available on the xtype module for validating the type:

```js
xtype.is(value, 'prod');
xtype.isProduct(value);
xtype.is(value, Product);       // Validation still works with constructor as the type specifier
```

Note that registration is still not required for validating all other non-registered (or even registered) instance types, which can continue to be validated using the constructor function as a type specifier:

```js
xtype.is(value, RandomTypeConstructor);     // true if value is object of RandomTypeConstructor
```

Being able to capture instance types in type expression strings provides greater flexibility and new possibilities, such as being able to include instance types in validation specs that are stored (as strings) in configuration, for use in data validation at runtime.

> **Note**: There is no type Id associated with instance types (whether registered in xtypejs or not). So in the `'product'` example above, there will be no `xtype.PRODUCT` type Id property exposed on the xtype module as a result of the registration of the `'product'` type.


### Custom Types

With the enhanced custom type definition mechanism, you can also now define and register any arbitrarily validated custom type by providing an object in the `'definition'` field which should have a `'validator'` property whose value is the validator function for the custom type. The validator function must be able to accept as the first argument, the value being validated, and return `true` (not a truthy value) if the value is considered valid for the custom type.

The following example defines a custom type named `'checking_account'` (compact name `'chk_acct'`):

```js
xtype.registerTypes({
    checking_account: {
        definition: {
            validator: function(value) {
                return (value instanceof Account && value.accountType === 'checking');
            }
        },
        compactName: 'chk_acct'
    }
});
```

So we could now do this:

```js
switch (xtype.which(value, 'int+ str2+ chk_acct') {
    case 'int+':
        // Search for a checking account using value as account number
        break;
        
    case 'str2+':
        // Search for a checking account using value as account name
        break;
        
    case 'chk_acct':
        // value is already a checking account, so just use it
        
    default:
        // Handle invalid value
}

// Same thing when using xtype.is:

var isValid = xtype.is(value, 'int+ str2+ chk_acct');
```

We could also now use the name of the custom type in type expression strings, and a new `is<Type>` method with the camel-cased name of the new type will also become available on the xtype module for validating the type:

```js
xtype.is(value, 'chk_acct');
xtype.isCheckingAccount(value);
```

> **Note**: There is no type Id associated with custom types (user-defined types with custom validators). So in the `'checking_account'` example above, there will be no `xtype.CHECKING_ACCOUNT` type Id property exposed on the xtype module as a result of the registration of the `'checking_account'` type.


### Arbitrary Type Combinations

The enhanced support for custom type definitions allows combinations of arbitrary types (simple, extended, instance, and custom types) in the definition of new custom types.

> **Note**: Individual types used to compose other types can only be referenced by name in type definitions after they themselves have already been registered. Therefore, a custom type cannot be referenced in a custom type definition that is in the same type registration call that also registers the referenced type. It can only be referenced in another type registration call subsequent to the call with which the referenced type was registered.

```js
// First register the instance type 'checking_account' and the custom type 'active_account':

xtype.registerTypes({

    // Named instance type for CheckingAccount objects:
    
    checking_account: {
        definition: CheckingAccount,
        compactName: 'chk_acct'
    },
    
    // Custom type for accounts that are considered to be active:
    
    active_account: {
        definition: {
            validator: function(value) {
                return (value instanceof Account && 
                        value.getStatus() !== 'closed' && 
                        value.getDaysSinceLastActivity() < 90);
            }
        },
        compactName: 'actv_acct'
    }
});

// Then register the custom type 'active_checking_account' which uses a combination of
// types to capture validation for a value that should be a non-empty object (-obj0),
// a CheckingAccount instance (chk_acct), and an active account (actv_acct):

xtype.registerTypes({
    active_checking_account: {
        definition: '-obj0 chk_acct actv_acct',
        compactName: 'actv_chk_acct'
    }
});
```
The `active_checking_account` type above (compact name `'actv_chk_acct'`) is an example of a combination of a built-in extended type (`'-obj0'`), an instance type (`'chk_acct'`) and a previously defined custom type (`'actv_acct'`), to produce a new data-validating type.

After registering the custom type, its name can now be used in type expression strings, and a new `is<Type>` method with the camel-cased name of the new type will also become available on the xtype module for validating the type:

```js
xtype.is(value, 'actv_chk_acct');
xtype.isActiveCheckingAccount(value);
```