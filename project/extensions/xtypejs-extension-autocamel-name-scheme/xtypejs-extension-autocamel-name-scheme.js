/** @license | xtypejs-extension-autocamel-name-scheme v{{ LIB_VERSION }} | (c) 2015, Lucas Ononiwu | MIT license, xtype.js.org/license.txt
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

    var LIB_NAME = 'xtypejsAutoCamelNameSchemeExtension',
        LIB_VERSION = '{{ LIB_VERSION }}',
        
        schemeName = 'auto-camel';

    function init(xtype) {
        if (!xtype || !xtype.ext || typeof xtype.ext.registerNameScheme !== 'function') {
            throw new Error('Required "xtype.ext.registerNameScheme" function not found');
        }

        var extensionInterface = this;

        function buildCamelScheme(schemeContainer) {
            var typeDefinitions = extensionInterface.getTypeDefinitions();

            schemeContainer = schemeContainer || Object.create(null);
            
            Object.keys(schemeContainer).forEach(function(typeName) {
                delete schemeContainer[typeName];
            });

            if (typeof typeDefinitions === 'object') {
                Object.keys(typeDefinitions).forEach(function(typeName) {
                    schemeContainer[typeName] = toCapitalizedCamelCase(typeName);
                });
            }
            return schemeContainer;
        }

        // -- Initialize --

        xtype.ext.registerNameScheme(schemeName, buildCamelScheme());

        extensionInterface.setRefreshHandler(function() {
            var currentCamelScheme = extensionInterface.getNameSchemes()[schemeName];

            if (typeof currentCamelScheme !== 'object') {  // Scheme has been user-removed or de-registered
                return;
            }
            
            buildCamelScheme(currentCamelScheme);

            if (extensionInterface.getActiveNameScheme() === currentCamelScheme) {
                extensionInterface.refresh();
            }
        });
    }


    function toCapitalizedCamelCase(str) { 
        return str.toLowerCase().replace(/(^|[^a-z0-9])(.)/g, function(match, segmenterChar, camelChar) {
            return camelChar.toUpperCase();
        });
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