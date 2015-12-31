;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktProjectEditCtrl', function($scope, $window, $stateParams, ktSweetAlert, ktProjectsService) {

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

            ktProjectsService.get({
                projectID: $stateParams.projectID,
                // detail: 'info'
            }, function(data) {
                $scope.project = data.project
                $scope.project.projectID = $stateParams.projectID
            })

            $scope.cancel = function($event) {
                $event.preventDefault()
                $window.history.back()
            }

            $scope.submitForm = function() {
                ktProjectsService.update($scope.project).$promise.then(function() {
                    ktSweetAlert.swal({
                        title: '提示',
                        text: '项目信息修改成功',
                        type: 'success',
                    });
                }, function(res) {
                    $scope.pendingRequests = false
                    ktSweetAlert.swal({
                        title: '提示',
                        text: $.isArray(res.error) ? res.error.join('<br/>') : (res.error || '抱歉，项目信息修改失败！'),
                        type: 'error',
                    });
                })
                return false;
            }
        })
})();
