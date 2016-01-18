;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktDebtorsCtrl', function($scope, $location, $stateParams, ktDataHelper) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })

        $scope.params = {
            maxSize: 5,
            page: 1,
            loanType: 'loan_batches',
            projectType: 'projects',
            projectID: $stateParams.projectID,
            per_page: 10
        }

        $scope.statusList = ktDataHelper.getLoanStatusMap()
        $scope.getStatusNameNice = ktDataHelper.getStatusNameNice($scope)

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }

        /*$scope.stateChanged = function() {
            $location.search($.extend($location.search(), {
                status: $scope.params.status || null,
                page: 1,
                per_page: 10
            }))
        }*/
    })

    .controller('ktDebtorsTableCtrl', function($scope, $location, $stateParams, ktDebtorsService) {
        $scope.debtors = [];

        var search = $location.search()
        $.extend($scope.params, search)

        ktDebtorsService.get($scope.params, function(data) {

            // $scope.projects = ktProjectsHelper.adapter(data.projects || []);
            $scope.debtors = data.loan_batches;
            $scope.params.totalItems = data.total_items;
            // $.extend($scope.params, params)
        });
    })
})();
