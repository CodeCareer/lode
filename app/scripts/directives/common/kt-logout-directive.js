;
(function() {
    'use strict';
    angular.module('kt.lode')
        .directive('ktLogout', function($window, $rootScope, $state, ipCookie, CacheFactory) {
            return {
                restrict: 'A',
                link: function(scope, elem) {
                    elem.on('click', function(event) {
                        event.stopPropagation()
                        event.preventDefault()

                        delete $window.localStorage.user;
                        delete $window.localStorage.token;
                        $rootScope.user = null;
                        ipCookie.remove('token')
                        CacheFactory.clearAll()

                        $state.go($rootScope.currentState || 'account.login', {}, {
                            reload: true
                        })
                    })
                }
            }
        })
})();
