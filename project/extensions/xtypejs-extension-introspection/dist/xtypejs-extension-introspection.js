/** @license | xtypejs-extension-introspection v0.1.1 | (c) 2015, Lucas Ononiwu | MIT license, xtype.js.org/license.txt
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

    var LIB_NAME = 'xtypejsIntrospectionExtension',
        LIB_INTERFACE_NAME = 'introspect',
        LIB_VERSION = '0.1.1',
        
        FRIENDLY_NAME_SUBSTITUTIONS = {
            elem: 'element',
            prop: 'property',
            multi: 'multiple',
            char: 'character',
            nan: 'not a number',
            any: 'any type',
            none: 'no type'
        };

    function init(xtype) {

        var Object = ({}).constructor || Object,
            objCreate = Object.create,
            objKeys = Object.keys,

            typeMappingArray = [],
            aliasMappingArray = [],
            aliasToNameMapping = objCreate(null),
            aliasToFriendlyNameMapping = objCreate(null),

            extensionInterface = this;


        function getFriendlyName(typeName) {
            var nameSegments = typeName.split('_');

            objKeys(FRIENDLY_NAME_SUBSTITUTIONS).forEach(function(item) {
                var itemIndex = nameSegments.indexOf(item);
                if (itemIndex !== -1) {
                    nameSegments[itemIndex] = FRIENDLY_NAME_SUBSTITUTIONS[item];
                }
            });

            return nameSegments.join(' ');
        }

        function buildNameMappings(nameScheme) {
            var typeDefinitions = extensionInterface.getTypeDefinitions(),
                typeMappingArr = [],
                aliasMappingArr = [],
                aliasNameMapping = objCreate(null),
                aliasFriendlyNameMapping = objCreate(null),
                usedAliases = objCreate(null);
            
            objKeys(typeDefinitions).forEach(function(typeName) {
                var typeValue = typeDefinitions[typeName];
                var aliasName = (nameScheme ? nameScheme[typeName] : typeName);
                aliasName = ((typeof aliasName === 'string' && aliasName.length > 0) ? aliasName : typeName);
                
                if (aliasName in usedAliases) {
                    throwError('Type name conflict: "' + aliasName + '" is aliased to "' + 
                            typeName + '" and "' + usedAliases[aliasName] + '"');
                }
                //aliasTypeMapping[aliasName] = typeValue;
                aliasMappingArr.push(aliasName);
                typeMappingArr.push(typeValue);
                aliasNameMapping[aliasName] = typeName;
                aliasFriendlyNameMapping[aliasName] = getFriendlyName(typeName);
                
                usedAliases[aliasName] = typeName;
            });
            typeMappingArray = typeMappingArr;
            aliasMappingArray = aliasMappingArr;
            aliasToNameMapping = aliasNameMapping;
            aliasToFriendlyNameMapping = aliasFriendlyNameMapping;
        }

        function rebuildNameMappings() {
            buildNameMappings(extensionInterface.getActiveNameScheme());
        }

        function isCompositeType(typeId) {
            if (typeof typeId === 'function') {
                return false;
            }
            else if (typeof typeId === 'number')
            var memberTypeCount;
                
            for (memberTypeCount = 0; typeId !== 0; memberTypeCount++) {
                typeId &= (typeId - 1);
            }
            return (memberTypeCount > 1);
        }
        

        /**
         * Returns the associated type Id for the specified type name.
         */
        function typeNameToId(typeName) {
            var typeNameIndex = aliasMappingArray.indexOf(typeName);

            return (typeNameIndex !== -1 ? typeMappingArray[typeNameIndex] : xtype.NONE);
        }
        
        /**
         * Returns the associated name for the specified type Id.
         */
        function typeIdToName(typeId) {
            var typeIdIndex = typeMappingArray.indexOf(typeId);

            if (typeIdIndex === -1) {
                typeIdIndex = typeMappingArray.indexOf(xtype.NONE);
            }

            return aliasMappingArray[typeIdIndex];
        }
        
        /**
         * Returns a list of the names of all types.
         */
        function typeNames() {
            return aliasMappingArray.slice();
        }
        
        /**
         * Returns a list of the type ids of all types.
         */
        function typeIds() {
            return typeMappingArray.slice();
        }

        /**
         * Reurns a list of the component types for the specified type.
         * Applicable only to built-in and custom derived types.
         */
        function typeComposition(type) {
            var typeId = (typeof type === 'string' ? typeNameToId(type) : type),
                composition = [];

            if (typeof typeId === 'function') {    // instance type
                composition.push(typeId);
            }
            else if (typeof typeId === 'number') {
                typeIds().forEach(function(candidateTypeId) {
                    if (!isCompositeType(candidateTypeId) && (typeId & candidateTypeId) > 0) {                        
                        composition.push(typeIdToName(candidateTypeId));
                    }
                });
            }
            return composition;
        }

        /**
         * Returns the default scheme name for the specified type
         */
        function typeDefaultName(type) {
            var typeAlias = (typeof type !== 'string' ? typeIdToName(type) : type);
            
            return (aliasToNameMapping[typeAlias] || aliasToNameMapping[typeIdToName(xtype.NONE)]);
        }

        /**
         * Returns a friendly name for the specified type
         */
        function typeFriendlyName(type) {
            var typeAlias = (typeof type !== 'string' ? typeIdToName(type) : type);
            
            return (aliasToFriendlyNameMapping[typeAlias] || aliasToFriendlyNameMapping[typeIdToName(xtype.NONE)]);
        }


        // -- Initialize --

        rebuildNameMappings();
        extensionInterface.setRefreshHandler(rebuildNameMappings);


        // -- Attach plugin functions --

        var libInterface = xtype[LIB_INTERFACE_NAME] || objCreate(null);
        xtype[LIB_INTERFACE_NAME] = libInterface;

        libInterface.typeNameToId = typeNameToId;
        libInterface.typeIdToName = typeIdToName;
        libInterface.typeNames = typeNames;
        libInterface.typeIds = typeIds;
        libInterface.typeComposition = typeComposition;
        libInterface.typeDefaultName = typeDefaultName;
        libInterface.typeFriendlyName = typeFriendlyName;
    }
    
    
    /*
     * Export module
     */

    var moduleExport = {
            name: LIB_NAME,
            version: (/\s*{{[^}]*}}\s*/g.test(LIB_VERSION) ? 'unspecified' : LIB_VERSION),
            type: 'xtypejs',
            init: init
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