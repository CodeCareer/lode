;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktOverdueAnalyticsOverdueRateCtrl', function($scope, $stateParams, ktInstitutionsService) {

            $scope.$emit('activeInstitutionChange', {
                id: $stateParams.id
            })

            var overdueTabs = ['逾期率', '不良率']

            $scope.radioPeriod = 'lastMonth'
            $scope.radioPeriodCustom = 'custom'
            $scope.overdueRateChart = {
                overdueTab: true,
                badTab: true,
                radioDataShowType: 'chart',
                chartOptions: {
                    tooltip: {
                        axisPointer: {
                            type: 'line',
                        }
                    },
                    xAxis: [{
                        type: 'category',
                        data: ['2015年05月', '2015年06月', '2015年07月', '2015年08月', '2015年09月', '2015年10月']
                    }],
                    legend: {
                        data: overdueTabs,
                        // selected: {},
                    },
                    series: [{
                        name: '逾期率',
                        type: 'line',

                        data: [620, 732, 701, 734, 1090, 1130, 1120]
                    }, {
                        name: '不良率',
                        type: 'line',
                        data: [120, 132, 101, 134, 290, 230, 220]
                    }]
                }
            }

            $scope.$watchGroup(['overdueRateChart.overdueTab', 'overdueRateChart.badTab'],
                function(newValue, oldValue) {
                    _.each(newValue, function(v, i) {
                        if (v !== oldValue[i]) {
                            // $scope.overdueRateChart.chartOptions.legend.selected[overdueTabs[i]] = v
                            $scope.$broadcast('overdueRateChart.change', [overdueTabs[i], v])
                        }
                    })
                })

            $scope.overdueRateProductChart = {
                radioDataShowType: 'chart',
                chartDimension: '逾期率',
                chartOptions: {

                }
            }

            $scope.overdueRateLocationChart = {
                radioDataShowType: 'chart',
                chartDimension: '逾期率',
                chartOptions: {

                }
            }


            // ktInstitutionsService.get({
            //     id: $stateParams.id
            // }, function(data) {
            //     $scope.institutions = data.ininstitutions
            // })
        })
})();
