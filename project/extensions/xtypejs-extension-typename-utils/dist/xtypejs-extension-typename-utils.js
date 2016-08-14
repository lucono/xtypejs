/** @license | xtypejs-extension-typename-utils v0.1.0 | (c) 2015, Lucas Ononiwu | MIT license, xtype.js.org/license.txt
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

    var LIB_NAME = 'xtypejsTypeNameUtilsExtension',
        LIB_VERSION = '0.1.0';

    function init(xtype) {

        var Object = ({}).constructor || Object,
            objCreate = Object.create,
            objKeys = Object.keys,
            
            typeToAliasMapping = objCreate(null),
            aliasToTypeMapping = objCreate(null),
            nameToAliasMapping = objCreate(null),

            extensionInterface = this;


        function buildNameMappings(nameScheme) {
            var typeDefinitions = extensionInterface.getTypeDefinitions(),
                typeAliasMapping = objCreate(null),
                aliasTypeMapping = objCreate(null),
                nameAliasMapping = objCreate(null),
                usedAliases = objCreate(null);
            
            objKeys(typeDefinitions).forEach(function(typeName) {
                var typeValue = typeDefinitions[typeName];
                var aliasName = (nameScheme ? nameScheme[typeName] : typeName);
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
        }

        function rebuildNameMappings() {
            buildNameMappings(extensionInterface.getActiveNameScheme());
        }
        

        /**
         * Returns the associated type Id for the specified type name.
         */
        function nameToId(type) {
            var typeId = (typeof type === 'string' ? aliasToTypeMapping[type] : xtype.NONE);
            
            return (typeof type === 'function' ? type
                    : (typeof typeId === 'number') ? typeId   // type name
                    : xtype.NONE);
        }
        
        /**
         * Returns the associated name for the specified type Id.
         */
        function idToName(type) {
            return (typeof type === 'function' ? type
                    : typeof type === 'number' ? (typeToAliasMapping[type] || typeToAliasMapping[xtype.NONE])
                    : typeToAliasMapping[ztype.NONE]);
        }
        
        /**
         * Returns a list of the names of all types.
         */
        function typeNames() {
            return objKeys(aliasToTypeMapping);
        }
        
        /**
         * Returns a list of the type ids of all types.
         */
        function typeIds() {
            var typeIdList = [];
            
            objKeys(aliasToTypeMapping).forEach(function(alias) {
                typeIdList.push(aliasToTypeMapping[alias]);
            });
            return typeIdList;
        }

        // -- Initialize --

        rebuildNameMappings();
        extensionInterface.setRefreshHandler(rebuildNameMappings);


        // -- Attach plugin functions --

        xtype.util = (xtype.util || objCreate(null));

        xtype.util.nameToId = nameToId;
        xtype.util.idToName = idToName;
        xtype.util.typeNames = typeNames;
        xtype.util.typeIds = typeIds;
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