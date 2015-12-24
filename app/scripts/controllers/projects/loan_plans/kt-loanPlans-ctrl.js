;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktLoanPlansCtrl', function($scope, $location, $stateParams, ktDataHelper) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })

        $scope.statusList = [{
            name: '全部',
            value: 'all'
        },{
            name: '未开始',
            value: 'initial'
        },{
            name: '已完成',
            value: 'done'
        },{
            name: '已拒绝',
            value: 'rejected'
        }]

        $scope.getStatusNameNice = ktDataHelper.getStatusNameNice($scope)

        $scope.params = {
            maxSize: 5,
            page: 1,
            per_page: 10,
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

    .controller('ktLoanPlansTableCtrl', function($scope, $location, $stateParams, ktLoanPlansService) {
        $scope.loanPlans = [];
        // $scope.params.maxSize = 5
        // $.extend($scope, ktDataHelper)
        $scope.params.projectID = $stateParams.projectID

        // var params = {
        //     id: $stateParams.id,
        //     page: 1,
        //     per_page: 10
        // }
        
        var search = $location.search()
        $.extend($scope.params, search)

        ktLoanPlansService.get($scope.params, function(data) {

            // $scope.projects = ktProjectsHelper.adapter(data.projects || []);
            $scope.loanPlans = data.loan_plans;
            $scope.params.totalItems = data.totalItems;
            // $.extend($scope.params, params)
        });
    })
})();
