/* global prettyPrint */
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/jquery/jquery.d.ts"/>
/* global xtype */


(function(window, global) {
    
    'use strict';
    
    /**
     * =================
     * UTILITY FUNCTIONS
     * =================
     */
     
    function getTypeComposition(typeName) {
        var composition = [],
            typeId = xtype.nameToId(typeName);
        
        xtype.typeNames().forEach(function(candidateType) {
            if (candidateType !== typeName && !isCompositeType(candidateType) && (typeId & xtype.nameToId(candidateType)) > 0) {                        
                composition.push(candidateType);
            }
        });
        return composition;
    }

    function isCompositeType(typeName) {
        var typeId = xtype.nameToId(typeName),
            memberTypeCount;
            
        for (memberTypeCount = 0; typeId != 0; memberTypeCount++) {
            typeId &= (typeId - 1);
        }
        return (memberTypeCount > 1);
    }
    
    function getCompactTypeNames() {        
        var typeIds = xtype.typeIds(),
            compactTypeNames = {},
            compactNameMapping = {};
        
        xtype.setOptions({nameScheme:'compact'});
        
        typeIds.forEach(function (typeId) {
            compactTypeNames[typeId] = xtype.idToName(typeId);
        });
        
        xtype.setOptions({nameScheme:'default'});
        
        typeIds.forEach(function (typeId) {
            compactNameMapping[xtype.idToName(typeId)] = compactTypeNames[typeId];
        });
        return compactNameMapping;
    }

    function getTypeMethodName(typeName) { 
        var capitalizedTypeName = typeName.toLowerCase().replace(/(^|_)(.)/g, function(match, camelPrefix, camelChar) {
            return camelChar.toUpperCase();
        });
        return 'is' + capitalizedTypeName;
    }
    
    function filterViewSpecificComments(code, view) {
        var altView = (view === 'default' ? 'compact' : 'default'),
            filteredCode = code
                .replace(new RegExp('/\\*[ ]*@' + altView + ':?(.|[\r\n])*?\\*/[ ]*([\r\n]*|$)', 'g'), '')
                .replace(new RegExp('//[ ]*@' + altView + ':?[ ]*.*?(//[ ]*@' + view + ':?|[\n\r]|$)', 'g'), '$1')
                .replace(new RegExp('/\\*[ ]*@' + view + ':?[ ]*', 'g'), '/* ')
                .replace(new RegExp('//[ ]*@' + view + ':?[ ]*', 'g'), '// ');
                
        return filteredCode;
    }
    
    function filterView(code, typeData, view) {
        var typesByName = typeData.typesByName,
            filteredCode = code; // filterViewSpecificComments(code, view);
        
        Object.keys(typesByName).forEach(function(typeName) {
            var sourceName = '\{' + typeName + '\}',
                filteredName = (view === 'compact' ? typesByName[typeName].compactName : typeName),
                lengthFix = new Array((sourceName.length - filteredName.length) + 1).join(' ');
                
            filteredCode = filteredCode
                    // Fix length for updates left of equal sign
                    .replace(new RegExp('^(.*?' + sourceName + '.*?)(=.*?([\n\r]|$)?)', 'gm'), '$1' + lengthFix + '$2')
                    .replace(new RegExp('^(.*?)' + sourceName + '(.*?=.*?([\n\r]|$)?)', 'gm'), '$1' + filteredName + '$2')
                    
                    // Fix length for updates left of end of line comments
                    .replace(new RegExp('^(.*?' + sourceName + '.*?)((//|/\\*).*?([\n\r]|$)?)', 'gm'), '$1' + lengthFix + '$2')
                    .replace(new RegExp(sourceName, 'g'), filteredName);
        });
        
        // Filter manual {@ type} tokens
        filteredCode = filteredCode.replace(/^(.*?)({@type:([^}]+)})([^;]*;[ ]*)((\/\/|\/\*)?.*?([\n\r]|$))/gm,
            function(match, preType, sourceNameCurly, sourceName, preComment, commentToEnd) {
                var filteredName = sourceName.split(':')[view === 'default' ? 0 : 1],
                    lengthFix = new Array(Math.max((sourceNameCurly.length - filteredName.length + 1), 0)).join(' ');
                    
                return (preType + filteredName + preComment + lengthFix + commentToEnd);
            }
        );
        
        // Apply manual //#:digit tokens
        //filteredCode = filteredCode.replace(/^(.*?)([ ]*)(\/\/|\/\*[ ]*)(#:([0-9]+)[ ])(.*?([\n\r]|$))/gm,
        filteredCode = filteredCode.replace(/^(.*?)([ ]*)(\/\/|\/\*[ ]*)(#:([0-9]+)(:([0-9]+))?[ ])(.*?([\n\r]|$))/gm,
            function(match, preComment, preCommentSpacing, commentStart, defaultPadDirective, defaultPadAdjustment, compactPadDirective, compactPadAdjustment, directiveToEnd) {
                var paddingAdjustment = (view === 'default' ? defaultPadAdjustment : (compactPadAdjustment ? compactPadAdjustment : defaultPadAdjustment)),
                    paddingReduction = (!isNaN(paddingAdjustment) ? parseInt(paddingAdjustment) : 0),
                    padLength = Math.max(preCommentSpacing.length - paddingReduction, 0),
                    pad = (padLength > 0 ? new Array(padLength).join(' ') : '');
                    
                return (preComment + pad + commentStart + ' ' + directiveToEnd);
            }
        );
        
        return filteredCode;
    }
    
    function toContentMap(contentEnvelope, $sce) {
        var contentMap = {};
        
        $(contentEnvelope).find('content').each(function(index, content) {
            var $content = $(content),
                contentName = $content.attr('name'),
                contentBody = $content.html().replace(/^([ ]*(\n|\r)+)*/g, '').replace(/([ ]*(\n|\r)+)*[ ]*$/g, ''), // trim extra start and end lines
                contentEntry = {},
                contentAttributes = {};
            
            contentEntry.content = contentBody;
            
            $.each(content.attributes, function(index, attr) {
                contentAttributes[attr.name] = $sce.trustAsHtml(attr.value.replace(/\[([^\[\]]+?)\]\(([^ ]+)\)/g, '<a href="$2">$1</a>'));
            });
            contentEntry.attributes = contentAttributes;
            contentMap[contentName] = contentEntry;
        });
        return contentMap;
    }
    
    function getLinkFriendlyForm(str) {
        return $('<span>' + str + '</span>').text().replace(/\./g, '_');
    }
    
    function getURLParam(url, paramName) {
        return decodeURI(url.replace(/^[^?]*(\?[.]*)/g, '$1').replace(
            new RegExp("^(?:.*[&\\?]" + encodeURI(paramName).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }
    
    function getScreenPathFromQueryUrl(url, defaultScreen, defaultItem) {
        var screen = (getURLParam(url, 'doc') || defaultScreen || ''),
            item = (getURLParam(url, 'item') || defaultItem || '');
        return (screen ? ('/' + screen + (item ? ('/' + item) : '')) : '');
    }
        
    function navigateToItem(item) {
        $.smoothScroll({
            scrollTarget: '#' + item
        });
    }
        
    function prettyPrintCode(code, lang, numbered) {
        return (code ? global.prettyPrintOne(code, lang, numbered) : '');
    }

    function sharePopup(url, popupWidth, popupHeight) {
		var popupLeft = (screen.width / 2) - (popupWidth / 2);
		var popupTop = (screen.height/2) - (popupHeight / 2);
		
		var options = 
			'toolbar=no,' +
			' location=no,' +
			' directories=no,' +
			' status=no,' +
			' menubar=no,' +
			' scrollbars=no,' +
			' resizable=no,' +
			' copyhistory=no,' +
			' width=' + popupWidth + ',' +
			' height=' + popupHeight + ',' +
			' top=' + popupTop + ',' +
			' left=' + popupLeft;
		
		return window.open(url, 'Share xtypejs', options);
    }

    var screenArtifacts = {
        types: {
            template: 'screens/types/typesScreen.html',
            code: 'screens/types/typeCodeSamples.html',
            json: 'screens/types/types.json'
        },
        api: {
            template: 'screens/api/apiScreen.html',
            code: 'screens/api/apiCodeSamples.html',
            json: 'screens/api/api.json'
        },
        usage: {
            template: 'screens/usage/usageScreen.html',
            code: 'screens/usage/usageCodeSamples.html'
        },
        getit: {
            template: 'screens/getit/getitScreen.html',
            code: 'screens/getit/getitOptions.html',
            json: 'https://api.github.com/repos/lucono/xtypejs/releases/latest'
        }
    };
    
    
    /**
     * ==============
     * ANGULAR MODULE
     * ==============
     */
    
    angular.module('xtypejsSite', ['ui.router'])
    
    .run(['$rootScope', '$location', '$http', '$templateCache', '$cacheFactory', '$sce', 'service', function($rootScope, $location, $http, $templateCache, $cacheFactory, $sce, service) {
        
        if (Object.keys($location.search()).length > 0) {
            /*
            var screenPath = $urlRouter.href(new UrlMatcher("/:screen/:item"), {
                screen: $location.search().doc,
                item: $location.search().item
            });
            */
            var screenPath = getScreenPathFromQueryUrl($location.absUrl(), '', 'menu');
            $location.path(screenPath).search({}).replace();
        }
        
        var AppUtils = {};
        
        AppUtils.isArray = Array.isArray;
        
        AppUtils.keys = function(obj) {
            if (typeof obj === 'object') {
                return Object.keys(obj);
            } else {
                return [];
            }
        };
        $rootScope.AppUtils = AppUtils;
        $rootScope.previousState = '';
        $rootScope.activeScreen = 'types';
        $rootScope.pageTitle = $sce.trustAsHtml('xtypejs');
        
        $rootScope.setPageTitle = function(title) {
            $rootScope.pageTitle = $sce.trustAsHtml(title);
        };
        
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            $rootScope.previousState = fromState;            
            //$(".screen-loader-pane").show();
        });
        
        /*
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $(".screen-loader-pane").hide();
        });
        */
        
        var httpCache = $cacheFactory('app-cache');
        $http.defaults.cache = httpCache;
        
        $http.get('/screens/screen-bundle.html', {
            cache: true
        }).success(function(templateBundleContent) {
            var $content = $('<div>' + templateBundleContent + '</div>');
            
            AppUtils.keys(screenArtifacts).forEach(function(screenName) {
                var artifacts = screenArtifacts[screenName],
                    $artifact,
                    artifactContent;
                
                ['template', 'code'].forEach(function(artifactType) {
                    var artifactAddress = artifacts[artifactType];
                    
                    if (artifactAddress) {
                        $artifact = $content.find('[' + artifactType + '-artifact=\'' + screenName + '\']');
                        if ($artifact.length === 1) {
                            artifactContent = $('<div>').append($artifact.clone()).html();                            
                            (artifactType === 'template' ? $templateCache : httpCache).put(artifactAddress, artifactContent);
                        } else {
                            $http.get(artifactAddress, {
                                cache: (artifactType === 'template' ? $templateCache : httpCache)
                            });
                        }
                    }
                });
                
                if (artifacts.json) {
                    $http.get(artifacts.json, {cache: true});
                }
            });
        });
    }])
    
    .controller('scrollToItem', ['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
        if ($rootScope.previousState && $state.includes($rootScope.previousState.name.split('\.')[0])) {
            navigateToItem($stateParams.item);
        } else {
            setTimeout(function() {
                navigateToItem($stateParams.item);
            }, 1000);
        }
    }])
    
    .config([
        '$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', '$locationProvider', 
        function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider) {
            
            $urlRouterProvider.otherwise('/types');
            
            $stateProvider
                .state('types', {
                    url: '/types',
                    templateUrl: screenArtifacts.types.template, //'screens/types/typesScreen.html',
                    controller: 'TypesScreenController',
                    deepStateRedirect: true
                })
                .state('types.item', {
                    url: '/{item:[^/]+}',
                    controller: 'scrollToItem',
                    deepStateRedirect: true
                })
                
                .state('api', {
                    url: '/api',
                    templateUrl: screenArtifacts.api.template,
                    controller: 'APIScreenController',
                    deepStateRedirect: true
                })
                .state('api.item', {
                    url: '/{item:[^/]+}',
                    controller: 'scrollToItem',
                    deepStateRedirect: true
                })
                
                .state('usage', {
                    url: '/usage',
                    templateUrl: screenArtifacts.usage.template,
                    controller: 'UsageScreenController',
                    deepStateRedirect: true
                })
                .state('usage.item', {
                    url: '/{item:[^/]+}',
                    controller: 'scrollToItem',
                    deepStateRedirect: true
                })
                
                .state('getit', {
                    url: '/getit',
                    templateUrl: screenArtifacts.getit.template,
                    controller: 'GetItScreenController',
                    deepStateRedirect: true
                })
                .state('getit.item', {
                    url: '/{item:[^/]+}',
                    controller: 'scrollToItem',
                    deepStateRedirect: true
                });
                
                $locationProvider.html5Mode({
                  enabled: true,
                  requireBase: true
                });
        }
    ])
    
    .factory('service', ['$http', '$rootScope', '$sce', function($http, $rootScope, $sce) {
        var service = {},
            serviceCache = {};
        
        service.getLatestRelease = function(callback) {
            //$http.get('https://api.github.com/repos/lucono/xtypejs/tags')
            //$http.get('https://api.github.com/repos/lucono/xtypejs/releases/latest', {
            $http.get(screenArtifacts.getit.json, {
                cache: true
            }).success(function(responseData) {
                if (serviceCache.releaseData) {
                    callback(serviceCache.releaseData);
                    return;
                }
                serviceCache.releaseData = responseData;
                callback(responseData);
            });
        };
        
        service.getTypeData = function(callback) {
            $http.get(screenArtifacts.types.json, {
                cache: true
            }).success(function(typeData) {
                if (serviceCache.typeData) {
                    callback(serviceCache.typeData);
                    return;
                }
                var typesByName = {},
                    compactTypeNames = getCompactTypeNames();
                
                $rootScope.AppUtils.keys(typeData.typesByCategory).forEach(function(typeCategoryName) {
                    typeData.typesByCategory[typeCategoryName].types.forEach(function(type) {
                        type.typeId = (type.typeId ? $sce.trustAsHtml(type.typeId) : type.name.toUpperCase());
                        type.compactName = compactTypeNames[type.name];
                        type.friendlyName = (type.friendlyName ? type.friendlyName : type.name.replace(/_/g, ' '));
                        type.description = $sce.trustAsHtml(type.description);
                        type.composition = (typeof type.composition === 'string' ? $sce.trustAsHtml(type.composition) : getTypeComposition(type.name));
                        
                        if (type.builtInType !== false) {
                            typesByName[type.name] = type;
                        }
                    });
                });
                typeData.typesByName = typesByName;
                serviceCache.typeData = typeData;
                callback(typeData);
            });
        };
        
        service.getTypeCodeContent = function(callback) {
            getCodeContent(screenArtifacts.types.code, callback);
        };
        
        service.getApiCodeContent = function(callback) {
            getCodeContent(screenArtifacts.api.code, callback);
        };
        
        service.getUsageCodeContent = function(callback) {
            getCodeContent(screenArtifacts.usage.code, callback);
        };
        
        service.getGetItContent = function(callback) {
            getCodeContent(screenArtifacts.getit.code, callback);
        };
        
        function getCodeContent(codeUrl, callback) {
            service.getTypeData(function(typeData) {
                $http.get(codeUrl, {
                        cache: true
                    }).success(function(responseData) {
                        if (serviceCache.codeContent && serviceCache.codeContent[codeUrl]) {
                            callback(serviceCache.codeContent[codeUrl]);
                            return;
                        }
                        var contentMap = toContentMap(responseData, $sce),
                            codeSamples = {};
                        
                        $rootScope.AppUtils.keys(contentMap).forEach(function(contentName) {
                            var contentItem = contentMap[contentName];
                            
                            if ('disabled' in contentItem.attributes) {
                                return true;
                            }
                            var content = contentItem.content;
                                
                            if (content.trim().length > 0) {
                                content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                                
                                var defaultCode = filterView(content, typeData, 'default'),
                                    compactCode = filterView(content, typeData, 'compact');
                                
                                var itemCodeSamples = {
                                    default: $sce.trustAsHtml(prettyPrintCode(defaultCode, contentItem.attributes.lang, false))
                                };
                                if (compactCode !== defaultCode) {
                                    compactCode =
                                        '\/\/ Switch to compact name scheme\n' +
                                        'xtype.options.setNameScheme(\'compact\');\n\n' + 
                                        compactCode;
                                        
                                    itemCodeSamples.compact = $sce.trustAsHtml(prettyPrintCode(compactCode, contentItem.attributes.lang, false));
                                }
                                contentItem.codeSamples = itemCodeSamples;
                            }
                            codeSamples[contentName] = contentItem; 
                        });
                        serviceCache.codeContent = (serviceCache.codeContent || {});
                        serviceCache.codeContent[codeUrl] = codeSamples;
                        callback(codeSamples);
                    }
                );
            });
        }
        
        service.getApiData = function(callback) {
            service.getTypeData(function(typeData) {
                $http.get(screenArtifacts.api.json, {
                        cache: true
                    }).success(function(apiData) {
                        if (serviceCache.apiData) {
                            callback(serviceCache.apiData);
                            return;
                        }
                        apiData.methodsByCategory.validationMethods.methods.forEach(function(typeInterfaceMethod) {
                            if (typeof typeInterfaceMethod.interface !== 'string') {
                                return true;
                            }
                            var methodEnumeration = {};
                            
                            $rootScope.AppUtils.keys(typeData.typesByCategory).forEach(function(typeCategoryName) {
                                var methodCategory = {},
                                    categoryMethods = [];
                                    
                                methodCategory.name = typeData.typesByCategory[typeCategoryName].name;
                                methodCategory.methods = categoryMethods;
                                
                                typeData.typesByCategory[typeCategoryName].types.forEach(function(type) {
                                    var methodName = getTypeMethodName(type.name),
                                        methodInterface = (typeInterfaceMethod.interface !== '' ? '.' + typeInterfaceMethod.interface : '');
                                        
                                    categoryMethods.push($sce.trustAsHtml('xtype' + methodInterface + '.' + methodName));
                                });
                                methodEnumeration[methodCategory.name] = methodCategory;
                            });
                            typeInterfaceMethod.methodEnumeration = methodEnumeration;
                        });
                        
                        $rootScope.AppUtils.keys(apiData.methodsByCategory).forEach(function(apiCategoryName) {
                            apiData.methodsByCategory[apiCategoryName].methods.forEach(function(method) {
                                var plainMethodName = getLinkFriendlyForm(method.name);
                                
                                method.plainName = plainMethodName;
                                
                                ['name', 'signature', 'description', 'notes'].forEach(function(prop) {
                                    method[prop] = $sce.trustAsHtml((method[prop] || '').replace(/{(.*?)}/g, '<code>$1</code>'));
                                });
                                if (method.arguments) {
                                    method.arguments.forEach(function(argument) {
                                        argument.name = $sce.trustAsHtml(argument.name.replace(/{(.*?)}/g, '<code>$1</code>'));
                                        
                                        argument.types.forEach(function(argType) {
                                            ['type', 'description'].forEach(function(prop) {
                                                argType[prop] = $sce.trustAsHtml(argType[prop].replace(/{(.*?)}/g, '<code>$1</code>'));
                                            });
                                        });
                                    });
                                }
                                if (method.return) {
                                    method.return.forEach(function(returnType) {
                                        ['type', 'description'].forEach(function(prop) {
                                            returnType[prop] = $sce.trustAsHtml(returnType[prop].replace(/{(.*?)}/g, '<code>$1</code>'));
                                        });
                                    });
                                }
                                if (method.argumentDetails) {
                                    method.argumentDetails.forEach(function(argumentDetail) {
                                        argumentDetail.properties.forEach(function(property) {
                                            property.name = $sce.trustAsHtml(property.name.replace(/{(.*?)}/g, '<code>$1</code>'));
                                            
                                            property.types.forEach(function(propertyType) {
                                                ['type', 'required', 'description'].forEach(function(prop) {
                                                    propertyType[prop] = $sce.trustAsHtml(propertyType[prop].replace(/{(.*?)}/g, '<code>$1</code>'));
                                                });
                                            });
                                        });
                                    });
                                }
                            });
                        });
                        serviceCache.apiData = (serviceCache.apiData || {});
                        serviceCache.apiData = apiData;
                        callback(apiData);
                    }
                );
            });
        };
        
        return service;
    }])
    
    .directive('share', function() {
        return function(scope, element, attrs) {
            if (element.attr('share') === 'email') {
                element.attr('href', 'mailto:?subject=xtypejs%20-%20Efficient%20data-validating%20pseudo%20types%20for%20JavaScript&body=Extend%20JavaScript%20types%20with%20close%20to%2040%20new,%20efficient,%20data-validating%20pseudo%20types.%20http://xtype.js.org');
                return;
            }
            var shareParams;
            
            switch (element.attr('share')) {
                case 'twitter':
                    shareParams = ['https://twitter.com/home?status=Extend%20JavaScript%20types%20with%20close%20to%2040%20new,%20efficient,%20data-validating%20pseudo%20types.%20http://xtype.js.org', 550, 420];
                    break;
                case 'g-plus':
                    shareParams = ['https://plus.google.com/share?url=http://xtype.js.org', 500, 520];
                    break;
                case 'facebook':
                    shareParams = ['https://www.facebook.com/sharer/sharer.php?u=http://xtype.js.org', 580, 420];
                    break;
                case 'linkedin':
                    shareParams = ['https://www.linkedin.com/shareArticle?mini=true&url=http://xtype.js.org&title=Efficient%20data-validating%20pseudo%20types%20for%20JavaScript&summary=Extend%20JavaScript%20types%20with%20close%20to%2040%20new,%20efficient,%20data-validating%20pseudo%20types.%20http://xtype.js.org&source=', 550, 560];
                    break;
            }
            
            element
                .attr('target', '_blank')
                .attr('rel', 'nofollow')
                .on('click', function(event) {
                    sharePopup.apply(this, shareParams);
                    event.preventDefault();
                });
        };
    })
    
    .directive('screenLink', ['$rootScope', '$location', function($rootScope, $location) {
        return function(scope, element, attrs) {
            if (!element.attr('href')) {        // No auto href installation if href value already manually provided
                attrs.$observe('screenLink', function(value) {
                    var target = value.split(':'),
                        screen = (target[0] ? target[0] : ''),
                        item = (target[1] ? target[1] : ''),
                        docParam = (screen || $rootScope.activeScreen),
                        href = (docParam ? ('/?doc=' + docParam + (item ? ('&item=' + item) : '')) : '') || '/';
                    
                    element.attr('href', href);
                });
            }            
            element.on('click', function(event) {
                var href = element.attr('href');                
                if (!href) {
                    return;
                }
                var item = getURLParam(href, 'item'),
                    screenPath = getScreenPathFromQueryUrl(href);
                
                if (screenPath !== $location.path()) {
                    $location.path(screenPath).search('').hash('');
                    $rootScope.$apply();
                } else if (item) {
                    navigateToItem(item);
                }
                event.preventDefault();
            });
        };
    }]);
    
    
    $(document).ready(function() {
        $('#typing-field').typed({
            strings:[
                'efficient^500',
                'flexible^500',
                'robust^500',
                'extensible^500',
                'intuitive^500',
                'no dependencies^500',
                'ready for...^2000',
                'node',
                'CommonJS',
                'requireJS',
                'AMD',
                'script tag^1500',
                'ready for your project!^1500',
                ':)^3000'
            ],
            startDelay: 500,
            typeSpeed: 0,
            cursorChar: '|',
            showCursor: false,
            loop: true
        });
    
        $(window).scroll(function() {
            var $navContainer = $('.right-nav-container');
            
            if (($navContainer.length > 0) && ($(window).scrollTop() >= $navContainer.offset().top)) {
                $(".right-nav").addClass("fixed");
            } else {
                $(".right-nav").removeClass("fixed");
            }
        });
        
    });
})(window, this);