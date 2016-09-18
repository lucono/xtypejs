/* global prettyPrint */

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

            var DEFAULT_CATEGORY = 'more_topics',
            
                categoryTitles = {
                    basic_setup: 'Start with Basic Setup',
                    advanced_setup: 'Use More Advanced Setup'
                },
                
                colGrouping = [
                    ['basic_setup'],
                    ['advanced_setup']
                ];
        
            Tonic.createNotebook({
                element: document.getElementById('play_editor_box'),
                source: defaultCodeSnippet,
                onLoad: function(loadedCodeEditor) {
                    $scope.codeEditor = loadedCodeEditor;
                }
            });

            service.getCodeContent('play', function(playContent) {
                
                $scope.playContent = playContent;
                
                var contentNames = $rootScope.AppUtils.keys(playContent),
                    itemsByCategory = {},
                    playCategories = {};
                
                contentNames.forEach(function(contentName) {
                    var contentItem = playContent[contentName],
                        itemCategory = contentItem.attributes.category || DEFAULT_CATEGORY,
                        categoryItems = itemsByCategory[itemCategory];

                    if (!categoryItems) {
                        categoryItems = [];
                        itemsByCategory[itemCategory] = categoryItems;
                    }

                    categoryItems.push(contentItem);
                });

                $rootScope.AppUtils.keys(itemsByCategory).forEach(function(categoryName) {
                    var playCategory = {
                            name: categoryName,
                            title: categoryTitles[categoryName] || categoryName,
                            items: itemsByCategory[categoryName]
                        };
                    
                    playCategories[categoryName] = playCategory;
                });

                var colGroups = [],
                    playCategoriesList = [];

                colGrouping.forEach(function(colGroup) {
                    var colGroupItems = [];

                    colGroup.forEach(function(categoryName) {
                        var playCategory = playCategories[categoryName];

                        if (!playCategory || !playCategory.items || playCategory.items.length === 0) {
                            return;
                        }
                        colGroupItems.push(playCategory);
                        playCategoriesList.push(playCategory);
                    });

                    colGroups.push(colGroupItems);
                });

                $scope.colGroups = colGroups;
                $scope.playCategoriesList = playCategoriesList;
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

            var codeEditorLoadedPromise;

            function checkCodeEditorLoaded(playContent) {
                if (!$scope.codeEditor) {
                    $timeout.cancel(codeEditorLoadedPromise);
                    
                    codeEditorLoadedPromise = $timeout(function() {
                        checkCodeEditorLoaded(playContent);
                    });
                    return;
                }
                loadCodeSnippet($scope.codeEditor, playContent[$stateParams.item]);
            }

            if ($scope.playContent) {
                checkCodeEditorLoaded($scope.playContent);
            } else {
                service.getCodeContent('play', function(playContent) {
                    checkCodeEditorLoaded(playContent);
                });
            }

            $rootScope.navigateToItem(playEditorId, !isSameScreenNavigation);
        }]);
})();
