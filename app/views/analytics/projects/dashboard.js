;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktProjectDashboardCtrl', function($scope, $stateParams, ktProjectStaticsReportService, ktDataHelper) {

            // $scope.$emit('activeProjectChange', {
            //     projectID: $stateParams.projectID
            // })

            $scope.statByProject = ktDataHelper.getStatByProject()

            ktProjectStaticsReportService.get({
                type: 'summary',
                projectID: $stateParams.projectID,
            }, function(data) {
                $.extend($scope, data)
            })
        })
})();
