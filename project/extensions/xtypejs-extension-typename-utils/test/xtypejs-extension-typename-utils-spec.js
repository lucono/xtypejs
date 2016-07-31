(function() {

    'use strict';
    
    function specs(xtypejsTestUtil, xtypejs, xtypejsTypeNameUtilsExtension) {
        
        var 
            // -- Import Test Data --
            data = xtypejsTestUtil.data,
            allInstanceTypes = data.allInstanceTypes,
            allNonInstanceTypes = data.allNonInstanceTypes,
            expectedTypeCount = data.expectedTypeCount,
            
            // -- Import Test Helper Functions --
            testHelpers = xtypejsTestUtil.helpers,
            msg = testHelpers.printMsg,
            str = testHelpers.toString;
        
        
        // -- Register xtypejsTypeNameUtilsExtension if not pre-registered (e.g., sometimes in browser) --
        if (xtypejsTypeNameUtilsExtension) {
            xtypejs.ext.registerExtension(xtypejsTypeNameUtilsExtension);
        }

        
        /*
         * --------------------
         * TESTS
         * --------------------
         */
        
        
        describe('xtypejs-extension-typename-utils', function() {
            
            var xtype;
            
            beforeEach(function() {
                xtype = xtypejs.newInstance();
            });
            
            
            describe('Getting all types', function() {
                
                it('should get the expected full set of type names', function() {
                    
                    var allReceivedTypes = xtype.util.typeNames(),
                        allReceivedTypeIds = xtype.util.typeIds();
                
                    expect(allReceivedTypes.length).toBe(expectedTypeCount,
                            
                    msg('Expected xtype.util.typeNames().length to be ' + str(expectedTypeCount)));
                    
                    allNonInstanceTypes.forEach(function(expectedTypeName) {
                        
                        expect(allReceivedTypes).toContain(expectedTypeName,
                                
                        msg('Expected xtype.util.typeNames() to contain ' + str(expectedTypeName)));
                    });
                });
                
                
                it('should get the expected full set of type Ids', function() {
                    
                    var allReceivedTypes = xtype.util.typeNames(),
                        allReceivedTypeIds = xtype.util.typeIds();
                
                    expect(allReceivedTypeIds.length).toBe(expectedTypeCount,
                            
                    msg('Expected xtype.util.typeIds().length to be ' + str(expectedTypeCount)));
                    
                    allNonInstanceTypes.forEach(function(expectedTypeName) {
                        var expectedTypeId = xtype.util.nameToId(expectedTypeName);
                        
                        expect(allReceivedTypeIds).toContain(expectedTypeId,
                                
                        msg('Expected xtype.util.typeIds() to contain ' + str(expectedTypeId) +
                            ' which is the corresponding type Id returned for type name ' + str(expectedTypeName)));
                    });
                });
            });
                
                
            describe('Type name to type Id conversion', function() {
                
                allNonInstanceTypes.forEach(function(testType) {

                    it('should convert type: ' + str(testType), function() {
                        
                        var allReceivedTypes = xtype.util.typeNames(),
                            allReceivedTypeIds = xtype.util.typeIds(),
                            expectedTypeIdProperty = testType.toUpperCase(),
                            expectedTypeId = xtype[expectedTypeIdProperty];
                    
                        expect(xtype.util.nameToId(testType)).toBe(expectedTypeId,
                        
                        msg('Expected xtype.util.nameToId(' + str(testType) + ')' +
                            ' to be ' + str(expectedTypeId) +
                            ' because it is the value exposed as the type Id for type ' + str(testType)));
                    });
                });
                
                
                it('should convert to themselves for instance types', function() {
                    
                    allInstanceTypes.forEach(function(instanceType) {
                        var result = xtype.util.nameToId(instanceType);
                        
                        expect(result).toBe(instanceType,
                                
                        msg('Expected xtype.util.nameToId(' + str(instanceType) + ')' +
                            ' to be ' + str(instanceType) +
                            ' because instance types should convert to themselves,' +
                            ' but the result was ' + str(result)));
                    });
                    
                });
            });
            
            
            describe('Type Id to type name conversion', function() {

                allNonInstanceTypes.forEach(function(testType) {
                        
                    it('should convert back from type Id: ' + str(testType), function() {
                        
                        var expectedTypeIdProperty = testType.toUpperCase(),
                            definedTypeId = xtype[expectedTypeIdProperty];

                        expect(xtype.util.idToName(definedTypeId)).toBe(testType,
                                
                        msg('Expected xtype.util.idToName(xtype[' + str(expectedTypeIdProperty) + '])' +
                            ' to be ' + str(testType) +
                            ' because it is the corersponding type for the defined type' +
                            ' id property xtype[' + str(expectedTypeIdProperty) + ']'));
                    });
                });
                
                
                it('should convert to themselves for instance types', function() {
                    
                    allInstanceTypes.forEach(function(instanceType) {                        
                        var result = xtype.util.idToName(instanceType);
                        
                        expect(result).toBe(instanceType,
                                
                        msg('Expected xtype.util.idToName(' + str(instanceType) + ')' +
                            ' to be the same instance type ' + str(instanceType) +
                            ' because instance types should convert to themselves,' +
                            ' but the result was ' + str(result)));
                    });
                });
            });
        });
    }
    
    
    if (typeof exports !== 'undefined') {
        /* -- Node environment -- */

        specs(
            require('../../../../shared/test/test-util'), 
            require('../../../xtypejs/dist/xtype'), 
            require('../dist/xtypejs-extension-typename-utils'));
    }
    else if (typeof define === 'function' && define.amd) {
        /* -- RequireJS environment -- */

        define([
                '../../../../shared/test/test-util.js',
                '../../../xtypejs/dist/xtype.js',
                '../dist/xtypejs-extension-typename-utils.js'
            ],
            function(xtypejsTestUtil, xtypejs, xtypejsTypeNameUtilsExtension) {
                specs(xtypejsTestUtil, xtypejs, xtypejsTypeNameUtilsExtension);
            });
    }
    else {
        /* -- Browser environment -- */

        specs(
            typeof xtypejsTestUtil !== 'undefined' ? xtypejsTestUtil : undefined,
            typeof xtype !== 'undefined' ? xtype : undefined,
            typeof xtypejsTypeNameUtilsExtension !== 'undefined' ? xtypejsTypeNameUtilsExtension : undefined);
    }
})();

