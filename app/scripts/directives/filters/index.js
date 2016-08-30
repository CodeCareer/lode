;
(function() {
    angular.module('kt.lode')

    .directive('ktFilterBox', function($state) {
        return {
            restrict: 'AE',
            scope: {
                shared: '=',
                specialClass: '@',
            },
            templateUrl: 'scripts/directives/filters/index.html',
            link: function($scope) {
                $scope.beginSearch = function(field, value) {
                    $scope.goTo(field, value, 'search')
                }

                // 筛选条件跳转
                $scope.goTo = function(field, value, type) {
                    var p = {}
                    var dscrdField = 'discretized_' + field // 自定义的条件field 值不同
                    var fromField = 'from_' + field
                    var toField = 'to_' + field
                    var customField = 'custom_for_show_' + field
                    if (field) {
                        var filter = $scope.shared.filters.getByField(field)

                        if (!filter.no_discretized) {
                            if (type === 'custom') {
                                if ($scope.shared.filters.validateByField(field)) {
                                    var vArr = value.split('-')
                                    delete $scope.shared.fParams[dscrdField]
                                    p[fromField] = vArr[0] || null
                                    p[toField] = vArr[1] || null
                                    p[customField] = value + filter.unit
                                } else {
                                    return
                                }
                            } else if (type === 'search') {
                                if ($scope.shared.filters.validateByField(field)) {
                                    p[field] = value
                                } else {
                                    return
                                }
                            } else {
                                delete $scope.shared.fParams[fromField]
                                delete $scope.shared.fParams[toField]
                                delete $scope.shared.fParams[customField]
                                p[dscrdField] = value
                            }
                        } else {
                            // if (filter.perform_type === 'options') {
                            delete $scope.shared.fParams[filter.field]
                            p[filter.field] = value
                                // }
                        }
                    }

                    $state.go($state.current.name, { filter: $.param($.extend({}, $scope.shared.fParams, p)) })
                }

                // 删除已选条件
                $scope.delFParams = function(field) {
                    var fParams = $scope.shared.fParams
                    delete fParams[field]
                    if (field.indexOf('custom_for_show_') > -1) { // 如果是自定义的筛选项
                        var realField = field.replace('custom_for_show_', '')
                        delete fParams['from_' + realField]
                        delete fParams['to_' + realField]
                    }

                    $scope.goTo()
                }

                $scope.resetFParams = function() {
                    $scope.shared.fParams = {}
                    $scope.shared.filterFParams = []
                    $scope.goTo()
                }

                // filter 参数的长度
                $scope.getFParamsLength = function() {
                    return _.keys($scope.shared.fParams).length
                }

                // 更新展示的选择条件，过滤掉from_和to_开头的参数，这两个类型的只是传给后端的值
                $scope.shared.updateFilterFParams = function() {
                    var orderByList = _.map($scope.shared.filters, 'field')
                    var f = _.pickBy($scope.shared.fParams, function(value, key) {
                        return !key.startsWith('from_') && !key.startsWith('to_')
                    })

                    // 转换成数组方便排序
                    f = _.map(f, function(value, key) {
                        return {
                            index: _.indexOf(orderByList, key.replace(/custom_for_show_|discretized_/g, '')),
                            value: key,
                            name: (function() {
                                var filter = _.find($scope.shared.filters, { field: key })
                                if (filter && filter.perform_type === 'options') {
                                    var option = _.find(filter.options, { value: value }) || {}
                                    return option.name || '未知'
                                }

                                return value
                            })()
                        }
                    })

                    $scope.shared.filterFParams = f.sort(function(a, b) {
                        /*eslint-disable*/
                        return (a.index > b.index) ? 1 : ((a.index < b.index) ? -1 : 0)
                            /*eslint-enable*/
                    })
                }

                $scope.$emit('filterInitDone')

            }
        }
    })
})();
