;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktInstitutionDashboardCtrl', function($scope, $location, $stateParams, ktReportService, ktDateHelper) {

            $scope.$emit('activeInstitutionChange', {
                id: $stateParams.id
            })

            var params = $location.search() || {}

            ktDateHelper.initPeriod($scope, params)

            // $scope.radioPeriod = 'lastMonth'
            // $scope.radioPeriodCustom = 'custom'

            $scope.totalTrendsChart = {
                radioDataShowType: 'chart',
                chartOptions: {}
            }

            $scope.incrementTrendsChart = {
                radioDataShowType: 'chart',
                chartOptions: {}
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

            var chartOptions = {
                tooltip: {
                    valueType: 'rmb'
                }
            }

            function getData() {
                var date_from, date_to, datePeriod
                datePeriod = $scope.radioPeriod
                datePeriod = datePeriod.split('~')
                date_from = datePeriod[0] || null
                date_to = datePeriod[1]

                ktReportService.get($.extend({
                    id: $stateParams.id,
                    type: 'total',
                    date_from: date_from,
                    date_to: date_to
                }, params), function(data) {
                    
                    data = ktDateHelper.adapterInstitutionDashboard(data)
                    $scope.data = data

                    $scope.totalTrendsChart.chartOptions = $.extend(true, {}, chartOptions, {

                        legend: {
                            data: _.filter(_.pluck(data.total_trends, 'name'), function(v) {
                                return v.indexOf('增长') === -1
                            })
                        },

                        xAxis: [{
                            type: 'category',
                            axisLine: {
                                show: true
                            },
                            data: data.dates
                        }],

                        yAxis: [{
                            type: 'value',
                            axisLabel: {
                                textStyle: {
                                    color: '#afb7d0',
                                    fontSize: 10
                                }
                            },
                        }, {
                            type: 'value',
                            axisLabel: {
                                textStyle: {
                                    color: '#afb7d0',
                                    fontSize: 10
                                }
                            },
                        }],

                        series: _.filter(data.total_trends, function(v) {
                            if (v.name.indexOf('增长') === -1) {
                                if (v.name !== '贷款余额') {
                                    v.type = 'bar'
                                    v.stack = "累计趋势"
                                    v.barWidth = 40
                                } else {
                                    v.type = 'line'
                                        // v.yAxisIndex = 1 //待确认，是否需要副y轴
                                }
                                return true
                            }
                            return false
                        })
                    })

                    $scope.incrementTrendsChart.chartOptions = $.extend(true, {}, chartOptions, {

                        legend: {
                            data: _.filter(_.pluck(data.increment_trends, 'name'), function(v) {
                                return v.indexOf('增长') === -1
                            })
                        },

                        xAxis: [{
                            type: 'category',
                            axisLine: {
                                show: true
                            },
                            data: data.dates
                        }],

                        yAxis: [{
                            type: 'value',
                            axisLabel: {
                                textStyle: {
                                    color: '#afb7d0',
                                    fontSize: 10
                                }
                            },
                        }, {
                            type: 'value',
                            axisLabel: {
                                textStyle: {
                                    color: '#afb7d0',
                                    fontSize: 10
                                }
                            },
                        }],

                        series: _.filter(data.increment_trends, function(v) {
                            if (v.name.indexOf('增长') === -1) {
                                if (v.name !== '贷款余额增量') {
                                    v.type = 'bar'
                                    v.stack = "增量趋势"
                                    v.barWidth = 40
                                } else {
                                    v.type = 'line'
                                        // v.yAxisIndex = 1 //待确认，是否需要副y轴
                                }
                                return true
                            }
                            return false
                        })
                    })


                })
            }

            // 初始加载数据
            getData()
        })
})();
