(function() {
    
    'use strict';
    
    function capitalize(str) {
        return (str ? (str.charAt(0).toUpperCase() + str.slice(1)) : str);
    }
    
    angular.module('xtypejsSite')
    
    .directive('codeSnippet', ['$sce', function($sce) {
        return {
            templateUrl : '/app/components/code-snippet/code-snippet.tpl.html',
            restrict: 'E',
            bindToController : true,
            link: function(scope, elem, attrs) {
                if ('noInfoLabel' in attrs) {
                    scope.noInfoLabel = true;
                    return;
                }
                attrs.$observe('infoLabel', function(value) {
                    scope.infoLabel = (value ? $sce.trustAsHtml(value) : '');
                });
            },
            scope : {
                codeItem: '=codeItem'
            },
            controller: ['$scope', '$element', '$attrs', '$sce', function($scope, $element, $attrs, $sce) {
                var viewList = ($scope.codeItem ? Object.keys($scope.codeItem.codeSamples || {}).sort() : []),
                    viewLabels = {},
                    defaultView = $element.attr('default-view'),
                    element = $element.get(0);
                
                viewList.forEach(function(view) {
                    if (('skip-' + view + '-view') in element.attributes) {
                        viewList.splice(viewList.indexOf(view), 1);
                        return true;
                    }
                    viewLabels[view] = ($element.attr(view + '-view-label') || capitalize(view));
                });
                
                /*
                viewList.forEach(function(view) {
                    viewLabels[view] = ($element.attr(view + '-view-label') || capitalize(view));
                });
                */
                
                $scope.switchView = function(view) {
                    $scope.activeView = (view + '-view');
                };
                $scope.views = viewList;
                $scope.viewLabels = viewLabels;
                $scope.hasCompact = (viewList.indexOf('compact') > -1);
                
                if (defaultView && viewList.indexOf(defaultView) > -1) {
                    $scope.switchView(defaultView);
                }
            }]
        };
    }]);
    
})();