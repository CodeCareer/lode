;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktRepaymentsCtrl', function($scope, $location, $stateParams, ktRepaymentsService, ktProjectsService, ktDataHelper) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })
        $scope.params = {
            maxSize: 5,
            page: 1,
            per_page: 10,
            projectID: $stateParams.projectID,
            projectType: 'projects',
            subproject_id: 'all'
        }

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }

        $scope.subProjectChange = function(id) {
            $location.search($.extend($location.search(), {
                subproject_id: id !== 'all' ? id : null,
                page: 1,
                per_page: 10
            }))
            $scope.params.subproject_id = id
        }

        $scope.getSubProjectName = ktDataHelper.getSubProjectName($scope)

        $scope.subProjects = [];
        ktProjectsService.get({
            projectID: $stateParams.projectID,
            subContent: 'subprojects'
        }, function(data) {
            $scope.subProjects = data.subprojects
            $scope.subProjects.unshift({
                    id: 'all',
                    name: '全部'
                })
                // $scope.currentSubProjectId = data.subprojects.length ? data.subprojects[0].id : null
        })

    })

    .controller('ktRepaymentsTableCtrl', function($scope, $location, $stateParams, ktRepaymentsService) {
        $scope.repayments = [];

        var search = $location.search()
        $.extend($scope.params, search)

        ktRepaymentsService.get($scope.params, function(data) {
            // $scope.projects = ktProjectsHelper.adapter(data.projects || []);
            $scope.repayments = data.repayments;
            $scope.params.totalItems = data.total_items;
            // $.extend($scope.params, params)
        });


    })
})();
