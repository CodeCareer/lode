;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktRepaymentsCtrl', function($scope, $location, $stateParams, ktDataHelper, ktDateHelper) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.subProjectID
        })

        $scope.statusList = ktDataHelper.getStatementStatusMap()
        $scope.getStatusNameNice = ktDataHelper.getStatusNameNice($scope)

        ktDateHelper.initPeriodDay($scope, $location.search() || {})

        $scope.$watch('radioPeriod', function(newValue, oldvalue) {
            if (newValue !== oldvalue) {
                var dates = newValue.split('~')
                $location.search($.extend($location.search(), {
                    start_date: dates[0] || null,
                    end_date: dates[1] || null
                }))
            }
        })

        $scope.params = {
            maxSize: 5,
            projectType: 'subprojects',
            projectID: $stateParams.subProjectID,
            page: 1,
            per_page: 10,
        }

        $scope.pageChanged = function() {
            $location.search('page', $scope.params.page)
        }
    })

    .controller('ktRepaymentsTableCtrl', function($scope, $location, $stateParams, ktBillsService, ktStatementsUpload) {
        $scope.bills = [];
        $scope.upload = function(file, event, statementID) {
            $scope.uploading = true
                // console.log(file, event)
            ktStatementsUpload({
                statementID: statementID,
                file: file,
            }).then(function() {
                // console.log('Success ' + res.config.data.file.name + 'uploaded. response: ' + res.data);
                // $scope.bills.unshift(res.data.loan_batch)
                var bill = _.findWhere($scope.bills, {
                    id: statementID
                })
                bill.status = 'uploaded'

                $scope.uploading = false
            }, function(res) {
                ktSweetAlert.swal({
                    title: '失败',
                    text: res.data.error || '上传失败！',
                    type: 'error',
                });
                $scope.uploading = false
                    // console.log('Error status: ' + res.status);
            }, function(evt) {
                $scope.uploading = false
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        }
        var search = $location.search()
        $.extend($scope.params, search)

        ktBillsService.get($scope.params, function(data) {

            $scope.bills = data.statements;
            $scope.params.totalItems = data.total_items;
        });
    })
})();
