;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktOverdueCtrl', function($scope, $location, $stateParams, ktProjectStaticsReportService, ktDateHelper) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            var params = $location.search() || {}

            ktDateHelper.initPeriod($scope, params)

            // $scope.radioPeriod = 'lastMonth'
            // $scope.radioPeriodCustom = 'custom'
            $scope.data = {}
            $scope.$watch('radioPeriod', function(newValue, oldvalue) {
                if (newValue !== oldvalue && newValue !== 'custom') {
                    var dates = newValue.split('~')
                    $location.search($.extend(params, {
                        start_date: dates[0] || null,
                        end_date: dates[1] || null
                    }))

                    // getData()
                }
            })

            $scope.overdueRateChart = {
                overdueTab: true,
                badTab: true,
                radioDataShowType: 'table',
                chartOptions: {}
            }

            $scope.migrateRateChart = {
                cm1: true,
                m1m2: true,
                m2m3: true,
                m3m4: true,
                m4m5: true,
                m5m6: true,
                radioDataShowType: 'table',
                chartDimension: '逾期率',
                chartOptions: {}
            }


            var chartOptions = {
                tooltip: {
                    axisPointer: {
                        type: 'line',
                    },
                    yAxisFormat: 'percent' //自定义属性，tooltip标示，决定是否显示百分比数值
                },
                /*yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: function(value) {
                            return (value * 100).toFixed(0) + '%'
                        }
                    }
                }]*/
            }

            function getData() {
                var startDate
                var endDate
                var datePeriod
                datePeriod = $scope.radioPeriod
                datePeriod = datePeriod.split('~')
                startDate = datePeriod[0]
                endDate = datePeriod[1]

                ktProjectStaticsReportService.get($.extend({
                    projectID: $stateParams.projectID,
                    type: 'overdue',
                    start_date: startDate,
                    end_date: endDate
                }, params), function(data) {
                    $scope.data = data

                    // 逾期率趋势图表
                    $scope.overdueRateChart.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.map(data.overdue_trends, 'name')
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

                    $scope.migrateRateChart.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.map(data.migration_trends, 'name')
                        },
                        xAxis: [{
                            type: 'category',
                            data: data.dates
                        }],

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
