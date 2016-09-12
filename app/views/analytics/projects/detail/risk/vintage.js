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
            options: [{
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

        // 从filter内提取的真实的参数
        $scope.shared.fParams = $.extend({
            vintage_index: 'ovd_rate',
            date: ''
        }, ktDataHelper.cutDirtyParams(ktDataHelper.decodeParams(params, ['filter'])))

        $scope.vintageIndexName = function() {
            return $scope.shared.filterFParams ? _.find($scope.shared.filterFParams, { value: 'vintage_index' }).name : ''

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
            ajaxParams.vintage_start_date1 = dates[0] || null
            ajaxParams.vintage_end_date1 = dates[1] || null

            delete ajaxParams.date

            ktProjectStaticsReportService.get($.extend({
                projectID: $stateParams.projectID,
                type: 'vintages',
                dimention: 'risk',
                vintage_start_date: ajaxParams.vintage_start_date1,
                vintage_end_date: ajaxParams.vintage_end_date1
            }, ajaxParams), function(data) {
                $scope.data = data

                $scope.shared.fParams.date = data.params.vintage_start_date + '~' + data.params.vintage_end_date

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
