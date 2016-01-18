;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktInstitutionsCtrl', function($scope, $location, $stateParams) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })

        $scope.params = {
            page: 1,
            per_page: 10,
            maxSize: 5
        }

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

    .controller('ktInstitutionsTableCtrl', function($scope, $location, $state, ktInstitutionsService) {
        $scope.institutions = []

        var search = $location.search()
        $.extend($scope.params, search)

        ktInstitutionsService.get($scope.params, function(data) {
            $scope.institutions = data.institutions;
            $scope.params.totalItems = data.total_items;
            // $.extend($scope.params, params)
        });
    })
})();
