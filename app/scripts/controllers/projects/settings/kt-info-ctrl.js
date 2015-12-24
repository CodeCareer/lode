;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktProjectInfoCtrl', function($scope, $stateParams, ktProjectsService) {

            $scope.$emit('activeInstitutionChange', {
                projectID: $stateParams.projectID
            })

            ktProjectsService.get({
                projectID: $stateParams.projectID,
                // detail: 'info'
            }, function(data) {
                $scope.project = data.project
            })
        })
})();
