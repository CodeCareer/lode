/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.lode')

    .factory('ktS', function($window) {
        return function (url) {
            return ($window.assetsMap && $window.assetsMap[url]) ? $window.assetsMap[url] : url
        }
    })

    /*.provider('ktAssetsMap', function() {
    	this.$get = function ($window) {
    		return {
    			getAsset: function (url) {
		            return ($window.assetsMap && $window.assetsMap[url]) ? $window.assetsMap[url] : url
		        },
		        haha: '123123'
    		}
    	}
    })*/

})();
