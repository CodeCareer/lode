;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktInstitutionsCtrl', function($scope, $location, $stateParams) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })

        $scope.params = {
            page: 1,
            per_page: 10,
            maxSize: 5
        }

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }

        /*$scope.stateChanged = function() {
            $location.search($.extend($location.search(), {
                status: $scope.params.status || null,
                page: 1,
                per_page: 10
            }))
        }*/
    })

    .controller('ktInstitutionsTableCtrl', function($scope, $location, $state, $uibModal, ktInstitutionsService) {
        $scope.institutions = []


        var search = $location.search()
        $.extend($scope.params, search)

        ktInstitutionsService.get($scope.params, function(data) {
            $scope.institutions = data.institutions;
            $scope.params.totalItems = data.total_items;
        });

        $scope.dataFilter = function($event, instID) {
            var inst = _.find($scope.institutions, { id: +instID })
            var modalInstance = $uibModal.open({
                templateUrl: 'views/modals/institution_filter.html',
                size: 'md',
                /*eslint-disable*/
                controller: function($timeout, $scope, $state, $uibModalInstance, ktProjectsService, ktDataHelper) {
                    /*eslint-enable*/

                    $scope.projects = []
                    $scope.selected = {}
                    ktProjectsService.get({}, function(res) {
                        $scope.projects = res.projects
                        $scope.selected.project_ids = inst.project_ids || _.map($scope.projects, 'id')
                        $scope.checkAll = $scope.checkListChange()
                    })
                    $scope.statusList = ktDataHelper.getProjectStatusMap()
                    $scope.getStatusName = function(status) {
                        var st = _.find($scope.statusList, function(v) {
                            return v.value === status
                        }) || {}
                        return st.name || '未知'
                    }


                    $scope.checkAllToggle = function() {
                        $scope.selected.project_ids = $scope.checkAll ? _.map($scope.projects, 'id') : [];
                    }

                    $scope.checkListChange = function() {
                        $timeout(function() {
                            $scope.checkAll = $scope.selected.project_ids.length === $scope.projects.length
                        }, 10)
                    }

                    $scope.ok = function() {
                        $scope.error = ''; // 每次提交清除错误
                        ktInstitutionsService.get({
                            // instID: instID,
                            project_ids: $scope.selected.project_ids
                        }, function(data) {
                            data.project_ids = $scope.selected.project_ids
                            data.filter_names = _.chain($scope.projects)
                                .filter(function(v) {
                                    return _.includes(data.project_ids, v.id)
                                })
                                .map(function(v) {
                                    return v.name
                                })
                                .join(',')
                                .value()
                            $uibModalInstance.close(data);
                        }, function(data) {
                            $scope.error = data.error || '查询失败！';
                        })
                    }

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    }

                }
            })

            //关闭model promise
            modalInstance.result.then(function(data) {
                inst.project_ids = data.project_ids
                inst.filter_names = data.filter_names
            })
        }
    })
})();
