
(function() {
    var xtypejsTestUtil = require('../../build/shared/test/test-util'),
        xtypejsSource = require('../../dist/xtype'),
        specs = require('./xtypejs-spec');
    
    specs(xtypejsTestUtil, xtypejsSource);
})();
