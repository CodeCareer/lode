;
(function() {
    'use strict';
    angular.module('kt.lode')
        .provider('ktDebtorRoutes', function(ktLazyResolveProvider) {
            var ktLazyResolve = ktLazyResolveProvider.$get()
            this.$get = {}
            this.routes = {
                // 子项目列表-助贷机构
                'analytics.subProjects': {
                    abstract: true,
                    url: '/subprojects',
                    template: '<ui-view/>',
                    data: {
                        permit: ['zhudai'],
                        breadcrumb: true,
                        breadcrumbState: 'analytics.subProjects.list.table',
                        pageTitle: '子项目列表'
                    }
                },
                // multi named view不支持局部刷新view， 所以使用nested view 的方式实现刷新局部刷新
                'analytics.subProjects.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/subprojects/subprojects_layout.html',
                    resolve: ktLazyResolve(['views/analytics/subprojects/subprojects.js']),
                    controller: 'ktSubProjectsCtrl',
                    data: {
                        breadcrumb: false, //重载父view data
                        pageTitle: '子项目列表'
                    }
                },
                'analytics.subProjects.list.table': {
                    url: '?page&status&per_page&project_id',
                    templateUrl: 'views/analytics/subprojects/subprojects.html',
                    controller: 'ktSubProjectsTableCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '子项目列表'
                    }
                },
                // 以下是单个项目统计页面-助贷机构
                'analytics.subProject': { //单个项目的抽:页面
                    url: '/subprojects/:subProjectID',
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        permit: ['zhudai'],
                        breadcrumb: true,
                        // breadcrumbTitle: '资产特征',
                        breadcrumbState: 'analytics.subProject.debtors.list.table',
                        pageTitle: '子项目详情',
                        specialClass: 'fixed-sidebar analytics-page analytics-detail',
                    }
                },
                // 借款人管理
                'analytics.subProject.debtors': {
                    abstract: true,
                    url: '/debtors',
                    template: '<ui-view/>',
                    data: {
                        pageTitle: '借款人管理',
                        breadcrumb: true,
                        breadcrumbState: 'analytics.subProject.debtors.list.table'
                    }
                },
                'analytics.subProject.debtors.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/subprojects/detail/debtors/debtors_layout.html',
                    resolve: ktLazyResolve(['views/analytics/subprojects/detail/debtors/debtors.js']),
                    controller: 'ktDebtorsCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '借款人管理',
                    }
                },
                'analytics.subProject.debtors.list.table': {
                    url: '?page&per_page',
                    templateUrl: 'views/analytics/subprojects/detail/debtors/debtors.html',
                    controller: 'ktDebtorsTableCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '借款人列表',
                        pageTitle: '借款人管理-借款人列表'
                    },
                },
                'analytics.subProject.debtors.detail': {
                    url: '/:batchNo',
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '借款人详情',
                        pageTitle: '借款人审批-借款人详情'
                    },
                },
                'analytics.subProject.debtors.detail.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/subprojects/detail/debtors/detail/debtor_layout.html',
                    resolve: ktLazyResolve(['views/analytics/subprojects/detail/debtors/detail/debtor.js']),
                    controller: 'ktDebtorCtrl',
                    data: {
                        breadcrumb: false,
                        // breadcrumbTitle: '借款人详情',
                        pageTitle: '借款人审批-借款人详情',
                    }
                },
                'analytics.subProject.debtors.detail.list.table': {
                    url: '?status&page&per_page',
                    templateUrl: 'views/analytics/subprojects/detail/debtors/detail/debtor.html',
                    controller: 'ktDebtorTableCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '借款人审批-借款人详情'
                    },
                },
                // 放款管理
                'analytics.subProject.loanPlans': {
                    abstract: true,
                    url: '/loan_plans',
                    template: '<ui-view/>',
                    data: {
                        breadcrumbState: 'analytics.subProject.loanPlans.list.table',
                        pageTitle: '放款管理',
                    }
                },
                'analytics.subProject.loanPlans.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/subprojects/detail/loan_plans/loan_plans_layout.html',
                    resolve: ktLazyResolve(['views/analytics/subprojects/detail/loan_plans/loan_plans.js']),
                    controller: 'ktLoanPlansCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '放款管理',
                    }
                },
                'analytics.subProject.loanPlans.list.table': {
                    url: '?status&page&per_page',
                    templateUrl: 'views/analytics/subprojects/detail/loan_plans/loan_plans.html',
                    controller: 'ktLoanPlansTableCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '放款计划列表',
                        pageTitle: '放款管理-放款计划列表'
                    }
                },
                'analytics.subProject.loanPlans.detail': {
                    url: '/:batchNo',
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        breadcrumb: false,
                        pageTitle: '放款管理-放款计划',
                    }
                },

                'analytics.subProject.loanPlans.detail.list': {
                    url: '',
                    abstract: true,
                    templateUrl: 'views/analytics/subprojects/detail/loan_plans/detail/loan_plan_layout.html',
                    resolve: ktLazyResolve(['views/analytics/subprojects/detail/loan_plans/detail/loan_plan.js']),
                    controller: 'ktLoanPlanCtrl',
                    data: {
                        pageTitle: '放款管理-放款计划明细',
                    }
                },
                'analytics.subProject.loanPlans.detail.list.table': {
                    url: 'page&per_page',
                    templateUrl: 'views/analytics/subprojects/detail/loan_plans/detail/loan_plan.html',
                    controller: 'ktLoanPlanTableCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '放款计划明细',
                        pageTitle: '放款管理-放款计划明细',
                    }
                },
                // 还款管理
                'analytics.subProject.repayments': {
                    abstract: true,
                    url: '/repayments',
                    template: '<ui-view/>',
                    data: {
                        breadcrumb: true,
                        breadcrumbState: 'analytics.subProject.repayments.list.table',
                        pageTitle: '财务管理',
                    }
                },
                'analytics.subProject.repayments.list': {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/analytics/subprojects/detail/repayments/repayments_layout.html',
                    resolve: ktLazyResolve(['views/analytics/subprojects/detail/repayments/repayments.js']),
                    controller: 'ktRepaymentsCtrl',
                    data: {
                        breadcrumb: false,
                        pageTitle: '财务管理-还款账单列表',
                    }
                },
                'analytics.subProject.repayments.list.table': {
                    url: '?page&per_page&start_date&end_date',
                    templateUrl: 'views/analytics/subprojects/detail/repayments/repayments.html',
                    controller: 'ktRepaymentsTableCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '还款账单列表',
                        pageTitle: '财务管理-还款账单列表'
                    }
                },
                'analytics.subProject.repayments.detail': {
                    url: '/:billID',
                    abstract: true,
                    template: '<ui-view/>',
                    data: {
                        breadcrumb: false,
                        pageTitle: '财务管理-还款账单明细',
                    }
                },
                'analytics.subProject.repayments.detail.list': {
                    url: '',
                    abstract: true,
                    templateUrl: 'views/analytics/subprojects/detail/repayments/detail/repayment_layout.html',
                    resolve: ktLazyResolve(['views/analytics/subprojects/detail/repayments/detail/repayment.js']),
                    controller: 'ktRepaymentCtrl',
                    data: {
                        pageTitle: '财务管理-还款账单明细',
                    }
                },
                'analytics.subProject.repayments.detail.list.table': {
                    url: '?page&per_page',
                    templateUrl: 'views/analytics/subprojects/detail/repayments/detail/repayment.html',
                    controller: 'ktRepaymentTableCtrl',
                    data: {
                        breadcrumb: true,
                        breadcrumbTitle: '还款账单明细',
                        pageTitle: '财务管理-还款账单明细',
                    }
                },
            }
        })
})();
