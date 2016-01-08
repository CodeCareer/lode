;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktAnalyticsCtrl', function($scope, $rootScope, $state, ktProjectsService) {

            // 初始化从路由获取id
            $scope.projectID = $state.params.id

            // 面包屑过滤器
            $scope.breadcrumbFilter = function(item) {
                return item.data.breadcrumb
            }
            $scope.stateGo = function (stateName, func, collapseName) {
                if (func) {
                    $scope[func](collapseName)
                }

                $state.go(stateName)
            }
            // 获取当前项目名称
            function getProjectName() {
                var f = _.findWhere($scope.projects || [], {
                    id: $scope.projectID
                })
                return f ? f.name : '全部项目'
            }

            // 获取所有项目列表
            ktProjectsService.get(function(data) {
                $scope.projects = data.projects
                $scope.activeProject = getProjectName()
            })

            // 切换不同的路由，更新当前项目ID，每个页面级controller会fire这个事件，保证路由的同步
            $scope.$on('activeProjectChange', function(e, data) {
                $scope.projectID = data.projectID
                $scope.activeProject = getProjectName()

                // 更新单个项目的名称，主要用于面包屑
                var projectMainState = _.find($state.$current.path, function (v) {
                    return v.name === 'analytics.project'
                })
                /*eslint-disable*/
                projectMainState && (projectMainState.data.pageTitle = $scope.activeProject)
                /*eslint-enable*/
            })

            // 是否展开全部项目子菜单的开关
            $scope.summaryMenu = {
                reportsIsCollapsed: !$state.includes('analytics.reports.**'),
                projectsIsCollapsed: !$state.includes('analytics.projects.**'),
                institutionsIsCollapsed: !$state.includes('analytics.institutions.**'),
                channelsIsCollapsed: !$state.includes('analytics.channels.**'),
                accountsIsCollapsed: !$state.includes('analytics.accounts.**'),

            }

            // 是否展开单个项目子菜单的开关
            $scope.menu = {
                dashboardIsCollapsed: !$state.includes('analytics.project.dashboard.**'),
                debtorsIsCollapsed: !$state.includes('analytics.project.debtors.**') && !$state.includes('analytics.project.rules.**') && !$state.includes('analytics.project.blacklist.**'),
                loanPlansIsCollapsed: !$state.includes('analytics.project.loanPlans.**'),
                repaymentsIsCollapsed: !$state.includes('analytics.project.repayments.**'),
                financeIsCollapsed: !$state.includes('analytics.project.finance.**') && !$state.includes('analytics.project.paymentClear.**') && !$state.includes('analytics.project.otherIncome.**'),
                cashFlowMonitorIsCollapsed: !$state.includes('analytics.project.cashFlowMonitor'),
                assetPerformanceIsCollapsed: !$state.includes('analytics.project.asset.**'),
                settingsIsCollapsed: !$state.includes('analytics.project.settings.**'),
                // assetFeatureIsCollapsed: !$state.includes('analytics.project.assetFeature.**'),
                // usersFeatureIsCollapsed: !$state.includes('analytics.project.usersFeature.**'),
                // overdueAnalyticsIsCollapsed: !$state.includes('analytics.project.overdueAnalytics.**'),
                // projectInfoIsCollapsed: !$state.includes('analytics.project.projectInfo.**'),
            }

            // 保证在子项目内当前路由切换项目
            $scope.currStateSwitch = function(id) {
                var stateName = $state.includes('analytics.project.**') ? $state.current.name : 'analytics.project.dashboard'

                $state.go(stateName, {
                    projectID: id
                })
            }

            // 全部项目汇总页面 默认展开菜单
            $rootScope.$on('$stateChangeSuccess', function(ev, toState) {
                if (toState.name === 'analytics.reports.dashboard') {
                    $scope.summaryMenu.reportsIsCollapsed = false
                }
            });

            // 更新菜单状态，保持只展开一个子菜单
            $scope.updateSummaryMenu = function(collapseName) {
                _.each($scope.summaryMenu, function(v, k) {
                    if (k !== collapseName) $scope.summaryMenu[k] = true
                })
                $scope.summaryMenu[collapseName] = !$scope.summaryMenu[collapseName]
            }

            // 更新菜单状态，保持只展开一个子菜单
            $scope.updateMenu = function(collapseName) {
                _.each($scope.menu, function(v, k) {
                    if (k !== collapseName) $scope.menu[k] = true
                })
                $scope.menu[collapseName] = !$scope.menu[collapseName]
            }

        })

})();
