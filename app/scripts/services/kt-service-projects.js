/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.lode')

    // 项目
    .factory('ktProjectsService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/projects/:projectID/:subContent', {
            projectID: '@projectID',
            subContent: '@subContent',
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 子项目
    .factory('ktSubProjectsService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/subprojects/:subProjectID', {
            subProjectID: '@subProjectID'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 机构
    .factory('ktInstitutionsService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/:projectType/:projectID/institutions/:instID', {
            projectType: '@projectType',
            projectID: '@projectID',
            instID: '@instID'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 账户
    .factory('ktAccountsService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/:projectType/:projectID/accounts', {
            projectType: '@projectType',
            projectID: '@projectID',
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 通道
    .factory('ktChannelsService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/:projectType/:projectID/channels', {
            projectType: '@projectType',
            projectID: '@projectID',
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })


    // 统计-按项目
    .factory('ktProjectsReportService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/projects/:projectID/:type/', {
            projectID: '@projectID',
            type: '@type',
            subProjectID: '@subProjectID',
            instID: '@instID'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 全部项目统计
    .factory('ktStaticsReportService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/statistics/:type/', {
            projectID: '@projectID',
            type: '@type',
            subProjectID: '@subProjectID',
            instID: '@instID'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 单个项目统计
    .factory('ktProjectStaticsReportService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/statistics/projects/:projectID/:type/', {
            projectID: '@projectID',
            type: '@type',
            subProjectID: '@subProjectID',
            instID: '@instID'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })


    /*// 统计-按机构
    .factory('ktInstitutionsReportService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/institutions/:instID/:type', {
            instID: '@instID',
            type: '@type'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })*/

    // 统计总览
    /*.factory('ktReportOverviewService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/projects/:projectID/:type', {
            projectID: '@projectID',
            type: '@type'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })*/

    // 借款人审批
    .factory('ktDebtorsService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/:projectType/:projectID/:loanType/:batchNo', {
            projectType: '@projectType',
            loanType: '@loanType',
            projectID: '@projectID',
            batchNo: '@batchNo'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 借款人审批
    .factory('ktApprovalsService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/approvals/:batchNo', {
            // projectID: '@projectID',
            batchNo: '@batchNo'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 借款人审批-助贷机构
    /*.factory('ktSubDebtorsService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/:projectType/:subProjectID/:loanType/:batchNo', {
            projectType: '@projectType',
            subProjectID: '@subProjectID',
            loanType: '@loanType',
            batchNo: '@batchNo'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })*/

    // 借款人批次上传
    .factory('ktLoanBatchesUpload', function($urlMatcherFactory, Upload, ktApiVersion) {
        return function upload(data) {
            var url = $urlMatcherFactory.compile('/ajax/' + ktApiVersion + '/subprojects/:subProjectID/loan_batches/upload').format(data)
            return Upload.upload({
                url: url,
                data: data || {}
            })
        }
    })

    // 借款人批次上传
    .factory('ktStatementsUpload', function($urlMatcherFactory, Upload, ktApiVersion) {
        return function upload(data) {
            var url = $urlMatcherFactory.compile('/ajax/' + ktApiVersion + '/statements/:statementID/upload').format(data)

            return Upload.upload({
                url: url,
                data: data || {}
            })
        }
    })

    // 借款人审批-规则
    .factory('ktRulesService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/projects/:projectID/rules/:ruleID', {
            projectID: '@projectID',
            ruleID: '@ruleID'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 借款人审批规则-黑名单
    .factory('ktBlacklistService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/projects/:projectID/blacklist', {
            projectID: '@projectID',
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 项目-放款计划
    .factory('ktLoanPlansService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/:projectType/:projectID/loan_plans/:batchNo/:content', {
            projectType: '@projectType',
            projectID: '@projectID',
            batchNo: '@batchNo',
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
        return $resource('/ajax/' + ktApiVersion + '/:projectType/:projectID/repayments/:batchNo/:content', {
            projectType: '@projectType',
            projectID: '@projectID',
            batchNo: '@batchNo',
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
        return $resource('/ajax/' + ktApiVersion + '/:projectType/:projectID/statements/:billID/:content', {
            projectType: '@projectType',
            projectID: '@projectID',
            content: '@content',
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
        return $resource('/ajax/' + ktApiVersion + '/projects/:projectID/other_incomes/:otherIncomeID', {
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
