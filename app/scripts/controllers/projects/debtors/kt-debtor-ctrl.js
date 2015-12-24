;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktDebtorCtrl', function($scope, $location, $stateParams, $uibModal, ktDataHelper) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })
        $scope.params = {
            maxSize: 5,
            page: 1,
            status: 'all',
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

        $scope.statusList = [{
            name: '全部',
            value: 'all'
        },{
            name: '未审批',
            value: 'initial'
        },{
            name: '已通过',
            value: 'approved'
        },{
            name: '已拒绝',
            value: 'rejected'
        }]

        $scope.getStatusName = function(status) {
            var st = _.find($scope.statusList, function (v) {
                return v.value === (status || $scope.params.status)
            }) || {}
            return st.name || '未知'
        }

        $scope.getStatusNameNice = ktDataHelper.getStatusNameNice($scope)

        $scope.approveAll = function($event) {
            $event.stopPropagation()
            $event.preventDefault()
            var projectID = $stateParams.projectID
            var number = $stateParams.number

            var modalInstance = $uibModal.open({
                templateUrl: 'views/modals/approve_borrower.html',
                size: 'md',
                /*resolve: {
                    number: function() {
                        return number
                    }
                },*/
                controller: function($scope, $state, $uibModalInstance, ktDebtorsService) {
                    $scope.items = [{
                        id: '1',
                        name: '规则1',
                        condition: '借款人年龄小于20',
                        result: '拒绝'
                    }, {
                        id: '2',
                        name: '规则2',
                        condition: '借款人收入小于5000',
                        result: '拒绝'
                    }, {
                        id: '3',
                        name: '规则3',
                        condition: '借款人省市等于北京',
                        result: '通过'
                    }]

                    $scope.selected = {}
                    $scope.selected.items = _.pluck($scope.items, 'id')
                    $scope.number = number

                    $scope.checkAll = true
                    $scope.filterByBlacklist = true

                    $scope.checkAllToggle = function() {
                        $scope.filterByBlacklist = $scope.checkAll ? true :false;
                        $scope.selected.items = $scope.checkAll ? _.pluck($scope.items, 'id') : [];
                    }

                    $scope.checkListChange = function() {
                        $scope.checkAll = $scope.selected.items.length === $scope.items.length && $scope.filterByBlacklist === true 
                    }

                    $scope.ok = function() {
                        $scope.error = ''; // 每次提交清除错误
                        // $scope.pendingRequests = false
                        ktDebtorsService.update({
                            projectID: projectID,
                            number: $scope.number,
                            by_bl: $scope.filterByBlacklist,
                            rules: $scope.selected.items
                        }, function(data) {
                            $uibModalInstance.close(data);
                        }, function(data) {
                            $scope.error = data.error || '取消预约失败！';
                        })
                    };

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.gotoRule = function() {
                        $uibModalInstance.dismiss('cancel');
                        $state.go('analytics.project.rules', {
                            projectID: projectID
                        })
                    }

                    $scope.gotoBlacklist = function () {
                        $uibModalInstance.dismiss('cancel');
                        $state.go('analytics.project.blacklist.list.table', {
                            projectID: projectID
                        })
                    }
                },
            });

            //关闭model promise
            modalInstance.result.then(function(data) {
                if (data.result)
                    $scope.debtor.status = 'done'
                    $.each($scope.debtor.borrowers, function(i, e) {
                        e.status = data.result[i]
                    })
            })
        }

    })

    .controller('ktDebtorTableCtrl', function($scope, $location, $stateParams, ktDebtorsService) {
        // $scope.debtor;
        // $scope.params.maxSize = 5

        
        // $scope.getStatusName($location.search().borrower_status)
            // $.extend($scope, ktProjectsHelper)

        $scope.params.projectID = $stateParams.projectID
        $scope.params.number = $stateParams.number

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
            $.extend($scope.debtor, data.debtor);
            $scope.params.totalItems = data.totalItems;
        });
    })
})();
