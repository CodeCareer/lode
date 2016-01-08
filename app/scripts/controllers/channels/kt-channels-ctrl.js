;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktChannelsCtrl', function($scope, $location, $stateParams) {

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

    .controller('ktChannelsTableCtrl', function($scope, $location, $state, ktChannelsService) {
        $scope.channels = []

        var search = $location.search()
        $.extend($scope.params, search)

        ktChannelsService.get($scope.params, function(data) {
            $scope.channels = data.channels;
            $scope.params.totalItems = data.totalItems;
            // $.extend($scope.params, params)
        });
    })
})();
