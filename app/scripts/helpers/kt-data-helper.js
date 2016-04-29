/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.lode')
        .factory('ktDataHelper', function() {
            var educationList = [{
                name: '博士',
                index: 0,
                value: 'doctor'
            }, {
                name: '硕士',
                index: 1,
                value: 'postgraduate'
            }, {
                name: '本科',
                index: 2,
                value: 'bachelor'
            }, {
                name: '大专',
                index: 3,
                value: 'junior_college'
            }, {
                name: '高中及以下',
                index: 4,
                value: 'high_school'
            }]

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
                getEducationMap: function() {
                    return educationList
                },
                getEducationName: function(value) {
                    var ed = _.find(educationList, function(v) {
                        return v.value === value
                    }) || {}
                    return ed.name || '-'
                },
                getProjectStatusMap: function() {
                    return [{
                        name: '全部',
                        value: 'all'
                    }, {
                        name: '进行中',
                        value: 'ongoing'
                    }, {
                        name: '已结束',
                        value: 'finished'
                    }]
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
                getStatByProject: function() {
                    return {
                        radioDataShowType: 'all', // all ,single
                        fieldNames: [{
                            name: '项目名称',
                            tip: ''
                        }, {
                            name: '累计成交额',
                            tip: ''
                        }, {
                            name: '累计成交笔数',
                            tip: ''
                        }, {
                            name: '累计借款人数',
                            tip: ''
                        }, {
                            name: '逾期率',
                            tip: '0，180'
                        }, {
                            name: '不良率',
                            tip: '90，180'
                        }]
                    }
                }
            }

        })

})();
