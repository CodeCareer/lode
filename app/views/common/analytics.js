;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktAnalyticsCtrl', function($scope, $rootScope, $state, $stateParams, ktProjectsService, user) {

            // 初始化从路由获取id
            $scope.projectID = 'all'
            $rootScope.user = user
            $rootScope.data_import_date = ''

            // 面包屑过滤器
            $scope.breadcrumbFilter = function(item) {
                return item.data.breadcrumb
            }

            // 判断是否是全部项目页面
            $scope.isAllProjectsPage = function() {
                return $state.includes('analytics.projects.**') || $state.includes('analytics.reports.**') || $state.includes('analytics.institutions.**')
            }

            // 跳转页面，实现更新collapse菜单
            $rootScope.stateGo = $scope.stateGo = function(stateName, func, collapseName) {
                if (func) {
                    $scope[func](collapseName)
                }

                $state.go(stateName)
            }

            function getProject(project) {
                return _.find($scope.projects || [], {
                    id: (project.id !== 'all' ? project.id : 'all')
                })
            }

            // 获取当前项目名称
            function getProjectName() {
                var f = getProject({
                    id: $scope.projectID
                })
                return f ? f.name : '全部项目'
            }

            function getProjectDate() {
                var f = getProject({
                    id: $scope.projectID
                })
                return f ? f.data_import_date : ''
            }


            // 添加或更新项目
            function updateProject(project) {
                var f = getProject(project)
                if (f) {
                    $.extend(f, project)
                    $scope.activeProjectName = f.name
                        // $rootScope.data_import_date = f.data_import_date

                } else {
                    $scope.projects.push(project)
                }
            }

            // 更新单个项目的名称，主要用于面包屑
            function updatePageTitle() {
                var projectMainState = _.find($state.$current.path, function(v) {
                    return v.name === 'analytics.project'
                })

                /*eslint-disable*/
                projectMainState && (projectMainState.data.pageTitle = $scope.activeProjectName)
                    /*eslint-enable*/
            }

            // 获取所有项目列表
            ktProjectsService.get(function(data) {
                data.projects.unshift({
                    id: 'all',
                    name: '全部项目'
                })
                $rootScope.projects = $scope.projects = data.projects
                $scope.activeProjectName = getProjectName()
                $rootScope.data_import_date = getProjectDate()
                updatePageTitle()

            })

            // 切换不同的路由，更新当前项目ID，每个页面级controller会fire这个事件，保证路由的同步
            $scope.$on('activeProjectChange', function(e, data) {
                if ($scope.projectID === data.projectID) return
                $scope.projectID = data.projectID || 'all'
                $scope.activeProjectName = getProjectName()
                $rootScope.data_import_date = getProjectDate()
                updatePageTitle()
            })

            // 更新项目
            $scope.$on('activeProjectUpdate', function(e, data) {
                updateProject(data)
            })

            // 是否展开全部项目子菜单的开关
            $scope.summaryMenu = {
                reportsIsCollapsed: !$state.includes('analytics.reports.**'),
                projectsIsCollapsed: !$state.includes('analytics.projects.**'),
                institutionsIsCollapsed: !$state.includes('analytics.institutions.**'),
            }

            // 是否折叠单个项目子菜单的开关
            $scope.menu = {
                dashboardIsCollapsed: !$state.includes('analytics.project.dashboard.**'),
                debtorsIsCollapsed: !$state.includes('analytics.project.debtors.**'),
                assetPerformanceIsCollapsed: !$state.includes('analytics.project.asset.**'),
                riskIsCollapsed: !$state.includes('analytics.project.risk.**'),
                cashIsCollapsed: !$state.includes('analytics.project.cash.**'),
                settingsIsCollapsed: !$state.includes('analytics.project.settings.**'),
            }

            // 保证在子项目内当前路由切换项目
            $scope.currStateSwitch = function(id) {

                if (id === 'all') {
                    $state.go($rootScope.defaultRoute)
                    return
                }

                var stateName
                var params

                stateName = (function() {

                    // 如果是借款人列表详情页面要跳到列表页
                    if ($state.includes('analytics.project.debtors.detail.**')) {
                        return 'analytics.project.debtors.list.table'
                    }

                    return $state.includes('analytics.project.**') ? $state.current.name : 'analytics.project.dashboard'
                })();
                params = {
                    projectID: id
                }

                console.log($state, $stateParams)
                    // 切换项目重置所有参数
                _.each($state.params, function(v, k) {
                    if (k !== 'projectID') {
                        params[k] = null
                    }
                })

                $state.go(stateName, params)
            }

            // 全部项目汇总页面 默认展开菜单
            $rootScope.$on('$stateChangeSuccess', function(ev, toState) {
                if (toState.name === $rootScope.defaultRoute) {
                    $scope.summaryMenu.reportsIsCollapsed = false
                }
            })

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

            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
                if (toState.name !== fromState.name) {
                    $(window).scrollTop(0)
                }
            })

        })

})();
