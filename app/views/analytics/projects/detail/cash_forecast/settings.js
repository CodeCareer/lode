;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktCashSettingsCtrl', function($scope, $state, $stateParams, $window, $timeout, ktProjectsService, ktFormValidator) {

        $scope.project = {
            history_params: {
                dates: [],
                trends: []
            },
            periods: []
        }

        var cache = JSON.parse($window.localStorage.cashForecast || '{}')
        var hasCache = _.isEmpty(cache)
        $scope.params = $.extend({
            start_date: moment().format('YYYY年MM月'),
            periods: 0,
            active_param: 'average',
            prepayment_rate: 0,
            default_rate: 0,
            no_repay_rate: 0,
        }, cache)

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

        $scope.changeStartDate = function(value) {
            $scope.params.start_date = value
            updateParams()
        }

        $scope.updateActiveParam = function(value) {
            $scope.params.active_param = value
            updateParams()
        }

        $scope.customParams = {
            prepayment_rate: {
                errors: '年化早偿率填写错误',
                open: false
            },
            default_rate: {
                errors: '年化违约率填写错误',
                open: false
            },
            no_repay_rate: {
                errors: '未还款率填写错误',
                open: false
            },
            validate: function() { // 做值得验证
                var prepaymentRate = ktFormValidator.validateInput('#prepayment_rate', '.cash-filter')
                var defaultRate = ktFormValidator.validateInput('#default_rate', '.cash-filter')
                var noRepayRate = ktFormValidator.validateInput('#no_repay_rate', '.cash-filter')
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
                        _self.no_repay_rate.open = true
                        break
                    default:
                        valid = true
                        _self.prepayment_rate.open = false
                        _self.default_rate.open = false
                        _self.no_repay_rate.open = false
                }

                $timeout(function() {
                    _self.prepayment_rate.open = false
                    _self.default_rate.open = false
                    _self.no_repay_rate.open = false
                }, 2000)

                return valid
            }
        }

        $scope.applySettings = function() {
            // $window.sessionStorage
            if ($scope.params.active_param === 'custom' && !$scope.customParams.validate()) {
                return
            }

            $window.localStorage.cashForecast = JSON.stringify($scope.params || {})
            $state.go('analytics.project.cash.forecast.index')

        }

        ktProjectsService.get({
            projectID: $stateParams.projectID,
            subContent: 'detail'
        }, function(data) {
            var project = $scope.project = data.project
            $scope.params.start_date = project.periods[project.history_params.dates.length] || $scope.params.start_date

            // 获取可选的期限列表
            $scope.project.validPeriods = _.chain(project.periods).filter(function(v) {
                return !_.includes(project.history_params.dates, v)
            }).value()

            if (!hasCache) {
                updateParams()
            }
        })

        // 更新参数
        function updateParams() {
            var params = $scope.params
            var project = $scope.project

            var startIndex = _.indexOf(project.periods, params.start_date)
            if (startIndex < 1) return

            params.periods = project.periods.length - startIndex

            var trends = project.history_params.trends
            var referList0 = trends[0].data.slice(-6)
            var referList1 = trends[1].data.slice(-6)
            var referList2 = trends[2].data.slice(-6)

            switch (params.active_param) {
                case 'average':
                    params.prepayment_rate = _.round((_.chain(referList0).sum().value() / referList0.length), 2)
                    params.default_rate = _.round((_.chain(referList1).sum().value() / referList1.length), 2)
                    params.no_repay_rate = _.round((_.chain(referList2).sum().value() / referList2.length), 2)
                    break
                case 'max':
                    params.prepayment_rate = _.chain(referList0).max().round(2).value()
                    params.default_rate = _.chain(referList1).max().round(2).value()
                    params.no_repay_rate = _.chain(referList2).max().round(2).value()
                    break
                case 'min':
                    params.prepayment_rate = _.chain(referList0).min().round(2).value()
                    params.default_rate = _.chain(referList1).min().round(2).value()
                    params.no_repay_rate = _.chain(referList2).min().round(2).value()
                    break
                case 'lastest':
                    params.prepayment_rate = _.chain(referList0).last().round(2).value()
                    params.default_rate = _.chain(referList1).last().round(2).value()
                    params.no_repay_rate = _.chain(referList2).last().round(2).value()
                    break
                default:
                    break
            }
        }

    })

})();
