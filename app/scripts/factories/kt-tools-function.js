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
                        var url = $rootScope.wantJumpUrl || ktUrlGet('/', $location.search())
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
                    var error = res.error || '登录失败！'
                    if (res.code === 22 && res.name === 'QuotaExceededError') {
                        error = '您的浏览器不支持localStorage,如果您使用的是iOS浏览器，可能是您使用“无痕浏览模式”导致的，请不要使用无痕浏览模式！'
                    }

                    ktSweetAlert.swal({
                        title: '登录失败',
                        text: error,
                        type: 'error',
                    });

                })
            }
        })

})();
