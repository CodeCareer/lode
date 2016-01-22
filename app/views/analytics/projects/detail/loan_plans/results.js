;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktLoanPlansResultsCtrl', function($scope, $stateParams, $location, ktLoanPlansService, ktDataHelper) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.params = {
                maxSize: 5,
                // projectID: $stateParams.projectID,
                batchNo: $stateParams.batchNo,
                content: 'issue_results',
                page: 1,
                issue_status: 'all',
                per_page: 10
            }

            var search = $location.search()
            $.extend($scope.params, search)

            $scope.pageChanged = function() {
                ktLoanPlansService.get($scope.params, function(data) {
                    $scope.issue_results.borrowers = data.issue_results.borrowers
                })
            }

            $scope.statusList = ktDataHelper.getBorrowersLoanStatusMap()
            // $scope.filterStatus = ktDataHelper.filterStatus(['all', 'success', 'fail'])
            $scope.getStatusNameNice = ktDataHelper.getStatusNameNice($scope)

            $scope.getStatusName = function(status) {
                var statusObj = _.find($scope.statusList, function(v) {
                    return v.value === (status || $scope.params.issue_status)
                }) || {}
                return statusObj.name || '未知'
            }

            $scope.statusChange = function(status) {
                $scope.params.issue_status = status
                ktLoanPlansService.get($scope.params, function(data) {
                    $scope.issue_results.borrowers = data.issue_results.borrowers
                })
            }

            ktLoanPlansService.get($scope.params, function(data) {
                $.extend($scope, data)
                $scope.params.totalItems = data.total_items
            })
        })
})();
