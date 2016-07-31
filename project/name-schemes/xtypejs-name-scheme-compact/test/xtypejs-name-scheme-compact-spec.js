(function() {

    'use strict';
    
    function specs(xtypejsTestUtil, xtypejs, xtypejsCompactNameScheme) {
        
        describe('xtypejs-name-scheme-compact', function() {
            
            var xtype;
            
            beforeEach(function() {
                xtype = xtypejs.newInstance(); 
            });
            
            
            it('should register without any scheme validation exceptions', function() {

                expect(function() {
                     xtype.ext.registerNameScheme('compact', xtypejsCompactNameScheme);
                }).not.toThrow();

            });
        });
    }
    
    
    if (typeof exports !== 'undefined') {
        /* -- Node environment -- */

        specs(
            require('../../../../shared/test/test-util'), 
            require('../../../xtypejs/dist/xtype'), 
            require('../dist/xtypejs-name-scheme-compact'));
    }
    else if (typeof define === 'function' && define.amd) {
        /* -- RequireJS environment -- */

        define([
                '../../../../shared/test/test-util.js',
                '../../../xtypejs/dist/xtype.js',
                '../dist/xtypejs-name-scheme-compact.js'
            ],
            function(xtypejsTestUtil, xtypejs, xtypejsCompactNameScheme) {
                specs(xtypejsTestUtil, xtypejs, xtypejsCompactNameScheme);
            });
    }
    else {
        /* -- Browser environment -- */

        specs(
            typeof xtypejsTestUtil !== 'undefined' ? xtypejsTestUtil : undefined,
            typeof xtype !== 'undefined' ? xtype : undefined,
            typeof xtypejsCompactNameScheme !== 'undefined' ? xtypejsCompactNameScheme : undefined);
    }
})();

