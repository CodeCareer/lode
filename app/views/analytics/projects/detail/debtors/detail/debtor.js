;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktDebtorCtrl', function($scope, $location, $stateParams, $state, $uibModal, ktLoanPlansService, ktDebtorsService, ktDataHelper, ktSweetAlert) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
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

        $scope.createPlan = function() {
            ktLoanPlansService.create({
                // projectID: $stateParams.projectID,
                // number: $stateParams.number,
                status: 'approved',
                batchNo: $stateParams.batchNo,
                content: 'new'
            }, function(data) {
                ktSweetAlert.swal({
                    title: '成功',
                    text: data.error || '放款计划生成成功！',
                    type: 'success',
                });
                $scope.debtor.status = 'planned'
            }, function() {

            })
        }

        $scope.approveAll = function($event) {
            $event.stopPropagation()
            $event.preventDefault()
            var projectID = $stateParams.projectID
            var batchNo = $stateParams.batchNo

            var modalInstance = $uibModal.open({
                templateUrl: 'views/modals/approve_borrower.html',
                size: 'md',
                /*resolve: {
                    number: function() {
                        return number
                    }
                },*/
                /*eslint-disable*/
                controller: function($timeout, $scope, $state, $uibModalInstance, ktApprovalsService, ktRulesService) {
                    /*eslint-enable*/

                    $scope.rules = [{
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

                    ktRulesService.get({
                        projectID: projectID
                    }, function(data) {
                        var conMaps = _.object(_.pluck(data.conditions, 'value'), _.pluck(data.conditions, 'name'))
                        var resMaps = _.object(_.pluck(data.results, 'value'), _.pluck(data.results, 'name'))
                        var fieldsMap = _.object(_.pluck(data.fields, 'value'), _.pluck(data.fields, 'name'))
                        _.each(data.rules, function(vr) {
                            vr.condition_des = '借款人' + fieldsMap[vr.field] + conMaps[vr.condition] + vr.value
                            vr.result_des = resMaps[vr.result]
                        })
                        $scope.rules = data.rules
                    })

                    $scope.selected = {}
                    $scope.selected.rules = _.pluck($scope.rules, 'id')
                    $scope.batchNo = batchNo

                    $scope.checkAll = true
                    $scope.filterByBlacklist = true

                    $scope.checkAllToggle = function() {
                        $scope.filterByBlacklist = $scope.checkAll ? true : false;
                        $scope.selected.rules = $scope.checkAll ? _.pluck($scope.rules, 'id') : [];
                    }

                    $scope.checkListChange = function() {
                        $timeout(function() {
                            $scope.checkAll = $scope.selected.rules.length === $scope.rules.length && $scope.filterByBlacklist === true
                        }, 10)
                    }

                    $scope.ok = function() {
                        $scope.error = ''; // 每次提交清除错误
                        // $scope.pendingRequests = false
                        ktApprovalsService.save({
                            // projectID: projectID,
                            batchNo: $stateParams.batchNo,
                            by_bl: $scope.filterByBlacklist,
                            rules: $scope.selected.rules
                        }, function(data) {
                            $uibModalInstance.close(data);
                        }, function(data) {
                            $scope.error = data.error || '审批失败！';
                        })
                    };

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.gotoRule = function() {
                        $uibModalInstance.dismiss('cancel');
                        $state.go('analytics.project.debtors.rules', {
                            projectID: projectID
                        })
                    }

                    $scope.gotoBlacklist = function() {
                        $uibModalInstance.dismiss('cancel');
                        $state.go('analytics.project.debtors.blacklist.list.table', {
                            projectID: projectID
                        })
                    }
                },
            });

            //关闭model promise
            modalInstance.result.then(function() {
                /*$state.go($state.current.name, {}, {
                    reload: true
                });*/
                ktDebtorsService.get($scope.params, function(data) {
                    $.extend($scope.debtor, data.loan_batch);
                    $scope.params.totalItems = data.total_items;
                });
                /*if (data.result) {
                    $scope.shared.debtor.status = 'done'
                }
                $.each($scope.shared.debtor.borrowers, function(i, e) {
                    e.status = data.result[i]
                })*/
            })
        }

    })

    .controller('ktDebtorTableCtrl', function($scope, $location, $stateParams, ktDebtorsService) {
        var search = $location.search()
        $.extend($scope.params, search)

        ktDebtorsService.get($scope.params, function(data) {
            $.extend($scope.debtor, data.loan_batch);
            $scope.params.totalItems = data.total_items;
        });
    })
})();
