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
            apiPath: '/ajax/api',
            // disable: true //关闭api mock
        });

        //默认跳转页面
        $urlRouterProvider.when('', '/analytics/reports/dashboard'); // for hashbang mode
        $urlRouterProvider.when('/', '/analytics/reports/dashboard'); // for html5mode
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
         *  开通小贷平台 
         */
            .state('analytics', {
                url: '/analytics?apimock', //父view的设置，通过ui-sref的跳转会将参数带到子view
                abstract: true,
                templateUrl: 'views/common/analytics.html',
                data: {
                    breadcrumb: true,
                    breadcrumbState: 'analytics.reports.dashboard',
                    pageTitle: '小微贷平台',
                    permit: ['login'],
                    specialClass: 'fixed-sidebar analytics-page'
                },
                resolve: resolveFactory(['scripts/controllers/kt-analytics-ctrl.js']),
                controller: 'ktAnalyticsCtrl'
            })
            // 总体数据报表
            .state('analytics.reports', {
                abstract: true,
                url: '/reports',
                template: '<ui-view/>',
                data: {
                    // breadcrumb: true,
                    // breadcrumbTitle: '数据报表',
                    pageTitle: '数据报表',
                }
            })
            // 数据报表-总览
            .state('analytics.reports.dashboard', {
                url: '/dashboard',
                templateUrl: 'views/analytics/dashboard.html',
                resolve: resolveFactory(['scripts/controllers/projects/kt-dashboard-ctrl.js']),
                controller: 'ktDashboardCtrl',
                data: {
                    // breadcrumb: true,
                    breadcrumbTitle: '总览',
                    pageTitle: '数据报表-总览',
                }
            })
            // 数据报表-资产特征
            .state('analytics.reports.assetFeature', {
                url: '/asset_feature',
                templateUrl: 'views/analytics/asset_feature.html',
                resolve: resolveFactory(['scripts/controllers/projects/kt-asset-feature-ctrl.js']),
                controller: 'ktAssetFeatureCtrl',
                data: {
                    // breadcrumb: true,
                    breadcrumbTitle: '资产特征',
                    pageTitle: '数据报表-资产特征',
                }
            })
            // 项目列表
            .state('analytics.projects', {
                abstract: true,
                url: '/projects',
                template: '<ui-view/>',
                data: {
                    breadcrumb: true,
                    breadcrumbState: 'analytics.projects.list.table',
                    pageTitle: '项目列表'
                }
            })
            // multi named view不支持局部刷新view， 所以使用nested view 的方式实现刷新局部刷新
            .state('analytics.projects.list', {
                abstract: true,
                url: '',
                templateUrl: 'views/analytics/projects/list_layout.html',
                resolve: resolveFactory(['scripts/controllers/projects/kt-projects-ctrl.js']),
                controller: 'ktProjectsCtrl',
                data: {
                    breadcrumb: false, //重载父view data
                    pageTitle: '项目列表'
                }
            })
            .state('analytics.projects.list.table', {
                url: '?page&status&per_page',
                templateUrl: 'views/analytics/projects/list_table.html',
                controller: 'ktProjectsTableCtrl',
                data: {
                    breadcrumb: false,
                    pageTitle: '项目列表'
                }
            })
            .state('analytics.projects.add', {
                url: '/add',
                templateUrl: 'views/analytics/projects/detail/settings/project_form.html',
                resolve: resolveFactory(['scripts/controllers/projects/settings/kt-add-ctrl.js']),
                controller: 'ktProjectAddCtrl',
                data: {
                    breadcrumb: true,
                    pageTitle: '添加项目'
                }
            })
            // 以下是单个项目统计页面
            .state('analytics.project', { //单个项目的抽象页面
                url: '/projects/:projectID',
                abstract: true,
                template: '<ui-view/>',
                // resolve: resolveFactory(['scripts/controllers/projects/kt-project-ctrl.js']), //已放到 kt-analytics.js 替代
                // controller: 'ktPrjectCtrl',
                data: {
                    breadcrumb: true,
                    // breadcrumbTitle: '资产特征',
                    breadcrumbState: 'analytics.project.dashboard',
                    pageTitle: '项目详情',
                    specialClass: 'fixed-sidebar analytics-page analytics-detail',
                }
            })
            .state('analytics.project.dashboard', {
                url: '/dashboard',
                templateUrl: 'views/analytics/projects/dashboard.html',
                resolve: resolveFactory(['scripts/controllers/projects/kt-project-dashboard-ctrl.js']),
                controller: 'ktProjectDashboardCtrl',
                data: {
                    pageTitle: '数据总览',
                }
            })

            .state('analytics.project.debtors', {
                abstract: true,
                url: '/debtors',
                template: '<ui-view/>',
                data: {
                    pageTitle: '借款人审批',
                    breadcrumbState: 'analytics.project.debtors.list.table'
                }
            })
            // 借款人审批
            .state('analytics.project.debtors.list', {
                abstract: true,
                url: '',
                templateUrl: 'views/analytics/projects/detail/debtors/list_layout.html',
                resolve: resolveFactory(['scripts/controllers/projects/debtors/kt-debtors-ctrl.js']),
                controller: 'ktDebtorsCtrl',
                data: {
                    breadcrumb: false,
                    pageTitle: '借款人审批',
                }
            })
            .state('analytics.project.debtors.list.table', {
                url: '?page&per_page',
                templateUrl: 'views/analytics/projects/detail/debtors/list_table.html',
                controller: 'ktDebtorsTableCtrl',
                data: {
                    breadcrumb: true,
                    breadcrumbTitle: '借款人列表',
                    pageTitle: '借款人审批-借款人列表'
                },
            })
            .state('analytics.project.debtors.detail', {
                url: '/:number',
                abstract: true,
                template: '<ui-view/>',
                // templateUrl: 'views/analytics/projects/detail/debtors/list_table.html',
                // controller: 'ktDebtorsTableCtrl',
                data: {
                    breadcrumb: true,
                    breadcrumbTitle: '借款人详情',
                    pageTitle: '借款人审批-借款人详情'
                },
            })
            .state('analytics.project.debtors.detail.list', {
                abstract: true,
                url: '',
                templateUrl: 'views/analytics/projects/detail/debtors/detail/list_layout.html',
                resolve: resolveFactory(['scripts/controllers/projects/debtors/kt-debtor-ctrl.js']),
                controller: 'ktDebtorCtrl',
                data: {
                    breadcrumb: false,
                    // breadcrumbTitle: '借款人详情',
                    pageTitle: '借款人审批-借款人详情',
                }
            })
            .state('analytics.project.debtors.detail.list.table', {
                url: '?status&page&per_page',
                templateUrl: 'views/analytics/projects/detail/debtors/detail/list_table.html',
                controller: 'ktDebtorTableCtrl',
                data: {
                    breadcrumb: false,
                    pageTitle: '借款人审批-借款人详情'
                },
            })
            // 审批规则设置
            .state('analytics.project.debtors.rules', {
                url: '/rules/list',
                templateUrl: 'views/analytics/projects/detail/debtors/rules.html',
                resolve: resolveFactory(['scripts/controllers/projects/debtors/kt-rules-ctrl.js']),
                controller: 'ktRulesCtrl',
                data: {
                    breadcrumbTitle: '规则设置',
                    pageTitle: '借款人审批-规则设置',
                }
            })
            // 审批规则-黑名单
            .state('analytics.project.debtors.blacklist', {
                abstract: true,
                url: '/blacklist/list',
                template: '<ui-view/>',
                data: {
                    breadcrumb: true,
                    breadcrumbState: 'analytics.project.blacklist.list.table',
                    breadcrumbTitle: '黑名单管理',
                    pageTitle: '借款人审批-黑名单',
                }
            })
            .state('analytics.project.debtors.blacklist.list', {
                abstract: true,
                url: '',
                templateUrl: 'views/analytics/projects/detail/debtors/blacklist_layout.html',
                resolve: resolveFactory(['scripts/controllers/projects/debtors/kt-blacklist-ctrl.js']),
                controller: 'ktBlacklistCtrl',
                data: {
                    breadcrumb: false,
                    pageTitle: '借款人审批-黑名单',
                }
            })
            .state('analytics.project.debtors.blacklist.list.table', {
                url: '?page&per_page',
                templateUrl: 'views/analytics/projects/detail/debtors/blacklist_table.html',
                controller: 'ktBlacklistTableCtrl',
                data: {
                    breadcrumb: false,
                    breadcrumbTitle: '黑名单列表',
                    pageTitle: '借款人审批-黑名单'
                },
            })

            // 放款管理
            .state('analytics.project.loanPlans', {
                abstract: true,
                url: '/loan_plans',
                template: '<ui-view/>',
                data: {
                    breadcrumbState: 'analytics.project.loanPlans.list.table',
                    pageTitle: '放款管理',
                }
            })
            .state('analytics.project.loanPlans.list', {
                abstract: true,
                url: '',
                templateUrl: 'views/analytics/projects/detail/loan_plans/list_layout.html',
                resolve: resolveFactory(['scripts/controllers/projects/loan_plans/kt-loanPlans-ctrl.js']),
                controller: 'ktLoanPlansCtrl',
                data: {
                    breadcrumb: false,
                    pageTitle: '放款管理',
                }
            })
            .state('analytics.project.loanPlans.list.table', {
                url: '?status&page&per_page',
                templateUrl: 'views/analytics/projects/detail/loan_plans/list_table.html',
                controller: 'ktLoanPlansTableCtrl',
                data: {
                    breadcrumb: true,
                    breadcrumbTitle: '放款计划列表',
                    pageTitle: '放款管理-放款计划列表'
                }
            })
            .state('analytics.project.loanPlans.detail', {
                url: '/:number',
                abstract: true,
                template: '<ui-view/>',
                // templateUrl: 'views/analytics/projects/detail/loan_plans/detail_layout.html',
                // resolve: resolveFactory(['scripts/controllers/projects/loan_plans/kt-loanPlan-ctrl.js']),
                // controller: 'ktLoanPlanCtrl',
                data: {
                    breadcrumb: false,
                    pageTitle: '放款管理-放款计划',
                }
            })
            .state('analytics.project.loanPlans.detail.summary', {
                url: '',
                templateUrl: 'views/analytics/projects/detail/loan_plans/detail.html',
                resolve: resolveFactory(['scripts/controllers/projects/loan_plans/kt-loanPlan-ctrl.js']),
                controller: 'ktLoanPlanCtrl',
                data: {
                    breadcrumb: true,
                    breadcrumbState: 'analytics.project.loanPlans.detail.summary',
                    breadcrumbTitle: '放款计划',
                    pageTitle: '放款管理-放款计划',
                }
            })
            .state('analytics.project.loanPlans.detail.plans', {
                url: '/plans',
                templateUrl: 'views/analytics/projects/detail/loan_plans/plans_list.html',
                resolve: resolveFactory(['scripts/controllers/projects/loan_plans/kt-loanPlans-plans-ctrl.js']),
                controller: 'ktLoanPlansPlansCtrl',
                data: {
                    breadcrumbTitle: '放款计划明细',
                    pageTitle: '放款管理-放款计划明细',
                }
            })
            .state('analytics.project.loanPlans.detail.results', {
                url: '/results',
                templateUrl: 'views/analytics/projects/detail/loan_plans/results_list.html',
                resolve: resolveFactory(['scripts/controllers/projects/loan_plans/kt-loanPlans-results-ctrl.js']),
                controller: 'ktLoanPlansResultsCtrl',
                data: {
                    breadcrumbTitle: '放款结果明细',
                    pageTitle: '放款管理-放款结果明细',
                }
            })
            .state('analytics.project.loanPlans.detail.repayments', {
                url: '/repayments',
                templateUrl: 'views/analytics/projects/detail/loan_plans/repayments_list.html',
                resolve: resolveFactory(['scripts/controllers/projects/loan_plans/kt-loanPlans-repayments-ctrl.js']),
                controller: 'ktLoanPlansRepaymentsCtrl',
                data: {
                    breadcrumbTitle: '还款计划明细',
                    pageTitle: '放款管理-还款计划明细',
                }
            })
            // 还款管理
            .state('analytics.project.repayments', {
                abstract: true,
                url: '/repayments',
                template: '<ui-view/>',
                data: {
                    breadcrumbState: 'analytics.project.repayments.list.table',
                    pageTitle: '还款管理',
                }
            })
            .state('analytics.project.repayments.list', {
                abstract: true,
                url: '',
                templateUrl: 'views/analytics/projects/detail/repayments/list_layout.html',
                resolve: resolveFactory(['scripts/controllers/projects/repayments/kt-repayments-ctrl.js']),
                controller: 'ktRepaymentsCtrl',
                data: {
                    breadcrumb: false,
                    pageTitle: '还款管理-还款清单列表',
                }
            })
            .state('analytics.project.repayments.list.table', {
                url: '?sub_project_id&page&per_page',
                templateUrl: 'views/analytics/projects/detail/repayments/list_table.html',
                controller: 'ktRepaymentsTableCtrl',
                data: {
                    breadcrumb: true,
                    breadcrumbTitle: '还款清单列表',
                    pageTitle: '还款管理-还款清单列表'
                }
            })
            .state('analytics.project.repayments.detail', {
                url: '/:number',
                templateUrl: 'views/analytics/projects/detail/repayments/detail.html',
                resolve: resolveFactory(['scripts/controllers/projects/repayments/kt-repayment-ctrl.js']),
                controller: 'ktRepaymentCtrl',
                data: {
                    breadcrumbTitle: '还款账单明细',
                    pageTitle: '还款管理-还款账单明细',
                }
            })
            // 财务管理
            .state('analytics.project.finance', {
                abstract: true,
                url: '/finance',
                template: '<ui-view/>',
                data: {
                    breadcrumbState: 'analytics.project.finance.billList.table',
                    pageTitle: '财务管理',
                }
            })
            .state('analytics.project.finance.billList', {
                abstract: true,
                url: '/bills',
                templateUrl: 'views/analytics/projects/detail/finance/bill_list_layout.html',
                resolve: resolveFactory(['scripts/controllers/projects/finance/kt-bills-ctrl.js']),
                controller: 'ktBillsCtrl',
                data: {
                    breadcrumb: false,
                    pageTitle: '还款对账-还款账单列表',
                }
            })
            .state('analytics.project.finance.billList.table', {
                url: '?sub_project_id&page&per_page&type&number',
                templateUrl: 'views/analytics/projects/detail/finance/bill_list_table.html',
                controller: 'ktBillsTableCtrl',
                data: {
                    breadcrumb: true,
                    breadcrumbTitle: '还款账单列表',
                    pageTitle: '还款对账-还款账单列表'
                }
            })
            .state('analytics.project.finance.billDetail', {
                url: '/bills/:billID',
                templateUrl: 'views/analytics/projects/detail/finance/bill_detail.html',
                resolve: resolveFactory(['scripts/controllers/projects/finance/kt-bill-ctrl.js']),
                controller: 'ktBillCtrl',
                data: {
                    breadcrumb: true,
                    breadcrumbTitle: '还款账单明细',
                    pageTitle: '还款对账-还款账单明细',
                }
            })
            .state('analytics.project.finance.paymentClear', {
                url: '/payment_clear',
                templateUrl: 'views/analytics/projects/detail/finance/payment_clear.html',
                resolve: resolveFactory(['scripts/controllers/projects/finance/kt-paymentClear-ctrl.js']),
                controller: 'ktPaymentClearCtrl',
                data: {
                    pageTitle: '回款清算',
                }
            })
            .state('analytics.project.finance.otherIncome', {
                url: '/other_income',
                abstract: true,
                templateUrl: 'views/analytics/projects/detail/finance/other_income_list_layout.html',
                resolve: resolveFactory(['scripts/controllers/projects/finance/kt-otherIncomes-ctrl.js']),
                controller: 'ktOtherIncomesCtrl',
                data: {
                    breadcrumb: false,
                    pageTitle: '其他收益',
                }
            })
            .state('analytics.project.finance.otherIncome.table', {
                url: '?page&per_page',
                templateUrl: 'views/analytics/projects/detail/finance/other_income_list_table.html',
                controller: 'ktOtherIncomesTableCtrl',
                data: {
                    breadcrumb: true,
                    pageTitle: '其他收益',
                }
            })
            // 现金流监控
            .state('analytics.project.cashFlowMonitor', {
                url: '/cash_flow_monitor?subproject_id',
                templateUrl: 'views/analytics/projects/detail/cash_flow_monitor/detail.html',
                resolve: resolveFactory(['scripts/controllers/projects/cash_flow_monitor/kt-cashFlowMonitor-ctrl.js']),
                controller: 'ktCashFlowMonitorCtrl',
                data: {
                    pageTitle: '现金流监控',
                }
            })
            .state('analytics.project.asset', { //单个项目的资产特抽象页面
                url: '/asset?date_from&date_to',
                abstract: true,
                template: '<ui-view/>',
                data: {
                    breadcrumbState: 'analytics.project.asset.feature',
                    pageTitle: '资产表现',
                }
            })
            .state('analytics.project.asset.feature', {
                url: '/feature',
                templateUrl: 'views/analytics/projects/detail/asset/feature.html',
                resolve: resolveFactory(['scripts/controllers/projects/asset/kt-feature-ctrl.js']),
                controller: 'ktAssetFeatureCtrl',
                data: {
                    breadcrumbTitle: '资产特征',
                    pageTitle: '资产表现-资产特征',
                }
            })
            .state('analytics.project.asset.users', {
                url: '/users',
                templateUrl: 'views/analytics/projects/detail/asset/users.html',
                resolve: resolveFactory(['scripts/controllers/projects/asset/kt-users-ctrl.js']),
                controller: 'ktUserFeatureCtrl',
                data: {
                    breadcrumbTitle: '人群特征',
                    pageTitle: '资产表现-人群特征',
                }
            })
            .state('analytics.project.asset.overdue', {
                url: '/overdue',
                templateUrl: 'views/analytics/projects/detail/asset/overdue.html',
                resolve: resolveFactory(['scripts/controllers/projects/asset/kt-overdue-ctrl.js']),
                controller: 'ktOverdueCtrl',
                data: {
                    breadcrumbTitle: '逾期分析',
                    pageTitle: '资产表现-逾期分析',
                }
            })
            // 项目设置
            .state('analytics.project.settings', { //单个项目的资产特抽象页面
                url: '/settings',
                abstract: true,
                template: '<ui-view/>',
                data: {
                    breadcrumbState: 'analytics.project.settings.info',
                    pageTitle: '项目设置',
                }
            })
            .state('analytics.project.settings.info', {
                url: '/info',
                templateUrl: 'views/analytics/projects/detail/settings/info.html',
                resolve: resolveFactory(['scripts/controllers/projects/settings/kt-info-ctrl.js']),
                controller: 'ktProjectInfoCtrl',
                data: {
                    breadcrumbTitle: '基本信息',
                    pageTitle: '项目设置-基本信息',
                }
            })
            .state('analytics.project.settings.edit', {
                url: '/edit',
                templateUrl: 'views/analytics/projects/detail/settings/project_form.html',
                resolve: resolveFactory(['scripts/controllers/projects/settings/kt-edit-ctrl.js']),
                controller: 'ktProjectEditCtrl',
                data: {
                    breadcrumbTitle: '编辑项目',
                    pageTitle: '项目设置-编辑项目',
                }
            })
            .state('analytics.project.settings.add', {
                url: '/add',
                templateUrl: 'views/analytics/projects/detail/settings/project_form.html',
                resolve: resolveFactory(['scripts/controllers/projects/settings/kt-add-ctrl.js']),
                controller: 'ktProjectAddCtrl',
                data: {
                    breadcrumbTitle: '添加项目',
                    pageTitle: '项目设置-添加项目',
                }
            })
            .state('analytics.project.settings.subProject', {
                url: '/subprojects',
                abstract: true,
                template: '<ui-view/>',
                data: {
                    breadcrumbState: 'analytics.project.settings.subProject.list.table',
                    pageTitle: '子项目管理',
                }
            })
            .state('analytics.project.settings.subProject.list', {
                abstract: true,
                url: '',
                templateUrl: 'views/analytics/projects/detail/settings/subproject_list_layout.html',
                resolve: resolveFactory(['scripts/controllers/projects/settings/kt-subprojects-ctrl.js']),
                controller: 'ktSubProjectsCtrl',
                data: {
                    breadcrumb: false,
                    pageTitle: '子项目管理-子项目列表',
                }
            })
            .state('analytics.project.settings.subProject.list.table', {
                url: '?page&per_page',
                templateUrl: 'views/analytics/projects/detail/settings/subproject_list_table.html',
                controller: 'ktSubProjectsTableCtrl',
                data: {
                    breadcrumb: true,
                    breadcrumbTitle: '子项目列表',
                    pageTitle: '子项目管理-子项目列表'
                }
            })
            .state('analytics.project.settings.subProject.add', {
                url: '/subprojects/add',
                templateUrl: 'views/analytics/projects/detail/settings/subproject_form.html',
                resolve: resolveFactory(['scripts/controllers/projects/settings/kt-subproject-add-ctrl.js']),
                controller: 'ktSubProjectAddCtrl',
                data: {
                    breadcrumbTitle: '添加子项目',
                    pageTitle: '子项目管理-添加子项目',
                }
            })
            .state('analytics.project.settings.subProject.edit', {
                url: '/subprojects/:subProjectID/edit',
                templateUrl: 'views/analytics/projects/detail/settings/subproject_form.html',
                resolve: resolveFactory(['scripts/controllers/projects/settings/kt-subproject-edit-ctrl.js']),
                controller: 'ktSubProjectEditCtrl',
                data: {
                    breadcrumbTitle: '编辑子项目',
                    pageTitle: '子项目管理-编辑子项目',
                }
            })
            /*.state('analytics.project.assetFeature', { //单个项目的资产特抽象页面
                url: '/asset_feature',
                abstract: true,
                template: '<ui-view/>',
                data: {
                    pageTitle: '资产特征',
                }
            })
            .state('analytics.project.assetFeature.timelimit', {
                url: '/timelimit',
                templateUrl: 'views/analytics/projects/detail/asset_feature/time_limit.html',
                resolve: resolveFactory(['scripts/controllers/projects/asset_feature/kt-timelimit-ctrl.js']),
                controller: 'ktAssetFeatureTimelimitCtrl',
                data: {
                    pageTitle: '资产特征-期限',
                }
            })
            .state('analytics.project.assetFeature.amount', {
                url: '/amount',
                templateUrl: 'views/analytics/projects/detail/asset_feature/amount.html',
                resolve: resolveFactory(['scripts/controllers/projects/asset_feature/kt-amount-ctrl.js']),
                controller: 'ktAssetFeatureAmountCtrl',
                data: {
                    pageTitle: '资产特征-额度',
                }
            })*/
            /*.state('analytics.project.assetFeature.type', {
                url: '/type',
                templateUrl: 'views/analytics/projects/detail/asset_feature/type.html',
                resolve: resolveFactory(['scripts/controllers/projects/asset_feature/kt-type-ctrl.js']),
                controller: 'ktAssetFeatureTypeCtrl',
                data: {
                    pageTitle: '资产特征-类型',
                }
            })
            .state('analytics.project.assetFeature.location', {
                url: '/location',
                templateUrl: 'views/analytics/projects/detail/asset_feature/location.html',
                resolve: resolveFactory(['scripts/controllers/projects/asset_feature/kt-location-ctrl.js']),
                controller: 'ktAssetFeatureLocationCtrl',
                data: {
                    pageTitle: '资产特征-地理',
                }
            })
            .state('analytics.project.usersFeature', { //单个项目的用户特抽象页面
                url: '/users_feature',
                abstract: true,
                template: '<ui-view/>',
                data: {
                    pageTitle: '人群特征',
                }
            })
            .state('analytics.project.usersFeature.gender', {
                url: '/gender',
                templateUrl: 'views/analytics/projects/detail/users_feature/gender.html',
                resolve: resolveFactory(['scripts/controllers/projects/users_feature/kt-gender-ctrl.js']),
                controller: 'ktUsersFeatureGenderCtrl',
                data: {
                    pageTitle: '人群特征-期限',
                }
            })
            .state('analytics.project.usersFeature.age', {
                url: '/age',
                templateUrl: 'views/analytics/projects/detail/users_feature/age.html',
                resolve: resolveFactory(['scripts/controllers/projects/users_feature/kt-age-ctrl.js']),
                controller: 'ktUsersFeatureAgeCtrl',
                data: {
                    pageTitle: '人群特征-额度',
                }
            })
            .state('analytics.project.usersFeature.income', {
                url: '/income',
                templateUrl: 'views/analytics/projects/detail/users_feature/income.html',
                resolve: resolveFactory(['scripts/controllers/projects/users_feature/kt-income-ctrl.js']),
                controller: 'ktUsersFeatureIncomeCtrl',
                data: {
                    pageTitle: '人群特征-类型',
                }
            })*/
            .state('analytics.project.overdueAnalytics', { //单个项目的用户特抽象页面
                url: '/overdue_analytics',
                abstract: true,
                template: '<ui-view/>',
                data: {
                    pageTitle: '逾期分析',
                }
            })
            .state('analytics.project.overdueAnalytics.overdueRate', {
                url: '/overdue_rate',
                templateUrl: 'views/analytics/projects/detail/overdue_analytics/overdue_rate.html',
                resolve: resolveFactory(['scripts/controllers/projects/overdue_analytics/kt-overdue-rate-ctrl.js']),
                controller: 'ktOverdueAnalyticsOverdueRateCtrl',
                data: {
                    pageTitle: '逾期分析-期限',
                }
            })
            .state('analytics.project.overdueAnalytics.migrateRate', {
                url: '/migrate_rate',
                templateUrl: 'views/analytics/projects/detail/overdue_analytics/migrate_rate.html',
                resolve: resolveFactory(['scripts/controllers/projects/overdue_analytics/kt-migrate-rate-ctrl.js']),
                controller: 'ktOverdueAnalyticsMigrateRateCtrl',
                data: {
                    pageTitle: '逾期分析-额度',
                }
            })
            .state('analytics.project.projectInfo', { //单个项目的用户特抽象页面
                url: '/project_info',
                abstract: true,
                template: '<ui-view/>',
                data: {
                    pageTitle: '机构信息',
                }
            })
            .state('analytics.project.projectInfo.info', {
                url: '/info',
                templateUrl: 'views/analytics/projects/detail/project_info/info.html',
                resolve: resolveFactory(['scripts/controllers/projects/project_info/kt-info-ctrl.js']),
                controller: 'ktProjectInfoInfoCtrl',
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
            /*.state('analytics.account.project', {
                url: '/project',
                templateUrl: 'views/analytics/account/project.html',
                controller: 'ktProjectCtrl',
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
            .state('account.confirm', {
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
            })
            /**
             * 错误页面
             */
            .state('error', {
                abstract: true,
                url: '/error?apimock',
                templateUrl: 'views/common/empty.html',
                // resolve: resolveFactory(['styles/portal.css']),
                data: {
                    pageTitle: '错误',
                    specialClass: 'error-page'
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
                // 权限控制，需要登录才能访问的页面逻辑，
                // 首页获取user的逻辑不要尝试在这里解决，放到路由的resolve里面解决，否则很容易造成死循环，注意这个坑
                var permit = toState.data.permit
                var search = $location.search()

                // 确保传递apimock
                if (search.apimock && !toParams.apimock) {
                    toParams.apimock = search.apimock
                }

                // 登录限制
                if (!$rootScope.user && permit && $.inArray('login', permit) > -1) {
                    // event.preventDefault(); //此处禁止事件冒泡会导致ui-rooter 死循环
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
                // console.log(arguments[5])
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
