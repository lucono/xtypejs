(function() {

    'use strict';
    
    function specs(xtypejsTestUtil, xtypejs, xtypejsIntrospectionExtension) {
        
        var 
            // -- Import Test Data --
            data = xtypejsTestUtil.data,
            allInstanceTypes = data.allInstanceTypes,
            allNonInstanceTypes = data.allNonInstanceTypes,
            compositeTypes = data.compositeTypes,
            nonCompositeTypes = data.nonCompositeTypes,
            expectedTypeCount = data.expectedTypeCount,
            
            // -- Import Test Helper Functions --
            testHelpers = xtypejsTestUtil.helpers,
            msg = testHelpers.printMsg,
            str = testHelpers.toString,
            subtractList = testHelpers.subtractList;
        
        
        // -- Register xtypejsIntrospectionExtension if not pre-registered (e.g., sometimes in browser) --
        if (xtypejsIntrospectionExtension) {
            xtypejs.ext.registerExtension(xtypejsIntrospectionExtension);
        }

        
        /*
         * --------------------
         * TESTS
         * --------------------
         */
        
        
        describe('xtypejs-extension-introspection', function() {
            
            var xtype;
            
            beforeEach(function() {
                xtype = xtypejs.newInstance();
            });
            
            
            describe('Getting all types', function() {

                it('should get the expected full set of type names for the default name scheme', function() {
                    
                    var allReceivedTypes = xtype.introspect.typeNames();
                
                    expect(allReceivedTypes.length).toBe(expectedTypeCount,
                            
                    msg('Expected xtype.introspect.typeNames().length to be ' + str(expectedTypeCount)));
                    
                    allNonInstanceTypes.forEach(function(expectedTypeName) {
                        
                        expect(allReceivedTypes).toContain(expectedTypeName,
                                
                        msg('Expected xtype.introspect.typeNames() to contain ' + str(expectedTypeName)));
                    });
                });

                it('should get the expected full set of type names when using a custom name scheme', function() {
                    
                    var customNameScheme = {
                            integer: 'int',
                            string: 'str',
                            number: 'num',
                            'undefined': 'undef',
                            'null': 'nil',
                            nothing: 'void',
                            any: 'anything'
                        };

                    xtype.options.setNameScheme(customNameScheme);

                    var allReceivedTypes = xtype.introspect.typeNames();
                
                    expect(allReceivedTypes.length).toBe(expectedTypeCount,
                            
                    msg('Expected xtype.introspect.typeNames().length to be ' + str(expectedTypeCount)));
                    
                    Object.keys(customNameScheme).forEach(function(typeName) {
                        var expectedTypeName = customNameScheme[typeName];
                        
                        expect(allReceivedTypes).toContain(expectedTypeName,
                                
                        msg('Expected xtype.introspect.typeNames() to contain ' + str(expectedTypeName)));
                    });
                });
                
                
                it('should get the expected full set of type Ids', function() {
                    
                    var allReceivedTypes = xtype.introspect.typeNames(),
                        allReceivedTypeIds = xtype.introspect.typeIds();
                
                    expect(allReceivedTypeIds.length).toBe(expectedTypeCount,
                            
                    msg('Expected xtype.introspect.typeIds().length to be ' + str(expectedTypeCount)));
                    
                    allNonInstanceTypes.forEach(function(expectedTypeName) {
                        var expectedTypeId = xtype.introspect.typeNameToId(expectedTypeName);
                        
                        expect(allReceivedTypeIds).toContain(expectedTypeId,
                                
                        msg('Expected xtype.introspect.typeIds() to contain ' + str(expectedTypeId) +
                            ' which is the corresponding type Id returned for type name ' + str(expectedTypeName)));
                    });
                });
            });
                
                
            describe('Type name to type Id conversion', function() {
                
                allNonInstanceTypes.forEach(function(testType) {

                    it('should convert type: ' + str(testType), function() {
                        
                        var expectedTypeIdProperty = testType.toUpperCase(),
                            expectedTypeId = xtype[expectedTypeIdProperty];
                    
                        expect(xtype.introspect.typeNameToId(testType)).toBe(expectedTypeId,
                        
                        msg('Expected xtype.introspect.typeNameToId(' + str(testType) + ')' +
                            ' to be ' + str(expectedTypeId) +
                            ' because it is the value exposed as the type Id for type ' + str(testType)));
                    });
                });
            });
            
            
            describe('Type Id to type name conversion', function() {

                allNonInstanceTypes.forEach(function(testType) {
                        
                    it('should convert back from type Id: ' + str(testType), function() {
                        
                        var expectedTypeIdProperty = testType.toUpperCase(),
                            definedTypeId = xtype[expectedTypeIdProperty];

                        expect(xtype.introspect.typeIdToName(definedTypeId)).toBe(testType,
                                
                        msg('Expected xtype.introspect.typeIdToName(xtype[' + str(expectedTypeIdProperty) + '])' +
                            ' to be ' + str(testType) +
                            ' because it is the corersponding type for the defined type' +
                            ' id property xtype[' + str(expectedTypeIdProperty) + ']'));
                    });
                });
            });

            
            describe('Getting type composition', function() {

                describe('for composite types', function() {

                    describe('using type names', function() {

                        Object.keys(compositeTypes).forEach(function(compositeTypeName) {

                            it('should get component types for composite type: ' + str(compositeTypeName), function() {
                                var expectedTypeComposition = compositeTypes[compositeTypeName].slice().sort(),
                                    actualTypeComposition = xtype.introspect.typeComposition(compositeTypeName).sort();

                                expect(actualTypeComposition).toEqual(expectedTypeComposition,
                                        
                                msg('Expected xtype.introspect.typeComposition(' + str(compositeTypeName) + ')' +
                                    ' to contain exactly ' + str(expectedTypeComposition) + 
                                    ' because they are the component types' +
                                    ' of the derived type ' + str(compositeTypeName)));
                            });
                        });
                    });

                    describe('using type Ids', function() {

                        Object.keys(compositeTypes).forEach(function(compositeTypeName) {

                            it('should get component types for composite type: ' + str(compositeTypeName), function() {
                                var compositeTypeIdProperty = compositeTypeName.toUpperCase(),
                                    compositeTypeId = xtype[compositeTypeIdProperty];
        
                                var expectedTypeComposition = compositeTypes[compositeTypeName].slice().sort(),
                                    actualTypeComposition = xtype.introspect.typeComposition(compositeTypeId).sort();

                                expect(actualTypeComposition).toEqual(expectedTypeComposition,
                                        
                                msg('Expected xtype.introspect.typeComposition(' + compositeTypeId + ')' +
                                    ' to contain exactly ' + str(expectedTypeComposition) + 
                                    ' because they are the component types' +
                                    ' of the derived type ' + str(compositeTypeName)));
                            });
                        });
                    });
                });

                describe('for non-composite non-instance types', function() {

                    describe('using type names', function() {

                        nonCompositeTypes.forEach(function(nonCompositeTypeName) {

                            it('should give only the same type for non-composite type: ' + str(nonCompositeTypeName), function() {
                                var expectedTypeComposition = [nonCompositeTypeName],
                                    actualTypeComposition = xtype.introspect.typeComposition(nonCompositeTypeName);

                                expect(actualTypeComposition).toEqual(expectedTypeComposition,
                                        
                                msg('Expected xtype.introspect.typeComposition(' + str(nonCompositeTypeName) + ')' +
                                    ' to contain exactly ' + str(expectedTypeComposition) + 
                                    ' because the non-composite type ' + str(nonCompositeTypeName) + 
                                    ' is only composed of itself'));
                            });
                        });
                    });

                    describe('using type Ids', function() {

                        nonCompositeTypes.forEach(function(nonCompositeTypeName) {

                            it('should give only the same type for non-composite type: ' + str(nonCompositeTypeName), function() {
                                var nonCompositeTypeIdProperty = nonCompositeTypeName.toUpperCase(),
                                    nonCompositeTypeId = xtype[nonCompositeTypeIdProperty];
        
                                var expectedTypeComposition = [nonCompositeTypeName],
                                    actualTypeComposition = xtype.introspect.typeComposition(nonCompositeTypeId);

                                expect(actualTypeComposition).toEqual(expectedTypeComposition,
                                        
                                msg('Expected xtype.introspect.typeComposition(' + nonCompositeTypeId + ')' +
                                    ' to contain exactly ' + str(expectedTypeComposition) + 
                                    ' because the non-composite type ' + str(nonCompositeTypeName) + 
                                    ' is only composed of itself'));
                            });
                        });
                    });
                });

                describe('for instance types', function() {

                    allInstanceTypes.forEach(function(instanceType) {

                        it('should give only the same type for instance type: ' + str(instanceType), function() {
                            var expectedTypeComposition = [instanceType],
                                actualTypeComposition = xtype.introspect.typeComposition(instanceType);

                            expect(actualTypeComposition).toEqual(expectedTypeComposition,
                                    
                            msg('Expected xtype.introspect.typeComposition(' + str(instanceType) + ')' + 
                                ' to contain zero types ' +
                                ' because instance types are not derived by' +
                                ' composition and constitute only themselves'));
                        });
                    });
                });
            });
        });
    }
    
    
    if (typeof exports !== 'undefined') {
        /* -- Node environment -- */

        specs(
            require('../../../../shared/test/test-util'), 
            require('../../../xtypejs/xtype'), 
            require('../dist/xtypejs-extension-introspection'));
    }
    else if (typeof define === 'function' && define.amd) {
        /* -- RequireJS environment -- */

        define([
                '../../../../shared/test/test-util.js',
                '../../../xtypejs/xtype.js',
                '../dist/xtypejs-extension-introspection.js'
            ],
            function(xtypejsTestUtil, xtypejs, xtypejsIntrospectionExtension) {
                specs(xtypejsTestUtil, xtypejs, xtypejsIntrospectionExtension);
            });
    }
    else {
        /* -- Browser environment -- */

        specs(
            typeof xtypejsTestUtil !== 'undefined' ? xtypejsTestUtil : undefined,
            typeof xtype !== 'undefined' ? xtype : undefined,
            typeof xtypejsIntrospectionExtension !== 'undefined' ? xtypejsIntrospectionExtension : undefined);
    }
})();

