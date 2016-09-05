/* global prettyPrint */
/// <reference path="../../typings/angularjs/angular.d.ts"/>

'use strict';

angular.module('xtypejsSite')

    .controller('PlaygroundScreenController', ['$rootScope', '$scope', 'service', function($rootScope, $scope, service) {

        $scope.defaultCodeSnippet = "var xtype = require('xtypejs');";
        $scope.defaultCodeSnippetTitle = 'Code Playground';
        $scope.codeSnippetTitle = $scope.defaultCodeSnippetTitle;
        
        service.getCodeContent('playground', function(playgroundContent) {
            
            $scope.codeEditor = Tonic.createNotebook({
                element: document.getElementById('playground_editor_box'),
                source: $scope.defaultCodeSnippet
            });

            $scope.playgroundContent = playgroundContent;
            
            var contentNames = $rootScope.AppUtils.keys(playgroundContent),
                col1Items = [],
                col2Items = [],
                midIndex = Math.ceil(contentNames.length / 2),
                contentIndex;
                
            for (contentIndex = 0; contentIndex < contentNames.length; contentIndex++) {
                (contentIndex < midIndex ? col1Items : col2Items).push(contentNames[contentIndex]);
            }
            
            $scope.contentNames = contentNames;
            $scope.col1Items = col1Items;
            $scope.col2Items = col2Items;
        });
        
        $rootScope.activeScreen = 'playground';
        $rootScope.screenTitle = 'Playground';
    }])
    
    .controller(
        'loadPlaygroundCodeSnippet', ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 
        function($rootScope, $scope, $state, $stateParams, $timeout) {

        var playgroundEditorId = 'playground_editor',
            isSameScreenNavigation = ($rootScope.previousState && $state.includes($rootScope.previousState.name.split('\.')[0]));
        
        if (isSameScreenNavigation) {
            $rootScope.navigateToItem(playgroundEditorId, !isSameScreenNavigation);
        } else {
            $timeout(function() {
                $rootScope.navigateToItem(playgroundEditorId, !isSameScreenNavigation);
            });
        }

        var codeSnippetId = $stateParams.item,
            codeSnippetItem = $scope.playgroundContent[codeSnippetId],
            codeSnippet = (codeSnippetItem && codeSnippetItem.content ? codeSnippetItem.content : $scope.defaultCodeSnippet),
            codeSnippetTitle = (codeSnippetItem ? codeSnippetItem.attributes.title : $scope.defaultCodeSnippetTitle);
            
            codeSnippet = 
                '// Setup: ' + codeSnippetTitle + '\n' +
                '// ---\n\n' +
                codeSnippet.trim() + '\n\n\n' +
                '// ---\n' +
                '// Ready for code here\n';

        $scope.codeEditor.setSource(codeSnippet);
    }]);