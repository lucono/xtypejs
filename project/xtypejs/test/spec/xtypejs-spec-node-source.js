
(function() {
    var xtypejsTestUtil = require('../../../../shared/test/test-util'),
        xtypejsSource = require('../../dist/xtype'),
        specs = require('./xtypejs-spec');
    
    specs(xtypejsTestUtil, xtypejsSource);
})();
