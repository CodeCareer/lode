;
(function() {
    'use strict';
    angular.module('kt.lode')
        //账户layout控制器
        .controller('ktAccountCtrl', function($scope, $state) {

            //tabset 指令不支持在active属性中使用表达式，所以用scope boolean替代
            $scope.tabStatus = {
                active1: false,
                active2: false,
            }

            $scope.tabSelect = function(state) {
                $state.go(state)
            }
        })
        
        //账户设置控制器
        .controller('ktAccountSetCtrl', function($scope) {
            $scope.tabStatus.active2 = true //更新父controller内的tabstatus
            $scope.accountAccordion = {
                openA: true
            }
            $scope.$watch('accountAccordion.openA', function(newValue) {
                $scope.$broadcast('accountAccordion.openA', {
                    isOpen: newValue
                })
            })
        })
        //为了生产单独的scope,避免form受外层 directive scope等影响
        .controller('ktPasswordUpdateCtrl', function($scope, ktUserService, ktSweetAlert) {

            var defaultForm = {
                old_password: '',
                password: '',
                password_confirmation: ''
            }

            var reset = function() {
                $scope.passwordResetForm.$setUntouched()
                $scope.passwordResetForm.$setPristine()
                $scope.accountSet = angular.copy(defaultForm)
            }

            $scope.cancel = function(event) {
                /*eslint-disable*/
                event && event.stopPropagation()
                event && event.preventDefault()
                /*eslint-enable*/
                $scope.accountAccordion.openA = false
            }

            $scope.$on('accountAccordion.openA', function(event, data) {
                if (data.isOpen === false) {
                    reset()
                }
            })

            $scope.submitForm = function() {
                $scope.pendingRequests = true
                ktUserService.update($scope.accountSet).$promise.then(function(data) {
                    $scope.pendingRequests = false
                    if (data.success) {
                        ktSweetAlert.swal({
                            title: '更改成功',
                            text: data.error || '密码更改成功！',
                            type: 'success',
                        }, function() {
                            $scope.accountSet = angular.copy(defaultForm)
                            $scope.accountAccordion.openA = false
                        });
                    }
                }).catch(function(data) {
                    $scope.pendingRequests = false
                    ktSweetAlert.swal({
                        title: '保存失败',
                        text: data.error || '抱歉，密码更改失败！',
                        type: 'error',
                    });
                })
            }
        })
})();
