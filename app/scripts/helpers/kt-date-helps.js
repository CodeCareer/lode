/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.lode')
        .factory('ktDateHelper', function() {
            return {
                getDate: function(periodName) {
                    var dateFrom
                    var dateTo
                    var targetDate

                    switch (periodName) {
                        case 'all':
                            dateFrom = ''
                            dateTo = moment().date(1).subtract(1, 'days').format('YYYY-MM')
                            break;
                        case 'lastMonth':
                            targetDate = moment().subtract(1, 'month')
                            dateFrom = targetDate.date(1).format('YYYY-MM')
                            dateTo = moment().date(1).subtract(1, 'days').format('YYYY-MM')
                            break;
                        case 'last3Month':
                            targetDate = moment().subtract(3, 'month')
                            dateFrom = targetDate.date(1).format('YYYY-MM')
                            dateTo = moment().date(1).subtract(1, 'days').format('YYYY-MM')
                            break;
                        case 'last6Month':
                            targetDate = moment().subtract(6, 'month')
                            dateFrom = targetDate.date(1).format('YYYY-MM')
                            dateTo = moment().date(1).subtract(1, 'days').format('YYYY-MM')
                            break;
                        default:
                            targetDate = periodName.split('~')
                            dateFrom = moment(targetDate[0]).format('YYYY-MM')
                            dateTo = moment(targetDate[1]).format('YYYY-MM')

                    }
                    return dateFrom + '~' + dateTo
                },

                initPeriod: function($scope, params) { //只针对单个机构的统计页面，所有机构的Dashboard 不太好兼容
                    var dateFrom = params.dateFrom || ''
                    var dateTo = params.dateTo || ''

                    // $scope.radioPeriodAll = this.getDate('all')
                    $scope.radioPeriodLastMonth = this.getDate('lastMonth')
                    $scope.radioPeriodLast3Month = this.getDate('last3Month')
                    $scope.radioPeriodLast6Month = this.getDate('last6Month')

                    if (dateFrom && dateTo) {
                        $scope.radioPeriod = dateFrom + '~' + dateTo
                    } else {
                        $scope.radioPeriod = $scope.radioPeriodLastMonth
                    }

                    $scope.radioPeriodCustom = ($scope.radioPeriod === $scope.radioPeriodLastMonth || $scope.radioPeriod === $scope.radioPeriodLast3Month || $scope.radioPeriod === $scope.radioPeriodLast6Month) ? 'custom' : $scope.radioPeriod

                },

                adapterInstitutionDashboard: function(data) {

                    function addSign(list) {
                        _.each(list || [], function(v) {
                            if (v.name.indexOf('已还') > -1) {
                                v.data = _.map(v.data, function(v2) {
                                    return -v2;
                                })
                            }
                        })
                    }

                    addSign(data.total_trends)
                    addSign(data.increment_trends)

                    return data
                }

                /*getPeriod: function(params) {
                    if (!params.dateFrom || !params.dateTo) return 'lastMonth'

                    if (params.date_period === 'custom') return params.dateFrom + '~' + params.dateTo

                    return params.date_period
                },

                getCustomPeriod: function (params) {
                    if (!params.dateFrom || !params.dateTo) return 'custom'

                    if (params.date_period === 'custom') return params.dateFrom + '~' + params.dateTo

                    return 'custom'
                },

                getPeriodName: function (date_period) {
                    return
                }*/

            }

        })

})();
