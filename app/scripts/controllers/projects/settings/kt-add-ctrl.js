;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktProjectAddCtrl', function($scope, $window, $state, $stateParams, ktSweetAlert, ktProjectsService) {

            $scope.$emit('activeInstitutionChange', {
                projectID: $stateParams.projectID
            })

            $scope.datepickerSettings = {
                singleDate: true,
                showShortcuts: false,
                autoClose: true,
                time: {
                    enabled: true
                }
            }
            $scope.project = {
                projectID: 'new'
            }

            $scope.cancel = function($event) {
                $event.preventDefault()
                $window.history.back()
            }

            $scope.submitForm = function() {
                ktProjectsService.save($scope.project).$promise.then(function() {
                    ktSweetAlert.swal({
                        title: '提示',
                        text: '项目新增成功',
                        type: 'success',
                    }, function() {
                        $state.go('analytics.projects.list.table')
                    });
                }, function(res) {
                    $scope.pendingRequests = false
                    ktSweetAlert.swal({
                        title: '提示',
                        text: $.isArray(res.error) ? res.error.join('<br/>') : (res.error || '抱歉，项目新增失败！'),
                        type: 'error',
                    });
                })
                return false;
            }
        })
})();
