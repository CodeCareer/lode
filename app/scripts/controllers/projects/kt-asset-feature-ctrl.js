;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktAssetFeatureCtrl', function($scope, $stateParams, ktReportService, ktInstitutionsService, ktDateHelper) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.radioPeriod = 'all'
            $scope.radioPeriodCustom = 'custom'

            $scope.institutions = []
            $scope.insitutionChange = function(id, name) {
                $scope.institutionName = name
                getData(id)
            }

            ktInstitutionsService.get(function(data) {
                data.institutions.unshift({
                    id: 'all',
                    name: '全部机构'
                })

                $scope.institutions = data.institutions
                $scope.institutionName = $scope.institutions[0].name
                // getData($scope.institutions[0].id)
            })

            $scope.radioDataShowType = 'chart'

            $scope.timelimitsChart = {
                chartOptions: {},
                list: [],
                menuData: {
                    index: 0
                }
            }

            $scope.amountsChart = {
                chartOptions: {},
                list: [],
                menuData: {
                    index: 0
                }
            }

            $scope.locationsChart = {
                chartOptions: {},
                list: [],
                menuData: {
                    index: 0
                }
            }

            $scope.gendersChart = {
                chartOptions: {},
                list: [],
                menuData: {
                    index: 0
                }
            }

            $scope.agesChart = {
                chartOptions: {},
                list: [],
                menuData: {
                    index: 0
                }
            }

            $scope.$watch('radioPeriod', function(newValue, oldvalue) {
                if (newValue !== oldvalue && newValue !== 'custom') {
                    getData($scope.activeInstID)
                }
            })

            var chartOptions = {
                tooltip: {
                    valueType: 'rmb' //自定义属性，tooltip标示，决定是否显示百分比数值
                }
            }

            function getDataKey(type) {
                var typesMap = {
                    'timelimitsChart': ['prncp_balns_by_term', 'incre_loan_amnt_by_term'],
                    'amountsChart': ['prncp_balns_by_amnt', 'incre_loan_amnt_by_amnt'],
                    // 'typeChart': ['prncp_balns_by_type', 'incre_loan_amnt_by_type'],
                    'locationsChart': ['prncp_balns_by_loc', 'prncp_balns_by_loc_percent'],
                    'gendersChart': ['prncp_balns_by_gender', 'prncp_balns_by_gender_percent'],
                    'agesChart': ['prncp_balns_by_age', 'prncp_balns_by_age_percent'],
                }

                var keys = typesMap[type]
                var prefix = keys[0]
                var suffix = ''
                // prefix = $scope[type].chartDimension === '时点余额' ? keys[0] : keys[1]
                // suffix = $scope[type].menuData.value === 'absolute' ? '' : '_percent'
                if (type === 'locationChart') suffix = suffix + '_' + $scope.locationChart.topDimension.toLowerCase()

                chartOptions = suffix === '_percent' ? {
                    tooltip: {
                        valueType: 'percent' //自定义属性，tooltip标示，决定是否显示百分比数值
                    },
                    yAxis: [{
                        max: 1,
                        min: 0
                    }]
                } : {
                    tooltip: {
                        valueType: 'rmb'
                    }
                }

                return prefix + suffix
            }

            function udpateData(type) {
                var data = $scope.data

                var listName = getDataKey(type)
                $scope[type].list = data[listName]
                $scope[type].chartOptions = $.extend(true, {}, chartOptions, {
                    legend: {
                        data: _.pluck(data[listName], 'name')
                    },
                    xAxis: [{
                        type: 'category',
                        data: data.dates
                    }],

                    series: _.map(data[listName], function(v) {
                        v.type = 'bar'
                        v.stack = '堆积组'
                        v.barWidth = 40
                        return v
                    })
                })
            }

            function getData(instID) {
                var startDate
                var endDate
                var datePeriod
                datePeriod = ktDateHelper.getDate($scope.radioPeriod) || $scope.radioPeriodCustom
                datePeriod = datePeriod.split('~')
                startDate = datePeriod[0] || null
                endDate = datePeriod[1]

                $scope.activeInstID = instID || 'all'

                ktReportService.get({
                    type: 'asset_features',
                    instID: instID !== 'all' ? instID : null,
                    start_date: startDate,
                    end_date: endDate
                }, function(data) {
                    $scope.data = data

                    udpateData('timelimitsChart')
                    udpateData('amountsChart')
                    udpateData('locationsChart')
                    udpateData('gendersChart')
                    udpateData('agesChart')
                })
            }

            // 初始加载数据
            getData()

        })
})();
