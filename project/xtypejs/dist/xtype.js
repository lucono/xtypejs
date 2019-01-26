/** @license | xtypejs v0.7.1 | (c) 2015, Lucas Ononiwu | MIT license, xtype.js.org/license.txt
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

    /*
    * --------------
    * MODULE GLOBALS
    * --------------
    */
    
    var LIB_NAME = 'xtype',
        LIB_VERSION = '0.7.1',
        
        TYPE_DELIMITER_DEFAULT_PATTERN = '[|, ]',
        NAME_SCHEME_DEFAULT_OPTION_VALUE = 'default',
        OBJECT_CLASS_REGEX = /^\[object\s(.*)\]$/,
        MAX_REQUEST_TYPE_CACHE_SIZE = 250,
        
        /* --- Extensions and Module Refresh --- */

        registeredExtensions = [],
        
        /* --- Localized function references --- */

        Array = ([]).constructor || Array,
        isArray = Array.isArray,
        arrayPush = Array.prototype.push,
        arraySlice = Array.prototype.slice,
        
        Object = ({}).constructor || Object,
        objCreate = Object.create,
        objKeys = Object.keys,
        objToString = Object.prototype.toString,

        newObj = function() {
            return objCreate(null);
        },
        
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
            
            // -- Absent --
            'null': NULL,
            'undefined': UNDEFINED,
            nan: NAN,
            
            // -- Boolean --
            boolean: BOOLEAN, 
            'true': TRUE,
            'false': FALSE,
            
            // -- String --
            string: STRING, 
            empty_string: EMPTY_STRING,
            whitespace: WHITESPACE,
            single_char_string: SINGLE_CHAR_STRING,
            multi_char_string: MULTI_CHAR_STRING,
            // Composite
            blank_string: BLANK_STRING,
            non_empty_string: NON_EMPTY_STRING,
            non_blank_string: NON_BLANK_STRING,
            
            // -- Number --
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
            
            // -- Array --
            array: ARRAY, 
            empty_array: EMPTY_ARRAY, 
            single_elem_array: SINGLE_ELEM_ARRAY,
            multi_elem_array: MULTI_ELEM_ARRAY,
            non_empty_array: NON_EMPTY_ARRAY,
            
            // -- Object --
            object: OBJECT,
            empty_object: EMPTY_OBJECT,
            single_prop_object: SINGLE_PROP_OBJECT,
            multi_prop_object: MULTI_PROP_OBJECT,
            non_empty_object: NON_EMPTY_OBJECT,
            
            // -- Other --
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

    /* Custome Typeof */
    
    var TYPEOF_NULL = 'null',
        TYPEOF_NAN = 'nan';


    /*
    * --------------
    * MODULE FACTORY
    * --------------
    */
    
    function newModuleInstance() {
        
        var moduleRefreshHandlers = [],
            nameSchemes = newObj(),
            activeNameScheme,
            isAliasMode = false,
            typeDelimiterRegExp,
            
            /* Type list string memoization cache */
            typeListStringToTypeIdCache = newObj(),
            typeListStringToTypeIdCacheSize = 0,
            
            /* Various mappings */
            typeToValueMapping = newObj(),
            aliasToTypeMapping = newObj(),
            typeToAliasMapping = newObj(),
            nameToAliasMapping = newObj(),
            objToStringToNameMapping = newObj(),
        
            optionsModule = newObj(),
            extensionsModule = newObj();
        
        /*
         * ----------------
         * MODULE FUNCTIONS
         * ---------------- 
         */
        
        function typeOf(item) {
            var typeName = (typeof item === 'object' || typeof item === 'function') ?  
                            (objToStringToNameMapping[objToString.call(item)] || 
                            objToString.call(item).match(OBJECT_CLASS_REGEX)[1].toLowerCase())
                    : typeof item;
            
            if (typeName === 'number' && isNaN(item)) {
                typeName = TYPEOF_NAN;
            }
            
            return (isAliasMode ? (nameToAliasMapping[typeName] || typeName) : typeName);
        }
        
        function type(item) {
            var typeName = (item === null) ? TYPEOF_NULL
                    : (typeof item === 'object' || typeof item === 'function') ?
                            (objToStringToNameMapping[objToString.call(item)] || 'object')
                    : typeof item;
            
            if (typeName === 'number' && isNaN(item)) {
                typeName = TYPEOF_NAN;
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
                    : getCompositeType(types, item);
            
            return (typeof compositeType === 'function') ||     // Item is a specified instance type
                    (typeof compositeType === 'object') ||      // Item is a specified custom type
                    !!(getBaseType(item, compositeType));
        }
    
        /**
         * Return the first of the types, if any, matches the type of the item.
         */
        function which(item, types) {
            types = (typeof types === 'string') ? types.split(typeDelimiterRegExp)
                    : (!isArray(types) ? [types]
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
            
            var strLength,          // strings
                strTrimLength,
                arrElemCount,       // arrays
                objPropCount;       // objects
            
            // Determine base type from derived type
            switch (itemSimpleType) {
                
                case STRING: 
                    return ((strLength = item.length) && (strTrimLength = item.trim().length) && false) ? 0   // evaluate multi-use values only once
                        : ((EMPTY_STRING & derivedTypeComposite) && strLength === 0) ? EMPTY_STRING
                        : ((WHITESPACE & derivedTypeComposite) && strLength > 0 && strTrimLength === 0) ? WHITESPACE
                        : ((MULTI_CHAR_STRING & derivedTypeComposite) && strTrimLength > 1) ? MULTI_CHAR_STRING
                        : ((SINGLE_CHAR_STRING & derivedTypeComposite) && strTrimLength === 1) ? SINGLE_CHAR_STRING
                        : 0;
                
                case NUMBER:
                        // Use non-strict equality to handle primitive and boxed zero number
                    return ((ZERO & derivedTypeComposite) && item == 0) ? ZERO                  // jshint ignore:line                        
                        : ((NON_INFINITE_NUMBER & derivedTypeComposite) && isFinite(item)) ? (
                                ((INTEGER & derivedTypeComposite) && (item % 1) === 0) ? (
                                        ((POSITIVE_INTEGER & derivedTypeComposite) && item > 0) ? POSITIVE_INTEGER
                                        : ((NEGATIVE_INTEGER & derivedTypeComposite) && item < 0) ? NEGATIVE_INTEGER
                                        : 0)
                                : ((FLOAT & derivedTypeComposite) && (item % 1) !== 0) ? (
                                        ((POSITIVE_FLOAT & derivedTypeComposite) && item > 0) ? POSITIVE_FLOAT
                                        : ((NEGATIVE_FLOAT & derivedTypeComposite) && item < 0) ? NEGATIVE_FLOAT
                                        : 0)
                                : 0)
                        : ((INFINITE_NUMBER & derivedTypeComposite) && !isFinite(item)) ? (
                                ((POSITIVE_INFINITY & derivedTypeComposite) && item > 0) ? POSITIVE_INFINITY
                                : ((NEGATIVE_INFINITY & derivedTypeComposite) && item < 0) ? NEGATIVE_INFINITY
                                : 0)
                        : 0;
                
                case BOOLEAN:
                        // Use non-strict equality to handle primitive and boxed booleans
                    return ((TRUE & derivedTypeComposite) && (item == true)) ? TRUE             // jshint ignore:line
                        : ((FALSE & derivedTypeComposite) && (item == false)) ? FALSE           // jshint ignore:line
                        : 0;
                
                case ARRAY:
                    return ((arrElemCount = item.length) && false) ? 0   // evaluate multi-use values only once
                        : ((EMPTY_ARRAY & derivedTypeComposite) && arrElemCount === 0) ? EMPTY_ARRAY
                        : ((SINGLE_ELEM_ARRAY & derivedTypeComposite) && arrElemCount === 1) ? SINGLE_ELEM_ARRAY
                        : ((MULTI_ELEM_ARRAY & derivedTypeComposite) && arrElemCount > 1) ? MULTI_ELEM_ARRAY
                        : 0;
                
                case OBJECT:
                    return ((objPropCount = objKeys(item).length) && false) ? 0   // evaluate multi-use values only once
                        : ((EMPTY_OBJECT & derivedTypeComposite) && objPropCount === 0) ? EMPTY_OBJECT
                        : ((SINGLE_PROP_OBJECT & derivedTypeComposite) && objPropCount === 1) ? SINGLE_PROP_OBJECT
                        : ((MULTI_PROP_OBJECT & derivedTypeComposite) && objPropCount > 1) ? MULTI_PROP_OBJECT
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
            } else if (!isArray(types)) {
                types = [types];
            }
            
            var compositeType = 0,
                requestedType,
                typeDefinition;
            
            for (var typeIndex = 0, typeCount = types.length; typeIndex < typeCount; typeIndex++) {
                requestedType = types[typeIndex];
                typeDefinition = (typeof requestedType === 'string') ? (aliasToTypeMapping[requestedType] || 0) 
                        : (typeof requestedType === 'object') ?         // Support for unregistered custom-validated type if validator function field present in obj
                                (requestedType !== null && typeof requestedType.validator === 'function' ? requestedType : 0)
                        : (requestedType || 0);
                
                if (typeof typeDefinition === 'number') {
                    compositeType = (compositeType | (ANY_TYPE & typeDefinition));
                } else if (typeof typeDefinition === 'function' && (item instanceof typeDefinition)) {
                    return typeDefinition;
                } else if (typeof typeDefinition === 'object' && typeDefinition.validator(item) === true) {     // No further need to null-check type definition
                    return typeDefinition;
                }
            }
            
            if (compositeType && typeString && (typeListStringToTypeIdCacheSize <= MAX_REQUEST_TYPE_CACHE_SIZE)) {
                typeListStringToTypeIdCache[typeString] = compositeType;
                typeListStringToTypeIdCacheSize++;
            }
            return compositeType;
        }
        
        /*
         * ----------------
         * HELPER FUNCTIONS
         * ----------------
         */

        /**
         * Builds an alias map using data in supplied value and alias mappings.
         */
        function buildAliasMappings() {
            var typeAliasMapping = newObj(),
                aliasTypeMapping = newObj(),
                nameAliasMapping = newObj(),
                usedAliases = newObj();
            
            objKeys(typeToValueMapping).forEach(function(typeName) {
                var typeValue = typeToValueMapping[typeName];
                var aliasName = (activeNameScheme ? activeNameScheme[typeName] : typeName);
                aliasName = ((typeof aliasName === 'string' && aliasName.length > 0) ? aliasName : typeName);
                
                if (aliasName in usedAliases) {
                    throwError('Type name conflict: "' + aliasName + '" is aliased to "' + 
                            typeName + '" and "' + usedAliases[aliasName] + '"');
                }
                if (typeof typeValue === 'number') {
                    typeAliasMapping[typeValue] = aliasName;     // Type Ids used only for built-in simple and extended types (with numeric Ids) 
                }
                aliasTypeMapping[aliasName] = typeValue;
                nameAliasMapping[typeName] = aliasName;
                
                usedAliases[aliasName] = typeName;
            });
            typeToAliasMapping = typeAliasMapping;
            aliasToTypeMapping = aliasTypeMapping;
            nameToAliasMapping = nameAliasMapping;
            
            isAliasMode = !!activeNameScheme;
            clearTypeListStringCache();
        }
        
        function defineInterfacePackagesAndMethods(hostObj) {
            hostObj.not = newObj();
            hostObj.any = newObj();
            hostObj.all = newObj();
            hostObj.some = newObj();
            hostObj.none = newObj();

            hostObj.not.is = function(value, types) {
                return !isType(value, types);
            };

            hostObj.any.is = getInterfaceFunction(isType, true, true, undefined, true);
            hostObj.all.is = getInterfaceFunction(isType, true, undefined, true, false);
            hostObj.some.is = getInterfaceFunction(isType, true, true, true, true);
            hostObj.none.is = getInterfaceFunction(isType, true, true, undefined, false);
        }
        
        /**
         * Defines the typeId property and associated type check
         * and interface methods for the specified type.
         */
        function defineType(typeName, typeDefinition, hostObj) {
            if (typeName in typeToValueMapping) {
                throwError('Cannot define type \'' + typeName + '\' - type already defined');
            }

            typeToValueMapping[typeName] = typeDefinition;
            
            if (typeof typeDefinition === 'number') {
                Object.defineProperty(hostObj, typeName.toUpperCase(), {
                    value: typeToValueMapping[typeName],
                    enumerable: true,
                    writable: false,
                    configurable: false
                });
            }
            
            var typeMethodName = getTypeMethodName(typeName);
            
            var typeCheckFunction = function(item) {
                return isType(item, (typeToValueMapping[typeName] || typeName));
            };
            
            hostObj[typeMethodName] = typeCheckFunction;
            
            hostObj.not[typeMethodName] = function(value) {
                return !typeCheckFunction(value);
            };
            
            hostObj.any[typeMethodName] = getInterfaceFunction(typeCheckFunction, false, true, undefined, true);
            hostObj.all[typeMethodName] = getInterfaceFunction(typeCheckFunction, false, undefined, true, false);
            hostObj.some[typeMethodName] = getInterfaceFunction(typeCheckFunction, false, true, true, true);
            hostObj.none[typeMethodName] = getInterfaceFunction(typeCheckFunction, false, true, undefined, false);
        }
        
        /**
         * Clears the memoization cache of type list strings used in requests.
         */
        function clearTypeListStringCache() {
            typeListStringToTypeIdCache = newObj();
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
        function getInterfaceFunction(delegateFunction, withTypes, trueCondition, falseCondition, terminationResult) {
            return function(values, types) {
                values = (!withTypes && arguments.length > 1 ? arraySlice.call(arguments)
                        : isArray(values) ? values
                        : [values]);
    
                var trueResult = false,
                    falseResult = false,
                    valueIndex;
                
                for (valueIndex = 0; valueIndex < values.length; valueIndex++) {
                    if (delegateFunction(values[valueIndex], types)) {
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

        function throwError(message) {
            throw new Error(LIB_NAME + ': ' + message);
        }
        
        /*
         * -----------------
         * EXTENSIONS MODULE
         * -----------------
         */
        
        function registerNameScheme(schemeName, schemeAliases) {
            if (typeof schemeName !== 'string' || schemeName.trim().length === 0 || typeof schemeAliases !== 'object') {
                return;
            }
            var trimSchemeName = schemeName.trim(),
                existingScheme = nameSchemes[trimSchemeName],
                newScheme = newObj();
            
            objKeys(schemeAliases).forEach(function(typeName) {
               newScheme[typeName] = schemeAliases[typeName];
            });
            
            nameSchemes[trimSchemeName] = newScheme;
            return existingScheme;
        }
        
        extensionsModule.registerNameScheme = registerNameScheme;
        
        /*
         * --------------
         * OPTIONS MODULE
         * --------------
         */
        
        function setDelimiterPattern(delimiterPattern) {
            delimiterPattern = ((delimiterPattern === null || delimiterPattern === undefined || delimiterPattern === '') ? 
                    TYPE_DELIMITER_DEFAULT_PATTERN : delimiterPattern);
            
            if (typeof delimiterPattern !== 'string') {
                return;
            }
            delimiterPattern = ('[ ]*' + delimiterPattern + '[ ]*');
            
            if (typeDelimiterRegExp && (delimiterPattern === typeDelimiterRegExp.source)) {
                return;
            }
            
            typeDelimiterRegExp = new RegExp(delimiterPattern, 'g');
            clearTypeListStringCache();
        }
        
        function setNameScheme(nameScheme) {
            if (nameScheme === undefined || nameScheme === null || nameScheme === NAME_SCHEME_DEFAULT_OPTION_VALUE) {
                nameScheme = null;
            }
            else if (typeof nameScheme === 'string' && (nameScheme in nameSchemes)) {
                nameScheme = nameSchemes[nameScheme];
            }
            if (nameScheme !== null && typeof nameScheme !== 'object') {
                throwError('Unknown name scheme "' + nameScheme + '"');
            }
            activeNameScheme = nameScheme;
            doRefresh();
        }
        
        function setOptions(options) {
            if (typeof options !== 'object') {
                return;
            }
            objKeys(options).forEach(function(optionName) {
                var optionMethod = optionsModule['set' + capitalize(optionName)];
                
                if (typeof optionMethod === 'function') {
                    optionMethod(options[optionName]);
                }
            });
        }
        
        optionsModule.setDelimiterPattern = setDelimiterPattern;
        optionsModule.setNameScheme = setNameScheme;
        optionsModule.set = setOptions;

        /*
         * --------------
         * MODULE REFRESH
         * --------------
         */

        function coreModuleRefreshHandler() {
            buildAliasMappings();
        }

        function doRefresh() {
            coreModuleRefreshHandler();
            doModuleTriggeredRefresh(coreModuleRefreshHandler);
        }
        
        var doModuleTriggeredRefresh = (function() {

            var handlersRequestingModuleRefresh = [],
                isModuleRefreshing = false,
                isModuleRefreshRequested = false;

            function refreshExtensions(requestingHandlers) {
                moduleRefreshHandlers.forEach(function(handler) {
                    /*
                     * Don't invoke handlers belonging to extensions 
                     * that requested the current refresh.
                     */
                    if (requestingHandlers.indexOf(handler) < 0) {
                        handler.call();
                    }
                });
            }

            /*
             * Handles extensions' refresh requests by bunching all refresh 
             * requests made during an active refresh into a single subsequent
             * refresh operation performed on completion of the active refresh.
             * Also, when the subsequent refresh is processed, excludes handlers 
             * of all the extensions which requested the refresh, in order to 
             * prevent potential cyclic refresh loops in poorly implemented 
             * extensions which may trigger new refreshes while responding to 
             * refresh requests originated by themselves.
             */
            return function (requestingHandler) {
                isModuleRefreshRequested = true;

                if (requestingHandler) {
                    handlersRequestingModuleRefresh.push(requestingHandler);
                }
                if (isModuleRefreshing) {
                    return;
                }

                isModuleRefreshing = true;

                while (isModuleRefreshRequested) {
                    isModuleRefreshRequested = false;
                    refreshExtensions(handlersRequestingModuleRefresh);
                }

                handlersRequestingModuleRefresh = [];
                isModuleRefreshing = false;
            };
        })();

        /*
         * ----------------
         * ADDON EXTENSIONS
         * ----------------
         */

        function registerExtensions(extensions, xtypeModule) {
            (isArray(extensions) ? extensions : [extensions]).forEach(function(extension) {
                if (!extension || extension.type !== 'xtypejs' || typeof extension.init !== 'function') {
                    throwError('Invalid extension - "type" property must be "xtypejs" and "init" property must be a function');
                }
                registeredExtensions.push(extension.init);
                applyExtension(extension.init, xtypeModule);
            });
        }

        function applyExtension(extensionInit, hostModule) {

            var moduleRefreshHandler = null,

                extensionInterface = {
                
                    getTypeDefinitions: function() {
                        return typeToValueMapping;
                    },

                    getNameSchemes: function() {
                        return nameSchemes;
                    },
                    
                    getActiveNameScheme: function() {
                        return activeNameScheme;
                    },

                    defineType: function(typeName, typeValue) {
                        defineType(typeName, typeValue, hostModule);
                    },

                    refresh: function() {
                        doModuleTriggeredRefresh(moduleRefreshHandler);
                    },

                    setRefreshHandler: function(handler) {
                        var existingHandlerIndex = moduleRefreshHandlers.indexOf(moduleRefreshHandler || handler);

                        if (existingHandlerIndex > -1) {
                            moduleRefreshHandlers.splice(existingHandlerIndex, 1);
                        }
                        if (typeof handler === 'function') {
                            moduleRefreshHandlers.push(handler);
                            moduleRefreshHandler = handler;
                        }
                    }
                };

            extensionInit.call(extensionInterface, hostModule);
        }
        
        /*
         * ---------------------
         * MODULE SETUP / EXPORT
         * ---------------------
         */
        
        function init() {
            var moduleExport = xtype;

            setDelimiterPattern(TYPE_DELIMITER_DEFAULT_PATTERN);
            
            ['Boolean', 'Number', 'String', 'Symbol', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error']
            .forEach(function(objectType) {
                objToStringToNameMapping['[object ' + objectType + ']'] = objectType.toLowerCase();
            });
            
            defineInterfacePackagesAndMethods(moduleExport);
            
            objKeys(TYPE_VALUE_MAPPING).forEach(function(typeName) {
                defineType(typeName, TYPE_VALUE_MAPPING[typeName], moduleExport);
            });
            
            buildAliasMappings();
            moduleRefreshHandlers.push(coreModuleRefreshHandler);
            
            Object.defineProperty(moduleExport, 'VERSION', {
                value: (/\s*{{[^}]*}}\s*/g.test(LIB_VERSION) ? 'unspecified' : LIB_VERSION),
                enumerable: true,
                writable: false,
                configurable: false
            });
            
            /*
             * Attach API methods to module export
             */

            moduleExport.type = type;
            moduleExport.typeOf = typeOf;
            moduleExport.which = which;
            moduleExport.is = isType;
            
            moduleExport.ext = extensionsModule;
            moduleExport.options = optionsModule;
            
            moduleExport.newInstance = newModuleInstance;

            moduleExport.ext.registerExtension = function(extensions) {
                extensions = (arguments.length > 1 ? arraySlice.call(arguments) : extensions);
                registerExtensions(extensions, moduleExport);
            };
            
            /*
             * Apply registered extensions on new instance
             */

            registeredExtensions.forEach(function(extension) {
                applyExtension(extension, moduleExport);
            });
            
            return moduleExport;
        }
        
        return init();
    }
    
    
    /*
     * Export module
     */
    var moduleExport = newModuleInstance();
    
    
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return moduleExport;
        });
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = moduleExport;
    }
    else {
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