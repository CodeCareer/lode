;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktCashSettingsCtrl', function($scope, $state, $stateParams, $location, $window, $timeout, ktProjectsService, ktFormValidator) {

        $scope.project = {
            history_params: {
                dates: [],
                trends: []
            },
            periods: []
        }

        var cache = JSON.parse($window.localStorage.getItem($stateParams.projectID + '.cashForecast') || '{}')
        var hasntCache = _.isEmpty(cache)

        // 基本参数初始化
        $scope.params = $.extend({
            start_date: moment().format('YYYY年MM月'),
            periods: 0,
            customOnly: false,
            startIndex: 0,
            active_param: 'average',
            prepayment_rate: 0,
            default_rate: 0,
            pending_rate: 0,
        }, cache)

        // 参数选取默认列表
        $scope.paramsList = [{
            name: '平均',
            value: 'average'
        }, {
            name: '最大',
            value: 'max'
        }, {
            name: '最小',
            value: 'min'
        }, {
            name: '最新',
            value: 'lastest'
        }, {
            name: '自定义',
            value: 'custom'
        }]

        // 选取预测时间时候触发
        $scope.changeStartDate = function(value) {
            $scope.params.start_date = value
            updateParams()
        }

        // 参数选取的时候触发
        $scope.updateActiveParam = function(value) {
            if ($scope.customOnly) return
            $scope.params.active_param = value
            updateParams()
        }

        // 自定义的时候错误提示和内容校验
        $scope.customParams = {
            prepayment_rate: {
                errors: '年化早偿率填写错误',
                open: false
            },
            default_rate: {
                errors: '年化违约率填写错误',
                open: false
            },
            pending_rate: {
                errors: '未还款率填写错误',
                open: false
            },
            validate: function() { // 做值得验证
                var prepaymentRate = ktFormValidator.validateInput('#prepayment_rate', '.cash-filter')
                var defaultRate = ktFormValidator.validateInput('#default_rate', '.cash-filter')
                var noRepayRate = ktFormValidator.validateInput('#pending_rate', '.cash-filter')
                var valid = false
                var _self = this
                switch (true) {
                    case !prepaymentRate.valid:
                        _self.prepayment_rate.open = true
                        break
                    case !defaultRate.valid:
                        _self.default_rate.open = true
                        break
                    case !noRepayRate.valid:
                        _self.pending_rate.open = true
                        break
                    default:
                        valid = true
                        _self.prepayment_rate.open = false
                        _self.default_rate.open = false
                        _self.pending_rate.open = false
                }

                $timeout(function() {
                    _self.prepayment_rate.open = false
                    _self.default_rate.open = false
                    _self.pending_rate.open = false
                }, 2000)

                return valid
            }
        }

        // 应用
        $scope.applySettings = function() {
            // $window.sessionStorage
            if ($scope.params.active_param === 'custom' && !$scope.customParams.validate()) {
                return
            }
            // $window.localStorage.get($stateParams.projectID+'.cashForecast')
            // console.log($scope.params);
            $window.localStorage.setItem($stateParams.projectID + '.cashForecast', JSON.stringify($scope.params || {}))
            $state.go('analytics.project.cash.forecast.index')

        }

        // 获取项目的期数等基本信息
        ktProjectsService.get({
            projectID: $stateParams.projectID,
            subContent: 'cashflows',
            subID: 'history_factors',
            // prepayment_rate: ajaxParams.prepayment_rate,
            // default_rate: ajaxParams.default_rate,
            // pending_rate:ajaxParams.ajaxParams
        }, function(data) {
            var project = $scope.project = data.project

            // 获取可选的期限列表
            var validPeriods = _.clone(project.history_params.dates)
            if (validPeriods.length < project.periods.length) {
                if (hasntCache) {
                    $scope.params.start_date = project.periods[validPeriods.length]
                }
                validPeriods.push(project.periods[validPeriods.length])
            }
            $scope.project.validPeriods = validPeriods

            if (hasntCache) {
                updateParams()
            }
        })

        // 更新参数-基于已有项目信息计算
        function updateParams() {
            var params = $scope.params
            var project = $scope.project

            var startIndex = params.startIndex = _.indexOf(project.periods, params.start_date)
            params.customOnly = false
            params.periods = project.periods.length - startIndex

            if (startIndex === 0) {
                params.customOnly = true
                params.active_param = 'custom'
                return
            }


            var trends = project.history_params.trends
            var referList0 = trends[0].data.slice(0, startIndex).slice(-6)
            var referList1 = trends[1].data.slice(0, startIndex).slice(-6)
            var referList2 = trends[2].data.slice(0, startIndex).slice(-6)

            switch (params.active_param) {
                case 'average':
                    params.prepayment_rate = _.round((_.chain(referList0).sum().value() / referList0.length), 2)
                    params.default_rate = _.round((_.chain(referList1).sum().value() / referList1.length), 2)
                    params.pending_rate = _.round((_.chain(referList2).sum().value() / referList2.length), 2)
                    break
                case 'max':
                    params.prepayment_rate = _.chain(referList0).max().round(2).value()
                    params.default_rate = _.chain(referList1).max().round(2).value()
                    params.pending_rate = _.chain(referList2).max().round(2).value()
                    break
                case 'min':
                    params.prepayment_rate = _.chain(referList0).min().round(2).value()
                    params.default_rate = _.chain(referList1).min().round(2).value()
                    params.pending_rate = _.chain(referList2).min().round(2).value()
                    break
                case 'lastest':
                    params.prepayment_rate = _.chain(referList0).last().round(2).value()
                    params.default_rate = _.chain(referList1).last().round(2).value()
                    params.pending_rate = _.chain(referList2).last().round(2).value()
                    break
                default:
                    break
            }
        }
    })

})();
