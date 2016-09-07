/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.lode')

    // 项目
    .factory('ktProjectsService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/projects/:projectID/:subContent/:subID', {
            projectID: '@projectID',
            subID: '@subID',
            subContent: '@subContent',
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 机构
    .factory('ktInstitutionsService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/:projectType/:projectID/institutions/:instID', {
            projectType: '@projectType',
            projectID: '@projectID',
            instID: '@instID'
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })

    // 统计-按项目
    /*.factory('ktProjectsReportService', function($resource, ktApiVersion) {
        return $resource('/ajax/' + ktApiVersion + '/projects/:projectID/:type', {
            projectID: '@projectID',
            type: '@type',
        }, {
            'get': {
                method: 'GET',
                cache: false
            }
        })
    })
*/
    // 全部项目统计
    .factory('ktStaticsReportService', function($resource, ktApiVersion) {
            return $resource('/ajax/' + ktApiVersion + '/statistics/:type', {
                type: '@type',
            }, {
                'get': {
                    method: 'GET',
                    cache: false
                }
            })
        })
          //GET /ajax/v1/statistics/projects/:project_id/repayments
        //get /ajax/api/v1/statistics/projects/:project_id/dashboard
        // 单个项目统计
        .factory('ktProjectStaticsReportService', function($resource, ktApiVersion) {
            return $resource('/ajax/' + ktApiVersion + '/statistics/projects/:projectID/:dimention/:type', {
                projectID: '@projectID',
                dimention: '@dimention',
                type: '@type'
            }, {
                'get': {
                    method: 'GET',
                    cache: false
                }
            })
        })

})();
