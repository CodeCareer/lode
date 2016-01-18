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
                    url: '/analytics?apimock&role&inst_type', //父view的设置，通过ui-sref的跳转会将参数带到子view
                    abstract: true,
                    templateUrl: 'views/common/analytics.html',
                    data: {
                        breadcrumb: true,
                        breadcrumbState: 'analytics.home',
                        pageTitle: '微贷平台',
                        permit: ['login'],
                        specialClass: 'fixed-sidebar analytics-page'
                    },
                    resolve: ktLazyResolve(['scripts/controllers/kt-analytics-ctrl.js'], {

                        user: function($q, $rootScope, ktUserService) {

                            // if ($rootScope.user) return true
                            var deferred = $q.defer()
                            ktUserService.get(function(res) {
                                var instType = res.account.institution.inst_type
                                var defaultRouteMap = {
                                    'zijin': 'analytics.reports.dashboard',
                                    'zhudai': 'analytics.subProjects.list.table'
                                }
                                $rootScope.defaultRoute = defaultRouteMap[instType] || 'analytics.home'

                                deferred.resolve(res.account)
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
                        waitUser: function($rootScope, $state, user) {
                            if (user) {
                                $state.go($rootScope.defaultRoute, $state.params)
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
                    resolve: ktLazyResolve(['scripts/controllers/projects/kt-dashboard-ctrl.js']),
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
                    resolve: ktLazyResolve(['scripts/controllers/projects/kt-asset-feature-ctrl.js']),
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
                    templateUrl: 'views/analytics/projects/list_layout.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/kt-projects-ctrl.js']),
                    controller: 'ktProjectsCtrl',
                    data: {
                        breadcrumb: false, //重载父view data
                        pageTitle: '项目列表'
                    }
                },
                'analytics.projects.list.table': {
                    url: '?page&status&per_page&zhudai_id&account_id',
                    templateUrl: 'views/analytics/projects/list_table.html',
                    controller: 'ktProjectsTableCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '项目列表'
                    }
                },
                'analytics.projects.add': {
                    url: '/add',
                    templateUrl: 'views/analytics/projects/detail/settings/project_form.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/settings/kt-add-ctrl.js']),
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
                    templateUrl: 'views/analytics/institutions/list_layout.html',
                    resolve: ktLazyResolve(['scripts/controllers/institutions/kt-institutions-ctrl.js']),
                    controller: 'ktInstitutionsCtrl',
                    data: {
                        breadcrumb: false, //重载父view data
                        pageTitle: '机构列表'
                    }
                },
                'analytics.institutions.list.table': {
                    url: '?page&status&per_page',
                    templateUrl: 'views/analytics/institutions/list_table.html',
                    controller: 'ktInstitutionsTableCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '机构列表'
                    }
                },
                'analytics.channels': {
                    abstract: true,
                    url: '/channels',
                    template: '<ui-view/>',
                    data: {
                        breadcrumb: true,
                        permit: ['login', 'admin'],
                        breadcrumbState: 'analytics.channels.list.table',
                        pageTitle: '通道列表'
                    }
                },
                'analytics.channels.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/channels/list_layout.html',
                    resolve: ktLazyResolve(['scripts/controllers/channels/kt-channels-ctrl.js']),
                    controller: 'ktChannelsCtrl',
                    data: {
                        breadcrumb: false, //重载父view data
                        pageTitle: '通道列表'
                    }
                },
                'analytics.channels.list.table': {
                    url: '?page&status&per_page',
                    templateUrl: 'views/analytics/channels/list_table.html',
                    controller: 'ktChannelsTableCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '通道列表'
                    }
                },
                'analytics.accounts': {
                    abstract: true,
                    url: '/accounts',
                    template: '<ui-view/>',
                    data: {
                        breadcrumb: true,
                        permit: ['login', 'admin'],
                        breadcrumbState: 'analytics.accounts.list.table',
                        pageTitle: '用户列表'
                    }
                },
                'analytics.accounts.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/accounts/list_layout.html',
                    resolve: ktLazyResolve(['scripts/controllers/accounts/kt-accounts-ctrl.js']),
                    controller: 'ktAccountsCtrl',
                    data: {
                        breadcrumb: false, //重载父view data
                        pageTitle: '用户列表'
                    }
                },
                'analytics.accounts.list.table': {
                    url: '?page&status&per_page',
                    templateUrl: 'views/analytics/accounts/list_table.html',
                    controller: 'ktAccountsTableCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '用户列表'
                    }
                },
                // 以下是单个项目统计页面-资金方
                'analytics.project': { //单个项目的抽:页面
                    url: '/projects/:projectID',
                    abstract: true,
                    template: '<ui-view/>',
                    // resolve: ktLazyResolve(['scripts/controllers/projects/kt-project-ctrl.js']), //已放到 kt-analytics.js 替代
                    // controller: 'ktPrjectCtrl',
                    data: {
                        breadcrumb: true,
                        // breadcrumbTitle: '资产特征',
                        breadcrumbState: 'analytics.project.dashboard',
                        pageTitle: '项目详情',
                        specialClass: 'fixed-sidebar analytics-page analytics-detail',
                    }
                },
                'analytics.project.dashboard': {
                    url: '/dashboard',
                    templateUrl: 'views/analytics/projects/dashboard.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/kt-project-dashboard-ctrl.js']),
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
                        pageTitle: '借款人审批',
                        breadcrumbState: 'analytics.project.debtors.list.table'
                    }
                },
                // 借款人审批
                'analytics.project.debtors.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/projects/detail/debtors/list_layout.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/debtors/kt-debtors-ctrl.js']),
                    controller: 'ktDebtorsCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '借款人审批',
                    }
                },
                'analytics.project.debtors.list.table': {
                    url: '?page&per_page',
                    templateUrl: 'views/analytics/projects/detail/debtors/list_table.html',
                    controller: 'ktDebtorsTableCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '借款人列表',
                        pageTitle: '借款人审批-借款人列表'
                    },
                },
                'analytics.project.debtors.detail': {
                    url: '/:batchNo',
                    abstract: true,
                    template: '<ui-view/>',
                    // templateUrl: 'views/analytics/projects/detail/debtors/list_table.html',
                    // controller: 'ktDebtorsTableCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '借款人详情',
                        pageTitle: '借款人审批-借款人详情'
                    },
                },
                'analytics.project.debtors.detail.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/projects/detail/debtors/detail/list_layout.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/debtors/kt-debtor-ctrl.js']),
                    controller: 'ktDebtorCtrl',
                    data: {
                        breadcrumb: false,
                        // breadcrumbTitle: '借款人详情',
                        pageTitle: '借款人审批-借款人详情',
                    }
                },
                'analytics.project.debtors.detail.list.table': {
                    url: '?status&page&per_page',
                    templateUrl: 'views/analytics/projects/detail/debtors/detail/list_table.html',
                    controller: 'ktDebtorTableCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '借款人审批-借款人详情'
                    },
                },
                // 审批规则设置
                'analytics.project.debtors.rules': {
                    url: '/rules/list',
                    templateUrl: 'views/analytics/projects/detail/debtors/rules.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/debtors/kt-rules-ctrl.js']),
                    controller: 'ktRulesCtrl',
                    data: {
                        breadcrumbTitle: '规则设置',
                        pageTitle: '借款人审批-规则设置',
                    }
                },
                // 审批规则-黑名单
                'analytics.project.debtors.blacklist': {
                    abstract: true,
                    url: '/blacklist/list',
                    template: '<ui-view/>',
                    data: {
                        breadcrumb: true,
                        breadcrumbState: 'analytics.project.blacklist.list.table',
                        breadcrumbTitle: '黑名单管理',
                        pageTitle: '借款人审批-黑名单',
                    }
                },
                'analytics.project.debtors.blacklist.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/projects/detail/debtors/blacklist_layout.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/debtors/kt-blacklist-ctrl.js']),
                    controller: 'ktBlacklistCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '借款人审批-黑名单',
                    }
                },
                'analytics.project.debtors.blacklist.list.table': {
                    url: '?page&per_page',
                    templateUrl: 'views/analytics/projects/detail/debtors/blacklist_table.html',
                    controller: 'ktBlacklistTableCtrl',
                    data: {
                        breadcrumb: false,
                        breadcrumbTitle: '黑名单列表',
                        pageTitle: '借款人审批-黑名单'
                    },
                },

                // 放款管理
                'analytics.project.loanPlans': {
                    abstract: true,
                    url: '/loan_plans',
                    template: '<ui-view/>',
                    data: {
                        breadcrumbState: 'analytics.project.loanPlans.list.table',
                        pageTitle: '放款管理',
                    }
                },
                'analytics.project.loanPlans.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/projects/detail/loan_plans/list_layout.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/loan_plans/kt-loanPlans-ctrl.js']),
                    controller: 'ktLoanPlansCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '放款管理',
                    }
                },
                'analytics.project.loanPlans.list.table': {
                    url: '?status&page&per_page',
                    templateUrl: 'views/analytics/projects/detail/loan_plans/list_table.html',
                    controller: 'ktLoanPlansTableCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '放款计划列表',
                        pageTitle: '放款管理-放款计划列表'
                    }
                },
                'analytics.project.loanPlans.detail': {
                    url: '/:batchNo',
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        breadcrumb: false,
                        pageTitle: '放款管理-放款计划',
                    }
                },
                'analytics.project.loanPlans.detail.summary': {
                    url: '',
                    templateUrl: 'views/analytics/projects/detail/loan_plans/detail.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/loan_plans/kt-loanPlan-ctrl.js']),
                    controller: 'ktLoanPlanCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbState: 'analytics.project.loanPlans.detail.summary',
                        breadcrumbTitle: '放款计划',
                        pageTitle: '放款管理-放款计划',
                    }
                },
                'analytics.project.loanPlans.detail.plans': {
                    url: '/plans',
                    templateUrl: 'views/analytics/projects/detail/loan_plans/plans_list.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/loan_plans/kt-loanPlans-plans-ctrl.js']),
                    controller: 'ktLoanPlansPlansCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '放款计划明细',
                        pageTitle: '放款管理-放款计划明细',
                    }
                },
                'analytics.project.loanPlans.detail.results': {
                    url: '/results',
                    templateUrl: 'views/analytics/projects/detail/loan_plans/results_list.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/loan_plans/kt-loanPlans-results-ctrl.js']),
                    controller: 'ktLoanPlansResultsCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '放款结果明细',
                        pageTitle: '放款管理-放款结果明细',
                    }
                },
                'analytics.project.loanPlans.detail.repayments': {
                    url: '/repayments',
                    templateUrl: 'views/analytics/projects/detail/loan_plans/repayments_list.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/loan_plans/kt-loanPlans-repayments-ctrl.js']),
                    controller: 'ktLoanPlansRepaymentsCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '还款计划明细',
                        pageTitle: '放款管理-还款计划明细',
                    }
                },
                // 还款管理
                'analytics.project.repayments': {
                    abstract: true,
                    url: '/repayments',
                    template: '<ui-view/>',
                    data: {
                        breadcrumbState: 'analytics.project.repayments.list.table',
                        pageTitle: '还款管理',
                    }
                },
                'analytics.project.repayments.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/projects/detail/repayments/list_layout.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/repayments/kt-repayments-ctrl.js']),
                    controller: 'ktRepaymentsCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '还款管理-还款清单列表',
                    }
                },
                'analytics.project.repayments.list.table': {
                    url: '?subproject_id&page&per_page',
                    templateUrl: 'views/analytics/projects/detail/repayments/list_table.html',
                    controller: 'ktRepaymentsTableCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '还款清单列表',
                        pageTitle: '还款管理-还款清单列表'
                    }
                },
                'analytics.project.repayments.detail': {
                    url: '/:batchNo',
                    templateUrl: 'views/analytics/projects/detail/repayments/detail.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/repayments/kt-repayment-ctrl.js']),
                    controller: 'ktRepaymentCtrl',
                    data: {
                        breadcrumbTitle: '还款清单明细',
                        pageTitle: '还款管理-还款清单明细',
                    }
                },
                // 财务管理
                'analytics.project.finance': {
                    abstract: true,
                    url: '/finance',
                    template: '<ui-view/>',
                    data: {
                        breadcrumbState: 'analytics.project.finance.billList.table',
                        pageTitle: '财务管理',
                    }
                },
                'analytics.project.finance.billList': {
                    abstract: true,
                    url: '/bills',
                    templateUrl: 'views/analytics/projects/detail/finance/bill_list_layout.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/finance/kt-bills-ctrl.js']),
                    controller: 'ktBillsCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '还款对账-还款账单列表',
                    }
                },
                'analytics.project.finance.billList.table': {
                    url: '?subproject_id&page&per_page&type&batch_no',
                    templateUrl: 'views/analytics/projects/detail/finance/bill_list_table.html',
                    controller: 'ktBillsTableCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '还款账单列表',
                        pageTitle: '还款对账-还款账单列表'
                    }
                },
                'analytics.project.finance.billDetail': {
                    url: '/bills/:billID',
                    templateUrl: 'views/analytics/projects/detail/finance/bill_detail.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/finance/kt-bill-ctrl.js']),
                    controller: 'ktBillCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '还款账单明细',
                        pageTitle: '还款对账-还款账单明细',
                    }
                },
                'analytics.project.finance.paymentClear': {
                    url: '/payment_clear',
                    templateUrl: 'views/analytics/projects/detail/finance/payment_clear.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/finance/kt-paymentClear-ctrl.js']),
                    controller: 'ktPaymentClearCtrl',
                    data: {
                        pageTitle: '回款清算',
                    }
                },
                'analytics.project.finance.otherIncome': {
                    url: '/other_income',
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        breadcrumb: false,
                        pageTitle: '其他收益',
                    }
                },
                'analytics.project.finance.otherIncome.list': {
                    url: '',
                    abstract: true,
                    templateUrl: 'views/analytics/projects/detail/finance/other_income_list_layout.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/finance/kt-otherIncomes-ctrl.js']),
                    controller: 'ktOtherIncomesCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '其他收益',
                    }
                },
                'analytics.project.finance.otherIncome.list.table': {
                    url: '?page&per_page',
                    templateUrl: 'views/analytics/projects/detail/finance/other_income_list_table.html',
                    controller: 'ktOtherIncomesTableCtrl',
                    data: {
                        breadcrumb: true,
                        pageTitle: '其他收益',
                    }
                },
                'analytics.project.finance.otherIncome.edit': {
                    url: '/:otherIncomeID/edit',
                    templateUrl: 'views/analytics/projects/detail/finance/other_income_form.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/finance/kt-otherIncome-edit-ctrl.js']),
                    controller: 'ktOtherIncomeEditCtrl',
                    data: {
                        breadcrumb: true,
                        pageTitle: '编辑收益',
                    }
                },
                'analytics.project.finance.otherIncome.add': {
                    url: '/add',
                    templateUrl: 'views/analytics/projects/detail/finance/other_income_form.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/finance/kt-otherIncome-add-ctrl.js']),
                    controller: 'ktOtherIncomeAddCtrl',
                    data: {
                        breadcrumb: true,
                        pageTitle: '添加收益',
                    }
                },
                // 现金流监控
                'analytics.project.cashFlowMonitor': {
                    url: '/cash_flow_monitor?subproject_id',
                    templateUrl: 'views/analytics/projects/detail/cash_flow_monitor/detail.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/cash_flow_monitor/kt-cashFlowMonitor-ctrl.js']),
                    controller: 'ktCashFlowMonitorCtrl',
                    data: {
                        pageTitle: '现金流监控',
                    }
                },
                'analytics.project.asset': { //单个项目的资产特抽:页面
                    url: '/asset?start_date&end_date',
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        breadcrumbState: 'analytics.project.asset.feature',
                        pageTitle: '资产表现',
                    }
                },
                'analytics.project.asset.feature': {
                    url: '/feature',
                    templateUrl: 'views/analytics/projects/detail/asset/feature.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/asset/kt-feature-ctrl.js']),
                    controller: 'ktAssetFeatureCtrl',
                    data: {
                        breadcrumbTitle: '资产特征',
                        pageTitle: '资产表现-资产特征',
                    }
                },
                'analytics.project.asset.users': {
                    url: '/users',
                    templateUrl: 'views/analytics/projects/detail/asset/users.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/asset/kt-users-ctrl.js']),
                    controller: 'ktUserFeatureCtrl',
                    data: {
                        breadcrumbTitle: '人群特征',
                        pageTitle: '资产表现-人群特征',
                    }
                },
                'analytics.project.asset.overdue': {
                    url: '/overdue',
                    templateUrl: 'views/analytics/projects/detail/asset/overdue.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/asset/kt-overdue-ctrl.js']),
                    controller: 'ktOverdueCtrl',
                    data: {
                        breadcrumbTitle: '逾期分析',
                        pageTitle: '资产表现-逾期分析',
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
                    templateUrl: 'views/analytics/projects/detail/settings/info.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/settings/kt-info-ctrl.js']),
                    controller: 'ktProjectInfoCtrl',
                    data: {
                        breadcrumbTitle: '基本信息',
                        pageTitle: '项目设置-基本信息',
                    }
                },
                'analytics.project.settings.edit': {
                    url: '/edit',
                    templateUrl: 'views/analytics/projects/detail/settings/project_form.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/settings/kt-edit-ctrl.js']),
                    controller: 'ktProjectEditCtrl',
                    data: {
                        breadcrumbTitle: '编辑项目',
                        pageTitle: '项目设置-编辑项目',
                    }
                },
                'analytics.project.settings.add': {
                    url: '/add',
                    templateUrl: 'views/analytics/projects/detail/settings/project_form.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/settings/kt-add-ctrl.js']),
                    controller: 'ktProjectAddCtrl',
                    data: {
                        breadcrumbTitle: '添加项目',
                        pageTitle: '项目设置-添加项目',
                    }
                },
                'analytics.project.settings.subProject': {
                    url: '/subprojects',
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        breadcrumbState: 'analytics.project.settings.subProject.list.table',
                        pageTitle: '子项目管理',
                    }
                },
                'analytics.project.settings.subProject.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/projects/detail/settings/subproject_list_layout.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/settings/kt-subprojects-ctrl.js']),
                    controller: 'ktSubProjectsCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '子项目管理-子项目列表',
                    }
                },
                'analytics.project.settings.subProject.list.table': {
                    url: '?page&per_page',
                    templateUrl: 'views/analytics/projects/detail/settings/subproject_list_table.html',
                    controller: 'ktSubProjectsTableCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '子项目列表',
                        pageTitle: '子项目管理-子项目列表'
                    }
                },
                'analytics.project.settings.subProject.add': {
                    url: '/add',
                    templateUrl: 'views/analytics/projects/detail/settings/subproject_form.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/settings/kt-subproject-add-ctrl.js']),
                    controller: 'ktSubProjectAddCtrl',
                    data: {
                        breadcrumbTitle: '添加子项目',
                        pageTitle: '子项目管理-添加子项目',
                    }
                },
                'analytics.project.settings.subProject.edit': {
                    url: '/:subProjectID/edit',
                    templateUrl: 'views/analytics/projects/detail/settings/subproject_form.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/settings/kt-subproject-edit-ctrl.js']),
                    controller: 'ktSubProjectEditCtrl',
                    data: {
                        breadcrumbTitle: '编辑子项目',
                        pageTitle: '子项目管理-编辑子项目',
                    }
                },
                'analytics.project.projectInfo': { //单个项目的用户特抽:页面
                    url: '/project_info',
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        pageTitle: '机构信息',
                    }
                },
                'analytics.project.projectInfo.info': {
                    url: '/info',
                    templateUrl: 'views/analytics/projects/detail/project_info/info.html',
                    resolve: ktLazyResolve(['scripts/controllers/projects/project_info/kt-info-ctrl.js']),
                    controller: 'ktProjectInfoInfoCtrl',
                    data: {
                        pageTitle: '机构信息',
                    }
                },
            }
        })
})();
