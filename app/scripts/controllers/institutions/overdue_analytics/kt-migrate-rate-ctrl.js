;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktOverdueAnalyticsMigrateRateCtrl', function($scope, $stateParams, ktInstitutionsService) {

            $scope.$emit('activeInstitutionChange', {id: $stateParams.id})

            $scope.radioPeriod = 'lastMonth'
            $scope.radioPeriodCustom = 'custom'
            $scope.migrateRateChart = {
                cm1: true,
                m1m2: true,
                m2m3: true,
                m3m4: true,
                m4m5: true,
                m5m6: true,
                radioDataShowType: 'chart',
                chartDimension: '逾期率'
            }


            // ktInstitutionsService.get({
            //     id: $stateParams.id
            // }, function(data) {
            //     $scope.institutions = data.ininstitutions
            // })
        })
})();
