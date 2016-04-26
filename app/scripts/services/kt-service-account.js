/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.lode')

    // user service
    .factory('ktUserService', function($resource, CacheFactory, ktApiVersion) {

        var profileCache
        if (!CacheFactory.get('profileCache')) {
            /*eslint-disable*/
            profileCache = CacheFactory('profileCache', {
                maxAge: 1 * 60 * 60 * 1000, // Items added to this cache expire after 1 hours
                cacheFlushInterval: 1 * 60 * 60 * 1000, // This cache will clear itself every 1 hours.
                deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
                storageMode: 'localStorage' // This cache will use `localStorage`.
            })

            /*eslint-enable*/
        }

        return $resource('/ajax/' + ktApiVersion + '/users', {}, {
            'get': {
                method: 'GET',
                // apiMock: true,
                cache: profileCache
            }
        })
    })

    // 登录接口
    .factory('ktLoginService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/sessions/:confirm', {
            confirm: '@confirm'
        }, {
            'post': {
                method: 'POST',
                // apiMock: true,
            },
            'save': {
                method: 'POST',
                // apiMock: true,
            }
        })
    })

})();
