;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktAssetFeatureCtrl', function($scope, $location, $stateParams, ktProjectsReportService, ktDateHelper) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

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

                    // getData()
                }
            })

            $scope.timeLimitChart = {
                radioDataShowType: 'table',
                chartDimension: '时点余额',
                chartOptions: {},
                list: [],
                menuData: { // 绝对值百分比
                    index: 0,
                    value: 'absolute'
                }
            }

            $scope.amountChart = {
                radioDataShowType: 'table',
                chartDimension: '时点余额',
                chartOptions: {},
                list: [],
                menuData: { // 绝对值百分比
                    index: 0,
                    value: 'absolute'
                }
            }

            $scope.typeChart = {
                radioDataShowType: 'table',
                chartDimension: '时点余额',
                chartOptions: {},
                list: [],
                menuData: { // 绝对值百分比
                    index: 0,
                    value: 'absolute'
                }
            }

            $scope.locationChart = {
                radioDataShowType: 'table',
                topDimension: 'Top5',
                chartDimension: '时点余额',
                chartOptions: {},
                list: [],
                menuData: { // 绝对值百分比
                    index: 0,
                    value: 'absolute'
                }
            }

            $scope.$watch('timeLimitChart.menuData.index', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData('timeLimitChart')
                }
            })

            $scope.$watch('timeLimitChart.chartDimension', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData('timeLimitChart')
                }
            })

            $scope.$watch('amountChart.menuData.index', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData('amountChart')
                }
            })

            $scope.$watch('amountChart.chartDimension', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData('amountChart')
                }
            })

            $scope.$watch('typeChart.menuData.index', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData('typeChart')
                }
            })

            $scope.$watch('typeChart.chartDimension', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData('typeChart')
                }
            })

            $scope.$watch('locationChart.menuData.index', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData('locationChart')
                }
            })

            $scope.$watch('locationChart.chartDimension', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData('locationChart')
                }
            })

            $scope.$watch('locationChart.topDimension', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData('locationChart')
                }
            })

            var chartOptions = {}

            function getDataKey(type) {
                var typesMap = {
                    'timeLimitChart': ['prncp_balns_by_term', 'loan_amnt_incrmnt_by_term'],
                    'amountChart': ['prncp_balns_by_amnt', 'loan_amnt_incrmnt_by_amnt'],
                    'typeChart': ['prncp_balns_by_type', 'loan_amnt_incrmnt_by_type'],
                    'locationChart': ['prncp_balns_by_loc', 'loan_amnt_incrmnt_by_loc'],
                }

                var keys = typesMap[type]
                var prefix
                var suffix
                prefix = $scope[type].chartDimension === '时点余额' ? keys[0] : keys[1]
                suffix = $scope[type].menuData.value === 'absolute' ? '' : '_percent'
                if (type === 'locationChart') suffix = suffix + '_' + $scope.locationChart.topDimension.toLowerCase()

                chartOptions = suffix === '_percent' ? {
                    tooltip: {
                        valueType: 'percent' //自定义属性，tooltip标示，决定是否显示百分比数值
                    },
                    yAxis: {
                        max: 1,
                        min: 0
                    }
                } : {
                    tooltip: {
                        valueType: 'rmb'
                    }
                }

                return prefix + suffix
            }

            function udpateData(type) {
                var data = $scope.data

                var listName = getDataKey(type)
                $scope[type].list = data[listName]
                $scope[type].chartOptions = $.extend(true, {}, chartOptions, {
                    legend: {
                        data: _.map(data[listName], 'name')
                    },
                    xAxis: {
                        type: 'category',
                        data: data.dates
                    },

                    series: _.map(data[listName], function(v) {
                        v.type = 'bar'
                        v.stack = '堆积组'
                        v.barWidth = 40
                        return v
                    })
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

                ktProjectsReportService.get($.extend({
                    projectID: $stateParams.projectID,
                    type: 'assets_features',
                    start_date: startDate,
                    end_date: endDate
                }, params), function(data) {
                    $scope.data = data
                    udpateData('timeLimitChart')
                    udpateData('amountChart')
                    udpateData('typeChart')
                    udpateData('locationChart')
                })
            }

            // 初始加载数据
            getData()
        })
})();
