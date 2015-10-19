/**
 * 应用配置
 * @author luxueyan
 */
;
(function() {
    'use strict';

    function configApp($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $compileProvider, $locationProvider, $httpProvider, $resourceProvider, $analyticsProvider, apiMockProvider, ktSProvider) {

        var ktS = ktSProvider.$get() //如果是factory注入到config,需要主动调用$get()来返回factory定义的内容

        // 开发环境开启调试模式，使用ng-inpector调试
        $compileProvider.debugInfoEnabled(true);

        $httpProvider.interceptors.push('ktTokenInterceptor'); //jwt interceptor
        $httpProvider.interceptors.push('ktResInterceptor'); //custom interceptor
        $httpProvider.defaults.cache = false; // ajax cache

        // window.history.pushState = null // 用于mock不支持pushstate的浏览器 
        // window.history.popState = null

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false //set false means no depend on the base tag in html head
        }).hashPrefix('!')

        // $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
        // $analyticsProvider.withAutoBase(true);  /* Records full path */

        $ocLazyLoadProvider.config({
            debug: true,
        })

        $resourceProvider.defaults.actions = {
            create: {
                method: 'POST'
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET'
            },
            query: {
                method: 'GET',
                isArray: true
            },
            remove: {
                method: 'DELETE'
            },
            'delete': {
                method: 'DELETE'
            }
        };

        //mock data 
        apiMockProvider.config({
            mockDataPath: '/mock_data',
            apiPath: '/api',
            // disable: true //关闭api mock
        });

        //default redirect to home index
        $urlRouterProvider.when('', 'analytics/dashboard'); // for hashbang mode
        $urlRouterProvider.when('/', 'analytics/dashboard'); // for html5mode
        $urlRouterProvider.otherwise('/error/404');

        var resolveFactory = function(deps, resolve) {
            angular.forEach(deps, function(v, i) {
                deps[i] = ktS(v)
            })
            var lazyLoad = {
                dependence: function($ocLazyLoad) {
                    return $ocLazyLoad.load(deps)
                }
            }
            return $.extend(lazyLoad, resolve || {})
        }

        $stateProvider

        /**
         *  小微贷统计平台 
         */
            .state('analytics', {
                url: '/analytics?apimock', //父view的设置，通过ui-sref的跳转会将参数带到子view
                abstract: true,
                templateUrl: 'views/common/analytics.html',
                data: {
                    breadcrumb: true,
                    breadcrumbState: 'analytics.dashboard',
                    pageTitle: '首页',
                    permit: ['login'],
                    specialClass: 'fixed-sidebar analytics-page'
                },
                resolve: resolveFactory(['styles/analytics.css', 'scripts/controllers/kt-analytics-ctrl.js']),
                controller: 'ktAnalyticsCtrl'
            })
            // 总体数据
            .state('analytics.dashboard', {
                url: '/dashboard',
                templateUrl: 'views/analytics/dashboard.html',
                resolve: resolveFactory(['scripts/controllers/institutions/kt-dashboard-ctrl.js']),
                controller: 'ktDashboardCtrl',
                data: {
                    pageTitle: '总体数据',
                }
            })
            // 机构列表
            .state('analytics.institutions', {
                abstract: true,
                url: '/institutions',
                template: '<ui-view/>',
                data: {
                    breadcrumb: true,
                    breadcrumbState: 'analytics.institutions.list.table',
                    pageTitle: '机构列表'
                }
            })
            // multi named view不支持局部刷新view， 所以使用nested view 的方式实现刷新局部刷新
            .state('analytics.institutions.list', {
                abstract: true,
                url: '',
                templateUrl: 'views/analytics/institutions/list.html',
                resolve: resolveFactory(['scripts/controllers/institutions/kt-institutions-ctrl.js']),
                controller: 'ktInstitutionsCtrl',
                data: {
                    breadcrumb: false, //重载父view data
                    pageTitle: '机构列表'
                },
            })
            .state('analytics.institutions.list.table', {
                url: '?page&status&per_page',
                templateUrl: 'views/analytics/institutions/list_table.html',
                controller: 'ktInstitutionsTableCtrl',
                data: {
                    breadcrumb: false,
                    pageTitle: '机构列表'
                },
            })
            // 以下是单个机构统计页面
            .state('analytics.institution', { //单个机构的抽象页面
                url: '/institutions/:id',
                abstract: true,
                template: '<ui-view/>',
                data: {
                    pageTitle: '机构详情',
                    specialClass: 'fixed-sidebar analytics-page analytics-detail',
                }
            })
            .state('analytics.institution.dashboard', {
                url: '/dashboard',
                templateUrl: 'views/analytics/institutions/dashboard.html',
                resolve: resolveFactory(['scripts/controllers/institutions/kt-institution-dashboard-ctrl.js']),
                controller: 'ktInstitutionDashboardCtrl',
                data: {
                    pageTitle: '机构总览',
                }
            })
            .state('analytics.institution.assetFeature', { //单个机构的资产特抽象页面
                url: '/asset_feature',
                abstract: true,
                template: '<ui-view/>',
                data: {
                    pageTitle: '资产特征',
                }
            })
            .state('analytics.institution.assetFeature.timelimit', {
                url: '/timelimit',
                templateUrl: 'views/analytics/institutions/detail/asset_feature/time_limit.html',
                resolve: resolveFactory(['scripts/controllers/institutions/asset_feature/kt-timelimit-ctrl.js']),
                controller: 'ktAssetFeatureTimelimitCtrl',
                data: {
                    pageTitle: '资产特征 | 期限',
                }
            })
            .state('analytics.institution.assetFeature.amount', {
                url: '/amount',
                templateUrl: 'views/analytics/institutions/detail/asset_feature/amount.html',
                resolve: resolveFactory(['scripts/controllers/institutions/asset_feature/kt-amount-ctrl.js']),
                controller: 'ktAssetFeatureAmountCtrl',
                data: {
                    pageTitle: '资产特征 | 额度',
                }
            })
            .state('analytics.institution.assetFeature.type', {
                url: '/type',
                templateUrl: 'views/analytics/institutions/detail/asset_feature/type.html',
                resolve: resolveFactory(['scripts/controllers/institutions/asset_feature/kt-type-ctrl.js']),
                controller: 'ktAssetFeatureTypeCtrl',
                data: {
                    pageTitle: '资产特征 | 类型',
                }
            })
            .state('analytics.institution.assetFeature.location', {
                url: '/location',
                templateUrl: 'views/analytics/institutions/detail/asset_feature/location.html',
                resolve: resolveFactory(['scripts/controllers/institutions/asset_feature/kt-location-ctrl.js']),
                controller: 'ktAssetFeatureLocationCtrl',
                data: {
                    pageTitle: '资产特征 | 地理',
                }
            })
            .state('analytics.institution.usersFeature', { //单个机构的用户特抽象页面
                url: '/users_feature',
                abstract: true,
                template: '<ui-view/>',
                data: {
                    pageTitle: '人群特征',
                }
            })
            .state('analytics.institution.usersFeature.gender', {
                url: '/gender',
                templateUrl: 'views/analytics/institutions/detail/users_feature/gender.html',
                resolve: resolveFactory(['scripts/controllers/institutions/users_feature/kt-gender-ctrl.js']),
                controller: 'ktUsersFeatureGenderCtrl',
                data: {
                    pageTitle: '人群特征 | 期限',
                }
            })
            .state('analytics.institution.usersFeature.age', {
                url: '/age',
                templateUrl: 'views/analytics/institutions/detail/users_feature/age.html',
                resolve: resolveFactory(['scripts/controllers/institutions/users_feature/kt-age-ctrl.js']),
                controller: 'ktUsersFeatureAgeCtrl',
                data: {
                    pageTitle: '人群特征 | 额度',
                }
            })
            .state('analytics.institution.usersFeature.income', {
                url: '/income',
                templateUrl: 'views/analytics/institutions/detail/users_feature/income.html',
                resolve: resolveFactory(['scripts/controllers/institutions/users_feature/kt-income-ctrl.js']),
                controller: 'ktUsersFeatureIncomeCtrl',
                data: {
                    pageTitle: '人群特征 | 类型',
                }
            })
            .state('analytics.institution.overdueAnalytics', { //单个机构的用户特抽象页面
                url: '/overdue_analytics',
                abstract: true,
                template: '<ui-view/>',
                data: {
                    pageTitle: '预期分析',
                }
            })
            .state('analytics.institution.overdueAnalytics.overdueRate', {
                url: '/overdue_rate',
                templateUrl: 'views/analytics/institutions/detail/overdue_analytics/overdue_rate.html',
                resolve: resolveFactory(['scripts/controllers/institutions/overdue_analytics/kt-overdue-rate-ctrl.js']),
                controller: 'ktOverdueAnalyticsOverdueRateCtrl',
                data: {
                    pageTitle: '预期分析 | 期限',
                }
            })
            .state('analytics.institution.overdueAnalytics.migrateRate', {
                url: '/migrate_rate',
                templateUrl: 'views/analytics/institutions/detail/overdue_analytics/migrate_rate.html',
                resolve: resolveFactory(['scripts/controllers/institutions/overdue_analytics/kt-migrate-rate-ctrl.js']),
                controller: 'ktOverdueAnalyticsMigrateRateCtrl',
                data: {
                    pageTitle: '预期分析 | 额度',
                }
            })
            .state('analytics.institution.institutionInfo', { //单个机构的用户特抽象页面
                url: '/institution_info',
                abstract: true,
                template: '<ui-view/>',
                data: {
                    pageTitle: '机构信息',
                }
            })
            .state('analytics.institution.institutionInfo.info', {
                url: '/info',
                templateUrl: 'views/analytics/institutions/detail/institution_info/info.html',
                resolve: resolveFactory(['scripts/controllers/institutions/institution_info/kt-info-ctrl.js']),
                controller: 'ktInstitutionInfoInfoCtrl',
                data: {
                    pageTitle: '机构信息',
                }
            })
            

        /**
         * 账户相关，包括平台内的账户信息、设置以及登录、注册等
         */
        .state('analytics.account', {
                url: '/account',
                abstract: true,
                templateUrl: 'views/analytics/account/account.html',
                controller: 'ktAccountCtrl',
                resolve: resolveFactory(['scripts/controllers/account/kt-account-ctrl.js']),
                data: {
                    pageTitle: '我的账户',
                }
            })
            /*.state('analytics.account.institution', {
                url: '/institution',
                templateUrl: 'views/analytics/account/institution.html',
                controller: 'ktInstitutionCtrl',
                data: {
                    breadcrumb: false,
                    pageTitle: '机构信息',
                }
            })*/
            .state('analytics.account.accountset', {
                url: '/accountset',
                templateUrl: 'views/analytics/account/accountset.html',
                controller: 'ktAccountSetCtrl',
                data: {
                    breadcrumb: false,
                    pageTitle: '账户设置',
                }
            })
            .state('account', {
                abstract: true,
                url: '/account?apimock',
                templateUrl: 'views/common/empty.html',
                data: {
                    pageTitle: 'Common',
                    specialClass: 'empty-page bg-light account-page'
                }
            })
            .state('account.login', {
                url: '/login',
                templateUrl: 'views/login.html',
                resolve: resolveFactory(['scripts/controllers/account/kt-login-ctrl.js']),
                controller: 'ktLoginCtrl',
                data: {
                    pageTitle: '登录'
                }
            })
            .state('account.register', {
                url: '/register',
                templateUrl: 'views/register.html',
                resolve: resolveFactory(['scripts/controllers/account/kt-register-ctrl.js']),
                controller: 'ktRegisterCtrl',
                data: {
                    pageTitle: '入会'
                }
            })
            /*.state('account.confirm', {
                url: '/confirm',
                templateUrl: 'views/confirm.html',
                resolve: resolveFactory(['scripts/controllers/account/kt-login-confirm-ctrl.js']),
                controller: 'ktConfirmCtrl',
                params: {
                    institution: {},
                    user: {}
                },
                data: {
                    pageTitle: '信息确认'
                }
            })*/
            /**
             * 错误页面
             */
            .state('error', {
                abstract: true,
                url: '/error',
                templateUrl: 'views/common/empty.html',
                // resolve: resolveFactory(['styles/portal.css']),
                data: {
                    pageTitle: '错误',
                }
            })
            .state('error.404', {
                url: '/404',
                templateUrl: 'views/error/404.html',
                data: {
                    pageTitle: '页面未找到'
                }
            })
            .state('error.500', {
                url: '/500',
                templateUrl: 'views/error/500.html',
                data: {
                    pageTitle: '服务器故障'
                }
            })
    }

    angular
        .module('kt.lode')
        .config(configApp)
        .run(function($rootScope, $state, $location, $timeout, $http, ktHomeResource, uibPaginationConfig, ktSessionUserService, ktS, CacheFactory) {

            // ajax 请求的缓存策略
            $http.defaults.cache = CacheFactory('ajaxCache', {
                maxAge: 30 * 1000, // 30秒缓存
                recycleFreq: 3 * 1000, // 3秒检查一次缓存是否失效
                // cacheFlushInterval: 60 * 60 * 1000, // 每小时清一次缓存
                deleteOnExpire: 'aggressive' // Items will be deleted from this cache when they expire
            });

            // 本地化分页
            $.extend(uibPaginationConfig, {
                boundaryLinks: true,
                directionLinks: true,
                firstText: '首页',
                itemsPerPage: 10,
                lastText: '尾页',
                nextText: '下一页',
                previousText: '上一页',
                rotate: true
            });

            $rootScope.apiCode = Math.random().toString(16).slice(2); // ajax disable catch
            $rootScope.version = '1.0.33'; // html,image version

            $rootScope.ktS = ktS // 资源哈希表

            //常用资源文件
            var resource = ktHomeResource.get($rootScope.version)
            $.extend($rootScope, resource)

            $rootScope.$state = $state;
            $rootScope.back = function() {
                window.history.back()
            }

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                //权限控制，需要登录才能访问的页面逻辑，
                //首页获取user的逻辑不要尝试在这里解决，放到路由的resolve里面解决，否则很容易造成死循环，注意这个坑
                var permit = toState.data.permit
                var search = $location.search()

                // 确保传递apimock
                if (search.apimock && !toParams.apimock) {
                    toParams.apimock = search.apimock
                }

                // 登录限制
                if (!$rootScope.user && permit && $.inArray('login', permit) > -1) {
                    event.preventDefault();
                    ktSessionUserService.get().then(function(user) {
                        $rootScope.user = user
                        if (!user) {
                            $state.go('account.login', toParams)
                        } else {
                            $state.go(toState.name, toParams)
                        }

                    }).catch(function() {
                        $state.go('account.login', toParams)
                    })
                }
            })

            $rootScope.$on('$stateChangeError', function() {
                console.log(arguments[5])
                $state.go('error.404');
            });

            $rootScope.$on('$stateNotFound', function() {
                $state.go('error.404');
            });

            $rootScope.$on('$stateChangeSuccess', function(ev, toState, toParams, fromState, fromParams) {

                window.requestAnimationFrame(function() {
                    // 响应式移动设备上，顶部导航切换页面时候收起hack
                    $('#navbar').removeClass('in').attr('aria-expanded', 'false')

                    // 切换页面成功后回到顶部
                    $('body').scrollTop(0)
                })

                // 存储非错误和登录注册框的url 供redirect或者返回用
                if (toState.name.indexOf('error') === -1 && toState.name.indexOf('account') === -1) {
                    var url = $rootScope.$state.$current.url.format(toParams)
                    $rootScope.currentUrl = url;
                    // $rootScope.latestState = toState.name;
                }

                // 存储状态
                $rootScope.previousState = fromState.name;
                $rootScope.previousStateParams = fromParams;
                $rootScope.currentState = toState.name;
            });

            // ng-include 加载完后显示footer, 避免闪烁
            $rootScope.$on('$includeContentLoaded', function() {
                setTimeout(function() {
                    $('#footer-analytics').css('display', 'block')
                }, 100)
            })
        });
})();
