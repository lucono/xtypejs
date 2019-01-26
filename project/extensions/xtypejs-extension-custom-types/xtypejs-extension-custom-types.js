/** @license | xtypejs-extension-custom-types v{{ LIB_VERSION }} | (c) 2015, Lucas Ononiwu | MIT license, xtype.js.org/license.txt
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
 
(function(root, xtypejs, undefined) {
    
    'use strict';

    var LIB_NAME = 'xtypejsCustomTypesExtension',
        LIB_INTERFACE_NAME = 'ext',
        LIB_VERSION = '{{ LIB_VERSION }}';

    function init(xtype) {

        var Object = ({}).constructor || Object,
            objCreate = Object.create,
            objKeys = Object.keys,

            extensionInterface = this;
        

        function registerType(customTypeName, customTypeValue) {
            if (typeof customTypeName === 'object') {
                registerMultipleTypes(customTypeName);
            }
            else {
                registerSingleType(customTypeName, customTypeValue);
            }
            extensionInterface.refresh();
        }
        
        /**
         * Registers one or more user-defined types into xtypejs.
         */
        function registerMultipleTypes(customTypes) {
            if (typeof customTypes !== 'object') {
                return;
            }
            objKeys(customTypes).forEach(function(customTypeName) {
                registerSingleType(customTypeName, customTypes[customTypeName]);
            });
        }

        /**
         * Registers a single user-defined type into xtypejs.
         */
        function registerSingleType(customTypeName, customTypeValue) {
            if (typeof customTypeName === 'object') {
                registerTypes(customTypeName);
                return;
            }
            if (typeof customTypeName !== 'string') {
                return;
            }
            
            var typeDefinitions = extensionInterface.getTypeDefinitions(),
                customTypeDefinition,
                composedCustomTypeDefinition,
                schemeAliases,
                matchMode;
            
            if (objKeys(typeDefinitions).indexOf(customTypeName) > -1) {
                throw 'Custom type name "' + customTypeName + '" conflicts with existing type name';
            }
            
            if (!/^([0-9a-z_]+)$/.test(customTypeName)) {
                throw 'Type name must only contain lowercase alphanumeric characters and underscore';
            }
            
            if (typeof customTypeValue === 'object' && customTypeValue !== null && ('definition' in customTypeValue)) {
                customTypeDefinition = customTypeValue.definition;
                schemeAliases = customTypeValue.schemeAliases;
                matchMode = customTypeValue.matchMode;
            } else {
                customTypeDefinition = customTypeValue;
            }
            
            if (typeof customTypeDefinition === 'string') {
                customTypeDefinition = composedCustomTypeDefinition = getCustomTypeDefinition(customTypeDefinition, matchMode, customTypeName);
            }
            
            if (typeof customTypeDefinition === 'number') {
                if ((customTypeDefinition & xtype.ANY) !== customTypeDefinition) {
                    throw 'Custom extended type composite \'' + customTypeName + '\' can only be derived using built-in extended type Ids.';
                }
            } else if (typeof customTypeDefinition === 'object' && customTypeDefinition !== null) {
                if (typeof customTypeDefinition.validator !== 'function') {
                    throw 'Custom type \'' + customTypeName + '\' definition is missing the validator function.';
                }
                if (composedCustomTypeDefinition !== customTypeDefinition) { // make internal copy of externally supplied object
                    composedCustomTypeDefinition = objCreate(null);
                    composedCustomTypeDefinition.validator = customTypeDefinition.validator;
                    customTypeDefinition = composedCustomTypeDefinition;
                }
            } else if (typeof customTypeDefinition !== 'function') {
                throw 'No valid type definition provided for requested custom type \'' + customTypeName + '\'';
            }
            
            var customTypeIdentity = (typeof composedCustomTypeDefinition === 'object' ? composedCustomTypeDefinition.identity
                    : typeof customTypeDefinition === 'object' ? customTypeDefinition.validator 
                    : customTypeDefinition);
            
            var existingTypeName = getTypeWithIdentity(customTypeIdentity);
            
            if (existingTypeName) {
                throw 'Custom type \'' + customTypeName + '\' conflicts with other type' +
                        ' \'' + existingTypeName + '\' with identical definition';
            }
            
            if (schemeAliases) {
                if (typeof schemeAliases !== 'object') {
                    throw 'Custom type "' + customTypeName + '" scheme aliases is not an object';
                }
                setSchemeAliases(customTypeName, schemeAliases);
            }
            extensionInterface.defineType(customTypeName, customTypeDefinition);
        }


        /**
         * Set the type aliases for the custom type for the specified name schemes.
         */
        function setSchemeAliases(customTypeName, schemeAliases) {
            objKeys(schemeAliases).forEach(function(schemeName) {
                var nameSchemes = extensionInterface.getNameSchemes(),
                    schemeAlias = schemeAliases[schemeName];

                if ((schemeName in nameSchemes) && typeof schemeAlias === 'string') {
                    var nameScheme = nameSchemes[schemeName];
                    objKeys(nameScheme).forEach(function(typeName) {
                        if (schemeAlias === nameScheme[typeName]) {
                            throw 'Type name alias "' + schemeAlias + '" for name scheme' +
                                ' "' + schemeName + '" for custom type "' + customTypeName + '"' + 
                                ' conflicts with existing name in the specified name scheme';
                        }
                    });
                    nameScheme[customTypeName] = schemeAlias;
                }
            });
        }
        
        /*
        * ----------------
        * HELPER FUNCTIONS
        * ----------------
        */
        
        /**
         * Finds and returns the type with the given identity, if any.
         */
        function getTypeWithIdentity(typeIdentity) {
            var typeDefinitions = extensionInterface.getTypeDefinitions(),
                existingType,
                existingTypeName,
                existingTypeIdentity,
                typeNames = objKeys(typeDefinitions), 
                typeCount = typeNames.length,
                typeIndex;
            
            for (typeIndex = 0; typeIndex < typeCount; typeIndex++) {
                existingTypeName = typeNames[typeIndex];
                existingType = typeDefinitions[existingTypeName];
                
                existingTypeIdentity = (typeof existingType === 'object' ?
                                (existingType.identity ? existingType.identity : existingType.validator)
                        : existingType);
                
                if (typeIdentity === existingTypeIdentity) {
                    return existingTypeName;
                }
            }
            return null;
        }
        
        /**
         * Gets a custom type definition from a definition string of component types.
         */
        function getCustomTypeDefinition(definitionString, matchMode, customTypeName) {
            var componentTypes = definitionString.trim().split(/[ ]*[, ][ ]*/g);

            if (componentTypes.length < 2) {
                throw 'Type definition string for custom type \'' + customTypeName + '\'' +
                        ' must contain two or more type components';
            }
            
            matchMode = (matchMode === 'all' ? 'all' : 'any');
            
            var typeIds = [],
                instanceTypes = [],
                customTypes = [];
            
            componentTypes.forEach(function(componentTypeName) {
                var typeValue = extensionInterface.getTypeDefinitions()[componentTypeName];
                
                if (typeof typeValue === 'undefined') {
                    throw 'Unknown type \'' + componentTypeName + '\' in type definition' +
                            ' string for custom type \'' + customTypeName + '\'';
                }
                
                if (typeof typeValue === 'number') {
                    typeIds.push(typeValue);
                } else if (typeof typeValue === 'function') {
                    instanceTypes.push(typeValue);
                } else if (typeof typeValue === 'object') {
                    customTypes.push(typeValue);
                }
            });
            
            var compositeTypeId,
                instanceChecker,
                customTypeChecker;
            
            if (typeIds.length > 0) {
                compositeTypeId = (matchMode === 'all' ? xtype.ANY : 0);

                typeIds.forEach(function(typeId) {
                    compositeTypeId = (matchMode === 'all' ? (compositeTypeId & typeId) : (compositeTypeId | typeId));
                });
            }
            
            if (instanceTypes.length > 0) {
                if (matchMode === 'all') {
                    instanceChecker = function(item) {
                        for (var index = 0, maxIndex = instanceTypes.length; index < maxIndex; index++) {
                            if (!(item instanceof instanceTypes[index])) {
                                return false;
                            }
                        }
                        return true;
                    };
                } else {
                    instanceChecker = function(item) {
                        for (var index = 0, maxIndex = instanceTypes.length; index < maxIndex; index++) {
                            if (item instanceof instanceTypes[index]) {
                                return true;
                            }
                        }
                        return false;
                    };
                }
            }
            
            if (customTypes.length > 0) {
                if (matchMode === 'all') {
                    customTypeChecker = function(item) {
                        for (var index = 0, maxIndex = customTypes.length; index < maxIndex; index++) {
                            if (!customTypes[index].validator(item)) {
                                return false;
                            }
                        }
                        return true;
                    };
                } else {
                    customTypeChecker = function(item) {
                        for (var index = 0, maxIndex = customTypes.length; index < maxIndex; index++) {
                            if (customTypes[index].validator(item)) {
                                return true;
                            }
                        }
                        return false;
                    };
                }
            }
            
            if ((typeof compositeTypeId === 'undefined') && !instanceChecker && !customTypeChecker) {
                throw 'Faild to determine valid composite checker for custom type \'' + customTypeName + '\'' +
                        ' with type definition string \'' + definitionString + '\'';
            }
            
            if ((typeof compositeTypeId !== 'undefined') && !instanceChecker && !customTypeChecker) {
                return compositeTypeId;
            }
            
            var validator;
            
            if (instanceChecker && !compositeTypeId && !customTypeChecker) {
                if (instanceTypes.length === 1) {
                    return instanceTypes[0];
                }
                validator = instanceChecker;
            } else if (customTypeChecker && !compositeTypeId && !instanceChecker) {
                validator = customTypeChecker;
            } else {
                validator = function(item) {
                    return matchMode === 'all' ?
                            (((typeof compositeTypeId !== 'undefined') ? xtype.is(item, compositeTypeId) : true) &&
                                    (instanceChecker ? instanceChecker(item) : true) &&
                                    (customTypeChecker ? customTypeChecker(item) : true))
                            : (((typeof compositeTypeId !== 'undefined') ? xtype.is(item, compositeTypeId) : false) ||
                                    (instanceChecker ? instanceChecker(item) : false) ||
                                    (customTypeChecker ? customTypeChecker(item) : false));
                };
            }

            var customTypeDefinition = objCreate(null);
            
            customTypeDefinition.validator = validator;
            customTypeDefinition.identity = (matchMode + ' : ' + componentTypes.sort().join(' '));
            
            return customTypeDefinition;
        }


        // -- Attach plugin functions --

        var libInterface = (xtype[LIB_INTERFACE_NAME] || objCreate(null));
        xtype[LIB_INTERFACE_NAME] = libInterface;

        libInterface.registerType = registerType;
    }
    
    
    /*
     * Export extension module
     */

    var moduleExport = {
            name: LIB_NAME,
            version: (/\s*{{[^}]*}}\s*/g.test(LIB_VERSION) ? 'unspecified' : LIB_VERSION),
            type: 'xtypejs',
            init: init
        };
    
    
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return moduleExport;
        });
    } 
    else if (typeof module === 'object' && module.exports) {
        module.exports = moduleExport;
    } 
    else {
        if (xtypejs && xtypejs.ext && typeof xtypejs.ext.registerExtension === 'function') {
            xtypejs.ext.registerExtension(moduleExport);
            return;
        }
        moduleExport.noConflict = (function(previouslyDefinedValue) {
            return function() {
                root[LIB_NAME] = previouslyDefinedValue;
                delete moduleExport.noConflict;
                return moduleExport;
            };
        })(root[LIB_NAME]);
        
        root[LIB_NAME] = moduleExport;
    }
    
})(this, (typeof xtype !== 'undefined' ? xtype : undefined));