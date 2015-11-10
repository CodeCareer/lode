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
                    var date_from, date_to, targetDate;

                    switch (periodName) {
                        case 'all':
                            date_from = '',
                            date_to = moment().date(1).subtract(1, 'days').format('YYYY-MM')
                            break;
                        case 'lastMonth':
                            targetDate = moment().subtract(1, 'month')
                            date_from = targetDate.date(1).format('YYYY-MM')
                            date_to = moment().date(1).subtract(1, 'days').format('YYYY-MM')
                            break;
                        case 'last3Month':
                            targetDate = moment().subtract(3, 'month')
                            date_from = targetDate.date(1).format('YYYY-MM')
                            date_to = moment().date(1).subtract(1, 'days').format('YYYY-MM')
                            break;
                        case 'last6Month':
                            targetDate = moment().subtract(6, 'month')
                            date_from = targetDate.date(1).format('YYYY-MM')
                            date_to = moment().date(1).subtract(1, 'days').format('YYYY-MM')
                            break;
                        default:
                            targetDate = periodName.split('~')
                            date_from = moment(targetDate[0]).format('YYYY-MM')
                            date_to = moment(targetDate[1]).format('YYYY-MM')

                    }
                    return date_from + '~' + date_to
                },

                initPeriod: function($scope, params) { //只针对单个机构的统计页面，所有机构的Dashboard 不太好兼容
                    var date_from = params.date_from || ''
                    var date_to = params.date_to || ''

                    // $scope.radioPeriodAll = this.getDate('all')
                    $scope.radioPeriodLastMonth = this.getDate('lastMonth')
                    $scope.radioPeriodLast3Month = this.getDate('last3Month')
                    $scope.radioPeriodLast6Month = this.getDate('last6Month')

                    if (date_from && date_to)
                        $scope.radioPeriod = date_from + '~' + date_to
                    else
                        $scope.radioPeriod = $scope.radioPeriodLastMonth

                    $scope.radioPeriodCustom = ($scope.radioPeriod == $scope.radioPeriodLastMonth || $scope.radioPeriod == $scope.radioPeriodLast3Month || $scope.radioPeriod == $scope.radioPeriodLast6Month) ? 'custom' : $scope.radioPeriod

                },

                adapterInstitutionDashboard: function (data) {

                    function addSign(list) {
                        _.each(list || [], function (v, i) {
                            if (v.name.indexOf('已还') > -1) {
                                v.data = _.map(v.data, function (v2) {
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
                    if (!params.date_from || !params.date_to) return 'lastMonth'
                    
                    if (params.date_period === 'custom') return params.date_from + '~' + params.date_to

                    return params.date_period
                },

                getCustomPeriod: function (params) {
                    if (!params.date_from || !params.date_to) return 'custom'

                    if (params.date_period === 'custom') return params.date_from + '~' + params.date_to

                    return 'custom'
                },

                getPeriodName: function (date_period) {
                    return 
                }*/

            }

        })

})();
