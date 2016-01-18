;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktLoginCtrl', function($scope, ktLoginService, ktLoginCommon) {
            $scope.submitForm = function() {
                ktLoginCommon(ktLoginService, $scope)
            }
        })
})();
