/* global prettyPrint */
/// <reference path="../../typings/angularjs/angular.d.ts"/>

'use strict';

angular.module('xtypejsSite')

    .controller('UsageScreenController', ['$rootScope', '$scope', 'service', function($rootScope, $scope, service) {
        $scope.activeViews = {};
        
        $scope.switchCodeView = function(contentName, view) {
            $scope.activeViews[contentName] = view;
        };
        
        service.getUsageCodeContent(function(usageContent) {
            $scope.usageContent = usageContent;
            
            var contentNames = $rootScope.AppUtils.keys(usageContent),
                col1Items = [],
                col2Items = [],
                midIndex = Math.ceil(contentNames.length / 2),
                contentIndex;
                
            for (contentIndex = 0; contentIndex < contentNames.length; contentIndex++) {
                (contentIndex < midIndex ? col1Items : col2Items).push(contentNames[contentIndex]);
            }
            
            $scope.col1Items = col1Items;
            $scope.col2Items = col2Items;
        });
        
        $rootScope.activeScreen = 'usage';
        $rootScope.activeScreenTitle = $rootScope.setPageTitle('Usage and Examples');
    }]);