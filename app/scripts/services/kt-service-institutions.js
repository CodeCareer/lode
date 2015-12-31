/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.lode')

    // 机构
    .factory('ktInstitutionsService', function($resource, ktApiVersion) {
        return $resource('/ajax/api/' + ktApiVersion + '/institutions/:id', {
            id: '@id'
        })
    })

    // 机构统计
    .factory('ktReportService', function($resource, ktApiVersion) {
        return $resource('/ajax/api/' + ktApiVersion + '/institutions/:id/reports/:type', {
            id: '@id',
            type: '@type'
        })
    })

})();
