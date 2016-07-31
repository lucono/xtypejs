(function() {

    'use strict';
    
    function specs(xtypejsTestUtil, xtypejs, xtypejsShortenedNameScheme) {
        
        describe('xtypejs-name-scheme-shortened', function() {
            
            var xtype;
            
            beforeEach(function() {
                xtype = xtypejs.newInstance(); 
            });
            
            
            it('should register without any scheme validation exceptions', function() {

                expect(function() {
                     xtype.ext.registerNameScheme('shortened', xtypejsShortenedNameScheme);
                }).not.toThrow();

            });
        });
    }
    
    
    if (typeof exports !== 'undefined') {
        /* -- Node environment -- */

        specs(
            require('../../../../shared/test/test-util'), 
            require('../../../xtypejs/dist/xtype'), 
            require('../dist/xtypejs-name-scheme-shortened'));
    }
    else if (typeof define === 'function' && define.amd) {
        /* -- RequireJS environment -- */

        define([
                '../../../../shared/test/test-util.js',
                '../../../xtypejs/dist/xtype.js',
                '../dist/xtypejs-name-scheme-shortened.js'
            ],
            function(xtypejsTestUtil, xtypejs, xtypejsShortenedNameScheme) {
                specs(xtypejsTestUtil, xtypejs, xtypejsShortenedNameScheme);
            });
    }
    else {
        /* -- Browser environment -- */

        specs(
            typeof xtypejsTestUtil !== 'undefined' ? xtypejsTestUtil : undefined,
            typeof xtype !== 'undefined' ? xtype : undefined,
            typeof xtypejsShortenedNameScheme !== 'undefined' ? xtypejsShortenedNameScheme : undefined);
    }
})();

