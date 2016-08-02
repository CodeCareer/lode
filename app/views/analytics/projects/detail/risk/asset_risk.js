;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktAssetRiskCtrl', function($scope, $location, $stateParams, ktProjectsService, ktProjectStaticsReportService, ktDateHelper) {

            // $scope.$emit('activeProjectChange', {
            //     projectID: $stateParams.projectID
            // })

            // $scope.datepickerSettings = {
            //     triggerEvent: 'datepicker-change'
            // }

            var params = $scope.params = $.extend({
                dimension: null,
                risk_index: 'ovd_rate',
            }, $location.search() || {})


            $scope.risk_indexs = [{
                name: 'C-M1',
                value: 'C-M1'
            }, {
                name: 'M1-C',
                value: 'M1-C'
            }, {
                name: 'M1-M2',
                value: 'M1-M2'
            }, {
                name: '逾期率',
                value: 'ovd_rate'
            }, {
                name: '不良率',
                value: 'np_rate'
            }]

            $scope.vintageRange = (function() {
                if (params.vintage_start_date) {
                    return params.vintage_start_date + '~' + params.vintage_end_date
                }
            })();

            $scope.dimensions = []

            ktDateHelper.initPeriod($scope, params)

            $scope.data = {}
            $scope.$watch('radioPeriod', function(newValue, oldvalue) {
                if (newValue !== oldvalue && newValue !== 'custom') {
                    var dates = newValue.split('~')
                    $location.search($.extend(params, {
                        start_date: dates[0] || null,
                        end_date: dates[1] || null
                    }))
                }
            })

            // $scope.$watch('vintageRange', function(newValue, oldvalue) {
            //     if (newValue !== oldvalue) {
            //         var dates = newValue.split('~')
            //         $location.search($.extend(params, {
            //             vintage_start_date: dates[0] || null,
            //             vintage_end_date: dates[1] || null
            //         }))
            //     }

            // });

            $scope.goTo = function(k, v) {
                var p = {}
                p[k] = v
                $location.search($.extend(params, p))
            }

            $scope.assetRiskChart = {
                radioDataShowType: 'chart',
                chartOptions: {}
            }

            $scope.dimensionsActiveName = function() {
                var d = _.find($scope.dimensions, function(v) {
                    return v.key === $scope.params.dimension
                }) || $scope.dimensions[0]
                return d ? d.name : ''
            }

            var chartOptions = {
                tooltip: {
                    axisPointer: {
                        type: 'line',
                    },
                    yAxisFormat: 'percent' //自定义属性，tooltip标示，决定是否显示百分比数值
                }
            }

            $scope.risk_indexs.activeName = function() {
                      var d = _.find($scope.risk_indexs, function(v) {
                          return v.value === params.risk_index
                      }) || $scope.risk_indexs[0]
                      return d.name
                  }

            function getData() {
                var startDate
                var endDate
                var datePeriod
                datePeriod = $scope.radioPeriod
                datePeriod = datePeriod.split('~')
                startDate = datePeriod[0]
                endDate = datePeriod[1]

                //获取combox的数据
                ktProjectsService.get($.extend({
                    projectID: $stateParams.projectID,
                    subContent: 'discretized_dimensions',
                    // start_date: startDate,
                    // end_date: endDate
                }, params), function(data) {

                    $scope.dimensions = data.dimensions
                    $scope.params.dimension = $scope.params.dimension || data.dimensions[0].key

                    /*    $scope.discriptionTool = function() {
                            var d = _.find($scope.dimensions, function(v) {
                                return v.key === params.dimension
                            }) || $scope.dimensions[0]
                            return d.description
                        }*/


                    // $scope.assetRiskChart.chartOptions = $.extend(true, {}, chartOptions, {
                    //     legend: {
                    //         data: _.map(data.trends, 'name')
                    //     },
                    //     xAxis: {
                    //         type: 'category',
                    //         data: data.dates
                    //     },

                    //     series: _.map(data.trends, function(v) {
                    //         v.type = 'line'
                    //         return v
                    //     })
                    // })


                })

                //画图表取得数据
                ktProjectStaticsReportService.get($.extend({
                    projectID: $stateParams.projectID,
                    dimention: 'risk',
                    type: 'asset',
                    start_date: startDate,
                    end_date: endDate
                }, params), function(data) {
                    $scope.data = data
                    $scope.assetRiskChart.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.map(data.trends, 'name')
                        },
                        xAxis: {
                            type: 'category',
                            data: data.dates
                        },

                        series: _.map(data.trends, function(v) {
                            v.type = 'line'
                            return v
                        })
                    })
                })
            }
            // 初始加载数据
            getData()

        })
})();
