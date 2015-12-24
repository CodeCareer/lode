;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktBillCtrl', function($scope, $stateParams, $location, ktBillsService, ktSweetAlert, ktDataHelper) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.params = {
                maxSize: 5,
                projectID: $stateParams.projectID,
                billID: $stateParams.billID,
                page: 1,
                status: 'all',
                per_page: 10
            }

            

            $scope.confirmBill = function() {
                ktSweetAlert.swal({
                    title: "提示：",
                    text: '需要确认财务账上收到的钱与账单显示的应收还款总额数据一致。如果不一致，可能需要逐笔核对个人明细。',
                    type: "warning",
                    showCancelButton: true
                }, function(isConfirm) {
                    if (!isConfirm) return
                    ktBillsService.update({
                        projectID: $stateParams.projectID,
                        billID: $stateParams.billID,
                        status: 'done'
                    }, function(data) {
                        $scope.bill.status = data.status || 'done'
                    })
                });
            }

            $scope.pageChanged = function() {
                // var search = $location.search()
                // $.extend($scope.params, search)
                ktBillsService.get($scope.params, function(data) {
                    $scope.bill = data.bill
                })
            }

            $scope.statusChange = function(status) {
                $scope.params.status = status
                ktBillsService.get($scope.params, function(data) {
                    $scope.bill = data.bill
                })
            }

            $scope.billTypes = ktDataHelper.getBillTypes()
            $scope.getTypeName = ktDataHelper.getBillTypeFactory($scope)
            $scope.getStatusNameNice = ktDataHelper.getStatusNameNice($scope)

            $scope.statusList = [{
                name: '全部',
                value: 'all'
            }, {
                name: '正常',
                value: 'normal'
            }, {
                name: '提前还款',
                value: 'ahead'
            }, {
                name: '逾期',
                value: 'overdue'
            }]

            $scope.getStatusName = function(status) {
                var st = _.find($scope.statusList, function(v) {
                    return v.value === (status || $scope.params.status)
                }) || {}
                return st.name || "未知"
            }

            var search = $location.search()
            $.extend($scope.params, search)

            ktBillsService.get($scope.params, function(data) {
                $.extend($scope, data)
                $scope.params.totalItems = data.totalItems
            })
        })
})();
