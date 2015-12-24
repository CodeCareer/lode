;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktBlacklistCtrl', function($scope, $location, $stateParams) {

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

    .controller('ktBlacklistTableCtrl', function($scope, $location, $stateParams, ktBlacklistService) {
        $scope.blacklist = [];
        // $scope.params.maxSize = 5
        // $.extend($scope, ktProjectsHelper)
        $scope.params.projectID = $stateParams.projectID

        var search = $location.search()
        $.extend($scope.params, search)

        ktBlacklistService.get($scope.params, function(data) {

            // $scope.projects = ktProjectsHelper.adapter(data.projects || []);
            $scope.blacklist = data.blacklist;
            $scope.params.totalItems = data.totalItems;
            // $.extend($scope.params, params)
        });
    })
})();
