;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktAssetRiskLayoutCtrl', function($scope, $state, $stateParams, $location, ktProjectsService, ktDateHelper) {
        $scope.shared = {}

        var params = $scope.shared.params = $.extend({
            filter: ''
        }, $location.search() || {})

        // 单独提出来的筛选条件，方便后面直接引用
        $scope.dateOptions = {
            field: 'date',
            field_type: 'date',
            name: '期限',
            options: [{
                name: '上月',
                // tip: '这是提示',
                value: ktDateHelper.getDate('lastMonth')
            }, {
                name: '近三月',
                value: ktDateHelper.getDate('last3Month')
            }, {
                name: '近六个月',
                value: ktDateHelper.getDate('last6Month')
            }, {
                name: '自定义',
                type: 'datepicker',
                onUpdate: function(value) {
                    this.name = this.value = value
                    $state.go($state.current.name, {
                        filter: $.param($.extend({}, $scope.shared.fParams, {
                            date: value,
                        }))
                    })
                },
                value: ''
            }],
            perform_type: 'options',
            option_type: 'object',
            no_discretized: true, // 区分离散化（主要是借款人清单页）的动态筛选
            unit: ''
        }

        $scope.shared.filters = [{
            field: 'dimension',
            field_type: 'string',
            name: '维度',
            options: [],
            perform_type: 'options',
            option_type: 'object', // object类型的避开重新组建options内容
            no_discretized: true, // 区分离散化（主要是借款人清单页）的动态筛选
            unit: ''
        }, {
            field: 'risk_index',
            field_type: 'string',
            name: '指标',
            options: [{
                name: 'C-M1',
                value: 'C-M1'
            }, {
                name: 'M1-C',
                value: 'M1-C'
            }, {
                name: '逾期率',
                value: 'ovd_rate'
            }, {
                name: '不良率',
                value: 'np_rate'
            }],
            perform_type: 'options',
            option_type: 'object',
            no_discretized: true, // 区分离散化（主要是借款人清单页）的动态筛选
            unit: ''
        }, $scope.dateOptions]

        // $scope.shared.filters.hideFParams = false // true 可以隐藏已选条件

        $scope.shared.filters.cannotDelete = true // 已选条件不显示清除功能

        //获取维度列表
        ktProjectsService.get($.extend({
            projectID: $stateParams.projectID,
            subContent: 'discretized_dimensions'
        }, params), function(data) {

            // 维度条件是异步获取后初始化
            var dimensionFilter = _.find($scope.shared.filters, { field: 'dimension' })
                //data.dimensions 是后天获取的
            dimensionFilter.options = _.map(data.dimensions, function(v) {
                return {
                    name: v.name,
                    value: v.key,
                    description: v.description
                }
            })

            $scope.$broadcast('filterReady')

        })
    })

    .controller('ktAssetRiskCtrl', function($scope, $timeout, $rootScope, $location, $stateParams, ktProjectsService, ktProjectStaticsReportService, ktDataHelper, ktDateHelper) {
        var search = $location.search()
        var params = $scope.shared.params
        var filters = $scope.shared.filters
        $.extend(params, search)
        ktDataHelper.pruneDirtyParams(params, search, ['filter'])

        function updateFParams() {
            // 更新显示的已选条件
            if ($scope.shared.updateFilterFParams) {
                ktDataHelper.filterInit(filters)($scope.shared.fParams)
                $scope.shared.updateFilterFParams()
            }
        }

        $scope.$on('filterReady', function() {

            if (!$scope.shared.fParams.dimension) {
                var d = _.find(filters, function(v) {
                    return v.field === 'dimension'
                })
                $scope.shared.fParams.dimension = d.options[0].value
            }

            updateFParams()
        })


        // 从filter内提取的真实的参数
        $scope.shared.fParams = $.extend({
            dimension: (function() {
                var o = _.find(filters, function(v) {
                    return v.field === 'dimension'
                }).options[0] || {}
                return o.value || null
            })(),
            risk_index: 'ovd_rate',
            date: ktDateHelper.getDate('last6Month')
        }, ktDataHelper.cutDirtyParams(ktDataHelper.decodeParams(params, ['filter'])))

        $scope.riskIndexName = function() {
            return $scope.shared.filterFParams ? _.find($scope.shared.filterFParams, { value: 'risk_index' }).name : ''

        }

        $scope.dimensionName = function() {
            return $scope.shared.filterFParams ? _.find($scope.shared.filterFParams, { value: 'dimension' }).name : ''

        }

        // 看是否匹配固定的值，否则是自定义日期
        var initDate = _.find($scope.dateOptions.options, function(v) {
            return $scope.shared.fParams.date === v.value
        })

        var customDate = _.last($scope.dateOptions.options)
        if (!initDate) {
            customDate.value = customDate.name = $scope.shared.fParams.date
        } else if (initDate.type !== 'datepicker') {
            customDate.value = customDate.name = ''
        }

        updateFParams()

        $scope.assetRiskChart = {
            radioDataShowType: 'chart',
            chartOptions: {}
        }

        var chartOptions = {
            tooltip: {
                axisPointer: {
                    type: 'line',
                },
                yAxisFormat: 'percent' //自定义属性，tooltip标示，决定是否显示百分比数值
            }
        }

        function getData() {
            var ajaxParams = _.cloneDeep($scope.shared.fParams)
            var dates = ajaxParams.date.split('~')
            ajaxParams.start_date = dates[0]
            ajaxParams.end_date = dates[1]
            delete ajaxParams.date

            //画图表取得数据
            ktProjectStaticsReportService.get($.extend({
                projectID: $stateParams.projectID,
                type: 'asset',
                dimention: 'risk'
            }, ajaxParams), function(data) {
                $scope.data = data
                $scope.assetRiskChart.chartOptions = $.extend(true, {}, chartOptions, {
                    legend: {
                        data: _.map(data.trends, 'name')
                    },
                    xAxis: {
                        type: 'category',
                        data: data.dates,
                    },
                    yAxis: {
                        name: '百分比(%)'
                    },

                    series: _.map(data.trends, function(v) {
                        v.type = 'line'
                        return v
                    })
                })
            })
        }

        // 初始加载数据
        getData()
    })
})();
