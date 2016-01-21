;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktLoanPlansPlansCtrl', function($scope, $stateParams, $location, ktLoanPlansService) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.params = {
                maxSize: 5,
                batchNo: $stateParams.batchNo,
                content: 'details',
                page: 1,
                per_page: 10
            }

            var search = $location.search()
            $.extend($scope.params, search)

            $scope.pageChanged = function() {
                // params.page = $scope.params.page
                ktLoanPlansService.get($scope.params, function(data) {
                    $.extend($scope, data)
                })

                // $location.search('page', $scope.params.page)
            }
            ktLoanPlansService.get($scope.params, function(data) {
                $.extend($scope, data)
                $scope.params.totalItems = data.total_items
            })
        })
})();
