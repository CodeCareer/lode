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
            subContent: 'borrowers',
            projectID: $stateParams.projectID,
            per_page: 10
        }

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }
    })

    .controller('ktDebtorTableCtrl', function($scope, $location, ktProjectsService, ktDataHelper) {
        var search = $location.search()
        $.extend($scope.params, search)

        $scope.getEducationName = ktDataHelper.getEducationName

        ktProjectsService.get($scope.params, function(data) {
            $scope.borrowers = data.borrowers
            $scope.params.totalItems = data.total_items;
        })
    })
})();
