;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktLoanPlanCtrl', function($scope, $stateParams) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.loanPlan = {}

            $scope.params = {
                // projects: 'projects',
                // projectID: $stateParams.projectID,
                batchNo: $stateParams.batchNo,
                page: 1,
                per_page: 10
            }
        })
        .controller('ktLoanPlanTableCtrl', function($scope, $state, $location, $stateParams, ktLoanPlansService) {

            var search = $location.search()
            $.extend($scope.params, search)

            /*function updatePageTitle(data) {
                var statusValue = (!data || data.status === 'draft') ? '放款计划' : '放款结果'
                $state.current.data.breadcrumbTitle = $state.current.data.pageTitle = statusValue
            }*/

            ktLoanPlansService.get($scope.params, function(data) {
                $.extend($scope.loanPlan, data.loan_plan)
                // updatePageTitle(data)
            })
        })
})();
