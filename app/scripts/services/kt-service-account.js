/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.lode')

    //user service
    .factory('ktUserService', function($resource, ktApiVersion) {
        return $resource('/ajax/api/' + ktApiVersion + '/users')
    })

    //获取user信息
    .factory('ktSessionUserService', function($q, $window, ktUserService) {
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
    })

    //user session service
    .factory('ktLoginService', function($resource, ktApiVersion) {
        return $resource('/ajax/api/' + ktApiVersion + '/sessions/:confirm', {
            confirm: '@confirm'
        })
    })

    //institutions service
    .factory('ktInstitutionService', function($resource, ktApiVersion) {
        return $resource('/ajax/api/' + ktApiVersion + '/institutions')
    })

})();
