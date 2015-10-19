;
(function() {
    'use strict';
    angular.module('kt.lode')
        .factory('ktApiCache', ['$cacheFactory', function($cacheFactory) {
            return $cacheFactory('ktApiCache');
        }]);
})();
