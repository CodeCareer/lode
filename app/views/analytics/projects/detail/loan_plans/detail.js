;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktLoanPlanCtrl', function($scope, $state, $stateParams, $location, ktLoanPlansService) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.params = {
                content: 'summary',
                batchNo: $stateParams.batchNo,
                page: 1,
                per_page: 10
            }

            var actionStatusMap = {
                approve: 'approved',
                reject: 'rejected',
                issue: 'issued'
            }

            // 放款计划审核action
            function loanAction(action, callback) {
                return function() {
                    ktLoanPlansService.save({
                        content: action,
                        batchNo: $stateParams.batchNo,
                    }, function(data) {

                        $scope.summary.status = actionStatusMap[action]
                            /*eslint-disable*/
                        callback && callback(data)
                            /*eslint-enable*/
                    })
                }
            }

            $scope.summary = {}

            $scope.approve = loanAction('approve')
            $scope.reject = loanAction('reject')
            $scope.issue = loanAction('issue', function(data) {
                $scope.summary.failed_issue_count = data.failed_issue_count
                $scope.summary.issue_time = data.issue_time
                // ktLoanPlansService.get($scope.params, function(data) {
                //     updatePageTitle(data)
                //     $.extend($scope.summary, data.summary)
                // })
            })

            function updatePageTitle(data) {
                var statusValue = (!data || data.status === 'draft') ? '放款计划' : '放款结果'
                $state.current.data.breadcrumbTitle = $state.current.data.pageTitle = statusValue
            }

            var search = $location.search()
            $.extend($scope.params, search)

            ktLoanPlansService.get($scope.params, function(data) {
                updatePageTitle(data)
                $.extend($scope.summary, data.summary)
            })
        })
})();
