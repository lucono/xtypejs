(function() {

    'use strict';
    
    function specs(xtypejsTestUtil, xtypejs, xtypejsCustomTypesExtension) {
        
        var 
            // -- Import Test Data --
            CustomInstanceParentType = xtypejsTestUtil.data.CustomInstanceParentType,
            
            // -- Import Test Helper Functions --
            testHelpers = xtypejsTestUtil.helpers,
            toCapitalizedCamelCase = testHelpers.toCapitalizedCamelCase,
            msg = testHelpers.printMsg,
            str = testHelpers.toString;
        
        
        // -- Register xtypejsCustomTypesExtension if not pre-registered (e.g., sometimes in browser) --
        if (xtypejsCustomTypesExtension) {
            xtypejs.ext.registerExtension(xtypejsCustomTypesExtension);
        }

        
        /*
         * --------------------
         * TESTS
         * --------------------
         */
        
        
        describe('xtypejs', function() {
            
            var xtype = xtypejs.newInstance();
            
            afterEach(function() {
                xtype = xtypejs.newInstance();
            });
            
            
            describe('Registering a custom type', function() {
                
                beforeEach(function() {
                    xtype.ext.registerNameScheme('myScheme', {
                        number: 'num',
                        string: 'string'
                    });

                    xtype.ext.registerType({
                        non_negative_integer: {
                            definition: 'non_negative_number, integer',
                            matchMode: 'all',
                            schemeAliases: { myScheme: '-int-' }
                        },
                        
                        non_positive_integer: {
                            definition: 'non_positive_number, integer',
                            matchMode: 'all',
                            schemeAliases: { myScheme: '-int+' }
                        },
                        
                        instance_type: {
                            definition: CustomInstanceParentType,
                            schemeAliases: { myScheme: 'inst' }
                        },
                        
                        two_prop_obj_custom_type: {
                            definition: {
                                validator: function(value) {
                                    return (typeof value === 'object' && value !== null && Object.keys(value).length === 2);
                                }
                            },
                            schemeAliases: { myScheme: 'obj2' }
                        }
                    });

                    xtype.ext.registerType({ 
                        num_instance_custom_type_combo: {
                            definition: 'non_negative_integer, instance_type, two_prop_obj_custom_type',
                            schemeAliases: { myScheme: 'num_inst_cust_combo' }
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
                
                
                it('should recognize the custom scheme type name of the new type', function() {

                    xtype.options.setNameScheme('myScheme');
                    
                    expect(xtype.which(5, 'int- str -int-')).toBe('-int-',
                    
                    msg('Expected xtype.which(5, "int- str -int-") to be -int-' +
                        ' because that is the custom scheme type name of the custom type that is the only matching' +
                        ' type for value 5 in the list of provided types in the xtype.which call'));
                });
                
                
                it('should throw an exception if the name of the custom type conflicts with that of an existing type', function() {
                    
                    expect(function() {
                        xtype.ext.registerType({
                            number: {
                                definition: 'non_negative_number, integer',
                                matchMode: 'all'
                            }
                        });
                    }).toThrow();
                });
                
                
                it('should throw an exception if the type definition of the custom type conflicts that of an existing type', function() {
                    
                    expect(function() {
                        xtype.ext.registerType({
                            non_neg_int: {
                                definition: 'non_negative_number, integer',
                                matchMode: 'all'
                            }
                        });
                    }).toThrow();
                });
                
                
                it('should throw an exception if the custom scheme type name of the custom type conflicts that of an existing type', function() {
                    
                    expect(function() {
                        xtype.ext.registerType({
                            non_neg_int: {
                                definition: 'non_negative_number, integer',
                                matchMode: 'any',
                                schemeAliases: { myScheme: '-int+' }    // -int+ is already used by different type in scheme
                            }
                        });
                    }).toThrow();
                });
            });
        });
    }
    
    
    if (typeof exports !== 'undefined') {
        /* -- Node environment -- */

        specs(
            require('../../../../shared/test/test-util'), 
            require('../../../xtypejs/dist/xtype'), 
            require('../dist/xtypejs-extension-custom-types'));
    }
    else if (typeof define === 'function' && define.amd) {
        /* -- RequireJS environment -- */

        define([
                '../../../../shared/test/test-util.js',
                '../../../xtypejs/dist/xtype.js',
                '../dist/xtypejs-extension-custom-types.js'
            ],
            function(xtypejsTestUtil, xtypejs, xtypeCustomTypesExtension) {
                specs(xtypejsTestUtil, xtypejs, xtypeCustomTypesExtension);
            });
    }
    else {
        /* -- Browser environment -- */

        specs(
            typeof xtypejsTestUtil !== 'undefined' ? xtypejsTestUtil : undefined,
            typeof xtype !== 'undefined' ? xtype : undefined,
            typeof xtypejsCustomTypesExtension !== 'undefined' ? xtypejsCustomTypesExtension : undefined);
    }
})();

