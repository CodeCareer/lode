;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktInstitutionInfoInfoCtrl', function($scope, $stateParams, ktInstitutionsService) {

            $scope.$emit('activeInstitutionChange', {
                projectID: $stateParams.projectID
            })

            // $scope.radioPeriod = 'lastMonth'
            // $scope.radioPeriodCustom = 'custom'
            // $scope.radioDataShowType = 'chart'
            // $scope.chartDimension = '新增余额'
            // $scope.menuData = {
            //     index: 0,
            //     value: 'absolute'
            // }

            ktInstitutionsService.get({
                projectID: $stateParams.projectID
            }, function(data) {
                $scope.institution = data.institution
            })
        })
})();
