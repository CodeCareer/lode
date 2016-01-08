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
        .factory('ktLoginCommon', function($rootScope, $window, $state, ktSweetAlert) {
            return function(ktLoginService, scope) {
                scope.pendingRequests = true

                ktLoginService.save(scope.user).$promise.then(function(res) {
                    scope.pendingRequests = false

                    if (res.token) {
                        $window.localStorage.token = res.token

                        var redirectState = $rootScope.previousState || 'analytics.reports.dashboard'
                        if (redirectState.indexOf('analytics.') === -1) redirectState = 'analytics.reports.dashboard'

                        var params = $rootScope.previousStateParams || {}
                        $state.go(redirectState, params)
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
        /*.factory('ktPermitsValid',  function($rootScope){
            return function (permit){
                // var permits = $rootScope.user.permits
                // var role = $rootScope.user.role
            };
        })*/

})();
