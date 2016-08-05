(function() {

    'use strict';
    
    function specs(xtypejsTestUtil, xtypejs, xtypejsCustomTypesExtension, xtypejsAutoCamelNameSchemeExtension) {
        
        var 
            // Import Test Data
            matchingTestValuesByType = xtypejsTestUtil.data.matchingTestValuesByType,
            
            // Import Test Helper Functions
            testHelpers = xtypejsTestUtil.helpers,
            toCapitalizedCamelCase = testHelpers.toCapitalizedCamelCase,
            msg = testHelpers.printMsg,
            str = testHelpers.toString;
        
        
        // Register xtypejsCustomTypesExtension if not already registered (e.g., sometimes in browser)
        if (xtypejsCustomTypesExtension) {
            xtypejs.ext.registerExtension(xtypejsCustomTypesExtension);
        }
        
        // Register xtypejsAutoCamelNameSchemeExtension if not already registered (e.g., sometimes in browser)
        if (xtypejsAutoCamelNameSchemeExtension) {
            xtypejs.ext.registerExtension([xtypejsCustomTypesExtension, xtypejsAutoCamelNameSchemeExtension]);
        }

        
        /*
         * --------------------
         * TESTS
         * --------------------
         */
        
        
        describe('xtypejs-extension-autocamel-name-scheme', function() {
            
            var xtype;
            
            beforeEach(function() {
                xtype = xtypejs.newInstance();
            });
            
            
            describe('Name scheme', function() {
                
                Object.keys(matchingTestValuesByType).forEach(function(typeName) {

                    it('should automatically use the camel-cased name alias for the type: ' + typeName, function() {
                        
                        var sampleData = matchingTestValuesByType[typeName].data[0],
                            sampleValue = sampleData.testValue,
                            simpleType = sampleData.simpleType,
                            extendedType = sampleData.extendedType;

                        xtype.options.setNameScheme('auto-camel');

                        var expectedSimpleName = toCapitalizedCamelCase(simpleType),
                            expectedExtendedName = toCapitalizedCamelCase(extendedType);
                        
                        expect(xtype.type(sampleValue)).toBe(expectedSimpleName,
                                
                        msg('Expected xtype.type(' + str(sampleValue) + ') to be ' + str(expectedSimpleName) +
                            ' because that is the name scheme alias of the type of sample (' + str(sampleValue) + ')' +
                            ' of simple type ' + str(simpleType)));
                        
                        expect(xtype(sampleValue)).toBe(expectedExtendedName,
                        
                        msg('Expected xtype(' + str(sampleValue) + ') to be ' + str(expectedExtendedName) +
                            ' because that is the name scheme alias of the type of sample (' + str(sampleValue) + ')' +
                            ' of extended type ' + str(extendedType)));
                    });
                });
            });
            
            
            describe('Registering a custom type', function() {

                it('should automatically create a camel-cased name for the newly registered type', function() {
                    
                    var isCustomTypeExtensionAvailable = (typeof xtype.ext === 'object' && typeof xtype.ext.registerType === 'function');

                    if (!isCustomTypeExtensionAvailable) {
                        throw new Error(
                            'The custom types extension is not installed for testing of ' +
                            'auto-camel name aliases for newly registered types');
                    }

                    var typeName = 'non_negative_integer';

                    xtype.ext.registerType(typeName, {
                            definition: 'non_negative_number, integer',
                            matchMode: 'all'
                        });
                    
                    xtype.options.setNameScheme('auto-camel');

                    var expectedCamelName = toCapitalizedCamelCase(typeName);
                    
                    expect(xtype.which(5, expectedCamelName)).toBe(expectedCamelName,
                    
                    msg('Expected xtype.which(5, ' + str(expectedCamelName) + ') to be ' + str(expectedCamelName) +
                        ' because that is the name scheme alias of the expected type of ' + str(typeName)));
                });
            });
        });
    }
    
    
    if (typeof exports !== 'undefined') {
        /* -- Node environment -- */

        specs(
            require('../../../../shared/test/test-util'), 
            require('../../../xtypejs/dist/xtype'), 
            require('../../xtypejs-extension-custom-types/dist/xtypejs-extension-custom-types'),
            require('../dist/xtypejs-extension-autocamel-name-scheme'));
    }
    else if (typeof define === 'function' && define.amd) {
        /* -- RequireJS environment -- */

        define([
                '../../../../shared/test/test-util.js',
                '../../../xtypejs/dist/xtype.js',
                '../../xtypejs-extension-custom-types/dist/xtypejs-extension-custom-types.js',
                '../dist/xtypejs-extension-autocamel-name-scheme.js'
            ],
            function(xtypejsTestUtil, xtypejs, xtypeCustomTypesExtension, xtypejsAutoCamelNameSchemeExtension) {
                specs(xtypejsTestUtil, xtypejs, xtypeCustomTypesExtension, xtypejsAutoCamelNameSchemeExtension);
            });
    }
    else {
        /* -- Browser environment -- */

        specs(
            typeof xtypejsTestUtil !== 'undefined' ? xtypejsTestUtil : undefined,
            typeof xtype !== 'undefined' ? xtype : undefined,
            typeof xtypejsCustomTypesExtension != 'undefined' ? xtypejsCustomTypesExtension : undefined,
            typeof xtypejsAutoCamelNameSchemeExtension !== 'undefined' ? xtypejsAutoCamelNameSchemeExtension : undefined);
    }
})();

