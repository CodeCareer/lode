;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktProjectDashboardCtrl', function($scope, $stateParams, ktReportService) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            // $scope.radioPeriod = 'all'
            // $scope.radioPeriodCustom = 'custom'
            $scope.ownFunds = {
                radioDataShowType: 'all', // all ,single
                fieldNames: [
                    '自有资金投放额',
                    '累计成交金额',
                    '未收回自有资金投放额',
                    '逾期率（0，180）',
                    '不良率（90，180）',
                    '预期收益（约定收益率）',
                    '总收益',
                    '已兑付收益',
                    '其他收入（融资顾问费、评审费等）',
                    '浮动收益'
                ]
            }

            $scope.guaranteeLoan = {
                radioDataShowType: 'all', // all ,single
                fieldNames: [
                    '担保责任额',
                    '累计成交金额',
                    '担保责任余额',
                    '逾期率（0，180）',
                    '不良率（90，180）',
                    '总收益',
                    '担保费（费率）',
                    '其他收入',
                    '浮动收益'
                ]
            }

            ktReportService.get({
                type: 'total',
                projectID: $stateParams.projectID,
            }, function(data) {
                $.extend($scope, data)
                // $scope.summary = data.summary
            })

            

        })
})();
