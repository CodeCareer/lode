;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktProjectEditCtrl', function($scope, $state, $window, $stateParams, ktSweetAlert, ktProjectsService, ktInstitutionsService) {

            $scope.$emit('activeProjectChange', {
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

            ktInstitutionsService.get({
                inst_type: 'zhudai'
            }, function(res) {
                $scope.institutions = res.institutions
            })

            ktProjectsService.get({
                projectID: $stateParams.projectID,
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
                        type: 'success'
                    }, function() {
                        $state.go('analytics.project.settings.info')
                    });

                    $scope.$emit('activeProjectUpdate', $scope.project)

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
