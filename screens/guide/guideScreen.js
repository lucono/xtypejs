/* global prettyPrint */

'use strict';

angular.module('xtypejsSite')

    .controller('GuideScreenController', ['$rootScope', '$scope', 'service', function($rootScope, $scope, service) {

        var DEFAULT_CATEGORY = 'miscellaneous',
        
            categoryTitles = {
                setup_and_basics: 'Setup and Basics',
                type_checking_and_validation: 'Type Checking and Validation',
                user_defined_types: 'User Defined Types',
                name_schemes_and_customization: 'Name Schemes and Customization',
                miscellaneous: 'Miscellaneous'
            },
            
            colGrouping = [
                ['setup_and_basics', 'type_checking_and_validation'],
                ['user_defined_types', 'name_schemes_and_customization', 'miscellaneous']
            ];
        
        service.getCodeContent('guide', function(guideContent) {
            $scope.guideContent = guideContent;
                
            var contentNames = $rootScope.AppUtils.keys(guideContent),
                itemsByCategory = {},
                guideCategories = {};
            
            contentNames.forEach(function(contentName) {
                var contentItem = guideContent[contentName],
                    itemCategory = contentItem.attributes.category || DEFAULT_CATEGORY,
                    categoryItems = itemsByCategory[itemCategory];

                if (!categoryItems) {
                    categoryItems = [];
                    itemsByCategory[itemCategory] = categoryItems;
                }

                categoryItems.push(contentItem);
            });

            $rootScope.AppUtils.keys(itemsByCategory).forEach(function(categoryName) {
                var guideCategory = {
                        name: categoryName,
                        title: categoryTitles[categoryName] || categoryName,
                        items: itemsByCategory[categoryName]
                    };
                
                guideCategories[categoryName] = guideCategory;
            });

            var colGroups = [],
                guideCategoriesList = [];

            colGrouping.forEach(function(colGroup) {
                var colGroupItems = [];

                colGroup.forEach(function(categoryName) {
                    var guideCategory = guideCategories[categoryName];

                    colGroupItems.push(guideCategory);
                    guideCategoriesList.push(guideCategory);
                });

                colGroups.push(colGroupItems);
            });

            $scope.colGroups = colGroups;
            $scope.guideCategoriesList = guideCategoriesList;
        });
        
        $rootScope.activeScreen = 'guide';
        $rootScope.screenTitle = 'Usage Guide';
    }]);