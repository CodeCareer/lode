;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktLoanPlansResultsCtrl', function($scope, $stateParams, $location, ktLoanPlansService, ktDataHelper) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.params = {
                maxSize: 5,
                projectID: $stateParams.projectID,
                number: $stateParams.number,
                content: 'results',
                page: 1,
                status: 'all',
                per_page: 10
            }

            var search = $location.search()
            $.extend($scope.params, search)

            $scope.pageChanged = function() {
                ktLoanPlansService.get($scope.params, function(data) {
                    $scope.borrowers = data.borrowers
                })
            }

            $scope.statusList = [{
                name: '全部',
                value: 'all'
            }, {
                name: '成功',
                value: 'approved'
            }, {
                name: '失败',
                value: 'rejected'
            }]
            $scope.getStatusNameNice = ktDataHelper.getStatusNameNice($scope)

            $scope.getStatusName = function(status) {
                var statusObj = _.find($scope.statusList, function(v) {
                    return v.value === (status || $scope.params.status)
                }) || {}
                return statusObj.name || '未知'
            }

            $scope.statusChange = function(status) {
                $scope.params.status = status
                ktLoanPlansService.get($scope.params, function(data) {
                    $scope.borrowers = data.borrowers
                })
            }

            ktLoanPlansService.get($scope.params, function(data) {
                $.extend($scope, data)
                $scope.params.totalItems = data.total_items
            })
        })
})();
