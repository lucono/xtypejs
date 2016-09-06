/* global prettyPrint */
/// <reference path="../../typings/angularjs/angular.d.ts"/>

(function() {

    'use strict';

    var defaultCodeSnippet = "var xtype = require('xtypejs'); \n\n\n";


    function loadCodeSnippet(codeEditor, codeSnippetItem) {

        if (!codeSnippetItem) {
            codeEditor.setSource(defaultCodeSnippet);
            return;
        }

        var codeSnippet = codeSnippetItem.content,
            codeSnippetCategory = codeSnippetItem.attributes.category,
            codeSnippetTitle = codeSnippetItem.attributes.title;
            
        codeSnippet = 
            '// ' + codeSnippetCategory + ': ' + codeSnippetTitle + '\n\n' +
            codeSnippet.trim() + '\n\n\n' +
            '// Play with this code\n\n';

        codeEditor.setSource(codeSnippet);
    }


    angular.module('xtypejsSite')

        .controller('PlayScreenController', ['$rootScope', '$scope', 'service', function($rootScope, $scope, service) {

            $scope.codeEditor = Tonic.createNotebook({
                element: document.getElementById('play_editor_box'),
                source: defaultCodeSnippet
                //onLoad: loadCodeSnippet
            });

            service.getCodeContent('play', function(playContent) {
                
                $scope.playContent = playContent;
                
                var contentNames = $rootScope.AppUtils.keys(playContent),
                    itemsByCategory = {},
                    itemsByCategoryAndColGroups = {};

                contentNames.forEach(function(contentName) {
                    var contentItem = playContent[contentName],
                        itemCategory = contentItem.attributes.category,
                        categoryItems = itemsByCategory[itemCategory];

                    if (!categoryItems) {
                        categoryItems = [];
                        itemsByCategory[itemCategory] = categoryItems;
                    }

                    categoryItems.push(contentItem);
                });

                $rootScope.AppUtils.keys(itemsByCategory).forEach(function(category) {
                    var categoryItems = itemsByCategory[category],
                        col1Items = [],
                        col2Items = [],
                        midIndex = Math.ceil(categoryItems.length / 2),
                        contentIndex
                    
                    for (contentIndex = 0; contentIndex < categoryItems.length; contentIndex++) {
                        (contentIndex < midIndex ? col1Items : col2Items).push(categoryItems[contentIndex]);
                    }

                    itemsByCategoryAndColGroups[category] = {
                            col1Items: col1Items,
                            col2Items: col2Items
                        };
                });
                
                $scope.contentNames = contentNames;
                $scope.itemsByCategoryAndColGroups = itemsByCategoryAndColGroups;
            });
            
            $rootScope.activeScreen = 'play';
            $rootScope.screenTitle = 'Play';
        }])
        
        .controller(
                'loadPlayCodeSnippet', ['$rootScope', '$scope', 'service', '$state', '$stateParams', '$timeout', 
                function($rootScope, $scope, service, $state, $stateParams, $timeout) {
            
            var playEditorId = 'play_editor',
                isSameScreenNavigation = ($rootScope.previousState && $state.includes($rootScope.previousState.name.split('\.')[0]));

            if ($stateParams.item === 'menu') {
                $rootScope.navigateToItem($stateParams.item, !isSameScreenNavigation);
                return;
            }

            if ($scope.playContent) {
                loadCodeSnippet($scope.codeEditor, $scope.playContent[$stateParams.item]);
            } else {
                service.getCodeContent('play', function(playContent) {
                    loadCodeSnippet($scope.codeEditor, playContent[$stateParams.item]);
                });
            }

            $rootScope.navigateToItem(playEditorId, !isSameScreenNavigation);
        }]);
})();
