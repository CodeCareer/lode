/**
 * 应用主要模块定义与依赖注入
 * @author  luxueyan
 */
;
(function() {
    angular.module('kt.lode', [
        'ui.router',
        'ui.bootstrap',
        'ngResource',
        'ngSanitize',
        'ngMessages',
        'ngAnimate',
        'cgNotify',
        'apiMock',
        'angulartics',
        'angulartics.baidu',
        'angulartics.google.analytics',
        'ipCookie',
        'checklist-model',
        'oc.lazyLoad',
        'angular-cache',
        'ngFileUpload',
        'kt.common',
        // 'kt.lode.i18' //国际化,ugliy? 之后有需要用angular默认的国际化方式
    ])
})();
