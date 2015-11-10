;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktOverdueAnalyticsOverdueRateCtrl', function($scope, $location, $stateParams, ktReportService, ktDateHelper) {

            $scope.$emit('activeInstitutionChange', {
                id: $stateParams.id
            })

            var params = $location.search() || {}

            ktDateHelper.initPeriod($scope, params)

            // $scope.radioPeriod = 'lastMonth'
            // $scope.radioPeriodCustom = 'custom'
            $scope.data = {}

            $scope.overdueRateChart = {
                overdueTab: true,
                badTab: true,
                radioDataShowType: 'chart',
                chartOptions: {}
            }

            /*$scope.$watchGroup(['overdueRateChart.overdueTab', 'overdueRateChart.badTab'],
                function(newValue, oldValue) {
                    _.each(newValue, function(v, i) {
                        if (v !== oldValue[i]) {
                            // $scope.overdueRateChart.chartOptions.legend.selected[overdueTabs[i]] = v
                            $scope.$broadcast('overdueRateChart.change', [overdueTabs[i], v])
                        }
                    })
                })*/

            $scope.overdueRateProductChart = {
                radioDataShowType: 'chart',
                chartDimension: '逾期率',
                chartOptions: {}
            }

            $scope.overdueRateLocationChart = {
                radioDataShowType: 'table',
                chartDimension: '逾期率',
                chartOptions: {}
            }

            var chartOptions = {
                tooltip: {
                    axisPointer: {
                        type: 'line',
                    },
                    percentValue: true //自定义属性，tooltip标示，决定是否显示百分比数值
                },
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: function(value) {
                            return (value * 100).toFixed(0) + '%'
                        }
                    }
                }]
            }

            $scope.$watch('radioPeriod', function(newValue, oldvalue) {
                if (newValue !== oldvalue && newValue !== 'custom') {
                    var dates = newValue.split('~')
                    $location.search($.extend(params, {
                        date_from: dates[0] || null,
                        date_to: dates[1] || null
                    }))

                    // getData()
                }
            })

            $scope.$watch('overdueRateProductChart.chartDimension', function(newValue, oldValue, scope) {
                if (newValue !== oldValue) {
                    updateProductView()
                }
            });

            function updateProductView() {
                var data = $scope.data

                if ($scope.overdueRateProductChart.chartDimension === '逾期率') {
                    data.products = data.products_overdue
                } else if ($scope.overdueRateProductChart.chartDimension === '不良率') {
                    data.products = data.products_bad
                }

                $scope.overdueRateProductChart.chartOptions = $.extend(true, {}, chartOptions, {
                    legend: {
                        data: _.pluck(data.products, 'name')
                    },
                    xAxis: [{
                        type: 'category',
                        data: data.dates
                    }],

                    series: _.map(data.products, function(v) {
                        v.type = 'line'
                        return v
                    })
                })
            }

            $scope.$watch('overdueRateLocationChart.chartDimension', function(newValue, oldValue, scope) {
                if (newValue !== oldValue) {
                    updateLocationView()
                }
            });
            
            function updateLocationView() {
                var data = $scope.data

                if ($scope.overdueRateLocationChart.chartDimension === '逾期率') {
                    data.locations = data.locations_overdue
                } else if ($scope.overdueRateLocationChart.chartDimension === '不良率') {
                    data.locations = data.locations_bad
                }

                // 逾期率地理位置图表
                /*$scope.overdueRateLocationChart.chartOptions = $.extend(true, {}, chartOptions, {
                    legend: {
                        data: _.pluck(data.locations, 'name')
                    },
                    xAxis: [{
                        type: 'category',
                        data: data.dates
                    }],

                    series: _.map(data.locations, function(v) {
                        v.type = 'line'
                        return v
                    })
                })*/
            }

            function getData() {
                var date_from, date_to, datePeriod
                datePeriod = $scope.radioPeriod
                datePeriod = datePeriod.split('~')
                date_from = datePeriod[0]
                date_to = datePeriod[1]

                ktReportService.get($.extend({
                    id: $stateParams.id,
                    type: 'overdue_rate',
                    date_from: date_from,
                    date_to: date_to
                }, params), function(data) {
                    $scope.data = data

                    // 逾期率趋势图表
                    $scope.overdueRateChart.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.pluck(data.overdue_trends, 'name')
                        },
                        xAxis: [{
                            type: 'category',
                            data: data.dates
                        }],

                        series: _.map(data.overdue_trends, function(v) {
                            v.type = 'line'
                            return v
                        })
                    })

                    updateProductView() // 更新产品类型
                    updateLocationView() // 更新地理位置

                })
            }

            // 初始加载数据
            getData()

        })
})();
