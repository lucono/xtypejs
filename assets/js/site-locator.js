(function() {
	'use strict';
	
    if (!/xtype.js.org|localhost/g.test(window.location.hostname)) {
        window.location.assign('http://xtype.js.org' + window.location.pathname + window.location.hash);
    }
})();