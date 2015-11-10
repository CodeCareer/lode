var commonScripts = [
    "bower_components/jquery/dist/jquery.min.js",
    "bower_components/underscore/underscore-min.js",
    "bower_components/angular/angular.js",
    "bower_components/oclazyload/dist/ocLazyLoad.js",
    "bower_components/angular-cookie/angular-cookie.min.js",
    "bower_components/angular-animate/angular-animate.min.js",
    "bower_components/angular-sanitize/angular-sanitize.min.js",
    // "bower_components/angular-route/angular-route.min.js",
    "bower_components/angular-messages/angular-messages.min.js",
    "bower_components/angular-ui-router/release/angular-ui-router.min.js",
    "bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
    // "bower_components/checklist-model/checklist-model.js",
    "bower_components/angular-resource/angular-resource.js",
    "bower_components/angular-notify/dist/angular-notify.min.js",
    "bower_components/angular-cache/dist/angular-cache.js",
    "bower_components/angulartics/dist/angulartics.min.js",
    "bower_components/angulartics/dist/angulartics-baidu.min.js",
    "bower_components/angulartics-google-analytics/dist/angulartics-google-analytics.min.js",
    // "bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js",
    "bower_components/moment/min/moment.min.js",
    "bower_components/moment/locale/zh-cn.js",
    // "bower_components/jquery-date-range-picker/jquery.daterangepicker.js",
    "bower_components/numeral/min/numeral.min.js",
    "bower_components/numeral/min/languages/chs.min.js",
    // "bower_components/metisMenu/dist/metisMenu.min.js",
    "bower_components/sweetalert/dist/sweetalert.min.js",
    "bower_components/angular-apimock/dist/angular-apimock.min.js",
    // "bower_components/echarts/build/dist/echarts.js",
    "app/common/libs/jquery-date-range-picker.js",
    "app/common/libs/requestAnimationFrame.js",
    "app/common/libs/echarts.js",
];

var appScripts = [
    "app/scripts/init.js",
    "app/scripts/app.js",
    "app/scripts/config.js",
    "app/common/kt-common.js",
    "app/common/locale/angular-locale_zh-cn.js",
    "app/common/factories/kt-resource-assetmap.js",
    // "app/common/factories/kt-captcha.js",
    "app/common/factories/kt-alert.js",
    "app/common/factories/kt-uri.js",
    "app/common/factories/kt-image.js",
    "app/common/filters/kt-filter-common.js",
    // "app/common/directives/kt-safari-image-directive.js",
    "app/common/directives/kt-common-directive.js",

    "app/scripts/directives/common/kt-logout-directive.js",
    "app/scripts/locale/zh-cn/kt-lode-i18.js",
    "app/scripts/resources/kt-resource-home.js",
    "app/scripts/factories/kt-tools-function.js",
    "app/scripts/factories/kt-tools-cache.js",
    "app/scripts/services/kt-service.js",
    "app/scripts/services/kt-service-account.js",
    "app/scripts/services/kt-service-captcha.js",
    "app/scripts/services/kt-service-institutions.js",
    "app/scripts/filters/kt-filter-institutions.js",
    "app/scripts/helpers/kt-date-helps.js",
    "app/scripts/interceptors/kt-interceptor.js",
];

var commonCss = [ // injector 会自动校验文件路径是否存在，所以需要填写基于项目目录的路径，然后再transform里面替换
    ".tmp/styles/bootstrap-custom-lode.css",
    "bower_components/fontawesome/css/font-awesome.css",
    "bower_components/animate.css/animate.css",
    "bower_components/sweetalert/dist/sweetalert.css",
    "bower_components/angular-notify/dist/angular-notify.min.css",
    "bower_components/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css",
    "app/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css",
];

var appCss = [
    "app/common/fonts/lode/css/style.css",
    ".tmp/styles/style.css",
    ".tmp/styles/analytics.css",
];

module.exports = {

    /**
     * 资源关系映射注入
     */
    options: {
        lineEnding: '<%= lineEnding %>', //unix下 使用换行，否则导致usemin执行失败，参考：https://github.com/DaftMonk/generator-angular-fullstack/issues/370
        addRootSlash: false,
    },
    assetsMap: {
        options: {
            starttag: '<!-- injectorAssetMap:js -->',
            transform: function(filepath) {
                return '<script src="' + filepath.replace('dist/', '') + '"></script>'
            }
        },
        files: {
            'dist/index.html': ['dist/scripts/assets-rev.*.js'],
        }
    },

    /**
     * index页面，common css注入
     */
    indexCommoncss: {
        options: {
            starttag: '<!-- injectorCommon:css -->',
            transform: function(filepath) {
                return '<link rel="stylesheet" href="' + filepath.replace(/\.tmp\/|app\//g, '') + '">'
            }
        },
        files: {
            'app/index.html': commonCss,
        }
    },

    /**
     * index页面，common js注入
     */
    indexCommonjs: {
        options: {
            starttag: '<!-- injectorCommon:js -->',
            transform: function(filepath) {
                return '<script src="' + filepath + '"></script>'
            }
        },
        files: {
            'app/index.html': commonScripts,
        }
    },
    
    /**
     * index页面，应用 css注入
     */
    indexAppcss: {
        options: {
            starttag: '<!-- injectorApp:css -->',
            transform: function(filepath) {
                return '<link rel="stylesheet" href="' + filepath.replace(/\.tmp\/|app\//g, '') + '">'
            }
        },
        files: {
            'app/index.html': appCss,
        }
    },

    /**
     * index页面，应用js注入
     */
    indexAppjs: {
        options: {
            starttag: '<!-- injectorApp:js -->',
            transform: function(filepath) {
                return '<script src="' + filepath.replace('app/', '') + '"></script>'
            }
        },
        files: {
            'app/index.html': appScripts,
        }
    },

    /**
     * karam配置文件js注入
     */
    karma: {
        options: {
            starttag: '/*injector:js*/',
            endtag: '/*endinjector*/',
            transform: function(filepath) {
                return '"' + filepath + '",'
            }
        },
        files: {
            'karma.conf.js': commonScripts.concat(appScripts),
        }
    }
};
