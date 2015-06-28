/* global prettyPrint */
/// <reference path="../../typings/angularjs/angular.d.ts"/>

'use strict';

angular.module('xtypejsSite')
    
    .controller('APIScreenController', ['$rootScope', '$scope', 'service', function($rootScope, $scope, service) {
        
        service.getCodeContent('api', function(codeContent) {
            $scope.codeContent = codeContent;
        });
        
        service.getApiData(function(apiData) {
            var methodsByCategory = apiData.methodsByCategory;
        
            $scope.colGroups = [
                [methodsByCategory.validationMethods],
                [methodsByCategory.typeMethods, methodsByCategory.extensionMethods],
                [methodsByCategory.utilityMethods],
                [methodsByCategory.optionsMethods, methodsByCategory.otherMethods]
            ];
            
            $scope.methodGroups = [
                methodsByCategory.validationMethods, 
                methodsByCategory.typeMethods, 
                methodsByCategory.extensionMethods,
                methodsByCategory.utilityMethods, 
                methodsByCategory.optionsMethods,
                methodsByCategory.otherMethods
            ];
        
            $scope.col1TypeEnumerationGroups = ['Basic', 'String', 'Boolean', 'Object'];
            $scope.col2TypeEnumerationGroups = ['Array', 'Number', 'Group'];
        });
        
        $rootScope.activeScreen = 'api';
        $rootScope.screenTitle = 'API';
    }]);