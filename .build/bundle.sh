
rm ../bundles/*
find ../assets ../vendor ../screens -name "*.js" -o -name "*.css" -o -name "*.html" | xargs dos2unix


./compressjs.sh \
    ../vendor/js/modernizr.custom.min.js \
    ../vendor/js/angular-ui-router.js \
    ../vendor/js/typed.js \
    ../vendor/js/jquery.smooth-scroll.js \
    ../vendor/js/prettify.js \
    ../assets/js/xtype.js \
    ../assets/js/default.js \
    ../screens/overview/overviewScreen.js \
    ../screens/types/typesScreen.js \
    ../screens/api/apiScreen.js \
    ../screens/guide/guideScreen.js \
    ../screens/getit/getitScreen.js \
    ../bundles/app-bundle.min.js


cat ../assets/css/xtype.css \
    ../vendor/css/prettify-theme.css \
    ../vendor/css/typed.css \
    > ../bundles/app-bundle.min.css


cat ../screens/overview/overviewScreen.html \
    ../screens/overview/overviewCodeSamples.html \
    ../screens/types/typesScreen.html \
    ../screens/types/typeCodeSamples.html \
    ../screens/api/apiScreen.html \
    ../screens/api/apiCodeSamples.html \
    ../screens/guide/guideScreen.html \
    ../screens/guide/guideCodeSamples.html \
    ../screens/getit/getitScreen.html \
    ../screens/getit/getitOptions.html \
    > ../bundles/app-bundle.screens.html
