/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.lode')
        .factory('ktDataHelper', function() {
            return {
                filterStatus: function(arr) { //filter:{fn}
                    return function(item) {
                        return _.includes(arr || [], item.value)
                    }
                },
                filterStatusReverse: function(arr) { //filter:{fn}
                    return function(item) {
                        return !_.includes(arr || [], item.status)
                    }
                },
                getPaymentStatusMap: function() { // 单个借款人的还款状态
                    return [{
                        name: '全部',
                        value: 'all'
                    }, {
                        name: '正常还款',
                        value: 'normal'
                    }, {
                        name: '提前还款',
                        value: 'advanced'
                    }, {
                        name: '逾期',
                        value: 'overdue'
                    }]
                },
                getStatementStatusMap: function() { // 每一期的账单状态
                    return [{
                        name: '全部',
                        value: 'all'
                    }, {
                        name: '未上传',
                        value: 'draft'
                    }, {
                        name: '已上传',
                        value: 'uploaded'
                    }, {
                        name: '已对账',
                        value: 'checked'
                    }]
                },
                getLoanStatusMap: function() { // 每一批次的借款放款状态
                    return [{
                        name: '全部',
                        value: 'all'
                    }, {
                        name: '未审核',
                        value: 'draft'
                    }, {
                        name: '已通过',
                        value: 'approved'
                    }, {
                        name: '已拒绝',
                        value: 'rejected'
                    }, {
                        name: '已生成放款计划',
                        value: 'planned'
                    }, {
                        name: '已下发指令',
                        value: 'issued'
                    }]
                },
                getBorrowersApprovalStatusMap: function() {
                    return [{
                        name: '全部',
                        value: 'all'
                    }, {
                        name: '未审核',
                        value: 'draft'
                    }, {
                        name: '已通过',
                        value: 'approved'
                    }, {
                        name: '已拒绝',
                        value: 'rejected'
                    }]
                },
                getBorrowersLoanStatusMap: function() { // 单个借款人的放款结果状态
                    return [{
                        name: '全部',
                        value: 'all'
                    }, {
                        name: '放款成功',
                        value: 'success'
                    }, {
                        name: '放款失败',
                        value: 'fail'
                    }]
                },
                getBillTypes: function() {
                    return [{
                        name: '当日系统还款',
                        value: 'system'
                    }, {
                        name: '当日其他渠道还款',
                        value: 'other'
                    }, {
                        name: '历史还款催收',
                        value: 'urged'
                    }]
                },
                getBillTypeFactory: function($scope) {
                    return function(type) {
                        var typeObj = _.find($scope.billTypes, function(v) {
                            return v.value === (type || $scope.params.type)
                        }) || {}
                        return typeObj.name || '未知状态'
                    }
                },
                getStatusNameNice: function($scope) {
                    return function(status) {
                        var st = _.find($scope.statusList, function(v) {
                            return v.value === (status || $scope.params.status)
                        }) || {}
                        switch (status) {
                            case 'draft':
                                return '<i class="glyphicon glyphicon-time initial-color mr5"></i>' + st.name;
                            case 'approved':
                            case 'planned':
                            case 'issued':
                            case 'normal':
                            case 'checked':
                            case 'success':
                                return '<i class="glyphicon glyphicon-ok approved-color mr5"></i>' + st.name;
                            case 'fail':
                            case 'rejected':
                                return '<i class="glyphicon glyphicon-remove rejected-color mr5"></i>' + st.name;
                            case 'advanced':
                            case 'uploaded':
                                return '<i class="glyphicon glyphicon-thumbs-up approved-color mr5"></i>' + st.name;
                            case 'overdue':
                                return '<i class="glyphicon glyphicon-thumbs-down warn-color mr5"></i>' + st.name;
                            default:
                                return '<i class="glyphicon glyphicon-question-sign warn-color mr5"></i>' + '未知';
                        }
                        // return st.name || '未知'
                    }
                },
                getSubProjectName: function($scope) {
                    return function(id) {
                        var subProject = _.find($scope.subProjects, function(v) {
                            return v.id === (id || $scope.params.subproject_id)
                        }) || {}
                        return $scope.params.subproject_id ? subProject.name : '全部'
                    }
                },
                getOwnFunds: function() {
                    return {
                        radioDataShowType: 'all', // all ,single
                        fieldNames: [
                            '自有资金投放额',
                            '累计成交金额',
                            '未收回自有资金投放额',
                            '逾期率',
                            '不良率',
                            '预期收益',
                            '总收益',
                            '已兑付收益',
                            '其他收入',
                            '浮动收益'
                        ],
                        fieldNameTips: ['资金来源为自有资金的项目的成交额', '', '资金来源为自有资金的项目的贷款余额', '0，180', '90，180', '约定收益率', '', '', '融资顾问费、评审费等', '']
                    }
                },
                getGuaranteeLoan: function() {
                    return {
                        radioDataShowType: 'all', // all ,single
                        fieldNames: [
                            '担保责任额',
                            '累计成交金额',
                            '担保责任余额',
                            '逾期率',
                            '不良率',
                            '总收益',
                            '担保费',
                            '其他收入',
                            '浮动收益'
                        ],
                        fieldNameTips: ['', '', '担保贷款项目的余额', '0，180', '90，180', '', '费率', '', '']
                    }
                }
            }

        })

})();
