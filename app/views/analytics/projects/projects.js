;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktProjectsCtrl', function($scope, $location, $stateParams, ktInstitutionsService) {

        // $scope.$emit('activeProjectChange', {
        //     projectID: $stateParams.projectID
        // })

        $scope.params = {
            maxSize: 5,
            page: 1,
            per_page: 10,
            zhudai_id: 'all',
            account_id: 'all',
        }

        ktInstitutionsService.get({
            inst_type: 'zhudai'
        }, function(data) {
            data.institutions.unshift({
                id: 'all',
                name: '全部机构'
            })

            $scope.institutions = data.institutions
        })

        $scope.getInstitutionName = function() {
            var inst = _.find($scope.institutions, function(v) {
                /*eslint-disable*/
                return v.id == $scope.params.zhudai_id
                /*eslint-enable*/
            }) || {}
            return inst.name
        }

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }

        $scope.institutionChanged = function(id) {
            // $scope.institutionName = getInstitutionName(id)
            $location.search($.extend($location.search(), {
                zhudai_id: id || null,
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

        var search = $location.search()
        $.extend($scope.params, search)

        ktProjectsService.get($scope.params, function(data) {
            $scope.projects = data.projects;
            $scope.params.totalItems = data.total_items;
        });
    })
})();
