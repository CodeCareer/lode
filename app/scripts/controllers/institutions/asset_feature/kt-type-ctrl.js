;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktAssetFeatureTypeCtrl', function($scope, $stateParams, ktReportService, ktDateHelper) {

            $scope.$emit('activeInstitutionChange', {
                projectID: $stateParams.projectID
            })

            $scope.radioPeriod = 'lastMonth'
            $scope.radioPeriodCustom = 'custom'
            $scope.radioDataShowType = 'chart'
            $scope.chartDimension = '时点余额'

            // 绝对值百分比
            $scope.menuData = {
                index: 0,
                value: 'absolute'
            }

            $scope.$watch('radioPeriod', function(newValue, oldvalue) {
                if (newValue !== oldvalue && newValue !== 'custom') {
                    getData()
                }
            })

            $scope.$watch('menuData.index', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData()
                }
            })

            $scope.$watch('chartDimension', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData()
                }
            })


            var chartOptions = {}

            function getDataKey() {
                var prefix
                var suffix
                prefix = $scope.chartDimension === '时点余额' ? 'remain_types' : 'new_types'
                suffix = $scope.menuData.value === 'absolute' ? '' : '_percent'

                chartOptions = suffix === '_percent' ? {
                    tooltip: {
                        percentValue: true //自定义属性，tooltip标示，决定是否显示百分比数值
                    },
                    yAxis: [{
                        axisLabel: {
                            formatter: function(value) {
                                return (value * 100).toFixed(0) + '%'
                            }
                        }
                    }]
                } : {
                    tooltip: {
                        percentValue: false
                    },
                    yAxis: [{
                        axisLabel: {
                            formatter: function(value) {
                                return value
                            }
                        }
                    }]
                }

                return prefix + suffix
            }

            function udpateData(data) {
                data = data || $scope.data

                var listName = getDataKey()
                $scope.data.list = data[listName]

                $scope.chartOptions = $.extend(true, {}, chartOptions, {
                    legend: {
                        data: _.pluck(data[listName], 'name')
                    },
                    xAxis: [{
                        type: 'category',
                        data: data.dates
                    }],

                    series: _.map(data[listName], function(v) {
                        v.type = 'bar'
                        v.stack = '按类型'
                        v.barWidth = 40
                        return v
                    })
                })
            }

            function getData() {
                var dateFrom
                var dateTo
                var datePeriod
                datePeriod = ktDateHelper.getDate($scope.radioPeriod) || $scope.radioPeriodCustom
                datePeriod = datePeriod.split('~')
                dateFrom = datePeriod[0] || null
                dateTo = datePeriod[1]

                ktReportService.get({
                    projectID: $stateParams.projectID,
                    type: 'asset_feature_type',
                    date_from: dateFrom,
                    date_to: dateTo
                }, function(data) {
                    $scope.data = data
                    udpateData(data)
                })
            }

            // 初始加载数据
            getData()
        })
})();
