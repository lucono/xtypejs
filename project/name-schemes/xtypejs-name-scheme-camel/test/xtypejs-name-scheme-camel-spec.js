(function() {

    'use strict';
    
    function specs(xtypejsTestUtil, xtypejs, xtypejsCamelNameScheme) {
        
        describe('xtypejs-name-scheme-camel', function() {
            
            var xtype;
            
            beforeEach(function() {
                xtype = xtypejs.newInstance(); 
            });
            
            
            it('should register without any scheme validation exceptions', function() {

                expect(function() {
                     xtype.ext.registerNameScheme('camel', xtypejsCamelNameScheme);
                }).not.toThrow();

            });
        });
    }
    
    
    if (typeof exports !== 'undefined') {
        /* -- Node environment -- */

        specs(
            require('../../../../shared/test/test-util'), 
            require('../../../xtypejs/xtype'), 
            require('../dist/xtypejs-name-scheme-camel'));
    }
    else if (typeof define === 'function' && define.amd) {
        /* -- RequireJS environment -- */

        define([
                '../../../../shared/test/test-util.js',
                '../../../xtypejs/xtype.js',
                '../dist/xtypejs-name-scheme-camel.js'
            ],
            function(xtypejsTestUtil, xtypejs, xtypejsCamelNameScheme) {
                specs(xtypejsTestUtil, xtypejs, xtypejsCamelNameScheme);
            });
    }
    else {
        /* -- Browser environment -- */

        specs(
            typeof xtypejsTestUtil !== 'undefined' ? xtypejsTestUtil : undefined,
            typeof xtype !== 'undefined' ? xtype : undefined,
            typeof xtypejsCamelNameScheme !== 'undefined' ? xtypejsCamelNameScheme : undefined);
    }
})();

