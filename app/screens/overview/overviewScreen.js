/* global prettyPrint */

'use strict';

angular.module('xtypejsSite')

    .controller('OverviewScreenController', ['$rootScope', '$scope', 'service', function($rootScope, $scope, service) {
        
        service.getCodeContent('overview', function(codeContent) {
            $scope.codeContent = {
                before: codeContent['before_code'],
                after: codeContent['after_code'],
                add_your_own: codeContent['add_your_own_code']
            };
        });
        
        $rootScope.activeScreen = 'overview';
        $rootScope.screenTitle = 'Overview';
    }]);