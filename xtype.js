/** @license | xtypejs v{{ VERSION }} | (c) 2015, Lucas Ononiwu | MIT license, xtype.js.org/license.txt
 */

/**
 * The MIT License (MIT)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 
(function(root, undefined) {
    
    'use strict';
    
    var moduleExport;
    
    /*
     * -------------------------
     * MODULE VARIABLES AND DATA
     * -------------------------
     */
    
    var VERSION = '{{ VERSION }}',
        TYPE_DELIMITER_DEFAULT_PATTERN = '[|, ]',
        NAME_SCHEME_DEFAULT_OPTION_VALUE = 'default',
        OBJECT_CLASS_REGEX = /^\[object\s(.*)\]$/,
        MAX_REQUEST_TYPE_CACHE_SIZE = 250,
        
        Object = ({}).constructor || Object,
        objCreate = Object.create,
        objKeys = Object.keys,
        objToString = Object.prototype.toString,
        
        optionsModule = objCreate(null),
        
        /*
         * -----------
         * BASE TYPES 
         * -----------
         */
        
        NONE_TYPE           = 0,                // No type
        
        /*  Nothing types  */
        
        NULL                = (1 << 0),
        UNDEFINED           = (1 << 1),
        NAN                 = (1 << 2),
        
        /* Boolean */
        
        TRUE                = (1 << 3),
        FALSE               = (1 << 4),
        
        /*  String  */
        
        EMPTY_STRING        = (1 << 5),        // String with zero characters.
        WHITESPACE          = (1 << 6),        // String with one or more of only whitespace characters.
        SINGLE_CHAR_STRING  = (1 << 7),        // String with exactly one non-whitespace and zero or more whitespace characters.
        MULTI_CHAR_STRING   = (1 << 8),        // String with more than one non-whitespace and zero or more whitespace characters.
        
        /* Number */
        
        ZERO                = (1 << 9),
        POSITIVE_INTEGER    = (1 << 10), 
        POSITIVE_FLOAT      = (1 << 11), 
        POSITIVE_INFINITY   = (1 << 12), 
        NEGATIVE_INTEGER    = (1 << 13),
        NEGATIVE_FLOAT      = (1 << 14),
        NEGATIVE_INFINITY   = (1 << 15),
        
        /* Array */
        
        EMPTY_ARRAY         = (1 << 16),
        SINGLE_ELEM_ARRAY   = (1 << 17), 
        MULTI_ELEM_ARRAY    = (1 << 18),
        
        /* Object */
        
        EMPTY_OBJECT        = (1 << 19),
        SINGLE_PROP_OBJECT  = (1 << 20),
        MULTI_PROP_OBJECT   = (1 << 21),
        
        /*  ECMA types  */
        
        SYMBOL              = (1 << 22),
        FUNCTION            = (1 << 23), 
        DATE                = (1 << 24), 
        ERROR               = (1 << 25), 
        REGEXP              = (1 << 26),
        
        /*
         * --------------
         * DERIVED TYPES 
         * --------------
         */
        
        /*  Derived Simple types  */
        
        BOOLEAN             = (TRUE | FALSE), 
        STRING              = (EMPTY_STRING | WHITESPACE | SINGLE_CHAR_STRING | MULTI_CHAR_STRING), 
        NUMBER              = (POSITIVE_INTEGER | POSITIVE_FLOAT | POSITIVE_INFINITY | NEGATIVE_INTEGER | NEGATIVE_FLOAT | NEGATIVE_INFINITY | ZERO),
        ARRAY               = (EMPTY_ARRAY | SINGLE_ELEM_ARRAY | MULTI_ELEM_ARRAY),
        OBJECT              = (EMPTY_OBJECT | SINGLE_PROP_OBJECT | MULTI_PROP_OBJECT),
        
        /*  Other derived types  */
        
        BLANK_STRING        = (EMPTY_STRING | WHITESPACE),
        NON_EMPTY_STRING    = (WHITESPACE | SINGLE_CHAR_STRING | MULTI_CHAR_STRING),
        NON_BLANK_STRING    = (SINGLE_CHAR_STRING | MULTI_CHAR_STRING),
        
        FLOAT               = (POSITIVE_FLOAT | NEGATIVE_FLOAT),
        INTEGER             = (POSITIVE_INTEGER | NEGATIVE_INTEGER | ZERO),
        INFINITE_NUMBER     = (POSITIVE_INFINITY | NEGATIVE_INFINITY),
        NON_INFINITE_NUMBER = (INTEGER | FLOAT),
        POSITIVE_NUMBER     = (POSITIVE_INTEGER | POSITIVE_FLOAT | POSITIVE_INFINITY),
        NEGATIVE_NUMBER     = (NEGATIVE_INTEGER | NEGATIVE_FLOAT | NEGATIVE_INFINITY),
        NON_ZERO_NUMBER     = (POSITIVE_NUMBER | NEGATIVE_NUMBER),
        NON_NEGATIVE_NUMBER = (POSITIVE_NUMBER | ZERO),
        NON_POSITIVE_NUMBER = (NEGATIVE_NUMBER | ZERO),
        
        NON_EMPTY_OBJECT    = (SINGLE_PROP_OBJECT | MULTI_PROP_OBJECT),
        NON_EMPTY_ARRAY     = (SINGLE_ELEM_ARRAY | MULTI_ELEM_ARRAY),
        
        NOTHING             = (NULL | UNDEFINED),
        PRIMITIVE           = (STRING | NUMBER | BOOLEAN | SYMBOL),
        
        // Composite of all base types (effectively all derived and non-derived types)
        ANY_TYPE = (
                NULL | UNDEFINED | NAN |
                SYMBOL | FUNCTION | DATE | ERROR | REGEXP |
                TRUE | FALSE |
                EMPTY_STRING | WHITESPACE | SINGLE_CHAR_STRING | MULTI_CHAR_STRING |
                ZERO | POSITIVE_INTEGER | POSITIVE_FLOAT | POSITIVE_INFINITY | NEGATIVE_INTEGER | NEGATIVE_FLOAT | NEGATIVE_INFINITY |
                EMPTY_ARRAY | SINGLE_ELEM_ARRAY | MULTI_ELEM_ARRAY | 
                EMPTY_OBJECT | SINGLE_PROP_OBJECT | MULTI_PROP_OBJECT),
        
        // Composite of all derived types (Internal)
        DERIVED_TYPE = (BOOLEAN | STRING | NUMBER | ARRAY | OBJECT);
    
    var TYPE_VALUE_MAPPING = {
            
            'null': NULL,
            'undefined': UNDEFINED,
            nan: NAN,
            
            'true': TRUE,
            'false': FALSE,
            
            string: STRING, 
            empty_string: EMPTY_STRING,
            whitespace: WHITESPACE,
            single_char_string: SINGLE_CHAR_STRING,
            multi_char_string: MULTI_CHAR_STRING,
            // Derived
            blank_string: BLANK_STRING,
            non_empty_string: NON_EMPTY_STRING,
            non_blank_string: NON_BLANK_STRING,
            
            number: NUMBER,
            zero: ZERO,
            positive_integer: POSITIVE_INTEGER, 
            positive_float: POSITIVE_FLOAT, 
            positive_infinity: POSITIVE_INFINITY, 
            negative_integer: NEGATIVE_INTEGER,
            negative_float: NEGATIVE_FLOAT,
            negative_infinity: NEGATIVE_INFINITY, 
            // Composite
            integer: INTEGER,
            float: FLOAT,
            infinite_number: INFINITE_NUMBER,
            positive_number: POSITIVE_NUMBER, 
            negative_number: NEGATIVE_NUMBER,
            non_infinite_number: NON_INFINITE_NUMBER,
            non_positive_number: NON_POSITIVE_NUMBER,
            non_negative_number: NON_NEGATIVE_NUMBER,
            non_zero_number: NON_ZERO_NUMBER,
            
            array: ARRAY, 
            empty_array: EMPTY_ARRAY, 
            single_elem_array: SINGLE_ELEM_ARRAY,
            multi_elem_array: MULTI_ELEM_ARRAY,
            non_empty_array: NON_EMPTY_ARRAY,
            
            object: OBJECT,
            empty_object: EMPTY_OBJECT,
            single_prop_object: SINGLE_PROP_OBJECT,
            multi_prop_object: MULTI_PROP_OBJECT,
            non_empty_object: NON_EMPTY_OBJECT,
            
            boolean: BOOLEAN, 
            symbol: SYMBOL,
            date: DATE, 
            error: ERROR, 
            regexp: REGEXP,             
            'function': FUNCTION, 
            
            nothing: NOTHING,            
            primitive: PRIMITIVE,
            any: ANY_TYPE,
            none: NONE_TYPE
    };
    
    var bundledNameSchemes = objCreate(null),
        compactNameMapping;
    
    /*
     * ----------------------------------
     * BEGIN: Bundled Compact Name Scheme
     * ----------------------------------
     * (Set $XTYPE_JS_BUNDLE_COMPACT_NAME_SCHEME$ = false in Gruntfile to unbundle).
     */
    if (typeof $XTYPE_JS_BUNDLE_COMPACT_NAME_SCHEME$ === 'undefined' || $XTYPE_JS_BUNDLE_COMPACT_NAME_SCHEME$) {
        compactNameMapping = {
            
            'null': 'null',
            'undefined': 'undef',
            nan: 'nan',
            
            string: 'str', 
            empty_string: 'str0',
            whitespace: 'str_',
            single_char_string: 'str1',
            multi_char_string: 'str2+',
            // ---
            blank_string: 'str0_',
            non_empty_string: '-str0',
            non_blank_string: '-str0_',
            
            boolean: 'bool', 
            'true': 'true',
            'false': 'false',
            
            number: 'num',
            positive_number: 'num+', 
            negative_number: 'num-',
            zero: 'num0',
            // ---
            non_positive_number: '-num+',
            non_negative_number: '-num-',
            non_zero_number: '-num0',
            // ---
            integer: 'int',
            positive_integer: 'int+', 
            negative_integer: 'int-', 
            // ---
            float: 'float',
            positive_float: 'float+', 
            negative_float: 'float-',
            // ---
            infinite_number: 'inf', 
            positive_infinity: 'inf+', 
            negative_infinity: 'inf-',
            non_infinite_number: '-inf',
            
            array: 'arr', 
            empty_array: 'arr0', 
            single_elem_array: 'arr1',
            multi_elem_array: 'arr2+',
            non_empty_array: '-arr0',
            
            object: 'obj', 
            empty_object: 'obj0',
            single_prop_object: 'obj1',
            multi_prop_object: 'obj2+',
            non_empty_object: '-obj0',
            
            symbol: 'symb',
            date: 'date', 
            error: 'err', 
            regexp: 'regex',
            'function': 'func',
            
            nothing: 'nil', 
            primitive: 'prim',
            any: 'any',
            none: 'none'
        };
        
        bundledNameSchemes.compact = compactNameMapping;
    }
    
    /*
     * ----------------------------------
     * END: Bundled Compact Name Scheme
     * ----------------------------------
     */
    
    
    var typeDelimiterRegExp = new RegExp(TYPE_DELIMITER_DEFAULT_PATTERN, 'g'),
        isAliasMode = false,
        
        /* Type list string memoization cache */
        typeListStringToTypeIdCache,
        typeListStringToTypeIdCacheSize,
        
        /* Various mappings */        
        objToStringToNameMapping = objCreate(null),
        nameToAliasMapping, 
        aliasToTypeMapping,
        typeToAliasMapping;
    
    /*
     * ----------------
     * MODULE FUNCTIONS
     * ---------------- 
     */
    
    function init(moduleExport) {
        ['Boolean', 'Number', 'String', 'Symbol', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error']
        .forEach(function(objectType) {
            objToStringToNameMapping['[object ' + objectType + ']'] = objectType.toLowerCase();
        });
        
        objKeys(TYPE_VALUE_MAPPING).forEach(function(typeName) {
            defineType(typeName, moduleExport);
        });
        
        buildAliasMappings();
        
        Object.defineProperty(moduleExport, 'VERSION', {
            value: (/\s*{{[^}]*}}\s*/g.test(VERSION) ? 'unknown' : VERSION),
            enumerable: true,
            writable: false,
            configurable: false
        });
    }
    
    function typeOf(item) {
        var typeName = (typeof item === 'object' || typeof item === 'function') ?  
                        (objToStringToNameMapping[objToString.call(item)] || 
                        objToString.call(item).match(OBJECT_CLASS_REGEX)[1].toLowerCase())
                : typeof item;
        
        if (typeName === 'number' && isNaN(item)) {
            typeName = 'nan';
        }
        
        return (isAliasMode ? (nameToAliasMapping[typeName] || typeName) : typeName);
    }
    
    function type(item) {
        var typeName = (item === null) ? 'null'
                : (typeof item === 'object' || typeof item === 'function') ?
                        (objToStringToNameMapping[objToString.call(item)] || 'object')
                : typeof item;
        
        if (typeName === 'number' && isNaN(item)) {
            typeName = 'nan';
        }
        
        return (isAliasMode ? (nameToAliasMapping[typeName] || typeName) : typeName);
    }
    
    /**
     * Checks whether the specified item is of any of the specified types.
     */
    function isType(item, types) {
        var compositeType = (typeof types === 'number') ? (ANY_TYPE & types)
                : (typeof types === 'string' && typeListStringToTypeIdCache[types] !== undefined) ?
                        typeListStringToTypeIdCache[types]
                : (typeof types === 'function' && item instanceof types) ? types
                : getCompositeType(types, item);
        
        return (typeof compositeType === 'function') ||     // Item is a specified instance type
                !!(getBaseType(item, compositeType));
    }

    /**
     * Return the first of the types, if any, matches the type of the item.
     */
    function which(item, types) {
        types = (typeof types === 'string') ? types.split(typeDelimiterRegExp)
                : (!Array.isArray(types) ? [types]
                : types);
        
        var typeCount = types.length,
            typeIndex;
        
        for (typeIndex = 0; typeIndex < typeCount; typeIndex++) {
            if (isType(item, types[typeIndex])) {
                return types[typeIndex];
            }
        }
        return typeToAliasMapping[NONE_TYPE];
    }
    
    /**
     * Returns the most specific available type for the specified item. 
     */
    function xtype(item) {
        return typeToAliasMapping[getBaseType(item)];
    }
    
    /**
     * Gets the derived type of the specified item.
     * @param eligibleTypesComposite The derived type 
     * composite whose member types filter the result.
     */
    function getBaseType(item, eligibleTypesComposite) {
        var itemSimpleType = (aliasToTypeMapping[type(item)] || NONE_TYPE);
        
        if ((itemSimpleType & DERIVED_TYPE) === 0) {
            // Not a derived type, so return eligible type immediately
            return (itemSimpleType & (eligibleTypesComposite !== undefined ? 
                    (ANY_TYPE & eligibleTypesComposite) : ANY_TYPE));
        }
        
        var derivedTypeComposite = (eligibleTypesComposite !== undefined ? 
                (DERIVED_TYPE & eligibleTypesComposite) : DERIVED_TYPE);
        
        if (derivedTypeComposite === 0) {
            // No matching eligible derived type
            return 0;
        }
        
        // Determine base type from derived type
        switch (itemSimpleType) {
            
            case STRING: 
                return ((EMPTY_STRING & derivedTypeComposite) && item.length === 0) ? EMPTY_STRING
                    : ((WHITESPACE & derivedTypeComposite) && item.length > 0 && item.trim().length === 0) ? WHITESPACE
                    : ((MULTI_CHAR_STRING & derivedTypeComposite) && item.trim().length > 1) ? MULTI_CHAR_STRING
                    : ((SINGLE_CHAR_STRING & derivedTypeComposite) && item.trim().length === 1) ? SINGLE_CHAR_STRING
                    : 0;
            
            case NUMBER:
                    // Use non-strict equality to handle primitive and boxed zero number
                return ((ZERO & derivedTypeComposite) && item == 0) ? ZERO                  // jshint ignore:line
                    : ((POSITIVE_INTEGER & derivedTypeComposite) && item > 0 && isFinite(item) && (item % 1) === 0) ? POSITIVE_INTEGER
                    : ((POSITIVE_FLOAT & derivedTypeComposite) && item > 0 && isFinite(item) && (item % 1) !== 0) ? POSITIVE_FLOAT
                    : ((NEGATIVE_INTEGER & derivedTypeComposite) && item < 0 && isFinite(item) && (item % 1) === 0) ? NEGATIVE_INTEGER
                    : ((NEGATIVE_FLOAT & derivedTypeComposite) && item < 0 && isFinite(item) && (item % 1) !== 0) ? NEGATIVE_FLOAT
                    : ((POSITIVE_INFINITY & derivedTypeComposite) && item > 0 && !isFinite(item)) ? POSITIVE_INFINITY
                    : ((NEGATIVE_INFINITY & derivedTypeComposite) && item < 0 && !isFinite(item)) ? NEGATIVE_INFINITY
                    : 0;
            
            case BOOLEAN:
                    // Use non-strict equality to handle primitive and boxed booleans
                return ((TRUE & derivedTypeComposite) && (item == true)) ? TRUE             // jshint ignore:line
                    : ((FALSE & derivedTypeComposite) && (item == false)) ? FALSE           // jshint ignore:line
                    : 0;
            
            case ARRAY:
                return ((EMPTY_ARRAY & derivedTypeComposite) && item.length === 0) ? EMPTY_ARRAY
                    : ((SINGLE_ELEM_ARRAY & derivedTypeComposite) && item.length === 1) ? SINGLE_ELEM_ARRAY
                    : ((MULTI_ELEM_ARRAY & derivedTypeComposite) && item.length > 1) ? MULTI_ELEM_ARRAY
                    : 0;
            
            case OBJECT:
                return ((EMPTY_OBJECT & derivedTypeComposite) && objKeys(item).length === 0) ? EMPTY_OBJECT
                    : ((SINGLE_PROP_OBJECT & derivedTypeComposite) && objKeys(item).length === 1) ? SINGLE_PROP_OBJECT
                    : ((MULTI_PROP_OBJECT & derivedTypeComposite) && objKeys(item).length > 1) ? MULTI_PROP_OBJECT
                    : 0;
        }
        return 0;
    }
    
    /**
     * Gets the composite type consisting of the specified types.
     */
    function getCompositeType(types, item) {
        var typeString;
        
        if (typeof types === 'string') {    // uncached string
            typeString = types;
            types = types.split(typeDelimiterRegExp);
        } else if (!Array.isArray(types)) {
            return (typeof types === 'number') ? (ANY_TYPE & types)
                    : (typeof types === 'function' && item instanceof types) ? types
                    : 0;
        }
        
        var compositeType = 0,
            requestedType;
        
        for (var typeIndex = 0, typeCount = types.length; typeIndex < typeCount; typeIndex++) {
            requestedType = types[typeIndex];
            
            if (typeof requestedType === 'string') {
                compositeType = (compositeType | (aliasToTypeMapping[requestedType] || 0));
            } else if (typeof requestedType === 'number') {
                compositeType = (compositeType | (ANY_TYPE & requestedType));
            } else if (typeof requestedType === 'function' && (item instanceof requestedType)) {
                return requestedType;
            }
        }
        
        if (typeString && (typeListStringToTypeIdCacheSize <= MAX_REQUEST_TYPE_CACHE_SIZE)) {
            typeListStringToTypeIdCache[typeString] = compositeType;
            typeListStringToTypeIdCacheSize++;
        }
        return compositeType;
    }
    
    function registerTypes (customTypes) {
        if (typeof customTypes !== 'object') {
            return;
        }
        var customTypeIds = [],
            existingCompactNames = [],
            customScheme = objCreate(null);        
        
        var customCompactNameScheme = (((arguments.length > 1) && (typeof arguments[1] === 'object')) ? arguments[1] : undefined);  // For deprecated second argument compact names obj. To be removed with next major release.
        
        if (compactNameMapping) {
            objKeys(compactNameMapping).forEach(function(typeName) {
                existingCompactNames.push(compactNameMapping[typeName]);
            });
        }
        
        objKeys(customTypes).forEach(function(customTypeName) {
            var customTypeValue = customTypes[customTypeName],
                customTypeId = (typeof customTypeValue === 'object' ? customTypeValue.typeId : customTypeValue),
                compactName = (typeof customTypeValue === 'object' ? customTypeValue.compactName : undefined);
            
            compactName = (compactName || (customCompactNameScheme ? customCompactNameScheme[customTypeName] : undefined));  // For deprecated second argument compact names obj. To be removed with next major release.
            
            if (!/^([0-9a-z_]+)$/.test(customTypeName)) {
                throw 'Type name must only contain lowercase alphanumeric characters and underscore';
            } else if ((typeof customTypeId !== 'number') || (customTypeId & ANY_TYPE) !== customTypeId) {
                throw 'Custom type Id can only be derived using built-in types.';
            } else if (customTypeIds.indexOf(customTypeId) > -1 || (customTypeId in typeToAliasMapping)) {
                throw 'Custom type Id "' + customTypeId + '" conflicts with new or existing type Id';
            } else if (customTypeName in TYPE_VALUE_MAPPING) {
                throw 'Custom type name "' + customTypeName + '" conflicts with existing type name';
            }
            
            customTypeIds.push(customTypeId);
            
            var customType = objCreate(null);
            
            customType.typeId = customTypeId;
            
            if (compactNameMapping && (typeof compactName === 'string')) {
                if (existingCompactNames.indexOf(compactName) > 0) {
                    throw 'Custom compact name "' + compactName + '" conflicts with new or existing name';
                }
                customType.compactName = compactName;
                existingCompactNames.push(compactName);
            }
            customScheme[customTypeName] = customType;
        });
        
        objKeys(customScheme).forEach(function(customTypeName) {
            var customType = customScheme[customTypeName];
            
            TYPE_VALUE_MAPPING[customTypeName] = customType.typeId;
            
            if ('compactName' in customType) {
                compactNameMapping[customTypeName] = customType.compactName;
            }
            defineType(customTypeName, moduleExport);
        });
        
        buildAliasMappings(nameToAliasMapping);
    }
    
    function registerNameScheme(schemeName, schemeAliases) {
        if (typeof schemeName !== 'string' || schemeName.trim().length === 0 || typeof schemeAliases !== 'object') {
            return;
        }        
        var trimSchemeName = schemeName.trim(),
            existingScheme = bundledNameSchemes[trimSchemeName],
            newScheme = objCreate(null);
        
        objKeys(schemeAliases).forEach(function(typeName) {
           newScheme[typeName] = schemeAliases[typeName];
        });
        
        bundledNameSchemes[trimSchemeName] = newScheme;        
        return existingScheme;
    }
    
    /*
     * -----------------
     * UTILITY FUNCTIONS
     * -----------------
     */
    
    /**
     * Builds an alias map using data in supplied value and alias mappings.
     */
    function buildAliasMappings(aliasMapping) {
        var typeAliasMapping = objCreate(null),
            aliasTypeMapping = objCreate(null),
            nameAliasMapping = objCreate(null),
            usedAliases = objCreate(null);
        
        objKeys(TYPE_VALUE_MAPPING).forEach(function(typeName) {
            var type = TYPE_VALUE_MAPPING[typeName];
            var aliasName = (aliasMapping ? aliasMapping[typeName] : typeName);
            aliasName = ((typeof aliasName === 'string' && aliasName.length > 0) ? aliasName : typeName);
            
            if (aliasName in usedAliases) {
                throw new Error('Type name conflict: "' + aliasName + '" aliased to "' + 
                        typeName + '" and "' + usedAliases[aliasName] + '"');
            }
            typeAliasMapping[type] = aliasName;
            aliasTypeMapping[aliasName] = type;
            nameAliasMapping[typeName] = aliasName;
            
            usedAliases[aliasName] = typeName;
        });
        typeToAliasMapping = typeAliasMapping;
        aliasToTypeMapping = aliasTypeMapping;
        nameToAliasMapping = nameAliasMapping;
        
        isAliasMode = !!aliasMapping;        
        clearTypeListStringCache();
    }
    
    /**
     * Defines the typeId property and associated type check
     * and interface methods for the specified type.
     */
    function defineType(typeName, hostObj) {
        Object.defineProperty(hostObj, typeName.toUpperCase(), {
            value: TYPE_VALUE_MAPPING[typeName],
            enumerable: true,
            writable: false,
            configurable: false
        });
        
        var typeMethodName = getTypeMethodName(typeName);
        
        var typeCheckFunction = function(item) {
            return isType(item, TYPE_VALUE_MAPPING[typeName]);
        };
        
        hostObj[typeMethodName] = typeCheckFunction;
        
        hostObj.not = (hostObj.not || objCreate(null));
        hostObj.not[typeMethodName] = function(value) {
            return !typeCheckFunction(value);
        };
        
        hostObj.any = (hostObj.any || objCreate(null));
        hostObj.any[typeMethodName] = getInterfaceFunction(typeCheckFunction, true, undefined, true);
        
        hostObj.all = (hostObj.all || objCreate(null));
        hostObj.all[typeMethodName] = getInterfaceFunction(typeCheckFunction, undefined, true, false);
        
        hostObj.some = (hostObj.some || objCreate(null));
        hostObj.some[typeMethodName] = getInterfaceFunction(typeCheckFunction, true, true, true);
        
        hostObj.none = (hostObj.none || objCreate(null));
        hostObj.none[typeMethodName] = getInterfaceFunction(typeCheckFunction, true, undefined, false);
    }
    
    /**
     * Clears the memoization cache of type list strings used in requests.
     */
    function clearTypeListStringCache() {
        typeListStringToTypeIdCache = objCreate(null);
        typeListStringToTypeIdCacheSize = 0;
    }
    
    /**
     * Gets the name to be used for the type-matching 
     * method name for the specified type.
     */
    function getTypeMethodName(typeName) { 
        var capitalizedTypeName = typeName.toLowerCase().replace(/(^|_)(.)/g, function(match, camelPrefix, camelChar) {
            return camelChar.toUpperCase();
        });
        return 'is' + capitalizedTypeName;
    }
    
    /**
     * Creates an interface function using the specified parameters.
     */
    function getInterfaceFunction(delegateFunction, trueCondition, falseCondition, terminationResult) {
        return function(values) {
            values = (arguments.length > 1 ? Array.prototype.slice.call(arguments)
                    : Array.isArray(values) ? values
                    : [values]);

            var trueResult = false,
                falseResult = false,
                valueIndex;
            
            for (valueIndex = 0; valueIndex < values.length; valueIndex++) {
                if (delegateFunction(values[valueIndex])) {
                    trueResult = true;
                } else {
                    falseResult = true;
                }
                if ((trueCondition === undefined || trueResult === trueCondition) && 
                        (falseCondition === undefined || falseResult === falseCondition)) {
                    return terminationResult;
                }
            }
            return !terminationResult;
        };
    }
    
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    /*
     * ------------
     * UTIL METHODS
     * ------------
     */
    
    /**
     * Returns the associated type Id for the specified type name.
     */
    function nameToId(type) {
        return (typeof type === 'function' ? type                                       // instance type
                : typeof type === 'string' ? (aliasToTypeMapping[type] || NONE_TYPE)    // type name
                : NONE_TYPE);                                                           // invalid type
    }
    
    /**
     * Returns the associated name for the specified type Id.
     */
    function idToName(type) {
        return (typeof type === 'function' ? type
                : typeof type === 'number' ? (typeToAliasMapping[type] || typeToAliasMapping[NONE_TYPE])
                : typeToAliasMapping[NONE_TYPE]);
    }
    
    /**
     * Returns a list of the names of all types.
     */
    function typeNames() {
        return objKeys(aliasToTypeMapping);
    }
    
    /**
     * Returns a list of the type ids of all types.
     */
    function typeIds() {
        var typeIdList = [];
        
        objKeys(aliasToTypeMapping).forEach(function(alias) {
            typeIdList.push(aliasToTypeMapping[alias]);
        });
        return typeIdList;
    }
    
    /*
     * --------------
     * OPTIONS MODULE
     * --------------
     */
    
    optionsModule.setDelimiterPattern = function(delimiterPattern) {
        delimiterPattern = ((delimiterPattern === null || delimiterPattern === undefined || delimiterPattern === '') ? 
                TYPE_DELIMITER_DEFAULT_PATTERN : delimiterPattern);
        
        if (typeof delimiterPattern !== 'string') {
            return;
        }
        delimiterPattern = ('[ ]*' + delimiterPattern + '[ ]*');
        
        if (delimiterPattern === typeDelimiterRegExp.source) {
            return;
        }
        
        typeDelimiterRegExp = new RegExp(delimiterPattern, 'g');
        clearTypeListStringCache();
    };
    
    optionsModule.setNameScheme = function(nameScheme) {
        if (nameScheme === undefined || nameScheme === NAME_SCHEME_DEFAULT_OPTION_VALUE) {
            buildAliasMappings();
            return;
        }
        if (typeof nameScheme === 'string' && (nameScheme in bundledNameSchemes)) {
            nameScheme = (bundledNameSchemes[nameScheme]);
        }
        if (typeof nameScheme === 'object') {
            buildAliasMappings(nameScheme);
        }
    };
    
    optionsModule.set = function(options) {
        if (typeof options !== 'object') {
            return;
        }
        objKeys(options).forEach(function(optionName) {
            var optionMethod = optionsModule['set' + capitalize(optionName)];
            
            if (typeof optionMethod === 'function') {
                optionMethod(options[optionName]);
            }
        });
    };
    
    /*
     * ---------------------
     * MODULE SETUP / EXPORT
     * ---------------------
     */
    
    moduleExport = xtype;
    
    init(moduleExport);
    
    moduleExport.type = type;
    moduleExport.typeOf = typeOf;
    moduleExport.which = which;
    moduleExport.is = isType;
    
    moduleExport.typeIds = typeIds;
    moduleExport.typeNames = typeNames;
    moduleExport.nameToId = nameToId;
    moduleExport.idToName = idToName;
    
    moduleExport.options = optionsModule;
    moduleExport.registerTypes = registerTypes;
    moduleExport.registerNameScheme = registerNameScheme;
    
    moduleExport.setOptions = optionsModule.set;    // Deprecated. To be removed with next major release.
    
    /*
     * Export module
     */
    var LIB_NAME = 'xtype';
    
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = moduleExport;
        }
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return moduleExport;
        });
    } else {
        moduleExport.noConflict = (function(previouslyDefinedValue) {
            return function() {
                root[LIB_NAME] = previouslyDefinedValue;
                delete moduleExport.noConflict;
                return moduleExport;
            };
        })(root[LIB_NAME]);
        
        root[LIB_NAME] = moduleExport;
    }
    
})(this);