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
                // projectID: $stateParams.projectID,
                // projectType: 'projects',
                billID: $stateParams.billID,
                content: 'payment_details',
                page: 1,
                status: 'all',
                per_page: 10
            }

            $scope.confirmBill = function() {
                ktSweetAlert.swal({
                    title: '提示：',
                    text: '需要确认财务账上收到的钱与账单显示的应收还款总额数据一致。如果不一致，可能需要逐笔核对个人明细。',
                    type: 'warning',
                    showCancelButton: true
                }, function(isConfirm) {
                    if (!isConfirm) return
                    ktBillsService.update({
                        projectID: $stateParams.projectID,
                        billID: $stateParams.billID,
                        status: 'checked'
                    }, function(data) {
                        $scope.bill.status = data.status || 'checked'
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
                // $scope.getStatusNameNice = ktDataHelper.getStatusNameNice($scope)

            $scope.getStatusNameNice = function(status) {
                var st = _.find($scope.statusList, function(v) {
                    return v.value === (status || $scope.params.status)
                }) || {}
                return '<span class="' + (status !== 'overdue' ? 'approved-color' : 'warn-color') + '">' + st.name + '</span>'
            }

            $scope.statusList = ktDataHelper.getPaymentStatusMap()
                // $scope.getStatusNameNice = ktDataHelper.getStatusNameNice($scope)

            $scope.getStatusName = function(status) {
                var st = _.find($scope.statusList, function(v) {
                    return v.value === (status || $scope.params.status)
                }) || {}
                return st.name || '未知'
            }

            var search = $location.search()
            $.extend($scope.params, search)

            ktBillsService.get($scope.params, function(data) {
                $.extend($scope, data)
                $scope.params.totalItems = data.statement.total_items
            })
        })
})();
