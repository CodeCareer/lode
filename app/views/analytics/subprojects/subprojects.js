;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktSubProjectsCtrl', function($scope, $location, $stateParams, ktProjectsService) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })

        $scope.params = {
            maxSize: 5,
            page: 1,
            per_page: 10,
            project_id: 'all'
                // projectID: $stateParams.projectID,
                // subProject: 'subprojects'
        }

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }

        $scope.stateChanged = function() {
            $location.search($.extend($location.search(), {
                status: $scope.params.status || null,
                page: 1,
                per_page: 10
            }))
        }

        $scope.projectChanged = function(id) {
            $location.search($.extend($location.search(), {
                project_id: id || null,
                page: 1,
                per_page: 10
            }))
        }

        $scope.getProjectName = function() {
            var f = _.find($scope.projects || [], {
                id: $scope.params.project_id
            })
            return f ? f.name : '全部项目'
        }

        ktProjectsService.get({
            projectID: $stateParams.projectID
        }, function(data) {
            data.projects.unshift({
                name: '全部项目',
                id: 'all'
            })

            $scope.projects = data.projects
        })
    })

    .controller('ktSubProjectsTableCtrl', function($scope, $location, $state, ktSubProjectsService) {
        $scope.subProjects = [];

        var search = $location.search()
        $.extend($scope.params, search)

        ktSubProjectsService.get($scope.params, function(data) {
            $scope.subProjects = data.subprojects;
            $scope.params.totalItems = data.total_items;
        });
    })
})();
