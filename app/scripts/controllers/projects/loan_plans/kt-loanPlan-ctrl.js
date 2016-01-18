;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktLoanPlanCtrl', function($scope, $state, $stateParams, $location, ktLoanPlansService) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            function updateStatus(status, callback) {
                ktLoanPlansService.update({
                    // projectID: $stateParams.projectID,
                    status: status,
                    batchNo: $stateParams.batchNo,
                }, function(data) {
                    $scope.status = data.status || status
                    /*eslint-disable*/
                    callback && callback(data)
                    /*eslint-enable*/
                })
            }

            $scope.loanPlan = {}

            $scope.approve = updateStatus('approved')
            $scope.approve = updateStatus('reject')
            $scope.approve = updateStatus('finished', function(data) {
                $scope.loanPlan.summary = data.summary
                $scope.loanPlan.approval_time = data.approval_time || moment().format('YYYY-MM-DD H:mm:ss')
                updateStatus(data)
            })

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

            function updatePageTitle(data) {
                var statusValue = (!data || data.status === 'draft') ? '放款计划' : '放款结果'
                $state.current.data.breadcrumbTitle = $state.current.data.pageTitle = statusValue
            }

            $scope.params = {
                // projects: 'projects',
                // projectID: $stateParams.projectID,
                batchNo: $stateParams.batchNo,
                page: 1,
                per_page: 10
            }

            var search = $location.search()
            $.extend($scope.params, search)

            ktLoanPlansService.get($scope.params, function(data) {
                updatePageTitle(data)
                $.extend($scope.loanPlan, data.loan_plan)
            })
        })
})();
