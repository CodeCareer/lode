;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktLoanPlansRepaymentsCtrl', function($scope, $stateParams, $location, ktLoanPlansService) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.params = {
                maxSize: 5,
                // projectID: $stateParams.projectID,
                batchNo: $stateParams.batchNo,
                content: 'payment_details',
                page: 1,
                per_page: 10
            }

            var search = $location.search()
            $.extend($scope.params, search)

            $scope.pageChanged = function() {
                ktLoanPlansService.get($scope.params, function(data) {
                    $scope.payment_details.borrowers = data.payment_details.borrowers
                })

                // $location.search('page', $scope.params.page)
            }

            ktLoanPlansService.get($scope.params, function(data) {
                $.extend($scope, data)
                $scope.params.totalItems = data.total_items
            })
        })
})();
