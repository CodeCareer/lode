;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktProjectsCtrl', function($scope, $location, $stateParams, ktInstitutionsService, ktAccountsService) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })

        $scope.params = {
            maxSize: 5,
            page: 1,
            per_page: 10,
            institution_id: 'all',
            account_id: 'all',
        }

        ktInstitutionsService.get(function(data) {
            data.institutions.unshift({
                id: 'all',
                name: '全部机构'
            })

            $scope.institutions = data.institutions
                // $scope.institutionName = getInstitutionName()
                // getData($scope.institutions[0].id)
        })

        ktAccountsService.get(function(data) {
            data.accounts.unshift({
                id: 'all',
                name: '全部用户'
            })

            $scope.accounts = data.accounts
                // $scope.accountName = getAccountName()
                // getData($scope.institutions[0].id)
        })

        $scope.getInstitutionName = function() {
            var inst = _.find($scope.institutions, function(v) {
                return v.id == $scope.params.institution_id
            }) || {}
            return inst.name
        }

        $scope.getAccountName = function() {
            var acc = _.find($scope.accounts, function(v) {
                return v.id == $scope.params.account_id
            }) || {}
            return acc.name
        }

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }

        $scope.institutionChanged = function(id) {
            // $scope.institutionName = getInstitutionName(id)
            $location.search($.extend($location.search(), {
                institution_id: id || null,
                page: 1,
                per_page: 10
            }))
        }

        $scope.accountChanged = function(id) {
            // $scope.accountName = getAccountName(id)
            $location.search($.extend($location.search(), {
                account_id: id || null,
                page: 1,
                per_page: 10
            }))
        }

        $scope.stateChanged = function() {
            $location.search($.extend($location.search(), {
                status: $scope.params.status || null,
                page: 1,
                per_page: 10
            }))
        }
    })

    .controller('ktProjectsTableCtrl', function($scope, $location, $state, ktProjectsService) {
        $scope.projects = [];
        // $scope.params.maxSize = 5
        // $.extend($scope, ktProjectsHelper)

        var search = $location.search()
        $.extend($scope.params, search)
        /*$scope.goDetail = function($event, projectId) {
            $event.stopPropagation()
            $event.preventDefault()
            $state.go('analytics.project.dashboard', {
                id: projectId
            })
        }*/

        ktProjectsService.get($scope.params, function(data) {
            // $scope.projects = ktProjectsHelper.adapter(data.projects || []);
            $scope.projects = data.projects;
            $scope.params.totalItems = data.totalItems;
            // $.extend($scope.params, params)
        });
    })
})();
