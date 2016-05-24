;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktLoginCtrl', function($scope, ktLoginService, ktLoginCommon, ktSweetAlert) {
            try {
                window.localStorage.setItem('_detect', 'work')
            } catch (e) {
                ktSweetAlert.swal({
                    title: '错误：',
                    text: '您的浏览器不支持localStorage，可能是无痕浏览模式导致的，请不要使用无痕上网模式',
                    type: 'error',
                })
            }
            $scope.submitForm = function() {
                ktLoginCommon(ktLoginService, $scope)
            }
        })
})();
