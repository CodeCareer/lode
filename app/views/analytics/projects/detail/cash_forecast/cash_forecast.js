;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktCashCtrl', function($scope, $location, $stateParams, $window, ktProjectsService, ktSweetAlert) {

            // $scope.$emit('activeProjectChange', {
            //     projectID: $stateParams.projectID
            // })

            // $scope.datepickerSettings = {
            //     triggerEvent: 'datepicker-change'
            // }

            // ktDateHelper.initPeriod($scope, params)

            $scope.data = {}
                /*     $scope.$watch('radioPeriod', function(newValue, oldvalue) {
                         if (newValue !== oldvalue && newValue !== 'custom') {
                             var dates = newValue.split('~')
                             $location.search($.extend(params, {
                                 start_date: dates[0] || null,
                                 // end_date: dates[1] || null
                             }))
                         }

                     })*/

            // $scope.goTo = function(k, v) {
            //         var p = {}
            //         p[k] = v
            //         $location.search($.extend(params, p))
            //     }

            var cache = JSON.parse($window.sessionStorage.cashForest || '{}')

            var params = $scope.params = $.extend({
                start_date: null,
                default_rate: null,
                prepayment_rate: null,
            }, cache, $location.search() || {})

            $scope.goTo = function() {
                if (!params.default_rate || !params.default_rate || !params.prepayment_rate) {
                    ktSweetAlert.swal({
                        title: '请正确输入',
                        text: '不能为空',
                        type: 'error',
                    });
                    return;
                }
                getData();

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

                $window.sessionStorage.cashForest = JSON.stringify(params)

                ktProjectsService.get($.extend({
                    subContent: 'cashflow',
                    projectID: $stateParams.projectID,

                }, params), function(data) {
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
                })
            }

            // 初始加载数据
            if (params.start_date && params.default_rate && params.prepayment_rate) {
                getData()
            }

        })
})();
