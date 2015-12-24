;
(function() {
    'use strict';
    angular.module('kt.lode')
        
        .controller('ktInstitutionsCtrl', function($scope, $location, $stateParams) {
            
            $scope.$emit('activeInstitutionChange', {projectID: $stateParams.projectID})
            $scope.shared = {}

            $scope.pageChanged = function() {
                $location.search('page', $scope.shared.page)
            }

            $scope.stateChanged = function() {
                $location.search($.extend($location.search(), {
                    status: $scope.shared.status || null,
                    page: 1,
                    per_page: 10
                }))
            }
        })

        .controller('ktInstitutionsTableCtrl', function($scope, $location, $state, ktInstitutionsService) {
            $scope.institutions = [];
            $scope.shared.maxSize = 5
            // $.extend($scope, ktInstitutionsHelper)

            var params = {
                page: 1,
                per_page: 10
            }
            var search = $location.search()

            $.extend(params, search)

            $scope.goDetail = function($event, institutionId) {
                $event.stopPropagation()
                $event.preventDefault()
                $state.go('analytics.institution.dashboard', {
                    id: institutionId
                })
            }

            ktInstitutionsService.get(params, function(data) {
               
                // $scope.institutions = ktInstitutionsHelper.adapter(data.institutions || []);
                $scope.institutions = data.institutions;
                $scope.shared.totalItems = data.totalItems;
                $.extend($scope.shared, params)
            });
        })
})();
