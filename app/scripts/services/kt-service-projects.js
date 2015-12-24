/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.lode')

    // 项目
    .factory('ktProjectsService', function($resource, ktApiVersion) {
        return $resource('/ajax/api/' + ktApiVersion + '/projects/:projectID/:subProject/:subProjectID', {
            projectID: '@projectID',
            subProject: '@subProject',
            subProjectID: '@subProjectID'
        })
    }, {
        'get': {
            method: 'GET',
            cache: false
        }
    })


    // 统计
    .factory('ktReportService', function($resource, ktApiVersion) {
        return $resource('/ajax/api/' + ktApiVersion + '/projects/:projectID/reports/:type/:subProjectID', {
            projectID: '@projectID',
            type: '@type',
            subProjectID: '@subProjectID'
        })
    }, {
        'get': {
            method: 'GET',
            cache: false
        }
    })

    // 借款人审批
    .factory('ktDebtorsService', function($resource, ktApiVersion) {
        return $resource('/ajax/api/' + ktApiVersion + '/projects/:projectID/debtors/:number', {
            projectID: '@projectID',
            number: '@number'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 借款人审批-规则
    .factory('ktRulesService', function($resource, ktApiVersion) {
        return $resource('/ajax/api/' + ktApiVersion + '/projects/:projectID/rules', {
            projectID: '@projectID',
        })
    }, {
        'get': {
            method: 'GET',
            cache: false
        }
    })

    // 借款人审批规则-黑名单
    .factory('ktBlacklistService', function($resource, ktApiVersion) {
        return $resource('/ajax/api/' + ktApiVersion + '/projects/:projectID/blacklist', {
            projectID: '@projectID',
        })
    }, {
        'get': {
            method: 'GET',
            cache: false
        }
    })

    // 放款计划
    .factory('ktLoanPlansService', function($resource, ktApiVersion) {
        return $resource('/ajax/api/' + ktApiVersion + '/projects/:projectID/loan_plans/:number/:content', {
            projectID: '@projectID',
            number: '@number',
            content: '@content'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 还款计划
    .factory('ktRepaymentsService', function($resource, ktApiVersion) {
        return $resource('/ajax/api/' + ktApiVersion + '/projects/:projectID/repayments/:number/:content', {
            projectID: '@projectID',
            number: '@number',
            content: '@content'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 财务管理-还款对账
    .factory('ktBillsService', function($resource, ktApiVersion) {
        return $resource('/ajax/api/' + ktApiVersion + '/projects/:projectID/bills/:billID', {
            projectID: '@projectID',
            billID: '@billID'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 财务管理-其他收入
    .factory('ktOtherIncomesService', function($resource, ktApiVersion) {
        return $resource('/ajax/api/' + ktApiVersion + '/projects/:projectID/other_incomes/:otherIncomeID', {
            projectID: '@projectID',
            otherIncomeID: '@otherIncomeID'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })
})();
