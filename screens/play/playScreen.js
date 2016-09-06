/* global prettyPrint */
/// <reference path="../../typings/angularjs/angular.d.ts"/>

'use strict';

angular.module('xtypejsSite')

    .controller('PlayScreenController', ['$rootScope', '$scope', 'service', function($rootScope, $scope, service) {

        $scope.defaultCodeSnippet = "var xtype = require('xtypejs');";
        $scope.defaultCodeSnippetTitle = 'Code Playground';
        $scope.codeSnippetTitle = $scope.defaultCodeSnippetTitle;
        
        service.getCodeContent('play', function(playContent) {
            
            $scope.codeEditor = Tonic.createNotebook({
                element: document.getElementById('play_editor_box'),
                source: $scope.defaultCodeSnippet
            });

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
            //$scope.col1Items = col1Items;
            //$scope.col2Items = col2Items;

            $scope.itemsByCategoryAndColGroups = itemsByCategoryAndColGroups;
        });
        
        $rootScope.activeScreen = 'play';
        $rootScope.screenTitle = 'Play';
    }])
    
    .controller(
            'loadPlayCodeSnippet', ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 
            function($rootScope, $scope, $state, $stateParams, $timeout) {

        var codeEditor = $scope.codeEditor,
            codeSnippetId = $stateParams.item,
            codeSnippetItem = $scope.playContent[codeSnippetId],
            codeSnippet = (codeSnippetItem && codeSnippetItem.content ? codeSnippetItem.content : $scope.defaultCodeSnippet),
            codeSnippetCategory = (codeSnippetItem ? codeSnippetItem.attributes.category + ': ' : ''),
            codeSnippetTitle = (codeSnippetItem ? codeSnippetItem.attributes.title : $scope.defaultCodeSnippetTitle);
            
            codeSnippet = 
                '// ' + codeSnippetCategory + codeSnippetTitle + '\n\n' +
                codeSnippet.trim() + '\n\n\n' +
                '// Play with this code\n\n';

        var playEditorId = 'play_editor',
            isSameScreenNavigation = ($rootScope.previousState && $state.includes($rootScope.previousState.name.split('\.')[0]));
        
        function scrollToEditorAndLoadCodeSnippet() {
            $rootScope.navigateToItem(playEditorId, !isSameScreenNavigation);
            codeEditor.setSource(codeSnippet);
        }

        if (isSameScreenNavigation) {
            scrollToEditorAndLoadCodeSnippet();
        } else {
            $timeout(function() {
                scrollToEditorAndLoadCodeSnippet();
            });
        }
    }]);