;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktDebtorsCtrl', function($scope, $location, $stateParams, Upload, ktDataHelper, ktLoanBatchesUpload, ktSweetAlert) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.subProjectID
        })

        $scope.params = {
            maxSize: 5,
            page: 1,
            projectType: 'subprojects',
            projectID: $stateParams.subProjectID,
            loanType: 'loan_batches',
            per_page: 10
        }
        $scope.debtors = []

        $scope.statusList = ktDataHelper.getLoanStatusMap()
        $scope.getStatusNameNice = ktDataHelper.getStatusNameNice($scope)

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }

        $scope.upload = function(file) {
            if (!file) return
            $scope.uploading = true
                // console.log(file, event)
            ktLoanBatchesUpload({
                subProjectID: $stateParams.subProjectID,
                file: file,
            }).then(function(res) {
                // console.log('Success ' + res.config.data.file.name + 'uploaded. response: ' + res.data);
                $scope.debtors.unshift(res.data.loan_batch)
                $scope.uploading = false
            }, function(res) {
                ktSweetAlert.swal({
                    title: '失败',
                    text: res.data.error || '上传失败！',
                    type: 'error',
                });
                $scope.uploading = false
                    // console.log('Error status: ' + res.status);
            }, function() {
                $scope.uploading = false
                // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
                // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        }

        /*$scope.stateChanged = function() {
            $location.search($.extend($location.search(), {
                status: $scope.params.status || null,
                page: 1,
                per_page: 10
            }))
        }*/
    })

    .controller('ktDebtorsTableCtrl', function($scope, $location, $stateParams, ktDebtorsService) {
        // $scope.debtors = [];
        // $scope.params.subProjectID = $stateParams.subProjectID

        var search = $location.search()
        $.extend($scope.params, search)

        ktDebtorsService.get($scope.params, function(data) {

            // $scope.projects = ktProjectsHelper.adapter(data.projects || []);
            $.extend($scope.debtors, data.loan_batches);
            $scope.params.totalItems = data.total_items;
            // $.extend($scope.params, params)
        });
    })
})();
