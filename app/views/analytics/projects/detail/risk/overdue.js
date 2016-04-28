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

            $scope.data = {}
            $scope.$watch('radioPeriod', function(newValue, oldvalue) {
                if (newValue !== oldvalue && newValue !== 'custom') {
                    var dates = newValue.split('~')
                    $location.search($.extend(params, {
                        start_date: dates[0] || null,
                        end_date: dates[1] || null
                    }))
                }
            })

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
                    axisPointer: {
                        type: 'line',
                    },
                    yAxisFormat: 'percent' //自定义属性，tooltip标示，决定是否显示百分比数值
                }
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
                    type: 'trends',
                    dimention: 'risk',
                    start_date: startDate,
                    end_date: endDate
                }, params), function(data) {
                    $scope.data = data

                    // 逾期率趋势图表
                    $scope.overdueRateChart.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.map(data.overdue_trends, 'name')
                        },
                        xAxis: {
                            type: 'category',
                            data: data.dates
                        },

                        series: _.map(data.overdue_trends, function(v) {
                            v.type = 'line'
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
