/**
 * common tools
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular
        .module('kt.lode')
        // 登录通用控制函数
        .factory('ktLoginCommon', function($rootScope, $window, $state, $location, ktSweetAlert, ktUrlGet, CacheFactory) {
            return function(ktLoginService, scope) {
                scope.pendingRequests = true

                ktLoginService.save(scope.user).$promise.then(function(res) {
                    scope.pendingRequests = false

                    if (res.token) {
                        CacheFactory.clearAll()
                        $window.localStorage.token = res.token
                        var url = $rootScope.currentUrl || ktUrlGet('/', $location.search())
                        // var redirectState = $rootScope.previousState || 'analytics.reports.dashboard'
                        // if (redirectState.indexOf('analytics.') === -1) redirectState = 'analytics.reports.dashboard'
                        // var params = $rootScope.previousStateParams || {}
                        $location.url(url)
                        // $state.go(redirectState, params)
                    } else {
                        $state.go('account.confirm', {
                            institution: res.institution,
                            user: scope.user
                        })
                    }
                }).catch(function(res) {
                    scope.pendingRequests = false

                    ktSweetAlert.swal({
                        title: '登录失败',
                        text: res.error || '登录失败',
                        type: 'error',
                    });

                })
            }
        })
        .factory('ktUrlGet', function() {
            return function(url, params) {
                var ret = url + ($.isEmptyObject(params) ? '' : ('?' + $.param(params)))
                return ret
            }
        })
})();
