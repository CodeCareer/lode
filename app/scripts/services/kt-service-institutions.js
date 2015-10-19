/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.lode')

    // 机构
    .factory('ktInstitutionsService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/institutions/:id', {
            id: '@id'
        })
    })
    
})();
