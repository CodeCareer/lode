;
(function() {
    'use strict';
    angular.module('kt.lode')

    .controller('ktRulesCtrl', function($scope, $location, $stateParams, ktRulesService, notify, ktSweetAlert) {

        $scope.$emit('activeProjectChange', {
            projectID: $stateParams.projectID
        })

        $scope.rules = []

        $scope.save = function($event, index, id) {
            var $elem = $($event.target)
            var rule = $scope.rules[index]
            id && (rule.ruleID = id)
            rule.projectID = $stateParams.projectID
            if (id) {
                ktRulesService.update(rule, function() {
                    notify.closeAll()
                    notify({
                        message: "保存成功!",
                        // position: 'right',
                        classes: 'alert-info right-top',
                        templateUrl: 'views/notification/notify.html',
                        container: $elem.closest('.card-body')[0],
                        duration: 1000
                    })
                })
            } else {

                ktRulesService.create(rule, function(data) {
                    notify.closeAll()
                    notify({
                        message: "新增成功!",
                        // position: 'right',
                        classes: 'alert-info right-top',
                        templateUrl: 'views/notification/notify.html',
                        container: $elem.closest('.card-body')[0],
                        duration: 1000
                    })
                    rule.id = data.id
                })
            }
            
        }

        $scope.remove = function(index, id) {
            ktSweetAlert.swal({
                title: "确认删除？",
                text: '',
                type: "warning",
                showCancelButton: true
            }, function(isConfirm) {
                if (!isConfirm) return
                if (!id) {
                    $scope.rules = _.filter($scope.rules, function(v, i) {
                        return i !== index
                    })
                    return
                }
                ktRulesService.delete({
                    id: id,
                    projectID: $stateParams.projectID,
                    ruleID: id
                }, function () {
                    $scope.rules = _.filter($scope.rules, function(v, i) {
                        return i !== index
                    })
                })
            });
        }

        $scope.addRule = function() {
            $scope.rules.push({
                projectID: $stateParams.projectID,
                ruleID: 'new'
            })
        }

        ktRulesService.get({
            projectID: $stateParams.projectID
        }, function(data) {
            $scope.rules = data.rules
            $scope.results = data.results
            $scope.fields = data.fields
            $scope.conditions = data.conditions
        })
    })

})();
