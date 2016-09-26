;
(function() {
    'use strict';
    angular.module('kt.lode')
        .provider('ktLoanerRoutes', function(ktLazyResolveProvider) {
            var ktLazyResolve = ktLazyResolveProvider.$get()
            this.$get = {}
            this.routes = {
                /**
                 *  微贷平台
                 */
                'analytics': {
                    url: '/analytics?apimock', //父view的设置，通过ui-sref的跳转会将参数带到子view
                    abstract: true,
                    templateUrl: 'views/common/analytics.html',
                    data: {
                        breadcrumb: false,
                        breadcrumbState: 'analytics.home',
                        pageTitle: '微贷平台',
                        permit: ['login'],
                        specialClass: 'fixed-sidebar analytics-page'
                    },
                    resolve: ktLazyResolve(['views/common/analytics.js'], {

                        user: function($q, $rootScope, ktUserService) {
                            'ngInject';
                            // if ($rootScope.user) return true
                            var deferred = $q.defer()
                            ktUserService.get(function(res) {
                                // $rootScope.defaultRoute = 'analytics.reports.dashboard'
                                $rootScope.defaultRoute = 'analytics.projects.list.table'

                                deferred.resolve(res.account)
                            }, function() {
                                deferred.resolve(null)
                            })
                            return deferred.promise
                        }
                    }),
                    controller: 'ktAnalyticsCtrl'
                },
                // 入口跳转
                'analytics.home': {
                    url: '/home',
                    template: '',
                    resolve: {
                        // 需要等待
                        waitUser: function($rootScope, $state, $timeout, user) {
                            'ngInject';
                            if (user) {
                                $timeout(function() {
                                    $state.go($rootScope.defaultRoute, $state.params)
                                }, 100)
                            } else {
                                $state.go('account.login')
                            }
                        }
                    }
                },
                // 总体数据报表
                'analytics.reports': {
                    abstract: true,
                    url: '/reports',
                    template: '<ui-view/>',
                    data: {
                        // breadcrumb: true,
                        // breadcrumbTitle: '数据报表',
                        pageTitle: '数据报表',
                    }
                },
                // 数据报表-总览
                'analytics.reports.dashboard': {
                    url: '/dashboard',
                    templateUrl: 'views/analytics/dashboard.html',
                    resolve: ktLazyResolve(['views/analytics/dashboard.js']),
                    controller: 'ktDashboardCtrl',
                    data: {
                        // breadcrumb: true,
                        breadcrumbTitle: '总览',
                        pageTitle: '数据报表-总览',
                    }
                },
                // 数据报表-资产特征
                'analytics.reports.assetFeature': {
                    url: '/asset_feature',
                    templateUrl: 'views/analytics/asset_feature.html',
                    resolve: ktLazyResolve([
                        'views/analytics/asset_feature.js',
                        'common/directives/kt-echart3-directive.js',
                        'common/directives/kt-linemenu-directive.js'
                    ]),
                    controller: 'ktAssetFeatureCtrl',
                    data: {
                        // breadcrumb: true,
                        breadcrumbTitle: '资产特征',
                        pageTitle: '数据报表-资产特征',
                    }
                },

                // 项目列表---资金方和助贷方共享
                'analytics.projects': {
                    abstract: true,
                    url: '/projects',
                    template: '<ui-view/>',
                    data: {
                        breadcrumb: true,
                        breadcrumbState: 'analytics.projects.list.table',
                        pageTitle: '项目列表'
                    }
                },
                // multi named view不支持局部刷新view， 所以使用nested view 的方式实现刷新局部刷新
                'analytics.projects.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/projects/projects_layout.html',
                    resolve: ktLazyResolve(['views/analytics/projects/projects.js']),
                    controller: 'ktProjectsCtrl',
                    data: {
                        breadcrumb: false, //重载父view data
                        pageTitle: '项目列表'
                    }
                },
                'analytics.projects.list.table': {
                    url: '?page&status&per_page&zhudai_id&account_id',
                    templateUrl: 'views/analytics/projects/projects.html',
                    controller: 'ktProjectsTableCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '项目列表'
                    }
                },
                'analytics.projects.add': {
                    url: '/add',
                    templateUrl: 'views/analytics/projects/detail/settings/project_form.html',
                    resolve: ktLazyResolve(['views/analytics/projects/detail/settings/project_add.js']),
                    controller: 'ktProjectAddCtrl',
                    data: {
                        breadcrumb: true,
                        pageTitle: '添加项目'
                    }
                },
                'analytics.institutions': {
                    abstract: true,
                    url: '/institutions',
                    template: '<ui-view/>',
                    data: {
                        breadcrumb: true,
                        permit: ['login', 'admin'],
                        breadcrumbState: 'analytics.institutions.list.table',
                        pageTitle: '机构列表'
                    }
                },
                'analytics.institutions.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/institutions/institutions_layout.html',
                    resolve: ktLazyResolve(['views/analytics/institutions/institutions.js']),
                    controller: 'ktInstitutionsCtrl',
                    data: {
                        breadcrumb: false, //重载父view data
                        pageTitle: '机构列表'
                    }
                },
                'analytics.institutions.list.table': {
                    url: '?page&status&per_page',
                    templateUrl: 'views/analytics/institutions/institutions.html',
                    controller: 'ktInstitutionsTableCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '机构列表'
                    }
                },

                // 以下是单个项目统计页面-资金方
                'analytics.project': { //单个项目的抽:页面
                    url: '/projects/:projectID',
                    abstract: true,
                    template: '<ui-view/>',
                    controller: function($scope, $stateParams) {
                        'ngInject';
                        $scope.$emit('activeProjectChange', {
                            projectID: $stateParams.projectID
                        })
                    },
                    data: {
                        breadcrumb: true,
                        breadcrumbState: 'analytics.project.dashboard',
                        pageTitle: '项目详情',
                        specialClass: 'fixed-sidebar analytics-page analytics-detail',
                    }
                },
                'analytics.project.dashboard': {
                    url: '/dashboard',
                    templateUrl: 'views/analytics/dashboard.html',
                    resolve: ktLazyResolve(['views/analytics/projects/dashboard.js']),
                    controller: 'ktProjectDashboardCtrl',
                    data: {
                        pageTitle: '数据总览',
                    }
                },
                'analytics.project.debtors': {
                    abstract: true,
                    url: '/debtors',
                    template: '<ui-view/>',
                    data: {
                        pageTitle: '借款人列表',
                        breadcrumbState: 'analytics.project.debtors.list.table'
                    }
                },
                // 借款人列表
                'analytics.project.debtors.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/projects/detail/debtors/debtor_layout.html',
                    resolve: ktLazyResolve([
                        'views/analytics/projects/detail/debtors/debtor.js',
                        'scripts/directives/filters/index.js',
                        'scripts/directives/filters/index.css',
                        'common/directives/datepicker/directive.js',
                        'common/directives/datepicker/theme/v2/style.css'
                    ]),
                    controller: 'ktDebtorCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '借款人列表',
                    }
                },
                'analytics.project.debtors.list.table': {
                    url: '?page&per_page&filter',
                    templateUrl: 'views/analytics/projects/detail/debtors/debtor.html',
                    controller: 'ktDebtorTableCtrl',
                    data: {
                        breadcrumb: false,
                        breadcrumbTitle: '借款人列表',
                        pageTitle: '借款人列表'
                    },
                },
                'analytics.project.debtors.detail': {
                    url: '',
                    abstract: true,
                    templateUrl: 'views/analytics/projects/detail/debtors/detail_layout.html',
                    controller: 'ktDebtorDetailLayoutCtrl',
                    resolve: ktLazyResolve(['views/analytics/projects/detail/debtors/detail.js']),
                    data: {
                        breadcrumb: false,
                        breadcrumbTitle: '借款人详情',
                        pageTitle: '借款人详情'
                    },
                },
                'analytics.project.debtors.detail.view': {
                    url: '/:debtorID?tab',
                    templateUrl: 'views/analytics/projects/detail/debtors/detail.html',
                    controller: 'ktDebtorDetailCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '借款人详情',
                        pageTitle: '借款人详情'
                    },
                },
                /*        'analytics.project.asset': { //单个项目的资产特抽:页面
                            url: '/asset?start_date&end_date',
                            abstract: true,
                            template: '<ui-view/>',
                            resolve: ktLazyResolve([
                                'common/directives/datepicker/directive.js',
                                'common/directives/datepicker/theme/v2/style.css'
                            ]),
                            data: {
                                breadcrumbState: 'analytics.project.asset.feature',
                                pageTitle: '资产分布',
                            }
                        },*/
                'analytics.project.asset': { //单个项目的资产特抽:页面
                    url: '/asset?start_date&end_date',
                    abstract: true,
                    template: '<ui-view/>',
                    resolve: ktLazyResolve([
                        'scripts/directives/filters/index.js',
                        'scripts/directives/filters/index.css',
                        'common/directives/datepicker/directive.js',
                        'common/directives/datepicker/theme/v2/style.css'
                    ]),
                    data: {
                        breadcrumbState: 'analytics.project.asset.users',
                        pageTitle: '资产分布',
                    }
                },
                /*   'analytics.project.asset.feature': {
                       url: '/feature',
                       templateUrl: 'views/analytics/projects/detail/asset/feature.html',
                       resolve: ktLazyResolve([
                           'views/analytics/projects/detail/asset/feature.js',
                           'common/directives/kt-echart3-directive.js',
                           'common/directives/kt-linemenu-directive.js'
                       ]),
                       controller: 'ktAssetFeatureCtrl',
                       data: {
                           breadcrumbTitle: '资产分析',
                           pageTitle: '资产分布-资产分析',
                       }
                   },*/

                'analytics.project.asset.feature': {
                    url: '/feature',
                    abstract: true,
                    templateUrl: 'views/analytics/projects/detail/asset/feature_layout.html',
                    resolve: ktLazyResolve([
                        'views/analytics/projects/detail/asset/feature.js',
                        'common/directives/kt-echart3-directive.js',
                        'common/directives/kt-linemenu-directive.js'
                    ]),
                    controller: 'ktAssetFeatureLayoutCtrl',
                    data: {
                        breadcrumb: false,
                        breadcrumbTitle: '资产分析',
                        pageTitle: '资产分布-资产分析',
                    }
                },
                'analytics.project.asset.feature.AssetFeature': {
                    url: '?filter',
                    templateUrl: 'views/analytics/projects/detail/asset/feature.html',
                    // resolve: ktLazyResolve([
                    //     'views/analytics/projects/detail/risk/asset_risk.js',
                    //     'common/directives/kt-echart3-directive.js'
                    // ]),
                    controller: 'ktAssetFeatureCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '资产分析',
                        pageTitle: '资产分布-资产分析',
                    }
                },
                // 'analytics.project.asset.users': {
                //     url: '/users',
                //     templateUrl: 'views/analytics/projects/detail/asset/users.html',
                //     resolve: ktLazyResolve([
                //         'views/analytics/projects/detail/asset/users.js',
                //         'common/directives/kt-echart3-directive.js',
                //         'common/directives/kt-linemenu-directive.js'
                //     ]),
                //     controller: 'ktUserFeatureCtrl',
                //     data: {
                //         breadcrumbTitle: '人群分析',
                //         pageTitle: '资产分布-人群分析',
                //     }
                // },
                'analytics.project.asset.users': {
                    url: '/users',
                    abstract: true,
                    templateUrl: 'views/analytics/projects/detail/asset/users_layout.html',
                    resolve: ktLazyResolve([
                        'views/analytics/projects/detail/asset/users.js',
                        'common/directives/kt-echart3-directive.js',
                        'common/directives/kt-linemenu-directive.js'
                    ]),
                    controller: 'ktUserFeatureLayoutCtrl',
                    data: {
                        breadcrumb: false,
                        breadcrumbTitle: '人群分析',
                        pageTitle: '资产分布-人群分析',
                    }
                },
                'analytics.project.asset.users.usersFeature': {
                    url: '?filter',
                    templateUrl: 'views/analytics/projects/detail/asset/users.html',
                    // resolve: ktLazyResolve([
                    //     'views/analytics/projects/detail/risk/asset_risk.js',
                    //     'common/directives/kt-echart3-directive.js'
                    // ]),
                    controller: 'ktUserFeatureCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '人群分析',
                        pageTitle: '资产分布-人群分析',
                    }
                },

                'analytics.project.risk': { //单个项目的资产特抽:页面
                    url: '/risk?start_date&end_date',
                    abstract: true,
                    template: '<ui-view/>',
                    resolve: ktLazyResolve([
                        'scripts/directives/filters/index.js',
                        'scripts/directives/filters/index.css',
                        'common/directives/datepicker/directive.js',
                        'common/directives/datepicker/theme/v2/style.css'
                    ]),
                    data: {
                        breadcrumbState: 'analytics.project.risk.overdue.overdueIndex',
                        pageTitle: '风险分析',
                    }
                },
                // 'analytics.project.risk.overdue': {
                //     url: '/overdue',
                //     templateUrl: 'views/analytics/projects/detail/risk/overdue.html',
                //     resolve: ktLazyResolve([
                //         'views/analytics/projects/detail/risk/overdue.js',
                //         'common/directives/kt-echart3-directive.js'
                //     ]),
                //     controller: 'ktOverdueCtrl',
                //     data: {
                //         breadcrumbTitle: '趋势分析',
                //         pageTitle: '风险分析-趋势分析',
                //     }
                // // },
                // 'analytics.project.risk.vintage': {
                //     url: '/vintage?vintage_start_date&vintage_end_date&vintage_index',
                //     templateUrl: 'views/analytics/projects/detail/risk/vintage.html',
                //     resolve: ktLazyResolve([
                //         'views/analytics/projects/detail/risk/vintage.js',
                //         'common/directives/kt-echart3-directive.js'
                //     ]),
                //     controller: 'ktVintageCtrl',
                //     data: {
                //         breadcrumbTitle: 'Vintage',
                //         pageTitle: '风险分析-Vintage',
                //     }
                // },
                'analytics.project.risk.overdue': {
                    url: '/overdue',
                    abstract: true,
                    templateUrl: 'views/analytics/projects/detail/risk/overdue_layout.html',
                    resolve: ktLazyResolve([
                        'views/analytics/projects/detail/risk/overdue.js',
                        'common/directives/kt-echart3-directive.js'
                    ]),
                    controller: 'ktOverdueLayoutCtrl',
                    data: {
                        breadcrumb: false,
                        breadcrumbTitle: '趋势分析',
                        pageTitle: '风险分析-趋势分析',
                    }
                },
                'analytics.project.risk.overdue.overdueIndex': {
                    url: '?filter',
                    templateUrl: 'views/analytics/projects/detail/risk/overdue.html',
                    // resolve: ktLazyResolve([
                    //     'views/analytics/projects/detail/risk/asset_risk.js',
                    //     'common/directives/kt-echart3-directive.js'
                    // ]),
                    controller: 'ktOverdueCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '趋势分析',
                        pageTitle: '风险分析-趋势分析',
                    }
                },
                'analytics.project.risk.vintage': {
                    // url: '/vintage',
                    url: '/vintage',
                    abstract: true,
                    templateUrl: 'views/analytics/projects/detail/risk/vintage_layout.html',
                    resolve: ktLazyResolve([
                        'views/analytics/projects/detail/risk/vintage.js',
                        'common/directives/kt-echart3-directive.js'
                    ]),
                    controller: 'ktVintageLayoutCtrl',
                    data: {
                        breadcrumb: false,
                        breadcrumbTitle: 'Vintage',
                        pageTitle: '风险分析-Vintage',
                    }
                },
                'analytics.project.risk.vintage.vintageIndex': {
                    url: '?filter',
                    templateUrl: 'views/analytics/projects/detail/risk/vintage.html',
                    // resolve: ktLazyResolve([
                    //     'views/analytics/projects/detail/risk/asset_risk.js',
                    //     'common/directives/kt-echart3-directive.js'
                    // ]),
                    controller: 'ktVintageCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: 'Vintage',
                        pageTitle: '风险分析-Vintage',
                    }
                },

                'analytics.project.risk.assetRisk': {
                    url: '/asset_risk',
                    abstract: true,
                    templateUrl: 'views/analytics/projects/detail/risk/asset_risk_layout.html',
                    resolve: ktLazyResolve([
                        'views/analytics/projects/detail/risk/asset_risk.js',
                        'common/directives/kt-echart3-directive.js'
                    ]),
                    controller: 'ktAssetRiskLayoutCtrl',
                    data: {
                        breadcrumb: false,
                        breadcrumbTitle: '多维分析',
                        pageTitle: '风险分析-多维分析',
                    }
                },
                'analytics.project.risk.assetRisk.index': {
                    url: '?filter',
                    templateUrl: 'views/analytics/projects/detail/risk/asset_risk.html',
                    // resolve: ktLazyResolve([
                    //     'views/analytics/projects/detail/risk/asset_risk.js',
                    //     'common/directives/kt-echart3-directive.js'
                    // ]),
                    controller: 'ktAssetRiskCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '多维分析',
                        pageTitle: '风险分析-多维分析',
                    }
                },
                //cash
                'analytics.project.cash': { //单个项目的资产特抽:页面
                    url: '/cash',
                    abstract: true,
                    template: '<ui-view/>',
                    resolve: ktLazyResolve([
                        // 'scripts/directives/filters/index.css',
                        // 'common/directives/datepicker/directive.js',
                        // 'common/directives/datepicker/theme/v2/style.css',

                        'scripts/directives/filters/index.js',
                        'scripts/directives/filters/index.css',
                        'common/directives/datepicker/directive.js',
                        'common/directives/datepicker/theme/v2/style.css'
                    ]),
                    data: {
                        breadcrumbState: 'analytics.project.cash.forecast.index',
                        pageTitle: '现金流测算',
                    }
                },
                'analytics.project.cash.forecast': {
                    url: '/forecast',
                    abstract: true,
                    templateUrl: 'views/analytics/projects/detail/cash_forecast/forecast_layout.html',
                    resolve: ktLazyResolve([
                        'views/analytics/projects/detail/cash_forecast/forecast.js',
                        'common/directives/kt-echart3-directive.js'
                    ]),
                    controller: 'ktCashForecastLayoutCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '现金流测算-现金流预测',
                    }
                },
                'analytics.project.cash.forecast.index': {
                    url: '',
                    templateUrl: 'views/analytics/projects/detail/cash_forecast/forecast.html',
                    controller: 'ktCashForecastCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '现金流预测',
                        pageTitle: '现金流测算-现金流预测'
                    }
                },
                // 'analytics.project.cash.repayments': {
                //     url: '/repayments',
                //     abstract: true,
                //     templateUrl: 'views/analytics/projects/detail/cash_forecast/repayments_layout.html',
                //     resolve: ktLazyResolve([
                //         'views/analytics/projects/detail/cash_forecast/repayments.js',
                //         'common/directives/kt-echart3-directive.js'
                //     ]),
                //     controller: 'ktRepaymentsLayoutCtrl',
                //     data: {
                //         breadcrumb: false,
                //         breadcrumbTitle: '还款分析',
                //         pageTitle: '现金流测算-还款分析',
                //     }
                // },
                // 'analytics.project.cash.repayments.index': {
                //     url: '?filter',
                //     templateUrl: 'views/analytics/projects/detail/cash_forecast/repayments.html',
                //     controller: 'ktRepaymentsCtrl',
                //     data: {
                //         breadcrumb: true,
                //         breadcrumbTitle: '还款分析',
                //         pageTitle: '现金流测算-还款分析'
                //     }
                // },
                'analytics.project.cash.settings': {
                    url: '/settings',
                    templateUrl: 'views/analytics/projects/detail/cash_forecast/settings.html',
                    controller: 'ktCashSettingsCtrl',
                    resolve: ktLazyResolve(['views/analytics/projects/detail/cash_forecast/settings.js']),
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '参数设置',
                        pageTitle: '现金流测算-参数设置'
                    }
                },
                //还款分析
                'analytics.project.repayments': {
                    abstract: true,
                    url: '/repayments',
                    templateUrl: 'views/analytics/projects/detail/analyze/repayments_layout.html',
                    resolve: ktLazyResolve([
                        'scripts/directives/filters/index.js',
                        'scripts/directives/filters/index.css',
                        'views/analytics/projects/detail/analyze/repayments.js',
                        'common/directives/kt-echart3-directive.js'
                    ]),
                    controller: 'ktRepaymentsLayoutCtrl',
                    data: {
                        breadcrumb: false,
                        breadcrumbTitle: '还款分析',
                        pageTitle: '现金流测算－还款分析',
                    }
                },
                'analytics.project.repayments.index': {
                    url: '?filter',
                    templateUrl: 'views/analytics/projects/detail/cash_forecast/repayments.html',
                    controller: 'ktRepaymentsCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '还款分析',
                        pageTitle: '现金流测算-还款分析'
                    }
                },
                // 项目设置
                'analytics.project.settings': { //单个项目的资产特抽:页面
                    url: '/settings',
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        breadcrumbState: 'analytics.project.settings.info',
                        pageTitle: '项目设置',
                    }
                },
                'analytics.project.settings.info': {
                    url: '/info',
                    templateUrl: 'views/analytics/projects/detail/settings/project_info.html',
                    resolve: ktLazyResolve(['views/analytics/projects/detail/settings/project_info.js']),
                    controller: 'ktProjectInfoCtrl',
                    data: {
                        breadcrumbTitle: '基本信息',
                        pageTitle: '项目设置-基本信息',
                    }
                },
                'analytics.project.settings.edit': {
                    url: '/edit',
                    templateUrl: 'views/analytics/projects/detail/settings/project_form.html',
                    resolve: ktLazyResolve(['views/analytics/projects/detail/settings/project_edit.js']),
                    controller: 'ktProjectEditCtrl',
                    data: {
                        breadcrumbTitle: '编辑项目',
                        pageTitle: '项目设置-编辑项目',
                    }
                },
                'analytics.project.settings.add': {
                    url: '/add',
                    templateUrl: 'views/analytics/projects/detail/settings/project_form.html',
                    resolve: ktLazyResolve(['views/analytics/projects/detail/settings/project_add.js']),
                    controller: 'ktProjectAddCtrl',
                    data: {
                        breadcrumbTitle: '添加项目',
                        pageTitle: '项目设置-添加项目',
                    }
                }
            }
        })
})();
