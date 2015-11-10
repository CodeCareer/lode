;
(function() {
    'use strict';
    angular.module('kt.lode')
        .controller('ktAnalyticsCtrl', function($scope, $state, ktInstitutionsService) {

            // 初始化从路由获取id
            $scope.institutionID = $state.params.id 

            // 获取当前机构名称
            function getInstitutionName() {
                var f = _.findWhere($scope.institutions || [], {
                    id: $scope.institutionID
                })
                return f ? f.name : '全部机构'
            }

            // 获取所有机构列表
            ktInstitutionsService.get(function(data) {
                $scope.institutions = data.institutions
                $scope.activeInstitution = getInstitutionName()
            })

            // 切换不同的路由，更新当前机构ID，每个页面级controller会fire这个事件，保证路由的同步
            $scope.$on('activeInstitutionChange', function(e, data) {
                $scope.institutionID = data.id
                $scope.activeInstitution = getInstitutionName()
            })

            // 是否展开子菜单的开关
            $scope.menu = {
                dashboardIsCollapsed: !$state.includes('analytics.institution.dashboard.**'),
                assetFeatureIsCollapsed: !$state.includes('analytics.institution.assetFeature.**'),
                usersFeatureIsCollapsed: !$state.includes('analytics.institution.usersFeature.**'),
                overdueAnalyticsIsCollapsed: !$state.includes('analytics.institution.overdueAnalytics.**'),
                institutionInfoIsCollapsed: !$state.includes('analytics.institution.institutionInfo.**'),
            }

            // 保证在当前路由切换机构
            $scope.goto = function (id) {
                var stateName = $state.includes('analytics.institution.**') ? $state.current.name : 'analytics.institution.dashboard'
                $state.go(stateName, {id: id})
            }

            // 更新菜单状态，保持只展开一个子菜单
            $scope.updateMenu = function(collapseName) {
                _.each($scope.menu, function(v, k) {
                    if (k !== collapseName) $scope.menu[k] = true
                })
                $scope.menu[collapseName] = !$scope.menu[collapseName]
            }

            /*$scope.breadcrumbFilter = function(item) {
                return item.data.breadcrumb
            }*/
        })

})();
