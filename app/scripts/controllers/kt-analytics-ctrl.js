;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktAnalyticsCtrl', function($scope, $rootScope, $state, $stateParams, ktProjectsService, ktSubProjectsService, user) {

            var instType = user.institution.inst_type
            var isZiJin = (instType === 'zijin')

            // 初始化从路由获取id
            $scope.projectID = 'all'
            $rootScope.user = user
            user.role = user.role || 'admin'
            user.institution = user.institution || {
                inst_type: 'zijin'
            }

            if ($stateParams.role) { // for hack
                user.role = $stateParams.role
            }

            if ($stateParams.inst_type) { // for hack
                user.institution.inst_type = $stateParams.inst_type
            }

            // 面包屑过滤器
            $scope.breadcrumbFilter = function(item) {
                return item.data.breadcrumb
            }

            // 跳转页面，实现更新collapse菜单
            $rootScope.stateGo = $scope.stateGo = function(stateName, func, collapseName) {
                if (func) {
                    $scope[func](collapseName)
                }

                $state.go(stateName)
            }

            function getProject() {
                return _.findWhere($scope.projects || [], {
                    id: $scope.projectID !== 'all' ? parseInt($scope.projectID, 10) : 'all'
                })
            }

            // 获取当前项目名称
            function getProjectName() {
                var f = getProject()
                return f ? f.name : '全部项目'
            }

            // 添加或更新项目
            function updateProject(project) {
                var f = getProject()

                if (f) {
                    $.extend(f, project)
                } else {
                    $scope.projects.unshift(project)
                }
            }

            // 更新单个项目的名称，主要用于面包屑
            function updatePageTitle() {
                var projectMainState = _.find($state.$current.path, function(v) {
                    return v.name === (isZiJin ? 'analytics.project' : 'analytics.subProject')
                })

                /*eslint-disable*/
                projectMainState && (projectMainState.data.pageTitle = $scope.activeProjectName)
                    /*eslint-enable*/
            }

            // 获取所有项目或子项目列表
            function initProjects() {
                // var isZiJin = (instType === 'zijin')
                if (isZiJin) {
                    ktProjectsService.get(function(data) {
                        data.projects.unshift({
                            id: 'all',
                            name: '全部项目'
                        })
                        $scope.projects = data.projects
                        $scope.activeProjectName = getProjectName()
                        updatePageTitle()

                    })
                } else {
                    ktSubProjectsService.get({
                        // projectID: 1,
                        // subProject: 'subprojects'
                    }, function(data) {
                        data.subprojects.unshift({
                            id: 'all',
                            name: '全部项目'
                        })
                        $scope.projects = data.subprojects
                        $scope.activeProjectName = getProjectName()
                        updatePageTitle()
                    })
                }
            }

            initProjects()

            // 只用于演示 - to remove
            /* $rootScope.$watch('user.institution.inst_type', function(newValue, oldValue) {
                 if (newValue !== oldValue) {
                     initProjects()
                 }
             });*/

            // 切换不同的路由，更新当前项目ID，每个页面级controller会fire这个事件，保证路由的同步
            $scope.$on('activeProjectChange', function(e, data) {
                // console.log($scope.projectID)
                if ($scope.projectID === data.projectID) return
                $scope.projectID = data.projectID || 'all'
                $scope.activeProjectName = getProjectName()
                updatePageTitle()

            })

            // 更新项目
            $scope.$on('activeProjectUpdate', function(e, data) {
                $scope.activeProjectName = data.name
                updateProject(data)
            })

            // 是否展开全部项目子菜单的开关
            $scope.summaryMenu = {
                reportsIsCollapsed: !$state.includes('analytics.reports.**'),
                projectsIsCollapsed: !$state.includes('analytics.projects.**'),
                subProjectsIsCollapsed: !$state.includes('analytics.subProjects.**'),
                institutionsIsCollapsed: !$state.includes('analytics.institutions.**'),
                channelsIsCollapsed: !$state.includes('analytics.channels.**'),
                accountsIsCollapsed: !$state.includes('analytics.accounts.**'),

            }

            // 是否折叠单个项目子菜单的开关
            $scope.menu = {
                dashboardIsCollapsed: !$state.includes('analytics.project.dashboard.**'),
                debtorsIsCollapsed: !$state.includes('analytics.project.debtors.**') && !$state.includes('analytics.project.rules.**') && !$state.includes('analytics.project.blacklist.**'),
                subDebtorsIsCollapsed: !$state.includes('analytics.subProject.debtors.**'),
                loanPlansIsCollapsed: !$state.includes('analytics.project.loanPlans.**'),
                subLoanPlansIsCollapsed: !$state.includes('analytics.subProject.loanPlans.**'),
                repaymentsIsCollapsed: !$state.includes('analytics.project.repayments.**'),
                subRepaymentsIsCollapsed: !$state.includes('analytics.subProject.repayments.**'),
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

                if (id === 'all') {
                    $state.go($rootScope.defaultRoute)
                    return
                }

                var stateName
                var params
                    // var isZiJin = (instType === 'zijin')
                if (isZiJin) { // 放贷方-资金平台、交易所、信托公司
                    stateName = $state.includes('analytics.project.**') ? $state.current.name : 'analytics.project.dashboard'
                    params = {
                        projectID: id
                    }
                } else { // 借贷方-助贷机构
                    stateName = $state.includes('analytics.subProject.**') ? $state.current.name : 'analytics.subProject.debtors.list.table'
                    params = {
                        subProjectID: id
                    }
                }

                $state.go(stateName, params)

            }

            // 全部项目汇总页面 默认展开菜单
            $rootScope.$on('$stateChangeSuccess', function(ev, toState) {
                if (toState.name === $rootScope.defaultRoute) {
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
