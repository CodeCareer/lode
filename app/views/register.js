;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktRegisterCtrl', function($scope, $rootScope, $stateParams, $timeout, $state, ktUserService, ktSweetAlert, ktCaptchaService) {
            $scope.registerUser = {}
            $scope.registerUser.type = $stateParams.type || 'fund'

            $scope.submitForm = function() {
                $scope.pendingRequests = true

                ktUserService.save($scope.registerUser).$promise.then(function(res) {
                    $scope.pendingRequests = false
                    if (res.success) {
                        ktSweetAlert.swal({
                            title: '提交成功',
                            text: '感谢您的申请，我们的业务人员会尽快与您联系，以进行线下机构认证。',
                            type: 'success',
                        }, function() {
                            $state.go($rootScope.previousState || 'home.index')
                        });
                    } else {
                        ktSweetAlert.swal({
                            title: '提交失败',
                            text: res.error || '抱歉，您的信息没有提交成功，请再次尝试！',
                            type: 'error',
                        });
                    }
                }, function(res) {
                    $scope.pendingRequests = false
                    ktSweetAlert.swal({
                        title: '提交失败',
                        text: $.isArray(res.error) ? res.error.join('<br/>') : (res.error || '抱歉，您的信息没有提交成功，请再次尝试！'),
                        type: 'error',
                    });
                })
                return false;
            }

            // var timerHandlerMessage
            // var timerHandlerTel;
            $scope.waitCaptchaMessage = false;
            $scope.waitCaptchaTel = false;
            $scope.captchaSettings = {}
            var timerMessage = ktCaptchaHelper.timerMessage($scope)
            var timerTel = ktCaptchaHelper.timerTel($scope)

            // 60秒计时短信
            /*function timerMessage(second) {
                $scope.timerMessage = second
                timerHandlerMessage = setInterval(function() {
                    $scope.timerMessage--;
                    if ($scope.timerMessage <= 0) {
                        $scope.waitCaptchaMessage = false;
                        clearInterval(timerHandlerMessage)
                    }
                    $scope.$apply();
                }, 1000)
            }

            // 60秒计时语音
            function timerTel(second) {
                $scope.timerTel = second
                timerHandlerTel = setInterval(function() {
                    $scope.timerTel--;
                    if ($scope.timerTel <= 0) {
                        $scope.waitCaptchaTel = false;
                        clearInterval(timerHandlerTel)
                    }
                    $scope.$apply();
                }, 1000)
            }*/

            // 获取验证码，首先校验图形验证码，通过事件的异步方式
            $scope.getCaptcha = function($event, channel) {
                $event.preventDefault()
                $event.stopPropagation()

                var CAPTCHA = $scope.captchaSettings.CAPTCHA
                if (!CAPTCHA) {
                    ktSweetAlert.swal({
                        title: '验证码组件有误',
                        text: '验证码组件有误！',
                        type: 'error',
                    });
                    return
                }

                CAPTCHA.validate($scope.registerUser.img_captcha, function(isValid) {
                    if (isValid) {
                        if (channel === 'sms' && $scope.waitCaptchaMessage) return
                        if (channel === 'tel' && $scope.waitCaptchaTel) return

                        //获取语音或短信验证码
                        ktCaptchaService.get({
                            mobile: $scope.registerUser.mobile,
                            channel: channel
                        }, function(data) {

                            if (data.status_code === 0) {
                                $scope.registerUser.verif_id = data.verif_id
                                if (channel === 'sms') {
                                    $scope.waitCaptchaMessage = true;
                                    timerMessage(60);
                                } else {
                                    $scope.waitCaptchaTel = true;
                                    timerTel(60);
                                }
                            } else {
                                ktSweetAlert.swal({
                                    title: '发送失败',
                                    text: data.msg || '抱歉，系统繁忙！',
                                    type: 'error',
                                });
                            }
                        }, function(data) {
                            ktSweetAlert.swal({
                                title: '发送失败',
                                text: data.msg || '抱歉，系统繁忙！',
                                type: 'error',
                            });
                        })
                    } else {
                        $timeout(function() {
                            ktSweetAlert.swal({
                                title: '提示',
                                text: '图形验证码不正确！',
                                type: 'error',
                            }, function() {
                                var form = CAPTCHA._container.closest('form')
                                form.trigger('accessible.' + form.attr('id'), {
                                    field: 'img_captcha'
                                })
                                $scope.registerUser.img_captcha = '';
                            });
                        }, 100)
                    }
                })
                // return false
            }

            // 图形校验结果
            /*$scope.$on('imgCaptchaSuccess', function($event, data) {

                //图形校验成功有data
                if (!data) {
                    ktSweetAlert.swal({
                        title: '提示',
                        text: '图形验证码不正确！',
                        type: 'error',
                        confirmButtonColor: '#62cb31',
                        // confirmButtonText: '确定'
                    });
                    return;
                }

                var channel = data.channel

                if (channel == 'sms' && $scope.waitCaptchaMessage) return
                if (channel == 'tel' && $scope.waitCaptchaTel) return

                //获取语音或短信验证码
                ktCaptchaService.get({
                    mobile: $scope.registerUser.mobile,
                    channel: channel
                }, function(data) {

                    if (data.status_code === 0) {
                        $scope.registerUser.verif_id = data.verif_id
                        if (channel == 'sms') {
                            $scope.waitCaptchaMessage = true;
                            timerMessage(60);
                        } else {
                            $scope.waitCaptchaTel = true;
                            timerTel(60);
                        }
                    } else {
                        ktSweetAlert.swal({
                            title: '发送失败',
                            text: data.msg || '抱歉，系统繁忙！',
                            type: 'error',
                            confirmButtonColor: '#62cb31',
                            // confirmButtonText: '确定'
                        });
                    }
                }, function(data) {
                    ktSweetAlert.swal({
                        title: '发送失败',
                        text: data.msg || '抱歉，系统繁忙！',
                        type: 'error',
                        confirmButtonColor: '#62cb31',
                        // confirmButtonText: '确定'
                    });
                })
            })*/

        })
})();
