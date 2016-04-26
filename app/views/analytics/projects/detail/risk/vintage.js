;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktVintageCtrl', function($scope, $location, $stateParams, ktProjectStaticsReportService, ktDateHelper) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            var params = $scope.params = $.extend({
                dimenstion: 'C-M1',
                vintage_start: moment().date(1).subtract(6, 'months').format('YYYY-MM-DD'),
                vintage_end: moment().date(0).format('YYYY-MM-DD'),
            }, $location.search() || {})

            $scope.dimensions = [{
                name: 'C-M1',
                value: 'C_M1'
            }, {
                name: 'M1-C',
                value: 'M_1C'
            }, {
                name: 'M1-M2',
                value: 'M1_M2'
            }, {
                name: '逾期率',
                value: 'overdue'
            }, {
                name: '不良率',
                value: 'bad'
            }]

            $scope.vintageRange = (function () {
                if (params.vintage_start) {
                    return params.vintage_start + '~' + params.vintage_end
                }
            })();

            $scope.dimensions.activeName = function() {
                var d = _.find($scope.dimensions, function(v) {
                    return v.value === params.dimenstion
                }) || $scope.dimensions[0]
                return d.name
            }

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

            $scope.$watch('vintageRange', function(newValue, oldvalue) {
                if (newValue !== oldvalue) {
                    var dates = newValue.split('~')
                    $location.search($.extend(params, {
                        vintage_start: dates[0] || null,
                        vintage_end: dates[1] || null
                    }))
                }

            });

            $scope.goTo = function(k, v) {
                var p = {}
                p[k] = v
                $location.search($.extend(params, p))
            }

            $scope.vintageChart = {
                radioDataShowType: 'table',
                chartOptions: {}
            }

            var chartOptions = {
                tooltip: {
                    axisPointer: {
                        type: 'line',
                    },
                    yAxisFormat: 'percent' //自定义属性，tooltip标示，决定是否显示百分比数值
                }
            }

            function getData() {
                var startDate
                var endDate
                var datePeriod
                datePeriod = $scope.radioPeriod
                datePeriod = datePeriod.split('~')
                startDate = datePeriod[0]
                endDate = datePeriod[1]

                ktProjectStaticsReportService.get($.extend({
                    projectID: $stateParams.projectID,
                    type: 'overdue',
                    start_date: startDate,
                    end_date: endDate
                }, params), function(data) {
                    $scope.data = data

                    $scope.vintageChart.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.map(data.overdue_trends, 'name')
                        },
                        xAxis: [{
                            type: 'category',
                            data: data.dates
                        }],

                        series: _.map(data.overdue_trends, function(v) {
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
