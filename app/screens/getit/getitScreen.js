/* global angular prettyPrint */

angular.module('xtypejsSite')
    
    .controller('GetItScreenController', ['$rootScope', '$scope', 'service', function($rootScope, $scope, service) {
        
        'use strict';
        
        $scope.fallbackDownloadUrl = 'https://github.com/lucono/xtypejs/tree/master/project/xtypejs/dist';
        
        service.getLatestRelease(function(releaseData) {
            $scope.latestVersion = releaseData.tag_name;
            $scope.assets = releaseData.assets;
            $scope.releaseTitle = releaseData.name;
            $scope.releaseDescription = releaseData.body;
        });
        
        service.getCodeContent('getit', function(getItContent) {
            $scope.getItContent = getItContent;
        });



        var extensionsBaseUrl = 'https://github.com/lucono/xtypejs/tree/master/project/extensions/',
            nameSchemesBaseUrl = 'https://github.com/lucono/xtypejs/tree/master/project/name-schemes/',

            extensions = [
                {
                    name: 'xtypejs-extension-custom-types',
                    description: 'Provides the \'xtype.ext.registerType\' xtypejs API method which provides the xtypejs custom types functionality.'
                },
                {
                    name: 'xtypejs-extension-introspection',
                    description: 'Provides the xtypejs type name introspection API methods which provide a way to enumerate all available types in xtypejs by name or id, and to convert between them.'
                },
                {
                    name: 'xtypejs-extension-autocamel-name-scheme',
                    description: 'Provides an auto-generating name scheme \'auto-camel\', which assigns camel-cased versions of the default names for all types in xtypejs, including all built-in and custom types.'
                }
            ],

            nameSchemes = [
                {
                    name: 'xtypejs-name-scheme-compact',
                    description: 'Provides a name scheme with very concise type names for the xtypejs built-in types.'
                },
                {
                    name: 'xtypejs-name-scheme-shortened',
                    description: 'Provides a name scheme with shortened versions of the default names for the xtypejs built-in types.'
                },
                {
                    name: 'xtypejs-name-scheme-camel',
                    description: 'Provides a name scheme with camel-cased versions of the default names for the xtypejs built-in types.'
                },
                {
                    name: 'xtypejs-name-scheme-shortened-camel',
                    description: 'Provides a name scheme with shortened camel-cased versions of the default names for the xtypejs built-in types.'
                }
            ];

        extensions.forEach(function(extension) {
            extension.url = (extension.url || extensionsBaseUrl + extension.name);
        });

        nameSchemes.forEach(function(nameScheme) {
            nameScheme.url = (nameScheme.url || nameSchemesBaseUrl + nameScheme.name);
        });
        
        $rootScope.extensions = extensions;
        $rootScope.nameSchemes = nameSchemes;
        
        $rootScope.activeScreen = 'getit';
        $rootScope.screenTitle = 'Get It';
    }]);