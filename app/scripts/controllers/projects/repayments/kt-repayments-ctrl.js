;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktRepaymentsCtrl', function($scope, $location, $stateParams, ktRepaymentsService, ktProjectsService) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })
        $scope.params = {
            maxSize: 5,
            page: 1,
            per_page: 10,
            sub_project_id: 'all'
        }

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }

        $scope.subProjectChange = function(id) {
            $location.search($.extend($location.search(), {
                sub_project_id: id !== 'all' ? id : null,
                page: 1,
                per_page: 10
            }))
            $scope.params.sub_project_id = id
        }

        
        $scope.getSubProjectName = function() {
            var subProject = _.find($scope.subProjects, function(v) {
                return v.id === $scope.params.sub_project_id
            }) || {}
            return $scope.params.sub_project_id ? subProject.name : '全部'
        }

        ktProjectsService.get({
            projectID: $stateParams.projectID,
            subProject: 'sub_projects'
        }, function(data) {
            $scope.subProjects = data.sub_projects
            $scope.subProjects.unshift({
                id: 'all',
                name: '全部'
            })
            // $scope.currentSubProjectId = data.sub_projects.length ? data.sub_projects[0].id : null
        })

    })

    .controller('ktRepaymentsTableCtrl', function($scope, $location, $stateParams, ktRepaymentsService, ktDataHelper) {
        // $scope.params.maxSize = 5
        $scope.repayments = [];
        $scope.subProjects = [];
        $scope.params.projectID = $stateParams.projectID
        $.extend($scope, ktDataHelper)

        // var params = {
        //     id: $stateParams.id,
        //     page: 1,
        //     per_page: 10
        // }
        var search = $location.search()
        $.extend($scope.params, search)

        ktRepaymentsService.get($scope.params, function(data) {
            // $scope.projects = ktProjectsHelper.adapter(data.projects || []);
            $scope.repayments = data.repayments;
            $scope.params.totalItems = data.totalItems;
            // $.extend($scope.params, params)
        });

        
    })
})();
