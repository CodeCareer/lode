;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktRulesCtrl', function($scope, $location, $stateParams, ktRulesService) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })
        
        $scope.rules = []

        $scope.save = function (index, id) {
            ktRulesService.update(
                $scope.rules[index]
            )
        }

        $scope.remove = function (index, id) {
            $scope.rules = _.filter($scope.rules, function (v, i) {
                return i !== index
                // to do
            })
        }

        $scope.addRule = function () {
            $scope.rules.push({id: 'new'})
        }

        ktRulesService.get({
            projectID: $stateParams.projectID
        }, function (data) {
            $scope.rules = data.rules
            $scope.results = data.results
            $scope.fields = data.fields
            $scope.conditions = data.conditions
        })
    })

})();
