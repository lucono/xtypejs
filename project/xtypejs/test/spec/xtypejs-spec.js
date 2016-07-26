(function() {

    'use strict';
    
    function specs(xtypejsTestUtil, xtypejs) {
        
        var 
            // -- Import Test Data --
            data = xtypejsTestUtil.data,
            testData = data.testData,
            allInstanceTypes = data.allInstanceTypes,
            allNonInstanceTypes = data.allNonInstanceTypes,
            matchingTestValuesByType = data.matchingTestValuesByType,
            nonMatchingTestValuesByType = data.nonMatchingTestValuesByType,
            noneType = data.noneType,
            
            // -- Import Test Helper Functions --
            testHelpers = xtypejsTestUtil.helpers,
            toCapitalizedCamelCase = testHelpers.toCapitalizedCamelCase,
            addList = testHelpers.addList,
            subtractList = testHelpers.subtractList,
            msg = testHelpers.printMsg,
            str = testHelpers.toString;
        
        
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
                            
                            expect(result).toBe(noneType,
                                    
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

                    xtype.options.setNameScheme({   // Switch to custom scheme
                        string: 'myString',
                        number: 'myNumber'
                    });
                    
                    expect(xtype.type(5)).toBe('myNumber');        // Confirm successful switch to custom scheme
                    
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

                    xtype.options.setNameScheme({   // Switch to custom scheme
                        string: 'myString',
                        number: 'myNumber'
                    });
                    
                    expect(xtype.type(5)).toBe('myNumber');        // Confirm successful switch to compact scheme
                    
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

                    xtype.ext.registerNameScheme('my_scheme', customNameScheme);
                    
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
        specs(
            typeof xtypejsTestUtil !== 'undefined' ? xtypejsTestUtil : undefined,
            typeof xtype !== 'undefined' ? xtype : undefined);
    }
})();

