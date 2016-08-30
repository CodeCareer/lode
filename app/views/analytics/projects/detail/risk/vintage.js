;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktVintageLayoutCtrl', function($scope, $state, $stateParams, $location) {
        $scope.shared = {}

        $scope.shared.params = $.extend({
            filter: ''
        }, $location.search() || {})

        // 单独提出来的筛选条件，方便后面直接引用
        $scope.dateOptions = {
            field: 'date',
            field_type: 'date',
            name: 'Vintage',
            options: [
                // {
                //     name: '上月',
                //     // tip: '这是提示',
                //     value: ktDateHelper.getDate('lastMonth')
                // }, {
                //     name: '近三月',
                //     value: ktDateHelper.getDate('last3Month')
                // }, {
                //     name: '近六个月',
                //     value: ktDateHelper.getDate('last6Month')
                // },
                {
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
                }
            ],
            perform_type: 'options',
            option_type: 'object',
            no_discretized: true, // 区分离散化（主要是借款人清单页）的动态筛选
            unit: ''
        }

        $scope.shared.filters = [{
            field: 'vintage_index',
            field_type: 'string',
            name: '指标',
            options: [{
                name: 'C',
                value: 'C'
            }, {
                name: 'M1',
                value: 'M1'
            }, {
                name: 'M2',
                value: 'M2'
            }, {
                name: 'M3',
                value: 'M3'
            }, {
                name: 'C-M1',
                value: 'C-M1'
            }, {
                name: 'M1-C',
                value: 'M1-C'
            }, {
                name: 'M1-M2',
                value: 'M1-M2'
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

    })

    .controller('ktVintageCtrl', function($scope, $rootScope, $location, $stateParams, ktProjectsService, ktProjectStaticsReportService, ktDataHelper) {
        var search = $location.search()
        var params = $scope.shared.params
        var filters = $scope.shared.filters
        $.extend(params, search)
        ktDataHelper.pruneDirtyParams(params, search, ['filter'])

        $scope.$on('filterReady', function() {

            // if (!$scope.shared.fParams.dimension) {
            //     var d = _.find(filters, function(v) {
            //         return v.field === 'dimension'
            //     })
            //     $scope.shared.fParams.dimension = d.options[0].value
            // }
        })

        // 从filter内提取的真实的参数
        $scope.shared.fParams = $.extend({
            vintage_index: 'ovd_rate',
            date: ''
        }, ktDataHelper.cutDirtyParams(ktDataHelper.decodeParams(params, ['filter'])))

        // 维度名称更新
        // var dimensionFilter = _.find($scope.shared.filters, { field: 'dimension' })
        // var riskFilter = _.find($scope.shared.filters, { field: 'vintage_index' })
        // vintage_indexs.activeName()
        $scope.vintageIndexName = function() {
            return $scope.shared.filterFParams ? _.find($scope.shared.filterFParams, { value: 'vintage_index' }).name : ''
                // var dimension = _.find(dimensionFilter.options, { value: $scope.shared.fParams.dimension }) || dimensionFilter.options[0]
                // return dimension.name || '未知'
        }

        $scope.vintageChart = {
            radioDataShowType: 'table',
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
            ajaxParams.vintage_start_date = dates[0] || null
            ajaxParams.vintage_end_date = dates[1] || null

            delete ajaxParams.date

            ktProjectStaticsReportService.get($.extend({
                projectID: $stateParams.projectID,
                type: 'vintages',
                dimention: 'risk',
                vintage_start_date: ajaxParams.vintage_start_date,
                vintage_end_date: ajaxParams.vintage_end_date
            }, ajaxParams), function(data) {
                $scope.data = data

                $scope.shared.fParams.date = data.params.vintage_start_date + '~' + data.params.vintage_end_date

                // 看是否匹配固定的值，否则是自定义日期
                var initDate = _.find($scope.dateOptions.options, function(v) {
                    return $scope.shared.fParams.date === v.value
                })

                if (!initDate) {
                    var customDate = _.last($scope.dateOptions.options)
                    customDate.value = customDate.name = $scope.shared.fParams.date
                }

                // 更新显示的已选条件
                if ($scope.shared.updateFilterFParams) {
                    ktDataHelper.filterInit(filters)($scope.shared.fParams)
                    $scope.shared.updateFilterFParams()
                } else {
                    $rootScope.$on('filterInitDone', function() {
                        ktDataHelper.filterInit(filters)($scope.shared.fParams)
                        $scope.shared.updateFilterFParams()
                    })
                }

                $scope.vintageChart.chartOptions = $.extend(true, {}, chartOptions, {
                    legend: {
                        data: _.map(data.trends, 'name')
                    },
                    xAxis: {
                        type: 'category',
                        data: data.dates
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
