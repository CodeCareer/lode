;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktDashboardCtrl', function($scope, ktStaticsReportService, ktDataHelper) {

            // $scope.$emit('activeProjectChange', {
            //     projectID: $stateParams.projectID
            // })

            $scope.statByProject = ktDataHelper.getStatByProject()

            ktStaticsReportService.get({
                type: 'summary'
            }, function(data) {
                $.extend($scope, data)
            })

        })
})();

/*;
(function() {
    'use strict';
    angular.module('kt.lode')
        // .controller('ktProjectDashboardCtrl', function($scope, $stateParams, ktProjectStaticsReportService, ktDataHelper) {
        .controller('ktProjectDashboardCtrl', function($scope, $stateParams, ktStaticsReportService, ktDataHelper) {

            // $scope.$emit('activeProjectChange', {
            //     projectID: $stateParams.projectID
            // })


            $scope.statByProject = ktDataHelper.getStatByProject()

            ktStaticsReportService.get({
                subContent: 'dashboard',
                // subContent: 'cashflow',
                projectID: $stateParams.projectID,
            }, function(data) {
                $.extend($scope, data)
            })
        })
})();*/
