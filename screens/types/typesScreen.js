/* global prettyPrint */
/// <reference path="../../typings/angularjs/angular.d.ts"/>

'use strict';

angular.module('xtypejsSite')

    .controller('TypesScreenController', ['$rootScope', '$scope', 'service', function($rootScope, $scope, service) {
        $scope.activeViews = {};
        
        $scope.switchCodeView = function(typeName, view) {
            $scope.activeViews[typeName] = view;
        };
        
        service.getCodeContent('types', function(codeContent) {
            $scope.codeContent = codeContent;
        });
        
        service.getTypeData(function(typeData) {
            $scope.colGroups = [
                [typeData.typesByCategory.basicTypes, typeData.typesByCategory.objectTypes],
                [typeData.typesByCategory.stringTypes, typeData.typesByCategory.arrayTypes],
                [typeData.typesByCategory.numberTypes],
                [typeData.typesByCategory.booleanTypes, typeData.typesByCategory.groupTypes, typeData.typesByCategory.moreTypes]
            ];
            
            $scope.typeGroups = [
                typeData.typesByCategory.basicTypes, typeData.typesByCategory.objectTypes,
                typeData.typesByCategory.stringTypes, typeData.typesByCategory.arrayTypes, typeData.typesByCategory.numberTypes,
                typeData.typesByCategory.booleanTypes, typeData.typesByCategory.groupTypes, typeData.typesByCategory.moreTypes
            ];
        });
        
        $rootScope.activeScreen = 'types';
        $rootScope.screenTitle = 'Types';
    }]);