;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktDashboardCtrl', function($scope, $stateParams, ktStaticsReportService, ktDataHelper) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.statByProject = ktDataHelper.getStatByProject()

            ktStaticsReportService.get({
                type: 'summary'
            }, function(data) {
                $.extend($scope, data)
            })

        })
})();
