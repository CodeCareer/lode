;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktCashFlowMonitorCtrl', function($scope, $location, $stateParams, ktReportService, ktProjectsService, ktDataHelper) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.params = $.extend({
                projectID: $stateParams.projectID,
                type: 'cash_flow',
                subproject_id: 'all'
                    // subProjectID: $scope.params.subProjectID || null
                    // start_date: start_date,
                    // end_date: end_date
            }, $location.search())

            $scope.getSubProjectName = ktDataHelper.getSubProjectName($scope)

            $scope.subProjectChange = function(id) {
                $scope.params.subproject_id = id
                $scope.params.subProjectID = id !== 'all' ? id : null
                getData()
            }

            ktProjectsService.get({
                projectID: $stateParams.projectID,
                subContent: 'subprojects'
            }, function(data) {
                $scope.subProjects = data.subprojects
                $scope.subProjects.unshift({
                    id: 'all',
                    name: '全部'
                })
                getData()
            })

            $scope.data = {}

            $scope.cashFlowChart = {
                planRepaymentTab: true,
                realRepaymentTab: true,
                agreeCashFlowTab: true,
                radioDataShowType: 'table',
                chartOptions: {}
            }

            var chartOptions = {
                tooltip: {
                    axisPointer: {
                        type: 'line',
                    },
                    valueType: 'rmb' //自定义属性，tooltip标示，决定是否显示百分比数值
                },
                /*yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: function(value) {
                            return (value * 100).toFixed(0) + '%'
                        }
                    }
                }]*/
            }

            /*$scope.$watch('radioPeriod', function(newValue, oldvalue) {
                if (newValue !== oldvalue && newValue !== 'custom') {
                    var dates = newValue.split('~')
                    $location.search($.extend(params, {
                        start_date: dates[0] || null,
                        end_date: dates[1] || null
                    }))

                    // getData()
                }
            })*/

            /*ktInstitutionsService.get(function(data) {
                $scope.institutions = data.institutions
                $scope.activeInstitutionName = data.institutions[0].name
                $scope.params.subProjectID = data.institutions[0].id
                getData()
            })*/

            function getData() {
                // var start_date, end_date, datePeriod
                // datePeriod = $scope.radioPeriod
                // datePeriod = datePeriod.split('~')
                // start_date = datePeriod[0]
                // end_date = datePeriod[1]

                ktReportService.get($scope.params, function(data) {
                    $scope.data = data

                    $scope.cashFlowChart.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: ['计划还款金额', '实际还款金额', '约定兑付现金流']
                        },
                        xAxis: [{
                            type: 'category',
                            data: _.pluck(data.results, 'stage')
                        }],

                        series: [{
                                name: '计划还款金额',
                                data: _.pluck(data.results, 'plan_rpmnt_amnt'),
                                type: 'line',
                                smooth: false,
                                itemStyle: {
                                    normal: {
                                        areaStyle: {
                                            type: 'default'
                                        }
                                    }
                                }
                            }, {
                                name: '实际还款金额',
                                data: _.pluck(data.results, 'real_rpmnt_amnt'),
                                type: 'line',
                                smooth: false,
                                itemStyle: {
                                    normal: {
                                        areaStyle: {
                                            type: 'default'
                                        }
                                    }
                                }
                            }, {
                                name: '约定兑付现金流',
                                data: _.pluck(data.results, 'agree_cash_flow'),
                                type: 'line',
                                smooth: false,
                                itemStyle: {
                                    normal: {
                                        areaStyle: {
                                            type: 'default'
                                        }
                                    }
                                }
                            }]
                            /*series: _.map(data.cash_flow, function(v) {
                                v.type = 'line'
                                return v
                            })*/
                    })

                })
            }

        })
})();
