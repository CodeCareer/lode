;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktLoanPlansCtrl', function($scope, $location, $stateParams, ktDataHelper) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.subProjectID
        })

        $scope.statusList = ktDataHelper.getLoanStatusMap()

        $scope.getStatusNameNice = ktDataHelper.getStatusNameNice($scope)

        $scope.params = {
            maxSize: 5,
            projectType: 'subprojects',
            projectID: $stateParams.subProjectID,
            page: 1,
            per_page: 10,
        }

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }
    })

    .controller('ktLoanPlansTableCtrl', function($scope, $location, $stateParams, ktLoanPlansService) {
        $scope.loanPlans = [];

        var search = $location.search()
        $.extend($scope.params, search)

        ktLoanPlansService.get($scope.params, function(data) {

            $scope.loanPlans = data.loan_plans;
            $scope.params.totalItems = data.total_items;
        });
    })
})();
