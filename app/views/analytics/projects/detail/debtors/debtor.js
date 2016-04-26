;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktDebtorCtrl', function($scope, $location, $stateParams) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })

        $scope.params = {
            maxSize: 10,
            page: 1,
            status: 'all',
            loanType: 'loan_applications',
            batchNo: 'ZXM120160414F380', // for debugger
            per_page: 10
        }

        $scope.debtor = {}

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }
    })

    .controller('ktDebtorTableCtrl', function($scope, $location, $stateParams, ktDebtorsService, ktDataHelper) {
        var search = $location.search()
        $.extend($scope.params, search)

        $scope.getEducationName = ktDataHelper.getEducationName

        ktDebtorsService.get($scope.params, function(data) {
            $.extend($scope.debtor, data.loan_batch);
            $scope.params.totalItems = data.loan_batch.total_items;
        });
    })
})();
