;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktOtherIncomeEditCtrl', function($scope, $window, $state, $stateParams, ktSweetAlert, ktOtherIncomesService) {

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

            $scope.otherIncome = {
                projectID: $stateParams.projectID,
                otherIncomeID: $stateParams.otherIncomeID
            }

            ktOtherIncomesService.get($scope.otherIncome, function(data) {
                $.extend($scope.otherIncome, data.other_income)
            })

            $scope.cancel = function($event) {
                $event.preventDefault()
                $window.history.back()
            }

            $scope.submitForm = function() {
                ktOtherIncomesService.update($scope.otherIncome).$promise.then(function() {
                    ktSweetAlert.swal({
                        title: '提示',
                        text: '保存成功',
                        type: 'success',
                    }, function() {
                        $state.go('analytics.project.finance.otherIncome.list.table')
                    });
                }, function(res) {
                    $scope.pendingRequests = false
                    ktSweetAlert.swal({
                        title: '提示',
                        text: $.isArray(res.error) ? res.error.join('<br/>') : (res.error || '抱歉，保存失败！'),
                        type: 'error',
                    });
                })
                return false;
            }
        })
})();
