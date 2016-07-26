(function(global) {

    'use strict';

    /*
    * --------------------
    * TEST HELPERS
    * --------------------
    */
    
    
    function addList(list1, list2) {
        return (list1).concat(list2);
    }
    
    
    function subtractList(fullList, subtractionList) {
        return fullList.slice().filter(function(entry) {
            return (subtractionList.indexOf(entry) < 0);
        });
    }
    
    
    function toCapitalizedCamelCase(str) { 
        return str.toLowerCase().replace(/(^|[^a-z0-9])(.)/g, function(match, segmenterChar, camelChar) {
            return camelChar.toUpperCase();
        });
    }
    
    
    function printMsg(str) {
        return '\n' + str + '\n';
    }
    
    
    function toString(item) {
        var itemString = '',
            itemType = Object.prototype.toString.call(item).match(/^\[object\s(.*)\]$/)[1];
        
        switch (itemType) {
            case 'String': itemString = '\'' + item + '\'';  // jshint ignore:line
            case 'Boolean':
            case 'Date':
            case 'Number': return (typeof item === 'object' ? 
                    itemType + '(' + (itemString || item) + ')' : itemString || ('' + item));
            case 'Symbol': return item.toString();
            case 'Function': return 'function:' + (('name' in item ? item.name 
                    : (/function ([^(]*)/.exec('' + item)[1])) || '<Anonymous>');
            case 'Object': return JSON.stringify(item);
            case 'Array': item.forEach(function(elem, index) {
                    itemString += ((index > 0 ? ',' : '') + toString(elem));
                });
                return '[' + itemString + ']';
        }
        return '' + item;
    }
    
    
    /*
    * --------------------
    * TEST DATA
    * --------------------
    */
    
    
    var CustomInstanceParentType = function CustomInstanceParentType(param) {
            this.singleProp = param;
        };
    
    var CustomInstanceChildType = function CustomInstanceChildType() {};

    CustomInstanceChildType.prototype = Object.create(CustomInstanceParentType.prototype);
    CustomInstanceChildType.prototype.constructor = CustomInstanceChildType;
    
    
    var noneType = 'none',

        allNonInstanceTypes = [     // Must include all the simple and extended non-instance types
            'null', 'undefined', 'nan', 'function', 'date', 'error', 'regexp',
            'string', 'empty_string', 'whitespace', 'single_char_string', 'multi_char_string', 
                    'blank_string', 'non_empty_string', 'non_blank_string',
            'number', 'zero', 'positive_integer', 'positive_float', 'positive_infinity', 
                    'negative_integer', 'negative_float', 'negative_infinity',
                    'float', 'integer', 'infinite_number', 'non_infinite_number', 
                    'positive_number', 'negative_number', 'non_zero_number', 
                    'non_positive_number', 'non_negative_number',
            'boolean', 'true', 'false',
            'array', 'empty_array', 'single_elem_array', 'multi_elem_array', 'non_empty_array',
            'object', 'empty_object', 'single_prop_object', 'multi_prop_object', 'non_empty_object',
            'primitive', 'nothing', 'any', 'none'
        ];
    
    if (typeof Symbol === 'function') {         // Add symbol type only if implemented in test VM
        allNonInstanceTypes.push('symbol');
    }
    
    var expectedTypeCount = (allNonInstanceTypes.length + (typeof Symbol === 'function' ? 0 : 1));  // Add 1 to account for uncounted 'symbol' type
    
        
    var allInstanceTypes = [
        String, Number, Boolean, Function, Object,
        Array, Date, Error, RegExp,
        CustomInstanceParentType, CustomInstanceChildType
    ];
    
    if (typeof Symbol === 'function') {         // Add symbol instance type only if implemented in test VM
        allInstanceTypes.push(Symbol);
    }
        
        
    var allTestTypes = allNonInstanceTypes.concat(allInstanceTypes),    
        

        testData = [
            
            /* NULL */            
            {
                description: 'the null value',
                testValue: null,
                simpleType: 'null',
                extendedType: 'null',
                matchingTypes: ['null', 'nothing', 'any']
            },
                    
            /* UNDEFINED */            
            {
                description: 'the undefined value',
                testValue: undefined,
                simpleType: 'undefined',
                extendedType: 'undefined',
                matchingTypes: ['undefined', 'nothing', 'any']
            },
                    
            /* BOOLEAN */
            {
                description: 'boolean true primitive',
                testValue: true,
                simpleType: 'boolean',
                extendedType: 'true',
                matchingTypes: ['boolean', 'true', 'primitive', 'any']
            },
            {
                description: 'boolean false primitive',
                testValue: false,
                simpleType: 'boolean',
                extendedType: 'false',
                matchingTypes: ['boolean', 'false', 'primitive', 'any']
            },
            /* Boolean Objects */
            {
                description: 'boolean true object',
                testValue: new Boolean(true),  // jshint ignore:line
                simpleType: 'boolean',
                extendedType: 'true',
                matchingTypes: ['boolean', 'true', 'primitive', 'any', Boolean, Object]
            },
            {
                description: 'boolean false object',
                testValue: new Boolean(false),  // jshint ignore:line
                simpleType: 'boolean',
                extendedType: 'false',
                matchingTypes: ['boolean', 'false', 'primitive', 'any', Boolean, Object]
            },
            
            /* STRING */
            {
                description: 'empty string',
                testValue: '',
                simpleType: 'string',
                extendedType: 'empty_string',
                matchingTypes: ['string', 'empty_string', 'blank_string', 'primitive', 'any']
            },
            {
                description: 'blank non-empty string',
                testValue: '   ',
                simpleType: 'string',
                extendedType: 'whitespace',
                matchingTypes: ['string', 'whitespace', 'blank_string', 'non_empty_string', 'primitive', 'any']
            },
            {
                description: 'multi non-white-character string',
                testValue: '  foo ',
                simpleType: 'string',
                extendedType: 'multi_char_string',
                matchingTypes: ['string', 'multi_char_string', 'non_empty_string', 
                                'non_blank_string', 'primitive', 'any']
            },
            {
                description: 'single character string',
                testValue: 't',
                simpleType: 'string',
                extendedType: 'single_char_string',
                matchingTypes: ['string', 'single_char_string', 'non_blank_string', 
                                'non_empty_string', 'primitive', 'any']
            },
            {
                description: 'white-padded single non-white-character string',
                testValue: '  L ',
                simpleType: 'string',
                extendedType: 'single_char_string',
                matchingTypes: ['string', 'single_char_string', 'non_blank_string', 
                                'non_empty_string', 'primitive', 'any']
            },
            /* String Objects */
            {
                description: 'empty string object',
                testValue: new String(''),  // jshint ignore:line
                simpleType: 'string',
                extendedType: 'empty_string',
                matchingTypes: ['string', 'empty_string', 'blank_string', 'primitive', 
                                'any', String, Object]
            },
            {
                description: 'blank string object',
                testValue: new String('   '),  // jshint ignore:line
                simpleType: 'string',
                extendedType: 'whitespace',
                matchingTypes: ['string', 'whitespace', 'blank_string', 'non_empty_string', 
                                'primitive', 'any', String, Object]
            },
            {
                description: 'white-padded single non-white-character string object',
                testValue: new String('  Y '),  // jshint ignore:line
                simpleType: 'string',
                extendedType: 'single_char_string',
                matchingTypes: ['string', 'single_char_string', 'non_empty_string', 'non_blank_string', 
                                'primitive', 'any', String, Object]
            },
            {
                description: 'multi non-white-character string object',
                testValue: new String(' foo  '),  // jshint ignore:line
                simpleType: 'string',
                extendedType: 'multi_char_string',
                matchingTypes: ['string', 'multi_char_string', 'non_empty_string', 'non_blank_string', 
                                'primitive', 'any', String, Object]
            },
            
            /* NUMBER */
            {
                description: 'the number zero',
                testValue: 0,
                simpleType: 'number',
                extendedType: 'zero',
                matchingTypes: ['number', 'integer', 'zero', 'non_negative_number', 
                                'non_positive_number', 'non_infinite_number', 'primitive', 'any']
            },
            {
                description: 'positive integer number',
                testValue: 5,
                simpleType: 'number',
                extendedType: 'positive_integer',
                matchingTypes: ['number', 'integer', 'positive_integer', 'positive_number', 
                                'non_negative_number', 'non_zero_number', 'non_infinite_number', 'primitive', 'any']
            },         
            {
                description: 'negative integer number',
                testValue: -1,
                simpleType: 'number',
                extendedType: 'negative_integer',
                matchingTypes: ['number', 'integer', 'negative_integer', 'negative_number', 
                                'non_positive_number', 'non_zero_number', 'non_infinite_number', 'primitive', 'any']
            },
            {
                description: 'very large positive integer',
                testValue: 9007199254740992,
                simpleType: 'number',
                extendedType: 'positive_integer',
                matchingTypes: ['number', 'integer', 'positive_integer', 'positive_number', 
                                'non_negative_number', 'non_zero_number', 'non_infinite_number', 'primitive', 'any']
            },
            {
                description: 'very large negative integer',
                testValue: -9007199254740992,
                simpleType: 'number',
                extendedType: 'negative_integer',
                matchingTypes: ['number', 'integer', 'negative_integer', 'negative_number', 
                                'non_positive_number', 'non_zero_number', 'non_infinite_number', 'primitive', 'any']
            },
            {
                description: 'positive float number',
                testValue: 0.15,
                simpleType: 'number',
                extendedType: 'positive_float',
                matchingTypes: ['number', 'float', 'positive_float', 'positive_number', 
                                'non_negative_number', 'non_zero_number', 'non_infinite_number', 'primitive', 'any']
            },
            {
                description: 'negative float number',
                testValue: -79.291,
                simpleType: 'number',
                extendedType: 'negative_float',
                matchingTypes: ['number', 'float', 'negative_float', 'negative_number', 
                                'non_positive_number', 'non_zero_number', 'non_infinite_number', 'primitive', 'any']
            },   
            {
                description: 'very large positive float',
                testValue: 900719925474099.2,
                simpleType: 'number',
                extendedType: 'positive_float',
                matchingTypes: ['number', 'float', 'positive_float', 'positive_number', 
                                'non_negative_number', 'non_zero_number', 'non_infinite_number', 'primitive', 'any']
            },
            {
                description: 'very large negative float',
                testValue: -900719925474099.2,
                simpleType: 'number',
                extendedType: 'negative_float',
                matchingTypes: ['number', 'float', 'negative_float', 'negative_number', 
                                'non_positive_number', 'non_zero_number', 'non_infinite_number', 'primitive', 'any']
            },
            {
                description: 'positive Number.MAX_VALUE',
                testValue: Number.MAX_VALUE,
                simpleType: 'number',
                extendedType: 'positive_integer',
                matchingTypes: ['number', 'integer', 'positive_integer', 'positive_number', 
                                'non_negative_number', 'non_zero_number', 'non_infinite_number', 'primitive', 'any']
            },
            {
                description: 'negative Number.MAX_VALUE',
                testValue: -Number.MAX_VALUE,
                simpleType: 'number',
                extendedType: 'negative_integer',
                matchingTypes: ['number', 'integer', 'negative_integer', 'negative_number', 
                                'non_positive_number', 'non_zero_number', 'non_infinite_number', 'primitive', 'any']
            },
            {
                description: 'positive Number.MIN_VALUE',
                testValue: Number.MIN_VALUE,
                simpleType: 'number',
                extendedType: 'positive_float',
                matchingTypes: ['number', 'float', 'positive_float', 'positive_number', 
                                'non_negative_number', 'non_zero_number', 'non_infinite_number', 'primitive', 'any']
            },
            {
                description: 'negative Number.MIN_VALUE',
                testValue: -Number.MIN_VALUE,
                simpleType: 'number',
                extendedType: 'negative_float',
                matchingTypes: ['number', 'float', 'negative_float', 'negative_number', 
                                'non_positive_number', 'non_zero_number', 'non_infinite_number', 'primitive', 'any']
            },
            {
                description: 'positive Infinity',
                testValue: Infinity,
                simpleType: 'number',
                extendedType: 'positive_infinity',
                matchingTypes: ['number', 'positive_infinity', 'positive_number', 
                                'non_negative_number', 'non_zero_number', 'infinite_number', 'primitive', 'any']
            },
            {
                description: 'negative Infinity',
                testValue: -Infinity,
                simpleType: 'number',
                extendedType: 'negative_infinity',
                matchingTypes: ['number', 'negative_infinity', 'negative_number', 
                                'non_positive_number', 'non_zero_number', 'infinite_number', 'primitive', 'any']
            },
            {
                description: 'the NaN value',
                testValue: NaN,
                simpleType: 'nan',
                extendedType: 'nan',
                matchingTypes: ['nan', 'any']
            },
            /* Number Objects */
            {
                description: 'positive integer number object',
                testValue: new Number(56),  // jshint ignore:line
                simpleType: 'number',
                extendedType: 'positive_integer',
                matchingTypes: ['number', 'integer', 'positive_integer', 'positive_number', 'non_negative_number', 
                                'non_zero_number', 'non_infinite_number', 'primitive', 'any', Number, Object]
            },
            {
                description: 'negative float number object',
                testValue: new Number(-4067.78),  // jshint ignore:line
                simpleType: 'number',
                extendedType: 'negative_float',
                matchingTypes: ['number', 'float', 'negative_float', 'negative_number', 'non_positive_number', 
                                'non_zero_number', 'non_infinite_number', 'primitive', 'any', Number, Object]
            },
            {
                description: 'number object with value of zero',
                testValue: new Number(0),  // jshint ignore:line
                simpleType: 'number',
                extendedType: 'zero',
                matchingTypes: ['number', 'integer', 'zero', 'non_negative_number', 'non_positive_number', 
                                'non_infinite_number', 'primitive', 'any', Number, Object]
            },
            {
                description: 'number object with value of positive Number.MAX_VALUE',
                testValue: new Number(Number.MAX_VALUE),  // jshint ignore:line
                simpleType: 'number',
                extendedType: 'positive_integer',
                matchingTypes: ['number', 'integer', 'positive_integer', 'positive_number', 'non_negative_number', 
                                'non_zero_number', 'non_infinite_number', 'primitive', 'any', Number, Object]
            },
            {
                description: 'number object with value of negative Number.MAX_VALUE',
                testValue: new Number(-Number.MAX_VALUE),  // jshint ignore:line
                simpleType: 'number',
                extendedType: 'negative_integer',
                matchingTypes: ['number', 'integer', 'negative_integer', 'negative_number', 'non_positive_number', 
                                'non_zero_number', 'non_infinite_number', 'primitive', 'any', Number, Object]
            },
            {
                description: 'number object with value of positive Number.MIN_VALUE',
                testValue: new Number(Number.MIN_VALUE),  // jshint ignore:line
                simpleType: 'number',
                extendedType: 'positive_float',
                matchingTypes: ['number', 'float', 'positive_float', 'positive_number', 'non_negative_number', 
                                'non_zero_number', 'non_infinite_number', 'primitive', 'any', Number, Object]
            },
            {
                description: 'number object with value of negative Number.MIN_VALUE',
                testValue: new Number(-Number.MIN_VALUE),  // jshint ignore:line
                simpleType: 'number',
                extendedType: 'negative_float',
                matchingTypes: ['number', 'float', 'negative_float', 'negative_number', 'non_positive_number', 
                                'non_zero_number', 'non_infinite_number', 'primitive', 'any', Number, Object]
            },
            {
                description: 'positive Infinity number object',
                testValue: new Number(Infinity),  // jshint ignore:line
                simpleType: 'number',
                extendedType: 'positive_infinity',
                matchingTypes: ['number', 'positive_infinity', 'positive_number', 'non_negative_number', 
                                'non_zero_number', 'infinite_number', 'primitive', 'any', Number, Object]
            },
            {
                description: 'negative Infinity number object',
                testValue: new Number(-Infinity),   // jshint ignore:line
                simpleType: 'number',
                extendedType: 'negative_infinity',
                matchingTypes: ['number', 'negative_infinity', 'negative_number', 'non_positive_number', 
                                'non_zero_number', 'infinite_number', 'primitive', 'any', Number, Object]
            },
            {
                description: 'NaN number object',
                testValue: new Number(NaN),  // jshint ignore:line
                simpleType: 'nan',
                extendedType: 'nan',
                matchingTypes: ['nan', 'any', Number, Object]
            },
                    
            /* ARRAY */
            {
                description: 'empty array',
                testValue: [],
                simpleType: 'array',
                extendedType: 'empty_array',
                matchingTypes: ['array', 'empty_array', 'any', Array, Object]
            },
            {
                description: 'single element array',
                testValue: ['foo'],
                simpleType: 'array',
                extendedType: 'single_elem_array',
                matchingTypes: ['array', 'single_elem_array', 'non_empty_array', 'any', Array, Object]
            },
            {
                description: 'multi-element array',
                testValue: ['foo', -12.5],
                simpleType: 'array',
                extendedType: 'multi_elem_array',
                matchingTypes: ['array', 'multi_elem_array', 'non_empty_array', 'any', Array, Object]
            },
            {
                description: 'empty array created using Array constructor',
                testValue: new Array(),  // jshint ignore:line
                simpleType: 'array',
                extendedType: 'empty_array',
                matchingTypes: ['array', 'empty_array', 'any', Array, Object]
            },
                    
            /* OBJECT */
            {
                description: 'empty object',
                testValue: {},
                simpleType: 'object',
                extendedType: 'empty_object',
                matchingTypes: ['object', 'empty_object', 'any', Object]
            },
            {
                description: 'single property object',
                testValue: {foo: 'foo'},
                simpleType: 'object',
                extendedType: 'single_prop_object',
                matchingTypes: ['object', 'single_prop_object', 'non_empty_object', 'any', Object]
            },
            {
                description: 'non-empty object',
                testValue: {foo: 'foo', bar: -12.5},
                simpleType: 'object',
                extendedType: 'multi_prop_object',
                matchingTypes: ['object', 'multi_prop_object', 'non_empty_object', 'any', Object]
            },
            {
                description: 'empty object created using Object constructor',
                testValue: new Object(),  // jshint ignore:line
                simpleType: 'object',
                extendedType: 'empty_object',
                matchingTypes: ['object', 'empty_object', 'any', Object]
            },
            {
                description: 'object of custom instance type CustomInstanceParentType having single property',
                testValue: new CustomInstanceParentType('myProp'),
                simpleType: 'object',
                extendedType: 'single_prop_object',
                matchingTypes: ['object', 'single_prop_object', 'non_empty_object', 'any', 
                                Object, CustomInstanceParentType]
            },
            {
                description: 'object of custom instance type CustomInstanceChildType having no properties',
                testValue: new CustomInstanceChildType(),
                simpleType: 'object',
                extendedType: 'empty_object',
                matchingTypes: ['object', 'empty_object', 'any', 
                                Object, CustomInstanceChildType, CustomInstanceParentType]
            },
                    
            /* FUNCTION */
            {
                description: 'declared function',
                testValue: CustomInstanceParentType,
                simpleType: 'function',
                extendedType: 'function',
                matchingTypes: ['function', 'any', Function, Object]
            },
            {
                description: 'named function expression',
                testValue: function fooFunction() {},
                simpleType: 'function',
                extendedType: 'function',
                matchingTypes: ['function', 'any', Function, Object]
            },
            {
                description: 'anonymous function expression',
                testValue: function () {},
                simpleType: 'function',
                extendedType: 'function',
                matchingTypes: ['function', 'any', Function, Object]
            },
            {
                description: 'function created using Function constructor',
                testValue: new Function(''),  // jshint ignore:line
                simpleType: 'function',
                extendedType: 'function',
                matchingTypes: ['function', 'any', Function, Object]
            },
                    
            /* DATE */
            {
                description: 'date object constructed with a date string argument',
                testValue: new Date('April 9, 1988 03:29:00'),
                simpleType: 'date',
                extendedType: 'date',
                matchingTypes: ['date', 'any', Date, Object]
            },
            {
                description: 'date object constructed without a date string argument',
                testValue: new Date(),
                simpleType: 'date',
                extendedType: 'date',
                matchingTypes: ['date', 'any', Date, Object]
            },
                    
            /* ERROR */
            {
                description: 'error object',
                testValue: new Error('Foo test error object message'),
                simpleType: 'error',
                extendedType: 'error',
                matchingTypes: ['error', 'any', Error, Object]
            },
                    
            /* REGEXP */
            {
                description: 'regular expression literal',
                testValue: /foo/g,
                simpleType: 'regexp',
                extendedType: 'regexp',
                matchingTypes: ['regexp', 'any', RegExp, Object]
            },
            {
                description: 'reguar expression object created with RegExp constructor',
                testValue: new RegExp('bar', 'g'),
                simpleType: 'regexp',
                extendedType: 'regexp',
                matchingTypes: ['regexp', 'any', RegExp, Object]
            }
    ];
    
    if (typeof Symbol === 'function') {                 // Add test data for Symbol type if implemented in test VM
        
        testData.push(
                
            /* SYMBOL */
            {
                description: 'symbol having description string',
                testValue: Symbol('foo'),               //jshint ignore:line
                simpleType: 'symbol',
                extendedType: 'symbol',
                matchingTypes: ['symbol', 'primitive', 'any']
            },
            {
                description: 'symbol having no description string',
                testValue: Symbol(),                    //jshint ignore:line
                simpleType: 'symbol',
                extendedType: 'symbol',
                matchingTypes: ['symbol', 'primitive', 'any']
            });
    }
    
    
    var matchingTestValuesByType = {};                  // Map of type name => list of matching test values
    var nonMatchingTestValuesByType = {};               // Map of type name => list of matching test values
    
    testData.forEach(function(data) {
        data.nonMatchingTypes = subtractList(allTestTypes, data.matchingTypes);

        allNonInstanceTypes.forEach(function(type) {     // Gather list of matching and non-matching test values by type
            var targetList = (data.matchingTypes.indexOf(type) > -1 ? matchingTestValuesByType : nonMatchingTestValuesByType);
            
            targetList[type] = (targetList[type] || []);
            targetList[type].push(data.testValue);
        });
    });



    var EXPORT_NAME = 'xtypejsTestUtil',
    
        moduleExport = {
            data: {
                allInstanceTypes: allInstanceTypes,
                allNonInstanceTypes: allNonInstanceTypes,
                allTestTypes: allTestTypes,
                testData: testData,
                matchingTestValuesByType: matchingTestValuesByType,
                nonMatchingTestValuesByType: nonMatchingTestValuesByType,
                CustomInstanceParentType: CustomInstanceParentType,
                CustomInstanceChildType: CustomInstanceChildType,
                noneType: noneType
            },
            helpers: {
                addList: addList,
                subtractList: subtractList,
                toCapitalizedCamelCase: toCapitalizedCamelCase,
                printMsg: printMsg,
                toString: toString
            }
        };
    
    
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = moduleExport;
        }
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return moduleExport;
        });
    } else {
        global[EXPORT_NAME] = moduleExport;
    }

})(this);