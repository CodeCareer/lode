;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktInstitutionInfoInfoCtrl', function($scope, $stateParams, ktInstitutionsService) {

            $scope.$emit('activeInstitutionChange', {id: $stateParams.id})

            // $scope.radioPeriod = 'lastMonth'
            // $scope.radioPeriodCustom = 'custom'
            // $scope.radioDataShowType = 'chart'
            // $scope.chartDimension = '新增余额'
            // $scope.menuData = {
            //     index: 0,
            //     value: 'absolute'
            // }

            ktInstitutionsService.get({
                id: $stateParams.id
            }, function(data) {
                $scope.institution = data.institution
            })
        })
})();
