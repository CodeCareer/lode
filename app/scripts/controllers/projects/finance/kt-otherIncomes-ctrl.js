;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktOtherIncomesCtrl', function($scope, $location, $stateParams) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })

        $scope.params = {
            maxSize: 5,
            page: 1,
            per_page: 10,
            sub_project_id: 'all'
        }

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }

    })

    .controller('ktOtherIncomesTableCtrl', function($scope, $location, $stateParams, ktOtherIncomesService, ktDataHelper) {
        $scope.otherIncomes = [];
        $scope.subProjects = [];
        $scope.params.projectID = $stateParams.projectID
        $.extend($scope, ktDataHelper)

        var search = $location.search()
        $.extend($scope.params, search)

        ktOtherIncomesService.get($scope.params, function(data) {
            $scope.otherIncomes = data.other_incomes;
            $scope.params.totalItems = data.totalItems;
        });


    })
})();
