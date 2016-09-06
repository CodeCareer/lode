;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktCashForecastLayoutCtrl', function($scope, $window) {

        $scope.data = {}
        $scope.shared = {}
        $scope.shared.tabs = {
            forecastResult: true,
            reForecast: false
        }

        var cache = JSON.parse($window.localStorage.cashForecast || '{}')

        $scope.shared.params = cache

    })

    .controller('ktCashForecastCtrl', function($scope, $location, $window, $stateParams, ktProjectsService) {
        var params = $scope.shared.params
        var activeTab = $location.search().tab || 'forecastResult'

        $scope.subTab = 'cashflow'
        $scope.shared.tabs.forecastResult = activeTab === 'forecastResult'
        $scope.shared.tabs.reForecast = activeTab === 'reForecast'
        $scope.project = {}

        // 参数回测
        $scope.reForecast = {
            periods: 0,
            activePeriod: ''
        }

        $scope.updatePeriod = function(value, index) {
            $scope.reForecast.activePeriod = value
            $scope.reForecast.periods = $scope.project.validPeriods.length - index
        }

        $scope.cashForecastChart = {
            radioDataShowType: 'chart',
            chartOptions: {}
        }

        var chartOptions = {
            tooltip: {
                axisPointer: {
                    type: 'line',
                    valueType: 'rmb'
                },
                yAxisFormat: 'rmb' //自定义属性，tooltip标示，决定是否显示百分比数值
            }
        }

        function getData() {

            // $window.localStorage.cashForecast = JSON.stringify(params)

            ktProjectsService.get($.extend({
                subContent: 'cashflow',
                projectID: $stateParams.projectID,

            }, params), function(data) {
                if (!params.start_date) {
                    $.extend(params, data.params)
                }

                $scope.data = data
                $scope.cashForecastChart.chartOptions = $.extend(true, {}, chartOptions, {
                    legend: {
                        // data: _.map(data.trends, 'name')
                        data: _.map(data.trends, 'name')
                    },
                    xAxis: {
                        type: 'category',
                        data: data.dates,
                        // name: '月份',
                    },
                    /*      axisLabel: {
                              interval: 0
                          },*/
                    yAxis: {
                        name: '万元',
                    },
                    series: _.map(data.trends, function(v) {
                        v.type = 'line'
                        return v
                    })
                })

                // 避免第一次跳转
                $scope.shared.goTo = function(tab) {
                    $location.search({
                        tab: tab
                    })
                }
            })

            // 获取项目的期数等基本信息
            ktProjectsService.get({
                projectID: $stateParams.projectID,
                subContent: 'detail'
            }, function(data) {
                var project = $scope.project = data.project

                // 获取可选的期限列表
                var validPeriods = $scope.project.validPeriods = _.clone(project.history_params.dates)

                if (_.indexOf(project.periods, params.start_date) >= validPeriods.length) {
                    $scope.reForecast.activePeriod = validPeriods.slice(-6, 1)
                    $scope.reForecast.periods = validPeriods.slice(-6).length
                } else {
                    $scope.reForecast.activePeriod = params.start_date
                    $scope.reForecast.periods = validPeriods.length - _.indexOf(validPeriods, params.start_date)
                }
            })
        }

        // 初始加载数据
        getData()
    })
})();
