/* global prettyPrint */
/// <reference path="../../typings/angularjs/angular.d.ts"/>

'use strict';

angular.module('xtypejsSite')
    
    .controller('GetItScreenController', ['$rootScope', '$scope', 'service', function($rootScope, $scope, service) {
        
        $scope.fallbackDownloadUrl = 'https://github.com/lucono/xtypejs/tree/master/dist';
        
        service.getLatestRelease(function(releaseData) {
            $scope.latestVersion = releaseData.tag_name;
            $scope.assets = releaseData.assets;
            $scope.releaseTitle = releaseData.name;
            $scope.releaseDescription = releaseData.body;
        });
        
        service.getCodeContent('getit', function(getItContent) {
            $scope.getItContent = getItContent;
        });
        
        $rootScope.activeScreen = 'getit';
        $rootScope.screenTitle = 'Get It';
    }]);