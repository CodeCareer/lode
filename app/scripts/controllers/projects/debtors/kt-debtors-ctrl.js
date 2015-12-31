;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktDebtorsCtrl', function($scope, $location, $stateParams) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })

        $scope.params = {
            maxSize: 5,
            page: 1,
            per_page: 10
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

    .controller('ktDebtorsTableCtrl', function($scope, $location, $stateParams, ktDebtorsService) {
        $scope.debtors = [];
        // $scope.params.maxSize = 5
        // $.extend($scope, ktProjectsHelper)
        $scope.params.projectID = $stateParams.projectID

        var search = $location.search()
        $.extend($scope.params, search)

        /*$scope.goDetail = function($event, projectId) {
            $event.stopPropagation()
            $event.preventDefault()
            $state.go('analytics.project.dashboard', {
                id: projectId
            })
        }*/

        ktDebtorsService.get($scope.params, function(data) {

            // $scope.projects = ktProjectsHelper.adapter(data.projects || []);
            $scope.debtors = data.debtors;
            $scope.params.totalItems = data.totalItems;
            // $.extend($scope.params, params)
        });
    })
})();
