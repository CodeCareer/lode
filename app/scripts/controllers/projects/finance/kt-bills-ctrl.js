;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktBillsCtrl', function($scope, $location, $stateParams, ktProjectsService, ktDataHelper) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })

        $scope.params = {
            maxSize: 5,
            page: 1,
            type: 'system',
            sub_project_id: 'all',
            per_page: 10
        }

        $scope.statusList = [{
            name: '全部',
            value: 'all'
        },{
            name: '未完成',
            value: 'initial'
        },{
            name: '已完成',
            value: 'done'
        }]

        $scope.billTypes = ktDataHelper.getBillTypes()
        $scope.getTypeName = ktDataHelper.getBillTypeFactory($scope)
        $scope.getStatusNameNice = ktDataHelper.getStatusNameNice($scope)

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }

        $scope.stateChanged = function() {
            $location.search($.extend($location.search(), {
                status: $scope.params.status || null,
                page: 1,
                per_page: 10
            }))
            // $scope.sub_project_id = id
        }

        $scope.subProjectChange = function(id) {
            $location.search($.extend($location.search(), {
                sub_project_id: id !== 'all' ? id : null,
                page: 1,
                per_page: 10
            }))
            $scope.params.sub_project_id = id
        }

        $scope.billTypeChange = function(type) {
            $location.search($.extend($location.search(), {
                type: type || null,
                page: 1,
                per_page: 10
            }))
        }

        $scope.numberChange = function ($event) {
            $event.stopPropagation()
            if ($event.keyCode == '13') {
                $scope.numberQuery()  
            }
        }

        $scope.numberQuery = function() {
            $location.search($.extend($location.search(), {
                number: $scope.params.number || null,
                page: 1,
                per_page: 10
            }))
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
            $scope.currentSubProjectId = data.sub_projects.length ? data.sub_projects[0].id : null
        })
    })

    .controller('ktBillsTableCtrl', function($scope, $location, $stateParams, ktBillsService) {
        $scope.bills = [];
        // $scope.params.maxSize = 5
        // $.extend($scope, ktDataHelper)
        $scope.params.projectID = $stateParams.projectID
        
        var search = $location.search()
        $.extend($scope.params, search)

        ktBillsService.get($scope.params, function(data) {
            // $scope.projects = ktProjectsHelper.adapter(data.projects || []);
            $scope.bills = data.bills;
            $scope.params.totalItems = data.totalItems;
            // $.extend($scope.params, params)
        });
    })
})();
