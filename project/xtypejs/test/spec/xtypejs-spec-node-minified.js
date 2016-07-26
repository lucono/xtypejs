
(function() {
    var xtypejsTestUtil = require('../../../../shared/test/test-util'),
        xtypejsMinified = require('../../dist/xtype.min'),
        specs = require('./xtypejs-spec');
    
    specs(xtypejsTestUtil, xtypejsMinified);
})();
