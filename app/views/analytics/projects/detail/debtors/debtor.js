;
(function() {
    'use strict';
    angular.module('kt.lode')

    .filter('filterByFormat', function($filter) {
        return function(val, format) {
            var ret = val
            switch (format) {
                case 'date':
                    ret = $filter('date')(val, 'yyyy-MM-dd')
                    break
                case 'percent':
                    ret = $filter('ktNumber')(val, 2, 'percent')
                    break
                case 'currency':
                    ret = $filter('ktNumberLocate')(val)
                    break
                default:
                    ret = val || '-'
            }
            return ret
        }
    })

    .controller('ktDebtorCtrl', function($scope, $location, $state, $stateParams, ktProjectsService) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })

        $scope.shared = {}
        $scope.shared.filters = []
        $scope.shared.search_filters = []
        var params = $scope.shared.params = { // ajax 需要的参数
            page: 1,
            per_page: 10
        }

        var _params = $scope.shared._params = { // ajax不需要的参数
            maxSize: 10,
            totalItems: 10,
            // subContent: 'borrowers',
            // projectID: $stateParams.projectID
        }

        // 过滤掉from_和to_开头的参数，这两个类型的只是传给后端的值
        $scope.shared.filterFParams = function() {
            return _.pickBy($scope.shared.fParams, function(value, key) {
                return !key.startsWith('from_') && !key.startsWith('to_')
            })
        }

        $scope.beginSearch = function (field, value) {
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
                if (type === 'custom') {
                    if ($scope.shared.filters.validateByField(field)) {
                        var vArr = value.split('-')
                        var filter = $scope.shared.filters.getByField(field)
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
            }

            $state.go($state.current.name, { filter: $.param($.extend({}, $scope.shared.fParams, p)) })
        }

        // 删除已选条件
        $scope.delFParams = function(field) {
            var fParams = $scope.shared.fParams
            delete fParams[field]
            if (field.indexOf('custom_for_show_') > -1) { // 如果是自定义的筛选项
                var realField = field.split('_')[3]
                delete fParams['from_' + realField]
                delete fParams['to_' + realField]
            }

            $scope.goTo()
        }

        // filter 参数的长度
        $scope.getFParamsLength = function() {
            return _.keys($scope.shared.fParams).length
        }

        ktProjectsService.get($.extend({}, _params, params, {
            subContent: 'filters',
            projectID: $stateParams.projectID
        }), function(data) {
            $scope.shared.filters = data.filters
                // $scope.shared.search_filters = data.search_filters
            $scope.$broadcast('filtersReady')
        })
    })

    .controller('ktDebtorTableCtrl', function($scope, $location, $stateParams, ktProjectsService, ktDataHelper) {
        var search = $location.search()
        var params = $scope.shared.params
        var _params = $scope.shared._params
        var filters = $scope.shared.filters
        $.extend(params, search)
        ktDataHelper.pruneDirtyParams(params, search, ['filter'])

        var fParams = $scope.shared.fParams = ktDataHelper.cutDirtyParams(ktDataHelper.decodeParams(params, ['filter']))

        if (filters.length) {
            ktDataHelper.filterInit(filters)(fParams)
        } else {
            $scope.$on('filtersReady', function() {
                ktDataHelper.filterInit($scope.shared.filters)(fParams)
            })
        }

        $scope.getFormat = function(index) {
            return $scope.fields[index].format
        }

        // $scope.getEducationName = ktDataHelper.getEducationName

        ktProjectsService.get($.extend({
            subContent: 'borrowers',
            projectID: $stateParams.projectID
        }, params, fParams), function(data) {
            $scope.borrowers = data.borrowers
            $scope.fields = data.fields
            _params.totalItems = data.total_items;

            $scope.shared.pageChanged = function() {
                $location.search('page', params.page)
            }
        })
    })
})();
