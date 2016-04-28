;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktUserFeatureCtrl', function($scope, $location, $stateParams, ktProjectStaticsReportService, ktDateHelper) {

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
                }
            })

            $scope.ageChart = {
                radioDataShowType: 'table',
                chartDimension: '时点余额',
                chartOptions: {},
                list: [],
                menuData: { // 绝对值百分比
                    index: 0,
                    value: 'absolute'
                }
            }

            $scope.educationChart = {
                radioDataShowType: 'table',
                chartDimension: '时点余额',
                chartOptions: {},
                list: [],
                menuData: { // 绝对值百分比
                    index: 0,
                    value: 'absolute'
                }
            }

            $scope.$watch('ageChart.menuData.index', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData('ageChart')
                }
            })

            $scope.$watch('ageChart.chartDimension', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData('ageChart')
                }
            })

            $scope.$watch('educationChart.menuData.index', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData('educationChart')
                }
            })

            $scope.$watch('educationChart.chartDimension', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    udpateData('educationChart')
                }
            })

            var chartOptions = {}

            function getDataKey(type) {
                var typesMap = {
                    'ageChart': ['prncp_balns_by_age', 'loan_amnt_incrmnt_by_age'],
                    'educationChart': ['prncp_balns_by_education', 'loan_amnt_incrmnt_by_education'],
                }

                var keys = typesMap[type]
                var prefix
                var suffix
                prefix = $scope[type].chartDimension === '时点余额' ? keys[0] : keys[1]
                suffix = $scope[type].menuData.value === 'absolute' ? '' : '_percent'
                // if (type === 'locationChart') suffix = suffix + '_' + $scope.locationChart.topDimension.toLowerCase()

                chartOptions = suffix === '_percent' ? {
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

                ktProjectStaticsReportService.get($.extend({
                    projectID: $stateParams.projectID,
                    type: 'borrower',
                    dimention: 'distribution',
                    start_date: startDate,
                    end_date: endDate
                }, params), function(data) {
                    $scope.data = data
                    udpateData('ageChart')
                    udpateData('educationChart')
                })
            }

            // 初始加载数据
            getData()
        })
})();
