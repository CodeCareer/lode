;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktDebtorDetailLayoutCtrl', function($scope) {
        $scope.tabs = {
            basic_info: true,
            payments: false,
            active3: false
        }
        $scope.shared = {}
    })

    .controller('ktDebtorDetailCtrl', function($window, $rootScope, $scope, $state, $stateParams, ktProjectsService, ktDataHelper) {

        var activeTab = $stateParams.tab || 'basic_info'
        $scope.tabs[activeTab] = true

        ktProjectsService.get({
            projectID: $stateParams.projectID,
            subContent: 'borrowers',
            subID: $stateParams.debtorID,
            tab: activeTab
        }, function(data) {
            switch (activeTab) {
                case 'basic_info':
                    ktDataHelper.seperateTwoColumns(data.basic, 7)
                    $scope.info = data.basic
                    break
                case 'payments':
                    $scope.repayments = {}
                    $scope.repayments.payments = data.payments
                    $scope.repayments.loan_info = data.loan_info
                    break
                case 'active3':
                    $scope.attachments = data.attachments
                    break
                default:
                    console.error('tab no exist')
            }

            $scope.token = encodeURIComponent($window.localStorage.token)
            $scope.debtorID = $stateParams.debtorID

            $scope.shared.goTo = function(tab) { // 第一次数据加载后再处理避免请求两次的bug,否则tab组件会默认触发一次select
                $state.go($state.current.name, {
                    tab: tab
                })
            }
        })
    })
})();
