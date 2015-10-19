;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktAssetFeatureTimelimitCtrl', function($scope, $stateParams, ktInstitutionsService) {

            $scope.$emit('activeInstitutionChange', {id: $stateParams.id})

            $scope.radioPeriod = 'lastMonth'
            $scope.radioPeriodCustom = 'custom'
            $scope.radioDataShowType = 'chart'
            $scope.chartDimension = '时点余额'
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
