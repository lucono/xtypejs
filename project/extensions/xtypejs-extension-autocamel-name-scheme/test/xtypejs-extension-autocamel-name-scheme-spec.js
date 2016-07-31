(function() {

    'use strict';
    
    function specs(xtypejsTestUtil, xtypejs, xtypejsAutoCamelNameSchemeExtension) {
        
        var 
            // -- Import Test Data --
            CustomInstanceParentType = xtypejsTestUtil.data.CustomInstanceParentType,
            
            // -- Import Test Helper Functions --
            testHelpers = xtypejsTestUtil.helpers,
            toCapitalizedCamelCase = testHelpers.toCapitalizedCamelCase,
            msg = testHelpers.printMsg,
            str = testHelpers.toString;
        
        
        // -- Register xtypejsAutoCamelNameSchemeExtension if not pre-registered (e.g., sometimes in browser) --
        if (xtypejsAutoCamelNameSchemeExtension) {
            xtypejs.ext.registerExtension(xtypejsAutoCamelNameSchemeExtension);
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
            
            
            describe('Registering a custom type', function() {
                // TODO
            });
        });
    }
    
    
    if (typeof exports !== 'undefined') {
        /* -- Node environment -- */

        specs(
            require('../../../../shared/test/test-util'), 
            require('../../../xtypejs/dist/xtype'), 
            require('../dist/xtypejs-extension-autocamel-name-scheme'));
    }
    else if (typeof define === 'function' && define.amd) {
        /* -- RequireJS environment -- */

        define([
                '../../../../shared/test/test-util.js',
                '../../../xtypejs/dist/xtype.js',
                '../dist/xtypejs-extension-autocamel-name-scheme.js'
            ],
            function(xtypejsTestUtil, xtypejs, xtypejsAutoCamelNameSchemeExtension) {
                specs(xtypejsTestUtil, xtypejs, xtypejsAutoCamelNameSchemeExtension);
            });
    }
    else {
        /* -- Browser environment -- */

        specs(
            typeof xtypejsTestUtil !== 'undefined' ? xtypejsTestUtil : undefined,
            typeof xtype !== 'undefined' ? xtype : undefined,
            typeof xtypejsAutoCamelNameSchemeExtension !== 'undefined' ? xtypejsAutoCamelNameSchemeExtension : undefined);
    }
})();

