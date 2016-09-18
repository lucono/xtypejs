#!/bin/bash

rm ../bundles/*
find ../app ../lib ../vendor -name "*.js" -o -name "*.css" -o -name "*.html" | xargs dos2unix


./compressjs.sh \
    ../vendor/js/modernizr.custom.min.js \
    ../vendor/js/angular-ui-router.js \
    ../vendor/js/typed.js \
    ../vendor/js/jquery.smooth-scroll.js \
    ../vendor/js/prettify.js \
    ../lib/xtype.js \
    ../lib/xtypejs-extension-typename-utils.js\
    ../lib/xtypejs-name-scheme-compact.js\
    ../app/assets/js/default.js \
    ../app/components/code-snippet/code-snippet.js \
    ../app/screens/overview/overviewScreen.js \
    ../app/screens/types/typesScreen.js \
    ../app/screens/api/apiScreen.js \
    ../app/screens/guide/guideScreen.js \
    ../app/screens/play/playScreen.js \
    ../app/screens/getit/getitScreen.js \
    ../bundles/app-bundle.min.js


cat \
    ../app/assets/css/xtype.css \
    ../app/components/code-snippet/code-snippet.css \
    ../vendor/css/prettify-theme.css \
    ../vendor/css/typed.css \
    > ../bundles/app-bundle.min.css


cat \
    ../app/screens/overview/overviewScreen.html \
    ../app/screens/overview/overviewCodeSamples.html \
    ../app/screens/types/typesScreen.html \
    ../app/screens/types/typeCodeSamples.html \
    ../app/screens/api/apiScreen.html \
    ../app/screens/api/apiCodeSamples.html \
    ../app/screens/guide/guideScreen.html \
    ../app/screens/guide/guideCodeSamples.html \
    ../app/screens/play/playScreen.html \
    ../app/screens/play/playCodeSamples.html \
    ../app/screens/getit/getitScreen.html \
    ../app/screens/getit/getitOptions.html \
    ../app/components/code-snippet/code-snippet.tpl.html \
    > ../bundles/app-bundle.screens.html
