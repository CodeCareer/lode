;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktOverdueLayoutCtrl', function($scope, $state, $stateParams, $location, ktProjectsService, ktDateHelper) {
        $scope.shared = {}

        $scope.shared.params = $.extend({
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

        $scope.shared.filters = [$scope.dateOptions]

        $scope.shared.filters.hideFParams = true // true 可以隐藏已选条件

        $scope.shared.filters.cannotDelete = true // 已选条件不显示清除功能

    })

    .controller('ktOverdueCtrl', function($scope, $rootScope, $location, $stateParams, ktProjectsService, ktProjectStaticsReportService, ktDataHelper, ktDateHelper) {
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
            date: ktDateHelper.getDate('last6Month')
        }, ktDataHelper.cutDirtyParams(ktDataHelper.decodeParams(params, ['filter'])))


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


        $scope.overdueRateChart = {
            overdueTab: true,
            badTab: true,
            radioDataShowType: 'table',
            chartOptions: {}
        }

        $scope.migrateRateChart = {
            legend: [],
            radioDataShowType: 'table',
            chartDimension: '逾期率',
            chartOptions: {}
        }


        var chartOptions = {
            tooltip: {
                // reverse: true,
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
                type: 'trends',
                dimention: 'risk',
                // start_date: startDate,
                // end_date: endDate
            }, ajaxParams), function(data) {
                $scope.data = data
                    //filter overdue_trends
                    /*    var overdueTrends = data.overdue_trends.reverse().filter(function(v) {
                            return !_.includes(['逾期率', '不良率'], v.name)
                        })*/

                // 逾期率趋势图表
                $scope.overdueRateChart.chartOptions = $.extend(true, {}, chartOptions, {
                    legend: {
                        data: _.map(data.overdue_trends.reverse().filter(function(v) {
                            return !_.includes(['逾期率', '不良率'], v.name)
                        }), 'name')
                    },

                    xAxis: {
                        type: 'category',
                        data: data.dates
                    },

                    series: _.map(data.overdue_trends.reverse().filter(function(v) {
                        return !_.includes(['逾期率', '不良率'], v.name)
                    }), function(v) {
                        v.type = 'line'
                        v.stack = 'stack'
                            // v.stack = 'bar'
                        v.smooth = true
                        v.itemStyle = { normal: { areaStyle: { type: 'default' } } }
                        return v
                    })
                })

                $scope.migrateRateChart.legend = _.chain(data.migration_trends).map(function(v) {
                    return {
                        name: v.name,
                        value: true
                    }
                }).value()

                $scope.migrateRateChart.chartOptions = $.extend(true, {}, chartOptions, {
                    legend: {
                        data: _.map(data.migration_trends, 'name')
                    },
                    xAxis: {
                        type: 'category',
                        data: data.dates
                    },
                    series: _.map(data.migration_trends, function(v) {
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
