;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktDebtorCtrl', function($scope, $location, $stateParams, $uibModal, ktDataHelper) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.subProjectID
        })

        $scope.params = {
            maxSize: 5,
            page: 1,
            status: 'all',
            loanType: 'loan_applications',
            batchNo: $stateParams.batchNo,
            per_page: 10
        }

        $scope.debtor = {}

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }

        $scope.statusChange = function(status) {
            $location.search($.extend($location.search(), {
                status: status || null,
                page: 1,
                per_page: 10
            }))
        }

        $scope.statusList = ktDataHelper.getLoanStatusMap()
        $scope.filterStatus = ktDataHelper.filterStatus(['all', 'rejected', 'approved'])

        $scope.getStatusName = function(status) {
            var st = _.find($scope.statusList, function(v) {
                return v.value === (status || $scope.params.status)
            }) || {}
            return st.name || '未知'
        }

        $scope.getStatusNameNice = ktDataHelper.getStatusNameNice($scope)

    })

    .controller('ktDebtorTableCtrl', function($scope, $location, $stateParams, ktDebtorsService) {

        // $scope.params.subProjectID = $stateParams.subProjectID
        // $scope.params.number = $stateParams.number

        var search = $location.search()
        $.extend($scope.params, search)

        ktDebtorsService.get($scope.params, function(data) {
            $.extend($scope.debtor, data.loan_batch);
            $scope.params.totalItems = data.total_items;
        });
    })
})();
