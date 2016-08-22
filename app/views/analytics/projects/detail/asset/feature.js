;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktAssetFeatureCtrl', function($scope, $location, $stateParams, ktProjectStaticsReportService, ktDateHelper) {

            // $scope.$emit('activeProjectChange', {
            //     projectID: $stateParams.projectID
            // })

            var params = $location.search() || {}
            ktDateHelper.initPeriod($scope, params)

            // 日期筛选
            $scope.$watch('radioPeriod', function(newValue, oldvalue) {
                if (newValue !== oldvalue && newValue !== 'custom') {
                    var dates = newValue.split('~')
                    $location.search($.extend(params, {
                        start_date: dates[0] || null,
                        end_date: dates[1] || null
                    }))
                }
            })

            // 默认图表列表
            $scope.charts = []

            // 初始化数据模型
            function initData() {
                var data = $scope.data
                var dimentions = data.dimensions

                _.each(dimentions, function(v) {
                    var chart = _.find($scope.charts, function(c) {
                        return c.key === v.key
                    })

                    if (!chart) {
                        chart = {
                            key: v.key,
                            name: v.name,
                            description: v.description,
                            radioDataShowType: 'table',
                            chartDimension: '时点余额',
                            chartOptions: {},
                            list: [],
                            menuData: { // 绝对值百分比
                                index: 0,
                                value: 'absolute'
                            },
                            menuDataChange: function() {
                                this.updateData()
                            },
                            dimentionChange: function(value) {
                                this.chartDimension = value
                                this.updateData()
                            },
                            updateData: function() {
                                var prefix
                                var suffix
                                var listName
                                prefix = this.chartDimension === '时点余额' ? 'mature_prncp_balns_by_' : 'loan_amnt_incrmnt_by_'
                                suffix = this.menuData.value === 'absolute' ? '' : '_percent'
                                listName = prefix + this.key + suffix

                                var chartOptions = suffix === '_percent' ? {
                                    tooltip: {
                                        yAxisFormat: 'percent' //自定义属性，tooltip标示，决定是否显示百分比数值
                                    },
                                    yAxis: {
                                        max: 1,
                                        min: 0
                                    }
                                } : {
                                    tooltip: {
                                        yAxisFormat: 'rmb'
                                    },
                                    yAxis: {
                                        max: null,
                                    }
                                }

                                this.list = data[listName]
                                this.chartOptions = $.extend(true, {}, chartOptions, {
                                    legend: {
                                        data: _.map(data[listName], 'name')
                                    },
                                    xAxis: {
                                        type: 'category',
                                        data: data.dates
                                    },
                                    series: _.map(data[listName], function(v2) {
                                        v2.type = 'bar'
                                        v2.stack = '堆积组'
                                        v2.barWidth = 40
                                        return v2
                                    })
                                })
                            }
                        }
                        chart.updateData()
                        $scope.charts.push(chart)
                    }
                })
            }

            function getData() {
                var startDate
                var endDate
                var datePeriod
                datePeriod = $scope.radioPeriod
                datePeriod = datePeriod.split('~')
                startDate = datePeriod[0] || null
                endDate = datePeriod[1]

                ktProjectStaticsReportService.get($.extend({
                    projectID: $stateParams.projectID,
                    type: 'loan',
                    dimention: 'distribution',
                    start_date: startDate,
                    end_date: endDate
                }, params), function(data) {
                    $scope.data = data
                    initData()
                })
            }

            // 初始加载数据
            getData()
        })
})();
