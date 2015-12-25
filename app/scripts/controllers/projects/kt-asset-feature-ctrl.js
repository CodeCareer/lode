;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktAssetFeatureCtrl', function($scope, $stateParams, ktReportService, ktInstitutionsService, ktDateHelper) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.radioPeriod = 'all'
            $scope.radioPeriodCustom = 'custom'

            $scope.institutions = []        
            $scope.insitutionChange = function(id, name) {
                $scope.institutionName = name
                getData(id)
            }

            ktInstitutionsService.get(function (data) {
                $scope.institutions = data.institutions
                $scope.institutionName = $scope.institutions[0].name
                getData($scope.institutions[0].id)
            })

            $scope.timelimitsChart = {
                chartOptions: {}
            }

            $scope.amountsChart = {
                chartOptions: {}
            }

            $scope.locationsChart = {
                chartOptions: {}
            }

            $scope.gendersChart = {
                chartOptions: {}
            }

            $scope.agesChart = {
                chartOptions: {}
            }

            $scope.$watch('radioPeriod', function(newValue, oldvalue) {
                if (newValue !== oldvalue && newValue !== 'custom') {
                    getData()
                }
            })

            var chartOptions = {
                tooltip: {
                    valueType: 'rmb' //自定义属性，tooltip标示，决定是否显示百分比数值
                }
            }

            function getData(instID) {
                var date_from, date_to, datePeriod
                datePeriod = ktDateHelper.getDate($scope.radioPeriod) || $scope.radioPeriodCustom
                datePeriod = datePeriod.split('~')
                date_from = datePeriod[0] || null
                date_to = datePeriod[1]

                ktReportService.get({
                    type: 'asset_features',
                    instID: instID,
                    date_from: date_from,
                    date_to: date_to
                }, function(data) {
                    $scope.data = data

                    $scope.timelimitsChart.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.pluck(data.rem_prncp_by_term, 'name')
                        },
                        xAxis: [{
                            type: 'category',
                            data: data.dates
                        }],

                        series: _.map(data.rem_prncp_by_term, function(v) {
                            v.type = 'bar'
                            v.stack = "按期限"
                            v.barWidth = 40
                            return v
                        })
                    })

                    $scope.amountsChart.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.pluck(data.rem_prncp_by_amnt, 'name')
                        },
                        xAxis: [{
                            type: 'category',
                            data: data.dates
                        }],

                        series: _.map(data.rem_prncp_by_amnt, function(v) {
                            v.type = 'bar'
                            v.stack = "按额度"
                            v.barWidth = 40
                            return v
                        })
                    })

                    $scope.locationsChart.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.pluck(data.rem_prncp_by_loc, 'name')
                        },
                        xAxis: [{
                            type: 'category',
                            data: data.dates
                        }],

                        series: _.map(data.rem_prncp_by_loc, function(v) {
                            v.type = 'bar'
                            v.stack = "按地理位置"
                            v.barWidth = 40
                            return v
                        })
                    })

                    $scope.gendersChart.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.pluck(data.rem_prncp_by_gender, 'name')
                        },
                        xAxis: [{
                            type: 'category',
                            data: data.dates
                        }],

                        series: _.map(data.rem_prncp_by_gender, function(v) {
                            v.type = 'bar'
                            v.stack = "按性别"
                            v.barWidth = 40
                            return v
                        })
                    })

                    $scope.agesChart.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.pluck(data.rem_prncp_by_age, 'name')
                        },
                        xAxis: [{
                            type: 'category',
                            data: data.dates
                        }],

                        series: _.map(data.rem_prncp_by_age, function(v) {
                            v.type = 'bar'
                            v.stack = "按年龄"
                            v.barWidth = 40
                            return v
                        })
                    })
                })
            }

            // 初始加载数据
            // getData()

        })
})();
