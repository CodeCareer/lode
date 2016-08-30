;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktUserFeatureLayoutCtrl', function($scope, $state, $stateParams, $location, ktProjectsService, ktDateHelper) {
        $scope.shared = {}

        $scope.shared.params = $.extend({
            filter: ''
        }, $location.search() || {})

        // 单独提出来的筛选条件，方便后面直接引用
        $scope.dateOptions = {
            field: 'date',
            field_type: 'date',
            name: '期限',
            options: [{
                name: '上月',
                // tip: '这是提示',
                value: ktDateHelper.getDate('lastMonth')
            }, {
                name: '近三月',
                value: ktDateHelper.getDate('last3Month')
            }, {
                name: '近六个月',
                value: ktDateHelper.getDate('last6Month')
            }, {
                name: '自定义',
                type: 'datepicker',
                onUpdate: function(value) {
                    this.name = this.value = value
                    $state.go($state.current.name, {
                        filter: $.param($.extend({}, $scope.shared.fParams, {
                            date: value,
                        }))
                    })
                },
                value: ''
            }],
            perform_type: 'options',
            option_type: 'object',
            no_discretized: true, // 区分离散化（主要是借款人清单页）的动态筛选
            unit: ''
        }

        $scope.shared.filters = [{
            field: 'risk_index',
            field_type: 'string',
            name: '指标',
            options: [{
                name: '时点余额',
                value: 'prncp_balns'
            }, {
                name: '新增成交',
                value: 'amnt_incrmnt'
            }],
            perform_type: 'options',
            option_type: 'object',
            no_discretized: true, // 区分离散化（主要是借款人清单页）的动态筛选
            unit: ''
        }, $scope.dateOptions]

        // $scope.shared.filters = [$scope.dateOptions]

        $scope.shared.filters.hideFParams = true // true 可以隐藏已选条件

        $scope.shared.filters.cannotDelete = true // 已选条件不显示清除功能

    })

    .controller('ktUserFeatureCtrl', function($scope, $rootScope, $location, $stateParams, ktProjectsService, ktProjectStaticsReportService, ktDataHelper, ktDateHelper) {
        var search = $location.search()
        var params = $scope.shared.params
        var filters = $scope.shared.filters
        $.extend(params, search)
        ktDataHelper.pruneDirtyParams(params, search, ['filter'])


        // 从filter内提取的真实的参数
        $scope.shared.fParams = $.extend({
            risk_index: 'prncp_balns',
            date: ktDateHelper.getDate('last6Month')
        }, ktDataHelper.cutDirtyParams(ktDataHelper.decodeParams(params, ['filter'])))

        // 看是否匹配固定的值，否则是自定义日期
        var initDate = _.find($scope.dateOptions.options, function(v) {
            return $scope.shared.fParams.date === v.value
        })

        if (!initDate) {
            var customDate = _.last($scope.dateOptions.options)
            customDate.value = customDate.name = $scope.shared.fParams.date
        }

        // 更新显示的已选条件
        if ($scope.shared.updateFilterFParams) {
            ktDataHelper.filterInit(filters)($scope.shared.fParams)
            $scope.shared.updateFilterFParams()
        } else {
            $rootScope.$on('filterInitDone', function() {
                ktDataHelper.filterInit(filters)($scope.shared.fParams)
                $scope.shared.updateFilterFParams()
            })
        }

        // 默认图表列表
        $scope.charts = []

        // 初始化数据模型
        function initData() {
            var data = $scope.data
            var dimentions = data.dimensions

            _.each(dimentions, function(v) {
                var chart = _.find($scope.charts, function(c) {
                    return c.key === v.key
                })

                if (!chart) {
                    chart = {
                        key: v.key,
                        name: v.name,
                        description: v.description,
                        radioDataShowType: 'table',
                        chartDimension: $scope.shared.fParams.risk_index === 'amnt_incrmnt' ? '新增成交' : '时点余额',
                        chartOptions: {},
                        list: [],
                        menuData: { // 绝对值百分比
                            index: 0,
                            value: 'absolute'
                        },
                        menuDataChange: function() {
                            this.updateData()
                        },
                        dimentionChange: function(value) {
                            this.chartDimension = value
                            this.updateData()
                        },
                        updateData: function() {
                            var prefix
                            var suffix
                            var listName
                                // prefix = this.chartDimension === '时点余额' ? 'mature_prncp_balns_by_' : 'loan_amnt_incrmnt_by_'
                            prefix = this.chartDimension === '时点余额' ? 'prncp_balns_by_' : 'loan_amnt_incrmnt_by_'
                            suffix = this.menuData.value === 'absolute' ? '' : '_percent'
                            listName = prefix + this.key + suffix

                            var chartOptions = suffix === '_percent' ? {
                                tooltip: {
                                    yAxisFormat: 'percent' //自定义属性，tooltip标示，决定是否显示百分比数值
                                },
                                yAxis: {
                                    max: 1,
                                    min: 0
                                }
                            } : {
                                tooltip: {
                                    yAxisFormat: 'rmb'
                                },
                                yAxis: {
                                    max: null,
                                }
                            }

                            this.list = data[listName]
                            this.chartOptions = $.extend(true, {}, chartOptions, {
                                legend: {
                                    data: _.map(data[listName], 'name')
                                },
                                xAxis: {
                                    type: 'category',
                                    data: data.dates
                                },

                                series: _.map(data[listName], function(v2) {
                                    v2.type = 'bar'
                                    v2.stack = '堆积组'
                                    v2.barWidth = 40
                                    return v2
                                })
                            })
                        }
                    }
                    chart.updateData()
                    $scope.charts.push(chart)
                }
            })
        }


        function getData() {
            var ajaxParams = _.cloneDeep($scope.shared.fParams)
            var dates = ajaxParams.date.split('~')
            ajaxParams.start_date = dates[0]
            ajaxParams.end_date = dates[1]
            delete ajaxParams.date

            //画图表取得数据
            ktProjectStaticsReportService.get($.extend({
                projectID: $stateParams.projectID,
                type: 'borrower',
                dimention: 'distribution',
                // start_date: startDate,
                // end_date: endDate
            }, ajaxParams), function(data) {
                $scope.data = data
                initData()
            })

        }

        // 初始加载数据
        getData()
    })
})();
