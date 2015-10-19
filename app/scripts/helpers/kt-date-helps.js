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
                    var startDate, endDate, targetDate;

                    switch (periodName) {
                        case 'lastMonth':
                            targetDate = moment().subtract(1, 'month')
                            startDate = targetDate.date(1).format('YYYY-MM-DD')
                            endDate = moment().date(1).subtract(1, 'days').format('YYYY-MM-DD')
                            break;
                        case 'last3Month': 
                            targetDate = moment().subtract(3, 'month')
                            startDate = targetDate.date(1).format('YYYY-MM-DD')
                            endDate = moment().date(1).subtract(1, 'days').format('YYYY-MM-DD')
                            break;
                        case 'last6Month': 
                            targetDate = moment().subtract(6, 'month')
                            startDate = targetDate.date(1).format('YYYY-MM-DD')
                            endDate = moment().date(1).subtract(1, 'days').format('YYYY-MM-DD')
                            break;
                        default :
                            return 'custom'

                    }
                    return startDate + '~' + endDate
                }
            }

        })

})();
