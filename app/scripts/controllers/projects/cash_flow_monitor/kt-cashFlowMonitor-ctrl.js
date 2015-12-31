;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktCashFlowMonitorCtrl', function($scope, $location, $stateParams, ktReportService, ktProjectsService, ktDataHelper) {

            $scope.$emit('activeInstitutionChange', {
                projectID: $stateParams.projectID
            })

            $scope.params = $.extend({
                projectID: $stateParams.projectID,
                type: 'cash_flow',
                sub_project_id: 'all'
                    // subProjectID: $scope.params.subProjectID || null
                    // date_from: date_from,
                    // date_to: date_to
            }, $location.search())

            $scope.getSubProjectName = ktDataHelper.getSubProjectName($scope)

            $scope.subProjectChange = function(id) {
                $scope.params.sub_project_id = id
                $scope.params.subProjectID = id !== 'all' ? id : null
                getData()
            }

            ktProjectsService.get({
                projectID: $stateParams.projectID,
                subProject: 'sub_projects'
            }, function(data) {
                $scope.subProjects = data.sub_projects
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
                        date_from: dates[0] || null,
                        date_to: dates[1] || null
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
                // var date_from, date_to, datePeriod
                // datePeriod = $scope.radioPeriod
                // datePeriod = datePeriod.split('~')
                // date_from = datePeriod[0]
                // date_to = datePeriod[1]

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
