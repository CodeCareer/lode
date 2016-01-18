;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktRepaymentCtrl', function($scope, $stateParams) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.subProjectID
            })

            $scope.bill = {}

            $scope.params = {
                projectType: 'subprojects',
                projectID: $stateParams.subProjectID,
                batchNo: $stateParams.batchNo,
                page: 1,
                per_page: 10
            }
        })
        .controller('ktRepaymentTableCtrl', function($scope, $state, $location, $stateParams, ktBillsService) {

            var search = $location.search()
            $.extend($scope.params, search)

            /*function updatePageTitle(data) {
                var statusValue = (!data || data.status === 'draft') ? '放款计划' : '放款结果'
                $state.current.data.breadcrumbTitle = $state.current.data.pageTitle = statusValue
            }*/

            ktBillsService.get($scope.params, function(data) {
                $.extend($scope.bill, data.bill)
                    // updatePageTitle(data)
            })
        })
})();
