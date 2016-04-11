;
(function() {
    'use strict';
    angular.module('kt.lode')
        .provider('ktAccountRoutes', function(ktLazyResolveProvider) {
            var ktLazyResolve = ktLazyResolveProvider.$get()
            this.$get = {}
            this.routes = {
                /**
                 * 账户相关，包括平台内的账户信息、设置以及登录、注册等
                 */
                'analytics.account': {
                    url: '/account',
                    abstract: true,
                    templateUrl: 'views/analytics/account/account.html',
                    resolve: ktLazyResolve(['views/analytics/account/account.js']),
                    controller: 'ktAccountCtrl',
                    data: {
                        pageTitle: '我的账户',
                    }
                },
                /*'analytics.account.project': {
                    url: '/project',
                    templateUrl: 'views/analytics/account/project.html',
                    controller: 'ktProjectCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '机构信息',
                    }
                },*/
                'analytics.account.accountset': {
                    url: '/accountset',
                    templateUrl: 'views/analytics/account/accountset.html',
                    controller: 'ktAccountSetCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '账户设置',
                    }
                },
                'account': {
                    abstract: true,
                    url: '/account?apimock&role&inst_type',
                    templateUrl: 'views/common/empty.html',
                    data: {
                        pageTitle: 'Common',
                        specialClass: 'empty-page bg-light account-page'
                    }
                },
                'account.login': {
                    url: '/login',
                    templateUrl: 'views/login.html',
                    resolve: ktLazyResolve(['views/login.js']),
                    controller: 'ktLoginCtrl',
                    data: {
                        pageTitle: '登录'
                    }
                },
                'account.register': {
                    url: '/register',
                    templateUrl: 'views/register.html',
                    resolve: ktLazyResolve([
                        'views/register.js',
                        'common/directives/kt-captchaimg-directive.js',
                        'common/factories/kt-captcha.js'
                    ]),
                    controller: 'ktRegisterCtrl',
                    data: {
                        pageTitle: '入会'
                    }
                },
                'account.confirm': {
                    url: '/confirm',
                    templateUrl: 'views/confirm.html',
                    resolve: ktLazyResolve(['views/confirm.js']),
                    controller: 'ktConfirmCtrl',
                    params: {
                        institution: {},
                        user: {}
                    },
                    data: {
                        pageTitle: '信息确认'
                    }
                },
            }
        })
})();
