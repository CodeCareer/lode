;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktRepaymentCtrl', function($scope, $stateParams, ktDataHelper) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.subProjectID
            })

            $scope.statusList = ktDataHelper.getPaymentStatusMap()
            $scope.getStatusNameNice = ktDataHelper.getStatusNameNice($scope)

            $scope.bill = {}

            $scope.params = {
                maxSize: 5,
                billID: $stateParams.billID,
                content: 'payment_details',
                page: 1,
                per_page: 10
            }

            $scope.pageChanged = function() {
                $location.search('page', $scope.params.page)
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
                $.extend($scope.bill, data.statement)
                $scope.params.totalItems = data.statement.total_items
                    // updatePageTitle(data)
            })
        })
})();
