/* global prettyPrint */
/// <reference path="../../typings/angularjs/angular.d.ts"/>

'use strict';

angular.module('xtypejsSite')
    
    .controller('GetItScreenController', ['$rootScope', '$scope', 'service', function($rootScope, $scope, service) {
        
        $scope.fallbackDownloadUrl = 'https://github.com/lucono/xtypejs/tree/master/dist';
        
        service.getLatestRelease(function(releaseData) {
            $scope.latestVersion = releaseData.tag_name;
            $scope.assets = releaseData.assets;
            $scope.releaseTitle = releaseData.name;
            $scope.releaseDescription = releaseData.body;
        });
        
        service.getCodeContent('getit', function(getItContent) {
            $scope.getItContent = getItContent;
        });



        var baseNpmPackageUrl = 'https://www.npmjs.com/package/',

            extensions = [
                {
                    name: 'xtypejs-extension-custom-types',
                    description: 'Provides the \'xtype.ext.registerType\' xtypejs API method which provides the official xtypejs custom types functionality.'
                },
                {
                    name: 'xtypejs-extension-typename-utils',
                    description: 'Provides the xtypejs type name utility API methods which provide a way to enumerate all available types in xtypejs, either by name or by id, or to convert between them.'
                },
                {
                    name: 'xtypejs-extension-autocamel-name-scheme',
                    description: 'Provides a virtual name scheme with name \'auto-camel\', which when is the active name scheme, automatically assigns a camel-cased type name to all types in xtypejs, including all default and custom types.'
                }
            ],

            nameSchemes = [
                {
                    name: 'xtypejs-name-scheme-compact',
                    description: 'Provides a name scheme with very concise type names for the xtypejs built-in types.'
                },
                {
                    name: 'xtypejs-name-scheme-shortened',
                    description: 'Provides a name scheme which uses shortened versions of the default names for the xtypejs built-in types.'
                },
                {
                    name: 'xtypejs-name-scheme-camel',
                    description: 'Provides a camel-cased name scheme for the xtypejs built-in types.'
                },
                {
                    name: 'xtypejs-name-scheme-shortened-camel',
                    description: 'Provides a name scheme which uses shortened camel-cased versions of the default names for the xtypejs built-in types.'
                }
            ];

        extensions.forEach(function(extension) {
            extension.url = (extension.url || baseNpmPackageUrl + extension.name);
        });

        nameSchemes.forEach(function(nameScheme) {
            nameScheme.url = (nameScheme.url || baseNpmPackageUrl + nameScheme.name);
        });
        
        $rootScope.extensions = extensions;
        $rootScope.nameSchemes = nameSchemes;
        
        $rootScope.activeScreen = 'getit';
        $rootScope.screenTitle = 'Get It';
    }]);