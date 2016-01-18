;
(function() {
    'use strict';
    angular.module('kt.lode')
        .provider('ktRouter', function($rootScopeProvider, $stateProvider, $urlRouterProvider, ktLoanerRoutesProvider, ktDebtorRoutesProvider, ktAccountRoutesProvider, ktErrorRoutesProvider) {

            var setUpRoutes = function(routes) {
                _.each(routes, function(v, k) {
                    $stateProvider.state(k, v)
                })
            }
            var redirectTo = function(url) {
                return function($injector, $location) {
                    var ktUrlGet = $injector.get('ktUrlGet')
                    var search = $location.search()
                    return ktUrlGet(url, search)
                }
            }

            this.run = function() {
                // 默认跳转页面
                $urlRouterProvider.when('', redirectTo('/analytics/home')); // for hashbang mode
                $urlRouterProvider.when('/', redirectTo('/analytics/home')); // for html5mode
                // $urlRouterProvider.otherwise('/error/404');
                $urlRouterProvider.otherwise(redirectTo('error/404'));

                setUpRoutes(ktLoanerRoutesProvider.routes)
                setUpRoutes(ktDebtorRoutesProvider.routes)
                setUpRoutes(ktAccountRoutesProvider.routes)
                setUpRoutes(ktErrorRoutesProvider.routes)

            }

            this.$get = {}
        })
})();
