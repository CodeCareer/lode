;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktRepaymentCtrl', function($scope, $stateParams, $location, ktRepaymentsService, ktSweetAlert) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.confirmRepayment = function() {
                ktSweetAlert.swal({
                    title: '提示：',
                    text: '还款指令会在还款当日由系统自动下发！',
                    type: 'info',
                }, function() {
                    ktRepaymentsService.update({
                        projectID: $stateParams.projectID,
                        number: $stateParams.number,
                        status: 'done'
                    }, function(data) {
                        $scope.repayment.status = data.status || 'done'
                    })
                });
            }

            $scope.pageChanged = function() {
                var search = $location.search()
                $.extend($scope.params, search)

                ktRepaymentsService.get($scope.params, function(data) {
                    $.extend($scope.repayments, data.repayments) // 分页请求还款清单明细
                })
            }

            $scope.params = {
                maxSize: 5,
                projectID: $stateParams.projectID,
                number: $stateParams.number,
                page: 1,
                per_page: 10
            }
            var search = $location.search()
            $.extend($scope.params, search)

            ktRepaymentsService.get($scope.params, function(data) {
                $.extend($scope, data)
                $scope.params.totalItems = data.totalItems
                    /*$.extend($scope.params, {
                        totalItems: data.totalItems
                    }, params)*/
            })
        })
})();
