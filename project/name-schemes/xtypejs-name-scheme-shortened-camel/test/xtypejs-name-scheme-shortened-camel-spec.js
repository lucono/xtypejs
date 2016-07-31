(function() {

    'use strict';
    
    function specs(xtypejsTestUtil, xtypejs, xtypejsShortenedCamelNameScheme) {
        
        describe('xtypejs-name-scheme-shortened-camel', function() {
            
            var xtype;
            
            beforeEach(function() {
                xtype = xtypejs.newInstance(); 
            });
            
            
            it('should register without any scheme validation exceptions', function() {

                expect(function() {
                     xtype.ext.registerNameScheme('shortened-camel', xtypejsShortenedCamelNameScheme);
                }).not.toThrow();

            });
        });
    }
    
    
    if (typeof exports !== 'undefined') {
        /* -- Node environment -- */

        specs(
            require('../../../../shared/test/test-util'), 
            require('../../../xtypejs/dist/xtype'), 
            require('../dist/xtypejs-name-scheme-shortened-camel'));
    }
    else if (typeof define === 'function' && define.amd) {
        /* -- RequireJS environment -- */

        define([
                '../../../../shared/test/test-util.js',
                '../../../xtypejs/dist/xtype.js',
                '../dist/xtypejs-name-scheme-shortened-camel.js'
            ],
            function(xtypejsTestUtil, xtypejs, xtypejsShortenedCamelNameScheme) {
                specs(xtypejsTestUtil, xtypejs, xtypejsShortenedCamelNameScheme);
            });
    }
    else {
        /* -- Browser environment -- */

        specs(
            typeof xtypejsTestUtil !== 'undefined' ? xtypejsTestUtil : undefined,
            typeof xtype !== 'undefined' ? xtype : undefined,
            typeof xtypejsShortenedCamelNameScheme !== 'undefined' ? xtypejsShortenedCamelNameScheme : undefined);
    }
})();

