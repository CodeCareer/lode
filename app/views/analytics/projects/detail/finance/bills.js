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
            projectType: 'projects',
            projectID: $stateParams.projectID,
            subproject_id: 'all',
            per_page: 10
        }

        $scope.statusList = ktDataHelper.getStatementStatusMap()
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
                // $scope.subproject_id = id
        }

        $scope.subProjectChange = function(id) {
            $location.search($.extend($location.search(), {
                subproject_id: id !== 'all' ? id : null,
                page: 1,
                per_page: 10
            }))
            $scope.params.subproject_id = id
        }

        $scope.billTypeChange = function(type) {
            $location.search($.extend($location.search(), {
                type: type || null,
                page: 1,
                per_page: 10
            }))
        }

        $scope.batchNoChange = function($event) {
            $event.stopPropagation()
            if ($event.keyCode === 13) {
                $scope.batchNoQuery()
            }
        }

        $scope.batchNoQuery = function() {
            $location.search($.extend($location.search(), {
                batch_no: $scope.params.batch_no || null,
                page: 1,
                per_page: 10
            }))
        }

        $scope.getSubProjectName = function() {
            var subProject = _.find($scope.subProjects, function(v) {
                /*eslint-disable*/
                return v.id == $scope.params.subproject_id
                /*eslint-enable*/
            }) || {}
            return $scope.params.subproject_id ? subProject.name : '全部'
        }

        ktProjectsService.get({
            projectID: $stateParams.projectID,
            subContent: 'subprojects'
        }, function(data) {
            $scope.subProjects = data.subprojects
            $scope.subProjects.unshift({
                id: 'all',
                name: '全部'
            })
            $scope.currentSubProjectId = data.subprojects.length ? data.subprojects[0].id : null
        })
    })

    .controller('ktBillsTableCtrl', function($scope, $location, $stateParams, ktBillsService) {
        $scope.bills = [];

        var search = $location.search()
        $.extend($scope.params, search)

        ktBillsService.get($scope.params, function(data) {
            // $scope.projects = ktProjectsHelper.adapter(data.projects || []);
            $scope.bills = data.statements;
            $scope.params.totalItems = data.total_items;
            // $.extend($scope.params, params)
        });
    })
})();
