/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.lode')
        .factory('ktDataHelper', function() {
            return {
                getLoanPlanStatus: function(status) {
                    var sMap = {
                        'draft': '未开始',
                        'approved': '已通过',
                        'rejected': '已拒绝',
                        'planed': '已生成放款计划',
                        'finished': '已完成'
                    }
                    return sMap[status] || '未知状态'
                },
                filterStatus: function(arr) {
                    return function(item) {
                        return _.contains(arr || [], item.value)
                    }
                },
                filterStatusReverse: function(arr) {
                    return function(item) {
                        return !_.contains(arr || [], item.status)
                    }
                },
                getLoanStatusMap: function() {
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
                        name: '已生成放款计划',
                        value: 'planned'
                    }, {
                        name: '已拒绝',
                        value: 'rejected'
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
                            case 'done':
                            case 'normal':
                                return '<i class="glyphicon glyphicon-ok approved-color mr5"></i>' + st.name;
                            case 'rejected':
                                return '<i class="glyphicon glyphicon-remove rejected-color mr5"></i>' + st.name;
                            case 'ahead':
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
