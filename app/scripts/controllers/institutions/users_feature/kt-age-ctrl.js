;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktUsersFeatureAgeCtrl', function($scope, $stateParams) {

            $scope.$emit('activeInstitutionChange', {
                projectID: $stateParams.projectID
            })

            $scope.radioPeriod = 'lastMonth'
            $scope.radioPeriodCustom = 'custom'
            $scope.radioDataShowType = 'chart'
            $scope.chartDimension = '新增余额'
            $scope.menuData = {
                index: 0,
                value: 'absolute'
            }

            // ktInstitutionsService.get({
            //     id: $stateParams.id
            // }, function(data) {
            //     $scope.institutions = data.ininstitutions
            // })
        })
})();
