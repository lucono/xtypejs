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
        var composition = [];
        
        if (!isCompositeType(typeName)) {
            return composition;
        }
        
        var typeId = xtype.util.nameToId(typeName);
        
        xtype.util.typeNames().forEach(function(candidateType) {
            if (candidateType !== typeName && !isCompositeType(candidateType) && (typeId & xtype.util.nameToId(candidateType)) > 0) {                        
                composition.push(candidateType);
            }
        });
        return composition;
    }

    function isCompositeType(typeName) {
        var typeId = xtype.util.nameToId(typeName),
            memberTypeCount;
            
        for (memberTypeCount = 0; typeId != 0; memberTypeCount++) {
            typeId &= (typeId - 1);
        }
        return (memberTypeCount > 1);
    }
    
    function getCompactTypeNames() {        
        var typeIds = xtype.util.typeIds(),
            compactTypeNames = {},
            compactNameMapping = {};
        
        xtype.options.set({nameScheme:'compact'});
        
        typeIds.forEach(function (typeId) {
            compactTypeNames[typeId] = xtype.util.idToName(typeId);
        });
        
        xtype.options.set({nameScheme:'default'});
        
        typeIds.forEach(function (typeId) {
            compactNameMapping[xtype.util.idToName(typeId)] = compactTypeNames[typeId];
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
            filteredCode = filterViewSpecificComments(code, view);
        
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
        
        // Filter grouped {{type expression}} tokens
        filteredCode = filteredCode.replace(/^(.*?)({{[ ]*([^{}]+?)[ ]*}})([^=;]*)(=+)?([^;]*?;?)([ ]*(\/\/|\/\*)?.*?([\n\r]|$))/gm,
            function(match, preExpr, exprWithCurly, defaultExpression, preEqualSign, equalSign, postEqualToStmtEnd, postStmtToLineEnd, commentStart) {
                var lengthFix;
                
                if (view === 'default') {
                    lengthFix = new Array((exprWithCurly.length - defaultExpression.length) + 1).join(' ');
                    
                    return (preExpr + defaultExpression + preEqualSign + (equalSign ? lengthFix + equalSign : '') + 
                        postEqualToStmtEnd + (!equalSign && commentStart ? lengthFix : '') + postStmtToLineEnd);
                }
                var typeList = defaultExpression.trim().split(/[ ]*[,/]+[ ]*/g),
                    typeCount = typeList.length,
                    typeIndex,
                    typeName;
                    
                for (typeIndex = 0; typeIndex < typeCount; typeIndex++) {
                    typeName = typeList[typeIndex];
                    
                    if (typesByName[typeName]) {
                        typeList[typeIndex] = typesByName[typeName].compactName;
                    }
                }
                var compactExpression = typeList.join(' ').trim();
                
                lengthFix = new Array((exprWithCurly.length - compactExpression.length) + 1).join(' ');
                
                return (preExpr + compactExpression + preEqualSign + (equalSign ? lengthFix + equalSign : '') + 
                    postEqualToStmtEnd + (!equalSign && commentStart ? lengthFix : '') + postStmtToLineEnd);
            }
        );
        
        // Filter manual {@ type} tokens
        filteredCode = filteredCode.replace(/^(.*?)({@type:([^}]+)})([^;]*;[ ]*)((\/\/|\/\*)?.*?([\n\r]|$))/gm,
            function(match, preType, sourceNameCurly, sourceName, preComment, commentToEnd) {
                var filteredName = sourceName.split(':')[view === 'default' ? 0 : 1],
                    lengthFix = new Array(Math.max((sourceNameCurly.length - filteredName.length + 1), 0)).join(' ');
                    
                return (preType + filteredName + preComment + lengthFix + commentToEnd);
            }
        );
        
        filteredCode = filteredCode.replace(/^(.*?)([ ]*)(\/\/|\/\*)([ ]*#:([0-9]+)(:([0-9]+))?[ ])(.*?([\n\r]|$))/gm,
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
                contentAttributes = {},
                htmlAttributes = ['name', 'title', 'description'];
            
            contentEntry.content = contentBody;
            
            $.each(content.attributes, function(index, attr) {
                contentAttributes[attr.name] = (htmlAttributes.indexOf(attr.name) > -1 ? $sce.trustAsHtml(attr.value) : attr.value);
            });
            contentEntry.attributes = contentAttributes;
            contentMap[contentName] = contentEntry;
        });
        return contentMap;
    }
    
    function getLinkFriendlyForm(str) {
        return $('<span>' + str + '</span>').text();
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
        
    function prettyPrintCode(code, lang, numbered) {
        return (code ? global.prettyPrintOne(code, lang, numbered) : '');
    }

    function sharePopup(url, popupWidth, popupHeight) { 
        if (!popupWidth || !popupHeight) {
            window.open(url);
            return;
        }
		       
        var popupTop = (screen.height/2) - (popupHeight / 2);
    	var popupLeft = (screen.width / 2) - (popupWidth / 2);
            
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
    
    var appArtifacts = {
        /* --- Screens --- */
        overview: {
            template: '/screens/overview/overviewScreen.html',
            code: 'screens/overview/overviewCodeSamples.html'
        },
        types: {
            template: '/screens/types/typesScreen.html',
            code: 'screens/types/typeCodeSamples.html',
            json: 'screens/types/types.json'
        },
        api: {
            template: '/screens/api/apiScreen.html',
            code: 'screens/api/apiCodeSamples.html',
            json: 'screens/api/api.json'
        },
        guide: {
            template: '/screens/guide/guideScreen.html',
            code: 'screens/guide/guideCodeSamples.html'
        },
        getit: {
            template: '/screens/getit/getitScreen.html',
            code: 'screens/getit/getitOptions.html',
            json: 'https://api.github.com/repos/lucono/xtypejs/releases/latest'
        },
        /* --- Components --- */
        codeSnippet: {
            template: '/components/code-snippet/code-snippet.tpl.html'
        }
    };
    
    
    /**
     * ==============
     * ANGULAR MODULE
     * ==============
     */
    
    var bundleLoadDeffered = $.Deferred(),
        bundleLoadPromise = bundleLoadDeffered.promise();
            
    function templatePromise(templateUrl) {
        return bundleLoadPromise.then(function(templateCache) {
            return templateCache.get(templateUrl);
        });
    }
        
    angular.module('xtypejsSite', ['ui.router'])
    
    .run([
        '$rootScope', '$location', '$http', '$templateCache', '$cacheFactory', '$sce', 'service', '$q', '$timeout',
        function($rootScope, $location, $http, $templateCache, $cacheFactory, $sce, service, $q, $timeout) {
        
        if (Object.keys($location.search()).length > 0) {
            var screenPath = getScreenPathFromQueryUrl($location.absUrl(), '', 'menu');
            $location.path(screenPath).search({}).replace();
        }
        
        var AppUtils = {};
        $rootScope.AppUtils = AppUtils;
        
        AppUtils.isArray = Array.isArray;
        
        AppUtils.keys = function(obj) {
            if (typeof obj === 'object') {
                return Object.keys(obj);
            } else {
                return [];
            }
        };
        
        AppUtils.capitalize = function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };
        
        $rootScope.libDescription = 'Concise, performant, readable, data and type validation for JavaScript apps, using built-in and user-defined data-validating pseudo types.';
        
        $rootScope.previousState = '';
        $rootScope.activeScreen = '';
        
        $rootScope.screenTitle = 'xtypejs';
        $rootScope.sectionTitle = '';
        
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            $rootScope.previousState = fromState;
        });
        
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            setTimeout(function() {
                $('body').removeClass('page-loading');
            }, 100);
        });
        
        $rootScope.navigateToItem = function(item, defer) {
            if (defer) {
                $timeout(function() {
                    $rootScope.navigateToItem(item);
                    $rootScope.$apply(); // For deferred case, updates page title with scroll target attribute
                });
                return;
            }
            var targetSelector = ('#' + item.replace(/\./g, '\\.')),
                $target = $(targetSelector),
                sectionTitle = $target.attr('section-title');
            
            if ($target.length === 0) {
                return;
            }
            $.smoothScroll({ scrollTarget: $target });
            $rootScope.sectionTitle = (sectionTitle ? sectionTitle : '');
        };
        
        $rootScope.navigateToScreenAddress = function(screenPath) {
            if (!screenPath) {
                return;
            }
            var screenSegments = screenPath.split('/'),
                item = (screenSegments.length > 2 ? screenSegments[2] : ''),
                currentPath = $location.path();
            
            if (screenPath !== currentPath) {
                var isSameScreenNavigation = (screenSegments[1] === currentPath.split('/')[1]);
                
                $location.path(screenPath).search('').hash('');
                
                if (!isSameScreenNavigation) {
                    $('body').addClass('screen-loading');
                    
                    $timeout(function() {
                        $rootScope.$apply();
                        $('body').removeClass('screen-loading');
                    });
                } else {
                    $rootScope.$apply();
                }
            }
            else if (item) {
                $rootScope.navigateToItem(item);
            }
            return false;
        };
        
        var httpCache = $cacheFactory('app-cache');
        $http.defaults.cache = httpCache;
        
        function processScreenBundle(bundleContent) {
            var fetchTrackers = [],
                $content = $('<div>' + bundleContent + '</div>');
            
            AppUtils.keys(appArtifacts).forEach(function(artifactName) {
                var artifacts = appArtifacts[artifactName],
                    $artifact,
                    artifactContent;
                
                ['template', 'code'].forEach(function(artifactType) {
                    var artifactAddress = artifacts[artifactType];
                    
                    if (artifactAddress) {
                        $artifact = $content.find('[' + artifactType + '-artifact=\'' + artifactName + '\']');
                        if ($artifact.length === 1) {
                            artifactContent = $('<div>').append($artifact.clone()).html();                            
                            (artifactType === 'template' ? $templateCache : httpCache).put(artifactAddress, artifactContent);
                        } else {
                            fetchTrackers.push(
                                $http.get(artifactAddress, {
                                    cache: true
                                }).success(function(artifactContent) {
                                    (artifactType === 'template' ? $templateCache : httpCache).put(artifactAddress, artifactContent);
                                }));
                        }
                    }
                });
                
                if (artifacts.json) {
                    fetchTrackers.push($http.get(artifacts.json, {
                        cache: true
                    }).success(function(artifactContent) {
                        httpCache.put(artifacts.json, artifactContent);
                    }));
                }
            });
            
            $q.all(fetchTrackers).then(function() {
                bundleLoadDeffered.resolve($templateCache);
            });
        }
        
        $http.get('/bundles/app-bundle.screens.html', {
            cache: true
        }).success(function(bundleContent) {
            processScreenBundle(bundleContent);
        }).error(function() {
            processScreenBundle('');
        });
    }])
    
    .controller('scrollToItem', ['$rootScope', '$state', '$stateParams', '$timeout', function($rootScope, $state, $stateParams, $timeout) {
        var isSameScreenNavigation = ($rootScope.previousState && $state.includes($rootScope.previousState.name.split('\.')[0]));
        
        if (isSameScreenNavigation) {
            $rootScope.navigateToItem($stateParams.item, !isSameScreenNavigation);
        } else {
            $timeout(function() {
                $rootScope.navigateToItem($stateParams.item, !isSameScreenNavigation);
            });
        }
    }])
    
    .config([
        '$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', '$locationProvider', 
        function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider) {
            
            $urlRouterProvider.otherwise('/overview');
            
            $stateProvider
                .state('overview', {
                    url: '/overview',
                    templateProvider: function() {
                        return templatePromise(appArtifacts.overview.template);
                    },
                    controller: 'OverviewScreenController',
                    deepStateRedirect: true
                })
                .state('overview.item', {
                    url: '/{item:[^/]+}',
                    controller: 'scrollToItem',
                    deepStateRedirect: true
                })
                
                .state('guide', {
                    url: '/guide',
                    templateProvider: function() {
                        return templatePromise(appArtifacts.guide.template);
                    },
                    controller: 'GuideScreenController',
                    deepStateRedirect: true
                })
                .state('guide.item', {
                    url: '/{item:[^/]+}',
                    controller: 'scrollToItem',
                    deepStateRedirect: true
                })
                
                .state('types', {
                    url: '/types',
                    templateProvider: function() {
                        return templatePromise(appArtifacts.types.template);
                    },
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
                    templateProvider: function() {
                        return templatePromise(appArtifacts.api.template);
                    },
                    controller: 'APIScreenController',
                    deepStateRedirect: true
                })
                .state('api.item', {
                    url: '/{item:[^/]+}',
                    controller: 'scrollToItem',
                    deepStateRedirect: true
                })
                
                .state('getit', {
                    url: '/getit',
                    templateProvider: function() {
                        return templatePromise(appArtifacts.getit.template);
                    },
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
            $http.get(appArtifacts.getit.json, {
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
            $http.get(appArtifacts.types.json, {
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
                        type.derivation = (typeof type.derivation === 'string' ? $sce.trustAsHtml(type.derivation) : getTypeComposition(type.name));
                        
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
        
        service.getCodeContent = function(screenName, callback) {
            if (screenName in appArtifacts) {
                getCodeContent(appArtifacts[screenName].code, callback);
            }
        };
        
        function getCodeContent(codeUrl, callback) {
            if (!codeUrl) {
                return;
            }
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
                                
                                var skippedViews = contentItem.attributes['skip-views'],
                                    skippedViewList = (skippedViews ? skippedViews.split(/[ ]+/g) : []),
                                    defaultCode,
                                    compactCode,
                                    itemCodeSamples = {};
                                
                                if (skippedViewList.indexOf('default') < 0) {
                                    defaultCode = filterView(content, typeData, 'default');
                                    itemCodeSamples['default'] = $sce.trustAsHtml(prettyPrintCode(defaultCode, contentItem.attributes.lang, false));
                                }
                                
                                if (skippedViewList.indexOf('compact') < 0) {
                                    compactCode = filterView(content, typeData, 'compact');
                                    
                                    if (!defaultCode || (compactCode !== defaultCode)) {
                                        itemCodeSamples.compact = $sce.trustAsHtml(prettyPrintCode(compactCode, contentItem.attributes.lang, false));
                                    }
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
                $http.get(appArtifacts.api.json, {
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
                                if (method['return']) {
                                    method['return'].forEach(function(returnType) {
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
    
    /**
     * ==========
     * DIRECTIVES
     * ==========
     */
     
    .directive('share', ['$rootScope', function($rootScope) {
        return function(scope, element, attrs) {
            if (element.attr('share') === 'email') {
                element.attr('href',
                    'mailto:?subject=' +
                    encodeURIComponent('Elegant, highly efficient data validation for JavaScript Apps') +
                    '&body=' +
                    encodeURIComponent('Checkout xtypejs - ' + $rootScope.libDescription + ' Find out more at http://xtype.js.org.'));
                return;
            }
            var shareParams;
            
            switch (element.attr('share')) {
                case 'g-plus':
                    shareParams = [
                        'https://plus.google.com/share?url=' + 
                        encodeURIComponent('http://xtype.js.org'), 
                        500, 520];
                    break;
                case 'facebook':
                    shareParams = [
                        'https://www.facebook.com/sharer/sharer.php?u=' + 
                        encodeURIComponent('http://xtype.js.org'), 
                        580, 420];
                    break;
                case 'twitter':
                    shareParams = [
                        'https://twitter.com/home?status=' + 
                        encodeURIComponent('xtypejs - Elegant, highly efficient data validation for JavaScript Apps. http://xtype.js.org'), 
                        550, 420];
                    break;
                case 'linkedin':
                    shareParams = [
                        'https://www.linkedin.com/shareArticle?mini=true&url=http://xtype.js.org&title=' +
                        encodeURIComponent('xtypejs - Elegant, highly efficient data validation for JavaScript Apps'), 
                        550, 560];
                    break;
                case 'reddit':
                    shareParams = ['https://www.reddit.com/r/node/comments/3bqwyf'];
                    break;
            }
            
            element
                .attr('rel', 'nofollow')
                .attr('target', '_blank')
                .attr('href', shareParams[0])
                .on('click', function(event) {
                    sharePopup.apply(this, shareParams);
                    event.preventDefault();
                });
        };
    }])
    
    .directive('screenLink', ['$rootScope', '$state', '$location', '$timeout', function($rootScope, $state, $location, $timeout) {
        return function(scope, element, attrs) {
            if (!element.attr('href')) {        // No auto href installation if href value already manually provided
                attrs.$observe('screenLink', function(value) {
                    var target = value.split(':'),
                        screen = (target[0] ? target[0] : ''),
                        item = (target[1] ? target[1] : ''),
                        docParam = (screen || $rootScope.activeScreen),
                        href = (docParam ? ('/?doc=' + docParam + (item ? ('&item=' + item) : '')) : '') || '/',
                        screenHref = (docParam ? ('/' + docParam + (item ? ('/' + item) : '')) : '') || '/';
                    
                    element.attr('href', href);
                    element.attr('screen-href', screenHref);
                });
            }
            element.on('click', function(event) {
                $rootScope.navigateToScreenAddress(element.attr('screen-href'));
                event.preventDefault();
            });
        };
    }]);
    
    
    $(document).ready(function() {
        
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