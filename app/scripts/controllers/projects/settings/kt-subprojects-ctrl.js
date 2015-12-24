;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktSubProjectsCtrl', function($scope, $location, $stateParams) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })

        $scope.params = {
            maxSize: 5,
            page: 1,
            per_page: 10,
            projectID: $stateParams.projectID,
            subProject: 'sub_projects'
        }

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }

        $scope.stateChanged = function() {
            $location.search($.extend($location.search(), {
                status: $scope.params.status || null,
                page: 1,
                per_page: 10
            }))
        }
    })

    .controller('ktSubProjectsTableCtrl', function($scope, $location, $state, ktProjectsService) {
        $scope.subProjects = [];

        var search = $location.search()
        $.extend($scope.params, search)

        ktProjectsService.get($scope.params, function(data) {
            $scope.subProjects = data.sub_projects;
            $scope.params.totalItems = data.totalItems;
        });
    })
})();
