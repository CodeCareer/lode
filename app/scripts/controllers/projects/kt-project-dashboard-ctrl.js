;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktProjectDashboardCtrl', function($scope, $stateParams, ktReportService, ktDataHelper) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            // $scope.radioPeriod = 'all'
            // $scope.radioPeriodCustom = 'custom'
            $scope.ownFunds = ktDataHelper.getOwnFunds()
            $scope.guaranteeLoan = ktDataHelper.getGuaranteeLoan()

            ktReportService.get({
                type: 'total',
                projectID: $stateParams.projectID,
            }, function(data) {
                $.extend($scope, data)
                // $scope.summary = data.summary
            })

            

        })
})();
