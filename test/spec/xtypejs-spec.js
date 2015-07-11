(function() {

    'use strict';
    
    function specs(origXtype) {
        
        origXtype = (origXtype || require('../xtype'));
        
        var xtype;      // prevent access to spec-external instance with shadow instance
        
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
        
        
        function msg(str) {
            return '\n' + str + '\n';
        }
        
        
        function str(item) {
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
                        itemString += ((index > 0 ? ',' : '') + str(elem));
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
        
        
        var allNonInstanceTypes = [     // Must include all the simple and extended non-instance types
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
        
        
        /*
         * --------------------
         * TESTS
         * --------------------
         */
        
        
        describe('xtypejs', function() {
            
            var xtype = origXtype.newInstance();
            
            afterEach(function() {
                xtype = origXtype.newInstance();
            });
            
            describe('Getting all types', function() {
                
                var allReceivedTypes = xtype.typeNames(),
                    allReceivedTypeIds = xtype.typeIds();
                
                
                it('should get the expected full set of type names', function() {
                    
                    expect(allReceivedTypes.length).toBe(expectedTypeCount,
                            
                    msg('Expected xtype.typeNames().length to be ' + str(expectedTypeCount)));
                    
                    allNonInstanceTypes.forEach(function(expectedTypeName) {
                        
                        expect(allReceivedTypes).toContain(expectedTypeName,
                                
                        msg('Expected xtype.typeNames() to contain ' + str(expectedTypeName)));
                    });
                });
                
                
                it('should get the expected full set of type Ids', function() {
                    
                    expect(allReceivedTypeIds.length).toBe(expectedTypeCount,
                            
                    msg('Expected xtype.typeIds().length to be ' + str(expectedTypeCount)));
                    
                    allNonInstanceTypes.forEach(function(expectedTypeName) {
                        var expectedTypeId = xtype.nameToId(expectedTypeName);
                        
                        expect(allReceivedTypeIds).toContain(expectedTypeId,
                                
                        msg('Expected xtype.typeIds() to contain ' + str(expectedTypeId) +
                            ' which is the corresponding type Id returned for type name ' + str(expectedTypeName)));
                    });
                });
            });
            
            
            describe('Named types', function() {
                
                describe('Type Id module property definitions', function() {
                    
                    allNonInstanceTypes.forEach(function(testType) {
                        var expectedTypeIdProperty = testType.toUpperCase();
                        
                        it('should define type Id property: ' + str(expectedTypeIdProperty), function() {
                            
                            expect(typeof xtype[expectedTypeIdProperty]).toBe('number',
                                    
                            msg('Expected type of property xtype[' + str(expectedTypeIdProperty) + '] to be "number"' +
                                ' because a property with matching but uppercased name should be defined for type ' + 
                                str(testType) + ' and must be numeric for typeId bitwise OR\'ing support'));
                        });
                    });
                });
                
                
                describe('Individual type-checking module method definitions', function() {
                    
                    allNonInstanceTypes.forEach(function(testType) {
                        
                        var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(testType)),
                            propertyType = (typeof xtype[expectedMatchingMethodForType]);
                        
                        it('should define type-checking method: ' + str(expectedMatchingMethodForType), function() {                        
                            
                            expect(propertyType).toBe('function',
                                    
                            msg('Expected type of xtype[' + str(expectedMatchingMethodForType) + '] to be "function"' +
                                ' because ' + str(expectedMatchingMethodForType) + ' should be a callable method' + 
                                ' used in checking for type ' + str(testType) +
                                ' but the result was ' + str(propertyType)));
                        });
                    });
                });
                
                
                ['not', 'none', 'all', 'any'].forEach(function(interfaceModule) {
                    
                    describe('interface module \'' + interfaceModule + '\'', function() {
                        
                        allNonInstanceTypes.forEach(function(testType) {
                            
                            var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(testType)),
                                propertyType = (typeof xtype[interfaceModule][expectedMatchingMethodForType]);
                            
                            it('should define type-checking method: ' + str(interfaceModule + '.' + expectedMatchingMethodForType), function() {                        
                                
                                expect(propertyType).toBe('function',
                                        
                                msg('Expected type of xtype[' + interfaceModule + '][' + str(expectedMatchingMethodForType) + '] to be "function"' +
                                    ' because it should be a callable method' + 
                                    ' used in checking for type ' + str(testType) +
                                    ' but the result was ' + str(propertyType)));
                            });
                        });
                    });
                });
                
                
                describe('Type name to type Id conversion', function() {
                    
                    allNonInstanceTypes.forEach(function(testType) {
                        var expectedTypeIdProperty = testType.toUpperCase(),
                            expectedTypeId = xtype[expectedTypeIdProperty];
                        
                        it('should convert type: ' + str(testType), function() {
                            
                            expect(xtype.nameToId(testType)).toBe(expectedTypeId,
                            
                            msg('Expected xtype.nameToId(' + str(testType) + ')' +
                                ' to be ' + str(expectedTypeId) +
                                ' because it is the value exposed as the type Id for type ' + str(testType)));
                        });
                    });
                    
                    
                    it('should convert to themselves for instance types', function() {
                        
                        allInstanceTypes.forEach(function(instanceType) {
                            var result = xtype.nameToId(instanceType);
                            
                            expect(result).toBe(instanceType,
                                    
                            msg('Expected xtype.nameToId(' + str(instanceType) + ')' +
                                ' to be ' + str(instanceType) +
                                ' because instance types should convert to themselves,' +
                                ' but the result was ' + str(result)));
                        });
                        
                    });
                });
                
                
                describe('Type Id to type name conversion', function() {

                    allNonInstanceTypes.forEach(function(testType) {
                        
                        var expectedTypeIdProperty = testType.toUpperCase(),
                            definedTypeId = xtype[expectedTypeIdProperty];

                        it('should convert back from type Id: ' + str(testType), function() {
                            
                            expect(xtype.idToName(definedTypeId)).toBe(testType,
                                    
                            msg('Expected xtype.idToName(xtype[' + str(expectedTypeIdProperty) + '])' +
                                ' to be ' + str(testType) +
                                ' because it is the corersponding type for the defined type' +
                                ' id property xtype[' + str(expectedTypeIdProperty) + ']'));
                        });
                    });
                    
                    
                    it('should convert to themselves for instance types', function() {
                        
                        allInstanceTypes.forEach(function(instanceType) {                        
                            var result = xtype.idToName(instanceType);
                            
                            expect(result).toBe(instanceType,
                                    
                            msg('Expected xtype.idToName(' + str(instanceType) + ')' +
                                ' to be the same instance type ' + str(instanceType) +
                                ' because instance types should convert to themselves,' +
                                ' but the result was ' + str(result)));
                        });
                    });
                });
            });
            
            
            describe('Getting extended type', function() {

                testData.forEach(function(data) {
                    
                    var item = data.testValue,
                        description = data.description,
                        extendedType = data.extendedType;
                
                    
                    it('should get extended type for sample: ' + description, function() {
                        
                        expect(xtype(item)).toBe(extendedType,
                                
                        msg('Expected xtype(' + str(item) + ')' +
                            ' to be ' + str(extendedType) + 
                            ' because it is the expected extended type for the value: ' + str(item)));
                    });
                });
            });
            
            
            describe('Getting simple type', function() {

                testData.forEach(function(data) {
                    
                    var item = data.testValue,
                        description = data.description,
                        simpleType = data.simpleType;
                    
                    
                    it('should get simple type for sample: ' + description, function() {
                        
                        expect(xtype.type(item)).toBe(simpleType,
                                
                        msg('Expected xtype.type(' + str(item) + ')' +
                            ' to be ' + str(simpleType) + 
                            ' because it is the expected simple type for the value ' + str(item)));
                    });
                });
            });
            
            
            describe('Getting more specific object types', function() {

                it('should get specific object type as defined by host environment', function() {
                    
                    expect(xtype.type(arguments)).toBe('object');       // xtype.type should report object type
                    
                    expect(xtype.typeOf(arguments)).toBe('arguments',   // but xtype.typeOf should report more specific object type
                            
                    msg('Expected xtype.typeOf(arguments)' +
                        ' to be \'arguments\'' + 
                        ' because it is the specific type of the arguments object'));
                });
            });
            
            
            describe('Individual type matching', function() {
                
                describe('For matching types', function() {
                
                    testData.forEach(function(data) {
                        
                        var item = data.testValue,
                            description = data.description,
                            matchingTypes = data.matchingTypes;
                        
                        
                        it('should match all matching types for sample: ' + description, function() {
                            matchingTypes.forEach(function(matchingType) {
                                
                                expect(xtype.is(item, matchingType)).toBe(true,
                                        
                                msg('Expected xtype.is(' + str(item) + ', ' + str(matchingType) + ')' +
                                    ' to be true' +
                                    ' because ' + str(matchingType) + ' is a matching type for ' + str(item)));
                                
                                var typeId = xtype.nameToId(matchingType);
                                
                                expect(xtype.is(item, typeId)).toBe(true,
        
                                msg('Expected xtype.is(' + str(item) + ', <typeId of ' + str(matchingType) + '>)' +
                                    ' to be true' +
                                    ' because ' + str(matchingType) + ' is a matching type for ' + str(item)));
                            });
                        });
                    });
                });
                
                
                describe('For non-matching types', function() {

                    testData.forEach(function(data) {
                        
                        var item = data.testValue,
                            description = data.description,
                            nonMatchingTypes = data.nonMatchingTypes;
                        
                        
                        it('should not match any non-matching type for sample: ' + description, function() {
                            nonMatchingTypes.forEach(function(nonMatchingType) {
                                
                                expect(xtype.is(item, nonMatchingType)).toBe(false,
                                        
                                msg('Expected xtype.is(' + str(item) + ', ' + str(nonMatchingType) + ')' +
                                    ' to be false' +
                                    ' because ' + str(nonMatchingType) + ' is not a matching type for ' + str(item)));

                                var typeId = xtype.nameToId(nonMatchingType);
                                
                                expect(xtype.is(item, typeId)).toBe(false,

                                msg('Expected xtype.is(' + str(item) + ', <typeId of ' + str(nonMatchingType) + '>)' +
                                    ' to be false' +
                                    ' because ' + str(nonMatchingType) + ' is not a matching type for ' + str(item)));
                            });
                        });
                    });
                });
            });
            
            
            describe('Type matching against several types', function() {
                
                describe('With at least one matching type', function() {

                    testData.forEach(function(data) {
                        
                        var item = data.testValue,
                            description = data.description,
                            matchingTypes = data.matchingTypes,
                            nonMatchingTypes = data.nonMatchingTypes;
                        
                        
                        it('should match for sample: ' + description, function() {
                            matchingTypes.forEach(function(matchingType) {
                                
                                var matchingList = nonMatchingTypes.concat(matchingType);
                                
                                expect(xtype.is(item, matchingList)).toBe(true,
        
                                msg('Expected xtype.is(' + str(item) + ', ' + str(matchingList) + ')' +
                                    ' to be true' +
                                    ' because matching type ' + str(matchingType) + ' is in the list of types'));
                            });
                        });
                    });
                });
                
                
                describe('With no matching types', function() {
                
                    testData.forEach(function(data) {
                        
                        var item = data.testValue,
                            description = data.description,
                            matchingTypes = data.matchingTypes,
                            nonMatchingTypes = data.nonMatchingTypes;
                        
                        
                        it('should not match for sample: ' + description, function() {
                            
                            expect(xtype.is(item, nonMatchingTypes)).toBe(false,
                            
                            msg('Expected xtype.is(' + str(item) + ', ' + str(nonMatchingTypes) + ')' +
                                ' to be false' +
                                ' because there are no matching types for ' + str(item) + ' in the list of types'));
                        });
                    });
                });
            });
            
            
            describe('Type matching using the is-methods', function() {

                describe('For a matching type', function() {
                
                    testData.forEach(function(data) {
                        
                        var item = data.testValue,
                            description = data.description,
                            matchingTypes = data.matchingTypes;
                        
                        
                        it('should match for sample: ' + description, function() {
                            // there are no is-methods for instance types
                            subtractList(matchingTypes, allInstanceTypes).forEach(function(matchingType) {
                                
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(matchingType));
                                
                                expect(xtype[expectedMatchingMethodForType](item)).toBe(true,
                                        
                                msg('Expected xtype.' + expectedMatchingMethodForType + '(' + str(item) + ') to be true' +
                                    ' because ' + str(item) + ' is of the corresponding type of matching method ' + 
                                    str(expectedMatchingMethodForType)));
                            });
                        });
                    });
                });
                
                
                describe('For a non-matching type', function() {
                
                    testData.forEach(function(data) {
                        
                        var item = data.testValue,
                            description = data.description,
                            nonMatchingTypes = data.nonMatchingTypes;
                        
                        
                        it('should not match for sample: ' + description, function() {
                            // there are no is-methods for instance types
                            subtractList(nonMatchingTypes, allInstanceTypes).forEach(function(nonMatchingType) {
                                
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(nonMatchingType));
                                
                                expect(xtype[expectedMatchingMethodForType](item)).toBe(false,
                                        
                                msg('Expected xtype.' + expectedMatchingMethodForType + '(' + str(item) + ') to be false' +
                                    ' because ' + str(item) + ' is not of the corresponding type of matching method ' + 
                                    str(expectedMatchingMethodForType)));
                            });
                        });
                    });
                });
                
                
                describe('with the \'not\' interface for a matching type', function() {
                
                    testData.forEach(function(data) {
                        
                        var item = data.testValue,
                            description = data.description,
                            matchingTypes = data.matchingTypes;
                        
                        
                        it('should match for sample: ' + description, function() {
                            // there are no is-methods for instance types
                            subtractList(matchingTypes, allInstanceTypes).forEach(function(matchingType) {
                                
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(matchingType));
                                
                                expect(xtype.not[expectedMatchingMethodForType](item)).toBe(false,
                                        
                                msg('Expected xtype.not.' + expectedMatchingMethodForType + '(' + str(item) + ') to be false' +
                                    ' because ' + str(item) + ' is of the corresponding type of matching method ' + 
                                    str(expectedMatchingMethodForType)));
                            });
                        });
                    });
                });
                
                
                describe('with the \'not\' interface for a non-matching type', function() {
                
                    testData.forEach(function(data) {
                        
                        var item = data.testValue,
                            description = data.description,
                            nonMatchingTypes = data.nonMatchingTypes;
                        
                        
                        it('should not match for sample: ' + description, function() {
                            // there are no is-methods for instance types
                            subtractList(nonMatchingTypes, allInstanceTypes).forEach(function(nonMatchingType) {
                                
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(nonMatchingType));
                                
                                expect(xtype.not[expectedMatchingMethodForType](item)).toBe(true,
                                        
                                msg('Expected xtype.not.' + expectedMatchingMethodForType + '(' + str(item) + ') to be true' +
                                    ' because ' + str(item) + ' is not of the corresponding type of matching method ' + 
                                    str(expectedMatchingMethodForType)));
                            });
                        });
                    });
                });
            });
            
            
            describe('Type matching of several values', function() {
                
                describe('with the \'any\' interface', function() {
                    
                    describe('with list of only matching values', function() {
                        
                        // there are no is-methods for instance types and no matching values for 'none' type
                        subtractList(allNonInstanceTypes, ['none']).forEach(function(type) {
                            
                            var testList = matchingTestValuesByType[type].slice(-3);                            
                            
                            it('should match for type: ' + type, function() {
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(type));
                                
                                expect(xtype.any[expectedMatchingMethodForType](testList)).toBe(true,
                                        
                                msg('Expected xtype.any.' + expectedMatchingMethodForType + '(' + str(testList) + ') to be true' +
                                    ' because ' + str(testList) + ' contains only matching values for type ' + str(type)));
                            });
                        });
                    });
                    

                    describe('with list of some matching and non-matching values', function() {

                        // there are no is-methods for instance types, no matching values for 'none' type, and no non-matching values for 'any' type
                        subtractList(allNonInstanceTypes, ['none', 'any']).forEach(function(type) {
                            
                            var matchingValues = matchingTestValuesByType[type].slice(-1),
                                nonMatchingValues = nonMatchingTestValuesByType[type].slice(-3),
                                testList = addList(matchingValues, nonMatchingValues);                            
                            
                            it('should match for type: ' + type, function() {
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(type));
                                
                                expect(xtype.any[expectedMatchingMethodForType](testList)).toBe(true,
                                        
                                msg('Expected xtype.any.' + expectedMatchingMethodForType + '(' + str(testList) + ') to be true' +
                                    ' because ' + str(testList) + ' contains some matching and non-matching values' +
                                    ' for type ' + str(type)));
                            });
                        });
                    });
                    
                    
                    describe('with list of no matching values', function() {

                        // there are no is-methods for instance types and no non-matching values for 'any' type
                        subtractList(allNonInstanceTypes, ['any']).forEach(function(type) {
                            
                            var testList = nonMatchingTestValuesByType[type].slice(-3);                            
                            
                            it('should not match for type: ' + type, function() {
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(type));
                                
                                expect(xtype.any[expectedMatchingMethodForType](testList)).toBe(false,
                                        
                                msg('Expected xtype.any.' + expectedMatchingMethodForType + '(' + str(testList) + ') to be false' +
                                    ' because ' + str(testList) + ' contains no matching values for type ' + str(type)));
                            });
                        });
                    });
                });
                
                
                describe('with the \'none\' interface', function() {

                    describe('with list of only matching values', function() {

                        // there are no is-methods for instance types and no matching values for 'none' type
                        subtractList(allNonInstanceTypes, ['none']).forEach(function(type) {
                            
                            var testList = matchingTestValuesByType[type].slice(-3);                            
                            
                            it('should not match for type: ' + type, function() {
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(type));
                                
                                expect(xtype.none[expectedMatchingMethodForType](testList)).toBe(false,
                                        
                                msg('Expected xtype.none.' + expectedMatchingMethodForType + '(' + str(testList) + ') to be false' +
                                    ' because ' + str(testList) + ' contains only matching values for type ' + str(type)));
                            });
                        });
                    });
                    

                    describe('with list of some matching and non-matching values', function() {

                        // there are no is-methods for instance types, no matching values for 'none' type, and no non-matching values for 'any' type
                        subtractList(allNonInstanceTypes, ['none', 'any']).forEach(function(type) {
                            
                            var matchingValues = matchingTestValuesByType[type].slice(-1),
                                nonMatchingValues = nonMatchingTestValuesByType[type].slice(-3),
                                testList = addList(matchingValues, nonMatchingValues);                            
                            
                            it('should not match for type: ' + type, function() {
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(type));
                                
                                expect(xtype.none[expectedMatchingMethodForType](testList)).toBe(false,
                                        
                                msg('Expected xtype.none.' + expectedMatchingMethodForType + '(' + str(testList) + ') to be false' +
                                    ' because ' + str(testList) + ' contains some matching and non-matching values' +
                                    ' for type ' + str(type)));
                            });
                        });
                    });
                    
                    
                    describe('with list of no matching values', function() {

                        // there are no is-methods for instance types and no non-matching values for 'any' type
                        subtractList(allNonInstanceTypes, ['any']).forEach(function(type) {
                            
                            var testList = nonMatchingTestValuesByType[type].slice(-3);                            
                            
                            it('should match for type: ' + type, function() {
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(type));
                                
                                expect(xtype.none[expectedMatchingMethodForType](testList)).toBe(true,
                                        
                                msg('Expected xtype.none.' + expectedMatchingMethodForType + '(' + str(testList) + ') to be true' +
                                    ' because ' + str(testList) + ' contains no matching values for type ' + str(type)));
                            });
                        });
                    });
                });
                
                
                describe('with the \'some\' interface', function() {
                    
                    describe('with list of only matching values', function() {

                        // there are no is-methods for instance types and no matching values for 'none' type
                        subtractList(allNonInstanceTypes, ['none']).forEach(function(type) {
                            
                            var testList = matchingTestValuesByType[type].slice(-3);                            
                            
                            it('should not match for type: ' + type, function() {
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(type));
                                
                                expect(xtype.some[expectedMatchingMethodForType](testList)).toBe(false,
                                        
                                msg('Expected xtype.some.' + expectedMatchingMethodForType + '(' + str(testList) + ') to be false' +
                                    ' because ' + str(testList) + ' contains only matching values for type ' + str(type)));
                            });
                        });
                    });
                    
                    
                    describe('with list of some matching and non-matching values', function() {

                        // there are no is-methods for instance types, no matching values for 'none' type, and no non-matching values for 'any' type
                        subtractList(allNonInstanceTypes, ['none', 'any']).forEach(function(type) {
                            
                            var matchingValues = matchingTestValuesByType[type].slice(-3),
                                nonMatchingValues = nonMatchingTestValuesByType[type].slice(-1),
                                testList = addList(matchingValues, nonMatchingValues);                            
                            
                            it('should match for type: ' + type, function() {
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(type));
                                
                                expect(xtype.some[expectedMatchingMethodForType](testList)).toBe(true,
                                        
                                msg('Expected xtype.some.' + expectedMatchingMethodForType + '(' + str(testList) + ') to be true' +
                                    ' because ' + str(testList) + ' contains some matching and non-matching values' +
                                    ' for type ' + str(type)));
                            });
                        });
                    });
                    
                    
                    describe('with list of no matching values', function() {

                        // there are no is-methods for instance types and no non-matching values for 'any' type
                        subtractList(allNonInstanceTypes, ['any']).forEach(function(type) {
                            
                            var testList = nonMatchingTestValuesByType[type].slice(-3);                            
                            
                            it('should not match for type: ' + type, function() {
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(type));
                                
                                expect(xtype.some[expectedMatchingMethodForType](testList)).toBe(false,
                                        
                                msg('Expected xtype.some.' + expectedMatchingMethodForType + '(' + str(testList) + ') to be false' +
                                    ' because ' + str(testList) + ' contains no matching values for type ' + str(type)));
                            });
                        });
                    });
                });
                
                
                describe('with the \'all\' interface', function() {
                    
                    describe('with list of only matching values', function() {

                        // there are no is-methods for instance types and no matching values for 'none' type
                        subtractList(allNonInstanceTypes, ['none']).forEach(function(type) {
                            
                            var testList = matchingTestValuesByType[type].slice(-3);                            
                            
                            it('should match for type: ' + type, function() {
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(type));
                                
                                expect(xtype.all[expectedMatchingMethodForType](testList)).toBe(true,
                                        
                                msg('Expected xtype.all.' + expectedMatchingMethodForType + '(' + str(testList) + ') to be true' +
                                    ' because ' + str(testList) + ' contains only matching values for type ' + str(type)));
                            });
                        });
                    });
                    
                    
                    describe('with list of some matching and non-matching values', function() {

                        // there are no is-methods for instance types, no matching values for 'none' type, and no non-matching values for 'any' type
                        subtractList(allNonInstanceTypes, ['none', 'any']).forEach(function(type) {
                            
                            var matchingValues = matchingTestValuesByType[type].slice(-3),
                                nonMatchingValues = nonMatchingTestValuesByType[type].slice(-1),
                                testList = addList(matchingValues, nonMatchingValues);                            
                            
                            it('should not match for type: ' + type, function() {
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(type));
                                
                                expect(xtype.all[expectedMatchingMethodForType](testList)).toBe(false,
                                        
                                msg('Expected xtype.all.' + expectedMatchingMethodForType + '(' + str(testList) + ') to be false' +
                                    ' because ' + str(testList) + ' contains some matching and non-matching values' +
                                    ' for type ' + str(type)));
                            });
                        });
                    });
                    
                    
                    describe('with list of no matching values', function() {

                        // there are no is-methods for instance types and no non-matching values for 'any' type
                        subtractList(allNonInstanceTypes, ['any']).forEach(function(type) {
                            
                            var testList = nonMatchingTestValuesByType[type].slice(-3);                            
                            
                            it('should not match for type: ' + type, function() {
                                var expectedMatchingMethodForType = ('is' + toCapitalizedCamelCase(type));
                                
                                expect(xtype.all[expectedMatchingMethodForType](testList)).toBe(false,
                                        
                                msg('Expected xtype.all.' + expectedMatchingMethodForType + '(' + str(testList) + ') to be false' +
                                    ' because ' + str(testList) + ' contains no matching values for type ' + str(type)));
                            });
                        });
                    });
                });
            });
            
            
            describe('Type Identification from a list', function() {

                describe('With at least one matching type', function() {

                    testData.forEach(function(data) {
                        
                        var item = data.testValue,
                            description = data.description,
                            nonMatchingTypes = data.nonMatchingTypes,
                            matchingTypes = data.matchingTypes;                        
                        
                        it('should identify item type for sample: ' + description, function() {
                            
                            matchingTypes.forEach(function(matchingType) {
                                
                                var matchingList = nonMatchingTypes.concat(matchingType),
                                    reportedTypeId = xtype.nameToId(matchingType),
                                    result = xtype.which(item, matchingList);
                                
                                expect(result).toBe(matchingType,
        
                                msg('Expected xtype.which(' + str(item) + ', ' + str(matchingList) + ')' +
                                    ' to be ' + str(matchingType) +
                                    ' because it is the only matching type for value ' + str(item) + ' in the list of types,' +
                                    ' but result was ' + str(result)));
                            });
                        });
                    });
                });
                
                
                describe('With no matching types', function() {

                    testData.forEach(function(data) {
                        
                        var item = data.testValue,
                            description = data.description,
                            nonMatchingTypes = data.nonMatchingTypes;
                        
        
                        it('should identify type of item as "none" for sample: ' + description, function() {
                            
                            var result = xtype.which(item, nonMatchingTypes);
                            
                            expect(result).toBe(xtype.idToName(xtype.NONE),
                                    
                            msg('Expected xtype.which(' + str(item) + ', ' + str(nonMatchingTypes) + ')' +
                                ' to be <type name of ' + str(xtype.NONE) + '>' +
                                ' there are no matching types for ' + str(item) + ' in the list of types,' +
                                ' but result was ' + str(result) + ' which it reports to be type ' + str(result)));
                        });
                    });
                });
            });
            
            
            describe('Testing for NaN', function() {
               
                it('should report NaN for bad numeric values', function() {
                    
                    expect(xtype.isNan(5 / 'a')).toBe(true,
                    
                    msg('Expected xtype.isNan(5 / "a") to be true' +
                        ' because (5 / "a") is of type "number" but without a valid numeric value'));
                    
                    expect(xtype.isNan(new Number(5 / 'a'))).toBe(true,          //jshint ignore:line
                            
                    msg('Expected xtype.isNan(new Number(5 / "a")) to be true' +
                        ' because new Number(5 / "a") is of type "number" but without a valid numeric value'));
                });
                
                
                it('should not report NaN for non-numeric values with or without valid numeric value equivalents', function() {
                    
                    expect(xtype.isNan('5')).toBe(false,
                    
                    msg('Expected xtype.isNan("5") to be false' +
                        ' because "5" is of type "string" and so does not represent a failed/bad number'));
                    
                    expect(xtype.isNan('5a')).toBe(false,
                    
                    msg('Expected xtype.isNan("5a") to be false' +
                        ' because "5a" is of type "string" and so does not represent a failed/bad number'));
                    
                    expect(xtype.isNan(new Number('5a'))).toBe(true,     //jshint ignore:line
                            
                    msg('Expected xtype.isNan(new Number("5a")) to be true' +
                        ' because new Number("5a") is of type "number" but without a valid numeric value'));
                });
            });
            
            
            describe('Changing the name scheme', function() {                
                
                it('should change to the compact name scheme using the string \'compact\'', function() {
                    
                    var stringCompactName = 'str',
                        positiveIntCompactName = 'int+';

                    xtype.options.setNameScheme('compact');
                    
                    expect(xtype.type('some string')).toBe(stringCompactName,
                    
                    msg('Expected xtype.type("some string") to be ' + str(stringCompactName) +
                        ' because that is the type name for the string type in the compact name scheme'));
                    
                    expect(xtype(5)).toBe(positiveIntCompactName,
                    
                    msg('Expected xtype(5) to be ' + str(positiveIntCompactName) +
                        ' because that is the type name for the positive integer type in the compact name scheme'));
                });
                
               
                it('should change to a custom name scheme using a passed object', function() {
                    
                    // Name of negative int type before applying custom name scheme
                    var defaultNegativeIntName = xtype(-5);
                    
                    var customStringName = 'myString',
                        customPositiveIntName = 'posInt';

                    xtype.options.setNameScheme({
                        string: 'myString',
                        positive_integer: 'posInt'
                    });
                    
                    expect(xtype.type('some string')).toBe(customStringName,
                    
                    msg('Expected xtype.type("some string") to be ' + str(customStringName) +
                        ' because that is the name for the string type in the' + 
                        ' custom name scheme that has been applied'));
                    
                    expect(xtype(5)).toBe(customPositiveIntName,
                    
                    msg('Expected xtype(5) to be ' + str(customPositiveIntName) +
                        ' because that is the name for the positive integer type' +
                        ' in the custom name scheme that has been applied'));
                    
                    expect(xtype(-5)).toBe(defaultNegativeIntName,
                    
                    msg('Expected xtype(-5) not have changed from ' + str(defaultNegativeIntName) +
                        ' because that is the name for the negative integer type which was not' +
                        ' changed in the custom name scheme that has been applied'));
                });
                
                
                it('should throw an exception if a custom name scheme causes a name conflict with an existing type', function() {
                    
                    expect(function() {
                        xtype.setOptions({ nameScheme: { number: 'integer' } });
                    }).toThrow();
                });
                
                
                it('should switch back to the default name scheme using the string \'default\'', function() {

                    xtype.options.setNameScheme('compact');   // Switch to compact scheme
                    expect(xtype.type(5)).toBe('num');        // Confirm successful switch to compact scheme
                    
                    var stringDefaultName = 'string',
                        positiveIntDefaultName = 'positive_integer';

                    xtype.options.setNameScheme('default');   // Switch back to default scheme
                    
                    expect(xtype.type('some string')).toBe(stringDefaultName,
                    
                    msg('Expected xtype.type("some string") to be ' + str(stringDefaultName) +
                        ' because that is the type name for the string type in the default name scheme'));
                    
                    expect(xtype(5)).toBe(positiveIntDefaultName,
                    
                    msg('Expected xtype(5) to be ' + str(positiveIntDefaultName) +
                        ' because that is the type name for the positive integer type in the default name scheme'));
                });
                
                
                it('should switch back to the default name scheme if no scheme specified', function() {

                    xtype.options.setNameScheme('compact');   // Switch to compact scheme
                    expect(xtype.type(5)).toBe('num');        // Confirm successful switch to compact scheme
                    
                    var stringDefaultName = 'string',
                        positiveIntDefaultName = 'positive_integer';

                    xtype.options.setNameScheme();      // Switch back to default scheme
                    
                    expect(xtype.type('some string')).toBe(stringDefaultName,
                    
                    msg('Expected xtype.type("some string") to be ' + str(stringDefaultName) +
                        ' because that is the type name for the string type in the default name scheme'));
                    
                    expect(xtype(5)).toBe(positiveIntDefaultName,
                    
                    msg('Expected xtype(5) to be ' + str(positiveIntDefaultName) +
                        ' because that is the type name for the positive integer type in the default name scheme'));
                });
            });
            
            
            describe('Registering a custom name scheme', function() {
                
                it('should make the name scheme available when setting name scheme by name', function() {
                    
                    var customStringName = 'my_string',
                        customPositiveIntName = 'my_pos_int',
                        
                        customNameScheme = {
                            string: customStringName,
                            positive_integer: customPositiveIntName
                        };

                    xtype.registerNameScheme('my_scheme', customNameScheme);
                    
                    // Name of negative int type before applying custom name scheme
                    var defaultNegativeIntName = xtype(-5);
                    
                    xtype.options.setNameScheme('my_scheme');
                    
                    expect(xtype.type('some string')).toBe(customStringName,
                    
                    msg('Expected xtype.type("some string") to be ' + str(customStringName) +
                        ' because that is the name for the string type in the' + 
                        ' custom name scheme that has been applied'));
                    
                    expect(xtype(5)).toBe(customPositiveIntName,
                    
                    msg('Expected xtype(5) to be ' + str(customPositiveIntName) +
                        ' because that is the name for the positive integer type' +
                        ' in the custom name scheme that has been applied'));
                    
                    expect(xtype(-5)).toBe(defaultNegativeIntName,
                    
                    msg('Expected xtype(-5) not have changed from ' + str(defaultNegativeIntName) +
                        ' because that is the name for the negative integer type which was not' +
                        ' changed in the custom name scheme that has been applied'));
                });
            });
            
            
            describe('Changing the type string delimiter pattern', function() {
                
                it('should change how individual types are identified in a type expression string', function() {

                    xtype.options.setDelimiterPattern('[/ ]');
                    
                    expect(xtype.which(5, 'string / integer / boolean')).toBe('integer',
                            
                    msg('Expected xtype.which(5, "string / integer / boolean") to be "integer"' +
                        ' because "integer" is the type of the value 5, and the delimiter change to' +
                        ' "[\\s/]+" should cause it to be identified from within the type expression string'));
                });
                
                
                it('should allow whitespace around delimiters', function() {

                    xtype.options.setDelimiterPattern('/');
                    
                    expect(xtype.which(5, 'string / integer / boolean')).toBe('integer',
                            
                    msg('Expected xtype.which(5, "string / integer / boolean") to be "integer"' +
                        ' because "integer" is the type of the value 5, and the delimiter change to[/]+" should' +
                        ' " also recognize the whitespace around the delimiter within the type expression string'));
                });
                
                
                it('should take null and undefined and empty string to mean a reset to default', function() {

                    // --- Using null ---
                    xtype.options.setDelimiterPattern('/');                           // Switch to custom pattern
                    expect(xtype.which(5, 'string / integer / boolean')).toBe('integer');   // Confirm successful switch to custom pattern
                    
                    xtype.options.setDelimiterPattern(null);    // Switch back to default pattern using null
                    
                    expect(xtype.which(5, 'string, integer, boolean')).toBe('integer',
                            
                    msg('Expected xtype.which(5, "string, integer, boolean") to be "integer"' +
                        ' because "integer" is the type of the value 5, and changing the delimiter' +
                        ' to null should still result in using the default delimiter'));
                    
                    
                    // --- Using undefined ---
                    xtype.options.setDelimiterPattern('/');                           // Switch to custom pattern
                    expect(xtype.which(5, 'string / integer / boolean')).toBe('integer');   // Confirm successful switch to custom pattern
                    
                    xtype.options.setDelimiterPattern();    // Switch back to default pattern using null
                    
                    expect(xtype.which(5, 'string, integer, boolean')).toBe('integer',
                            
                    msg('Expected xtype.which(5, "string, integer, boolean") to be "integer"' +
                        ' because "integer" is the type of the value 5, and changing the delimiter' +
                        ' to undefined should still result in using the default delimiter'));
                    
                    
                    // --- Using empty string ---
                    xtype.options.setDelimiterPattern('/');                           // Switch to custom pattern
                    expect(xtype.which(5, 'string / integer / boolean')).toBe('integer');   // Confirm successful switch to custom pattern
                    
                    xtype.options.setDelimiterPattern('');    // Switch back to default pattern using null
                    
                    expect(xtype.which(5, 'string, integer, boolean')).toBe('integer',
                            
                    msg('Expected xtype.which(5, "string, integer, boolean") to be "integer"' +
                        ' because "integer" is the type of the value 5, and changing the delimiter' +
                        ' to empty string should still result in using the default delimiter'));
                });
            });
            
            
            describe('Registering a custom type', function() {
                
                beforeEach(function() {
                    xtype.registerTypes({
                        non_negative_integer: {
                            typeId: (xtype.NON_NEGATIVE_NUMBER & xtype.INTEGER),
                            compactName: '-int-'
                        },
                        
                        non_positive_integer: {
                            definition: 'non_positive_number, integer',
                            matchMode: 'all',
                            compactName: '-int+'
                        },
                        
                        instance_type: {
                            definition: CustomInstanceParentType,
                            compactName: 'inst'
                        },
                        
                        two_prop_obj_custom_type: {
                            definition: {
                                validator: function(value) {
                                    return (typeof value === 'object' && value !== null && Object.keys(value).length === 2);
                                }
                            },
                            compactName: 'obj2'
                        }
                    });

                    xtype.registerTypes({ 
                        num_instance_custom_type_combo: {
                            definition: 'non_negative_integer, instance_type, two_prop_obj_custom_type',
                            compactName: 'num_inst_cust_combo'
                        }
                    });
                });
                
                
                it('should create a type Id constant for registered types' +
                        ' derived fully from inbuilt types having type Ids', function() {
                    
                    expect(xtype.NON_NEGATIVE_INTEGER).toBeDefined(
                            
                    msg('Expected xtype.NON_NEGATIVE_INTEGER to be defined' +
                        ' because that is the uppercased name of a registered custom' +
                        ' type derived fully from inbuilt types having type Ids'));
                    
                    expect(xtype.NON_POSITIVE_INTEGER).toBeDefined(
                            
                    msg('Expected xtype.NON_POSITIVE_INTEGER to be defined' +
                        ' because that is the uppercased name of a registered custom' +
                        ' type derived fully from inbuilt types having type Ids'));
                });
                
                
                it('should create a dedicated is<Type> validator method for the registered custom type', function() {
                    
                    var customTypeNames = [
                           'non_negative_integer', 
                           'non_positive_integer', 
                           'instance_type', 
                           'two_prop_obj_custom_type',
                           'num_instance_custom_type_combo'];
                    
                    customTypeNames.forEach(function(customTypeName) {
                        var matchingMethod = ('is' + toCapitalizedCamelCase(customTypeName));
                        
                        expect(xtype[matchingMethod]).toBeDefined(
                                
                        msg('Expected xtype.' + matchingMethod + ' to be defined' +
                            ' because that is the expected is<Type> method for checking' +
                            ' the registered custom type \'' + customTypeName + '\''));
                    });
                });
                
                
                it('should recognize the new type in \'is\' API calls', function() {
                    
                    var typeExpression = 'negative_integer, string, non_negative_integer';
                    
                    expect(xtype.is(5, typeExpression)).toBe(true,
                            
                    msg('Expected xtype.is(5, ' + str(typeExpression) + ')' +
                        ' to be true because the typeExpression ' + str(typeExpression) + ' includes' +
                        ' the registered custom type \'non_negative_integer\''));
                    
                    expect(xtype.is(5.5, typeExpression)).toBe(false,
                            
                    msg('Expected xtype.is(5.5, ' + str(typeExpression) + ')' +
                        ' to be false because the typeExpression ' + str(typeExpression) +
                        ' doesn\'t contain a type for the float value 5.5'));
                    

                    typeExpression = 'negative_integer, string, non_positive_integer';
                    
                    expect(xtype.is(0, typeExpression)).toBe(true,
                    
                    msg('Expected xtype.is(0, ' + str(typeExpression) + ')' +
                        ' to be true because the typeExpression ' + str(typeExpression) + ' includes' +
                        ' the registered custom type \'non_positive_integer\''));
                    
                    expect(xtype.is(5.5, typeExpression)).toBe(false,
                            
                    msg('Expected xtype.is(5.5, ' + str(typeExpression) + ')' +
                        ' to be false because the typeExpression ' + str(typeExpression) +
                        ' does not contain a type for the float value 5.5'));
                    
                    
                    var customInstance = new CustomInstanceParentType();
                    typeExpression = 'negative_integer, instance_type, non_positive_integer';
                    
                    expect(xtype.is(customInstance, typeExpression)).toBe(true,
                            
                    msg('Expected xtype.is(' + str(customInstance) + ', ' + str(typeExpression) + ')' +
                        ' to be true because the typeExpression ' + str(typeExpression) + ' includes' +
                        ' the registered custom type \'' + str(customInstance) + '\''));

                    typeExpression = 'negative_integer, non_positive_integer';
                    
                    expect(xtype.is(customInstance, typeExpression)).toBe(false,
                            
                    msg('Expected xtype.is(' + str(customInstance) + ', ' + str(typeExpression) + ')' +
                        ' to be false because the typeExpression ' + str(typeExpression) + ' does not include' +
                        ' the registered custom type \'' + str(customInstance) + '\''));
                    
                    
                    var twoPropObj = {
                        key1: 'val1',
                        key2: 'val2'
                    };
                    typeExpression = 'negative_integer, two_prop_obj_custom_type, non_positive_integer';
                    
                    expect(xtype.is(twoPropObj, typeExpression)).toBe(true,
                            
                    msg('Expected xtype.which(' + str(twoPropObj) + ', ' + str(typeExpression) + ')' +
                        ' to be true because the typeExpression ' + str(typeExpression) + ' includes' +
                        ' the registered custom type \'' + str(twoPropObj) + '\''));

                    typeExpression = 'negative_integer, non_positive_integer';
                    
                    expect(xtype.is(twoPropObj, typeExpression)).toBe(false,
                            
                    msg('Expected xtype.which(' + str(twoPropObj) + ', ' + str(typeExpression) + ')' +
                        ' to be false because the typeExpression ' + str(typeExpression) + ' does not include' +
                        ' the registered custom type \'' + str(twoPropObj) + '\''));
                    
                    
                    typeExpression = 'num_instance_custom_type_combo';
                    
                    expect(xtype.is(5, typeExpression)).toBe(true,
                            
                    msg('Expected xtype.is(5, ' + str(typeExpression) + ')' +
                        ' to be true because the typeExpression ' + str(typeExpression) + ' includes' +
                        ' the value 5'));
                    
                    expect(xtype.is(customInstance, typeExpression)).toBe(true,
                            
                    msg('Expected xtype.is(' + str(customInstance) + ', ' + str(typeExpression) + ')' +
                        ' to be true because the typeExpression ' + str(typeExpression) + ' includes' +
                        ' the value ' + str(customInstance)));
                    
                    expect(xtype.is(twoPropObj, typeExpression)).toBe(true,

                    msg('Expected xtype.is(' + str(twoPropObj) + ', ' + str(typeExpression) + ')' +
                        ' to be true because the typeExpression ' + str(typeExpression) + ' includes' +
                        ' the value ' + str(twoPropObj)));
                    
                    expect(xtype.is(-5, typeExpression)).toBe(false,

                    msg('Expected xtype.is(-5, ' + str(typeExpression) + ')' +
                        ' to be false because the typeExpression ' + str(typeExpression) + ' does not include' +
                        ' the negative values'));
                    
                });
                
                
                it('should recognize the new type in \'which\' API calls', function() {
                    
                    expect(xtype.which(5, 'negative_integer, string, non_negative_integer')).toBe('non_negative_integer',
                            
                    msg('Expected xtype.which(5, "negative_integer, string, non_negative_integer")' +
                        ' to be non_negative_integer' +
                        ' because that is the name of the custom type that is the only matching' +
                        ' type for value 5 in the list of provided types in the xtype.which call'));
                    
                    
                    expect(xtype.which(0, 'negative_integer, string, non_positive_integer')).toBe('non_positive_integer',
                            
                    msg('Expected xtype.which(-5, "negative_integer, string, non_positive_integer")' +
                        ' to be non_positive_integer' +
                        ' because that is the name of the custom type that is the only matching' +
                        ' type for value -5 in the list of provided types in the xtype.which call'));
                    
                    
                    var customInstance = new CustomInstanceParentType();
                    
                    expect(xtype.which(
                            customInstance, 
                            'negative_integer, instance_type, non_positive_integer')).toBe('instance_type',
                            
                    msg('Expected xtype.which(' + str(customInstance) + ', "instance_type, string, non_positive_integer")' +
                        ' to be instance_type' +
                        ' because that is the name of the custom type that is the only matching' +
                        ' type for value ' + str(customInstance) + ' in the list of provided types in the xtype.which call'));
                    
                    
                    var twoPropObj = {
                        key1: 'val1',
                        key2: 'val2'
                    };
                    
                    expect(xtype.which(
                            twoPropObj, 
                            'negative_integer, two_prop_obj_custom_type, non_positive_integer')).toBe('two_prop_obj_custom_type',
                            
                    msg('Expected xtype.which(' + str(twoPropObj) + ', "two_prop_obj_custom_type, string, non_positive_integer")' +
                        ' to be two_prop_obj_custom_type' +
                        ' because that is the name of the custom type that is the only matching' +
                        ' type for value ' + str(twoPropObj) + ' in the list of provided types in the xtype.which call'));
                });
                
                
                it('should recognize the compact name of the new type', function() {

                    xtype.options.setNameScheme('compact');
                    
                    expect(xtype.which(5, 'int- str -int-')).toBe('-int-',
                            
                    msg('Expected xtype.which(5, "int- str -int-") to be -int-' +
                        ' because that is the compact name of the custom type that is the only matching' +
                        ' type for value 5 in the list of provided types in the xtype.which call'));
                });
                
                
                it('should throw an exception if the name of the custom type conflicts with that of an existing type', function() {
                    
                    expect(function() {
                        xtype.registerTypes({
                            number: (xtype.NON_POSITIVE_NUMBER & xtype.INTEGER)
                        });
                    }).toThrow();
                });
                
                
                it('should throw an exception if the compact name of the custom type conflicts that of an existing type', function() {
                    
                    expect(function() {
                        xtype.registerTypes({
                            non_neg_int: {
                                typeId: (xtype.NON_NEGATIVE_NUMBER & xtype.INTEGER),
                                compactName: 'int+'
                            }
                        });
                    }).toThrow();
                });
            });
        });
    }
    
    
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {      // Return tests as module (node)
            exports = module.exports = specs;
        }
    } else if (typeof define === 'function' && define.amd) {        // Return tests as module (RequireJS)
        define(function() {
            return specs;
        });
    } else {                                                        // Otherwise, execute tests in browser
        specs(typeof xtype !== 'undefined' ? xtype : undefined);
    }
})();

