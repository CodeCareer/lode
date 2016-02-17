;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktDashboardCtrl', function($scope, $stateParams, ktProjectsReportService, ktDataHelper) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            // $scope.radioPeriod = 'all'
            // $scope.radioPeriodCustom = 'custom'
            $scope.ownFunds = ktDataHelper.getOwnFunds()
            $scope.guaranteeLoan = ktDataHelper.getGuaranteeLoan()

            ktProjectsReportService.get({
                type: 'stat_overview'
            }, function(data) {
                $.extend($scope, data)
                // $scope.summary = data.summary
            })

            // $scope.typesChart = {
            //     chartOptions: {}
            // }

            // $scope.institutionsChart = {
            //     chartOptions: {}
            // }

            // $scope.timelimitsChart = {
            //     chartOptions: {}
            // }

            // $scope.amountsChart = {
            //     chartOptions: {}
            // }

            // $scope.locationsChart = {
            //     chartOptions: {}
            // }

            // $scope.gendersChart = {
            //     chartOptions: {}
            // }

            // $scope.agesChart = {
            //     chartOptions: {}
            // }

            /*$scope.$watch('radioPeriod', function(newValue, oldvalue) {
                if (newValue !== oldvalue && newValue !== 'custom') {
                    getData()
                }
            })*/

            // var chartOptions = {
            //     tooltip: {
            //         valueType: 'rmb' //自定义属性，tooltip标示，决定是否显示百分比数值
            //     }
            // }

            // function getData() {
            //     var start_date, end_date, datePeriod
            //     datePeriod = ktDateHelper.getDate($scope.radioPeriod) || $scope.radioPeriodCustom
            //     datePeriod = datePeriod.split('~')
            //     start_date = datePeriod[0] || null
            //     end_date = datePeriod[1]

            //     ktReportService.get({
            //         type: 'asset_features',
            //         start_date: start_date,
            //         end_date: end_date
            //     }, function(data) {
            //         $scope.data = data

            //         /*$scope.typesChart.chartOptions = $.extend(true, {}, chartOptions, {
            //             legend: {
            //                 data: _.map(data.types, 'name')
            //             },
            //             xAxis: [{
            //                 type: 'category',
            //                 data: data.dates
            //             }],

            //             series: _.map(data.types, function(v) {
            //                 v.type = 'bar'
            //                 v.stack = "按类型"
            //                 v.barWidth = 40
            //                 return v
            //             })
            //         })

            //         $scope.institutionsChart.chartOptions = $.extend(true, {}, chartOptions, {
            //             legend: {
            //                 data: _.map(data.institutions, 'name')
            //             },
            //             xAxis: [{
            //                 type: 'category',
            //                 data: data.dates
            //             }],

            //             series: _.map(data.institutions, function(v) {
            //                 v.type = 'bar'
            //                 v.stack = "按机构"
            //                 v.barWidth = 40
            //                 return v
            //             })
            //         })*/

            //         $scope.timelimitsChart.chartOptions = $.extend(true, {}, chartOptions, {
            //             legend: {
            //                 data: _.map(data.rem_prncp_by_term, 'name')
            //             },
            //             xAxis: [{
            //                 type: 'category',
            //                 data: data.dates
            //             }],

            //             series: _.map(data.rem_prncp_by_term, function(v) {
            //                 v.type = 'bar'
            //                 v.stack = "按期限"
            //                 v.barWidth = 40
            //                 return v
            //             })
            //         })

            //         $scope.amountsChart.chartOptions = $.extend(true, {}, chartOptions, {
            //             legend: {
            //                 data: _.map(data.rem_prncp_by_amnt, 'name')
            //             },
            //             xAxis: [{
            //                 type: 'category',
            //                 data: data.dates
            //             }],

            //             series: _.map(data.rem_prncp_by_amnt, function(v) {
            //                 v.type = 'bar'
            //                 v.stack = "按额度"
            //                 v.barWidth = 40
            //                 return v
            //             })
            //         })

            //         /* $scope.locationsChart.chartOptions = $.extend(true, {}, chartOptions, {
            //              legend: {
            //                  data: _.map(data.locations, 'name')
            //              },
            //              xAxis: [{
            //                  type: 'category',
            //                  data: data.dates
            //              }],

            //              series: _.map(data.locations, function(v) {
            //                  v.type = 'bar'
            //                  v.stack = "按地理位置"
            //                  v.barWidth = 40
            //                  return v
            //              })
            //          })

            //          $scope.gendersChart.chartOptions = $.extend(true, {}, chartOptions, {
            //              legend: {
            //                  data: _.map(data.genders, 'name')
            //              },
            //              xAxis: [{
            //                  type: 'category',
            //                  data: data.dates
            //              }],

            //              series: _.map(data.genders, function(v) {
            //                  v.type = 'bar'
            //                  v.stack = "按性别"
            //                  v.barWidth = 40
            //                  return v
            //              })
            //          })

            //          $scope.agesChart.chartOptions = $.extend(true, {}, chartOptions, {
            //              legend: {
            //                  data: _.map(data.ages, 'name')
            //              },
            //              xAxis: [{
            //                  type: 'category',
            //                  data: data.dates
            //              }],

            //              series: _.map(data.ages, function(v) {
            //                  v.type = 'bar'
            //                  v.stack = "按年龄"
            //                  v.barWidth = 40
            //                  return v
            //              })
            //          })*/
            //     })
            // }

            // // 初始加载数据
            // getData()

        })
})();
