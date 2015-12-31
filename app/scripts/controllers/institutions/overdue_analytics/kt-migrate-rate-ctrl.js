;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktOverdueAnalyticsMigrateRateCtrl', function($scope, $location, $stateParams, ktReportService, ktDateHelper) {

            $scope.$emit('activeInstitutionChange', {
                projectID: $stateParams.projectID
            })

            var params = $location.search() || {}

            ktDateHelper.initPeriod($scope, params)

            // $scope.radioPeriod = 'lastMonth'
            // $scope.radioPeriodCustom = 'custom'
            $scope.migrateRateChart = {
                cm1: true,
                m1m2: true,
                m2m3: true,
                m3m4: true,
                m4m5: true,
                m5m6: true,
                radioDataShowType: 'chart',
                chartDimension: '逾期率'
            }

            var chartOptions = {
                tooltip: {
                    axisPointer: {
                        type: 'line',
                    },
                    valueType: 'percent' //自定义属性，tooltip标示，决定是否显示百分比数值
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

            function getData() {
                var dateFrom
                var dateTo
                var datePeriod
                datePeriod = $scope.radioPeriod
                datePeriod = datePeriod.split('~')
                dateFrom = datePeriod[0]
                dateTo = datePeriod[1]

                ktReportService.get($.extend({
                    projectID: $stateParams.projectID,
                    type: 'migrate_rate',
                    date_from: dateFrom,
                    date_to: dateTo
                }, params), function(data) {
                    $scope.data = data

                    $scope.migrateRateChart.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.pluck(data.migration_trends, 'name')
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
