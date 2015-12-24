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
                        'initial': '未开始',
                        'approved': '已通过',
                        'rejected': '已拒绝',
                        'done': '已完成'
                    }
                    return sMap[status] || '未知状态'
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
                            case 'initial':
                                return '<i class="glyphicon glyphicon-time initial-color mr5"></i>' + st.name;
                            case 'approved': 
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
                }
            }

        })

})();
