/* global prettyPrint */
/// <reference path="../../typings/angularjs/angular.d.ts"/>

'use strict';

angular.module('xtypejsSite')

    .controller('OverviewScreenController', ['$rootScope', '$scope', 'service', function($rootScope, $scope, service) {
        
        service.getCodeContent('overview', function(codeContent) {
            $scope.codeContent = codeContent;
            $scope.demoCodeSampleList = ['switch_example'];
        });
        
        $rootScope.activeScreen = 'overview';
        $rootScope.screenTitle = 'Overview';
    }]);