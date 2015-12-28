;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktLoanPlanCtrl', function($scope, $state, $stateParams, $location, ktLoanPlansService) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.approve = function(number) {
                ktLoanPlansService.update({
                    projectID: $stateParams.projectID,
                    // number: $stateParams.number,
                    status: 'approved',
                    number: number
                }, function(data) {
                    $scope.status = data.status || 'approved'
                })
            }

            $scope.reject = function(number) {
                ktLoanPlansService.update({
                    projectID: $stateParams.projectID,
                    // number: $stateParams.number,
                    status: 'rejected',
                    number: number
                }, function(data) {
                    $scope.status = data.status || 'rejected'
                })
            }

            $scope.sendDirective = function(number) {
                ktLoanPlansService.update({
                    projectID: $stateParams.projectID,
                    // number: $stateParams.number,
                    status: 'done',
                    number: number
                }, function(data) {
                    $scope.status = data.status || 'done'
                    $scope.summary = data.summary
                    $scope.approve_at = data.approve_at || moment().format('YYYY-MM-DD H:mm:ss')
                    updateStatus(data)
                })
            }

            /*$scope.repaymentsNav = {
                maxSize: 5
            }

            $scope.pageChanged = function() {
                var search = $location.search()

                $.extend(params, search)

                ktLoanPlansService.get(params, function(data) {
                    $.extend($scope.repayments, data.repayments) // 分页请求还款摘要
                })
            }*/

            /*$scope.stateChanged = function() {
                $location.search($.extend($location.search(), {
                    status: $scope.status || null,
                    page: 1,
                    per_page: 10
                }))
            }*/

            function updateStatus (data) {
                var statusValue = (!data || data.status == 'initial') ? '放款计划' : '放款结果'
                $state.current.data.breadcrumbTitle = $state.current.data.pageTitle = statusValue
            }

            var params = {
                projectID: $stateParams.projectID,
                number: $stateParams.number,
                page: 1,
                per_page: 10
            }
            var search = $location.search()

            $.extend(params, search)

            ktLoanPlansService.get(params, function(data) {
                updateStatus(data)
                // $state.current.data.breadcrumbTitle = $state.current.data.pageTitle = (data.status == 'initial' ? '放款计划' : '放款结果')
                $.extend($scope, data, params)
                    /*$.extend($scope.repaymentsNav, {
                        totalItems: data.totalItems
                    }, params)*/
            })
        })
})();
