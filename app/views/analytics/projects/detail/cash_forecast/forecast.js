;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktCashForecastLayoutCtrl', function($scope, $window, $stateParams) {

        $scope.data = {}
        $scope.shared = {}
        $scope.shared.tabs = {
            forecastResult: true,
            reForecast: false
        }

        var cache = JSON.parse($window.localStorage.getItem($stateParams.projectID + '.cashForecast') || '{}')

        $scope.shared.params = cache

    })

    .controller('ktCashForecastCtrl', function($scope, $timeout, $location, $window, $stateParams, ktProjectsService) {
        var params = $scope.shared.params

        var activeTab = $location.search().tab || 'forecastResult'
        var loadingSettings = { // 设置图表异步加载的样式
            text: '努力加载中...',
            color: '#3d4351',
            textColor: '#3d4351',
        }

        // $scope.result = { subTab: 'addup_cashflow_trends' } // 包一层保证双向绑定
        $scope.result = { subTab: 'asset_cashflow_trends' } // 包一层保证双向绑定
        $scope.shared.tabs.forecastResult = activeTab === 'forecastResult'
        $scope.shared.tabs.reForecast = activeTab === 'reForecast'
        $scope.project = {}

        // 参数回测
        $scope.reForecast = {
            periods: 0,
            activePeriod: ''
        }

        $scope.$watch('result.subTab', function(newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.cashForecastChart.updateChartView()
            }
        })

        var chartOptions = {
            tooltip: {
                axisPointer: {
                    type: 'line',
                    valueType: 'rmb'
                },
                yAxisFormat: 'rmb' //自定义属性，tooltip标示，决定是否显示百分比数值
            }
        }

        // 预测结果图表
        $scope.cashForecastChart = {
            radioDataShowType: 'chart',
            tableData: [],
            initDone: false, // 用于判断是否需要重新加载数据
            getData: function() {
                var _self = this
                ktProjectsService.get($.extend({
                    subContent: 'cashflow',
                    projectID: $stateParams.projectID,

                }, params), function(data) {
                    //初始 undefined
                    // console.log(params.start_date)
                    $scope.data = data;

                    if (!params.start_date) {
                        $.extend(params, data.params)
                    }

                    var startIndex = params.startIndex = _.indexOf(data.dates, params.start_date)

                    params.periods = data.dates.length - startIndex - 1

                    // params.periods = project.periods.length - startIndex
                    // console.log(params.start_date)
                    // else{
                    //          $scope.data = data
                    // $scope.shared.params.start_date = data.params.start_date
                    // $scope.shared.params.periods = data.params.periods
                    // $scope.shared.params.prepayment_rate = data.params.prepayment_rate
                    // $scope.shared.params.default_rate = data.params.default_rate
                    // $scope.shared.params.no_repay_rate = data.params.no_repay_rate
                    // }

                    _self.initDone = true
                    _self.data = data
                    _self.updateChartView()

                    // 避免第一次进来会fire一次select发生跳转
                    $scope.shared.goTo = function(chart) {
                        if (!$scope[chart].initDone) {
                            $timeout(function() {
                                $scope[chart].getData()
                            }, 10)
                        }
                    }

                    // 回测时间
                    $scope.updatePeriod = function(value, index) {
                        $scope.reForecast.activePeriod = value
                        $scope.reForecast.periods = $scope.project.validPeriods.length - index
                        $scope.reForecastChart.getData()
                    }
                })
            },
            updateChartView: function() {
                var data = this.data
                var trends = this.tableData = data[$scope.result.subTab]

                // 过滤掉图表不展示的字段
                trends = _.filter(trends, function(v) {
                    var assert = false
                    switch ($scope.result.subTab) {
                        case 'addup_cashflow_trends':
                            assert = v.name !== '累计现金流'
                            break
                        case 'asset_cashflow_trends':
                            assert = v.name !== '总现金流'
                            break
                        default:
                            assert = true
                    }
                    return assert
                })

                // 分割线位置
                var seperateIndex = _.indexOf(data.dates, params.start_date)
                    // var dataDatesLen = data.dates.length;

                var yMax = 0

                // 依据不同的tab算取不同的最大值
                switch ($scope.result.subTab) {
                    case 'addup_cashflow_trends':
                        var yMax1 = _.chain(trends).filter({ name: '余额' }).map(function(v) {
                            return _.max(v.data)
                        }).max().value()

                        var yMax2 = _.chain(trends).filter({ name: '累计本金' }).map(function(v) {
                            return _.max(v.data)
                        }).max().value()

                        yMax = Math.max(yMax1, yMax2)
                        break
                    case 'asset_cashflow_trends':
                    case 'loss_cashflow_trends':
                        var dataArr = _.chain(trends).map('data').value()
                        var sumArr = []
                        _.each(dataArr[0], function(v, i) {
                            sumArr[i] = 0
                            _.each(dataArr, function(innerV) {
                                sumArr[i] += innerV[i]
                            })
                        })

                        yMax = _.max(sumArr)
                        break
                    default:
                        yMax = Math.pow(10, 10)
                }

                var intervalCount = 5
                var interval = _.ceil(yMax / (10000 * intervalCount))
                interval = _.ceil(interval, 1 - _.toString(interval).length)
                yMax = interval * intervalCount * 10000

                this.chartOptions = $.extend(true, {}, chartOptions, {
                    legend: {
                        data: _.map(trends, 'name')
                    },
                    xAxis: {
                        type: 'category',
                        data: data.dates,
                        boundaryGap: false
                    },
                    tooltip: {
                        reverse: $scope.result.subTab !== 'addup_cashflow_trends'
                    },
                    yAxis: {
                        name: '万元',
                        boundaryGap: false,
                        interval: interval * 10000,
                        max: yMax
                    },
                    series: _.map(trends, function(v, i) {

                        if (i === 0) {
                            v.markLine = {
                                // animation: false,
                                label: {
                                    normal: {
                                        formatter: '预测起始点',
                                        textStyle: {
                                            align: 'center'
                                        }
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        type: 'dashed'
                                    }
                                },
                                // tooltip: {
                                //     formatter: '真实预测分割线'
                                // },
                                data: [
                                    [{
                                        coord: [seperateIndex, 0],
                                        symbol: 'none'
                                    }, {
                                        coord: [seperateIndex, yMax],
                                        symbol: 'arrow',
                                        symbolSize: [5, 10]
                                    }]
                                ]
                            }
                        }
                        v.type = 'line'
                        if ($scope.result.subTab !== 'addup_cashflow_trends') {
                            v.stack = '堆积'
                            v.areaStyle = { normal: {} }
                        }
                        return v
                    })
                })
            },
            chartOptions: {}
        }

        // 参数回测
        $scope.reForecastChart = {
            radioDataShowType: 'chart',
            initDone: false,
            showLoading: function() {
                var echart1 = echarts.getInstanceByDom($('#reForecastChart1')[0])
                var echart2 = echarts.getInstanceByDom($('#reForecastChart2')[0])
                var echart3 = echarts.getInstanceByDom($('#reForecastChart3')[0])
                var echart4 = echarts.getInstanceByDom($('#reForecastChart4')[0])

                /*eslint-disable*/
                echart1 && echart1.showLoading(loadingSettings)
                echart2 && echart2.showLoading(loadingSettings)
                echart3 && echart3.showLoading(loadingSettings)
                echart4 && echart4.showLoading(loadingSettings)
                    /*eslint-enable*/
            },
            hideLoading: function() {
                var echart1 = echarts.getInstanceByDom($('#reForecastChart1')[0])
                var echart2 = echarts.getInstanceByDom($('#reForecastChart2')[0])
                var echart3 = echarts.getInstanceByDom($('#reForecastChart3')[0])
                var echart4 = echarts.getInstanceByDom($('#reForecastChart4')[0])

                /*eslint-disable*/
                echart1 && echart1.hideLoading()
                echart2 && echart2.hideLoading()
                echart3 && echart3.hideLoading()
                echart4 && echart4.hideLoading()
                    /*eslint-enable*/
            },
            getData: function() {
                var _self = this
                _self.showLoading()
                ktProjectsService.get({
                    subContent: 're_forecast',
                    projectID: $stateParams.projectID,
                    start_date: $scope.reForecast.activePeriod
                }, function(data) {

                    _self.hideLoading()
                    _self.initDone = true
                    _self.data = data
                    _self.updateChartView()

                })
            },
            updateChartView: function() {
                var data = this.data
                var commonChartOptions = {
                    xAxis: {
                        type: 'category',
                        data: data.dates,
                    }
                }

                this.chart1 = $.extend(true, {}, chartOptions, commonChartOptions, {
                    legend: {
                        data: _.map(data.addup_cashflow_trends, 'name')
                    },
                    yAxis: {
                        name: '万元'
                    },
                    series: _.map(data.addup_cashflow_trends, function(v) {
                        v.type = 'line'
                        return v
                    })
                })

                this.chart2 = $.extend(true, {}, chartOptions, commonChartOptions, {
                    legend: {
                        data: _.map(data.balns_trends, 'name')
                    },
                    yAxis: {
                        name: '万元'
                    },
                    series: _.map(data.balns_trends, function(v) {
                        v.type = 'line'
                        return v
                    })
                })

                this.chart3 = $.extend(true, {}, chartOptions, commonChartOptions, {
                    legend: {
                        data: _.map(data.prepayment_rate_trends, 'name')
                    },
                    tooltip: {
                        yAxisFormat: 'percent'
                    },
                    yAxis: {
                        name: '%'
                    },
                    series: _.map(data.prepayment_rate_trends, function(v) {
                        v.type = 'line'
                        return v
                    })
                })

                this.chart4 = $.extend(true, {}, chartOptions, commonChartOptions, {
                    legend: {
                        data: _.map(data.loss_rate_trends, 'name')
                    },
                    tooltip: {
                        yAxisFormat: 'percent'
                    },
                    yAxis: {
                        name: '%'
                    },
                    series: _.map(data.loss_rate_trends, function(v) {
                        v.type = 'line'
                        return v
                    })
                })
            },
            chart1: {},
            chart2: {},
            chart3: {},
            chart4: {}
        }

        // 获取项目的期数等基本信息
        ktProjectsService.get({
            projectID: $stateParams.projectID,
            subContent: 'cashflows',
            subID: 'history_factors'
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

        // 预测结果加载
        $scope.cashForecastChart.getData()

    })
})();
