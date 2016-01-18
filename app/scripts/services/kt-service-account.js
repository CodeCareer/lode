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
                maxAge: 12 * 60 * 60 * 1000, // Items added to this cache expire after 12 hours
                cacheFlushInterval: 12 * 60 * 60 * 1000, // This cache will clear itself every 12 hours.
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

    //获取user信息
    /*.factory('ktSessionUserService', function($q, $window, ktUserService) {
        return {
            get: function(params) {
                var localStorage = $window.localStorage
                var user = localStorage.user
                var deferred = $q.defer()
                user = user ? JSON.parse(user) : null

                if (!user) {
                    ktUserService.get(params || {}, function(res) {
                        if (res && res.account) {
                            localStorage.user = JSON.stringify(res.account)
                            deferred.resolve(res ? res.account : null)
                        } else {
                            deferred.resolve(null)
                        }
                    }, function() {
                        return deferred.resolve(null); //这里不用reject， 否则会触发stateError 时间，导致home上的resolve失效
                    })
                } else {
                    setTimeout(function() {
                        deferred.resolve(user)
                    }, 10)
                }
                return deferred.promise;
            },
            del: function() {
                delete localStorage.user
            }
        }
    })*/

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
