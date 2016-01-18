;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktSubProjectAddCtrl', function($scope, $window, $state, $stateParams, ktSweetAlert, ktProjectsService) {

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

            $scope.subProject = {
                projectID: $stateParams.projectID,
                subContent: 'subprojects',
                // subProjectID: 'new'
            }

            $scope.cancel = function($event) {
                $event.preventDefault()
                $window.history.back()
            }

            $scope.submitForm = function() {
                ktProjectsService.save($scope.subProject).$promise.then(function() {
                    ktSweetAlert.swal({
                        title: '提示',
                        text: '新增成功',
                        type: 'success',
                    }, function() {
                        $state.go('analytics.project.settings.subProject.list.table')
                    });
                }, function(res) {
                    $scope.pendingRequests = false
                    ktSweetAlert.swal({
                        title: '提示',
                        text: $.isArray(res.error) ? res.error.join('<br/>') : (res.error || '抱歉，新增失败！'),
                        type: 'error',
                    });
                })
                return false;
            }
        })
})();
