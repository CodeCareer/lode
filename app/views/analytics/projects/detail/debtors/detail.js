;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktDebtorDetailLayoutCtrl', function($scope, $state) {
        $scope.tabs = {
            active1: false,
            active2: false,
            active3: false
        }

        $scope.goTo = function(tab) {
            $state.go($state.current.name, {
                tab: tab
            })
        }
    })

    .controller('ktDebtorDetailCtrl', function($scope, $state, $stateParams, ktProjectsService, ktDataHelper) {

        var activeTab = $stateParams.tab || 'active1'
        $scope.tabs[activeTab] = true

        ktProjectsService.get({
            projectID: $stateParams.projectID,
            subContent: 'borrowers',
            subID: $stateParams.debtorID,
            tab: activeTab
        }, function(data) {
            switch (activeTab) {
                case 'active1':
                    ktDataHelper.seperateTwoColumns(data.info, 7)
                    $scope.info = data.info
                    break
                case 'active2':
                    $scope.repayments = data.repayments
                    break
                case 'active3':
                    $scope.attachments = data.attachments
                    break
                default:
                    console.error('tab no exist')
            }
        })
    })
})();
