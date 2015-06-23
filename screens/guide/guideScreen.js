/* global prettyPrint */
/// <reference path="../../typings/angularjs/angular.d.ts"/>

'use strict';

angular.module('xtypejsSite')

    .controller('GuideScreenController', ['$rootScope', '$scope', 'service', function($rootScope, $scope, service) {
        $scope.activeViews = {};
        
        $scope.switchCodeView = function(contentName, view) {
            $scope.activeViews[contentName] = view;
        };
        
        service.getCodeContent('guide', function(guideContent) {
            $scope.guideContent = guideContent;
            
            var contentNames = $rootScope.AppUtils.keys(guideContent),
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
        
        $rootScope.activeScreen = 'guide';
        $rootScope.screenTitle = 'Usage Guide';
    }]);