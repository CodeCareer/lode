/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.lode')

    .factory('ktCaptchaService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/users/captcha')
    })

})();
