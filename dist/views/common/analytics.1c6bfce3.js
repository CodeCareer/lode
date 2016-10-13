!function(){"use strict";angular.module("kt.lode").controller("ktAnalyticsCtrl",["$scope","$rootScope","$state","$stateParams","ktProjectsService","user",function(a,b,c,d,e,f){function g(b){return _.find(a.projects||[],{id:"all"!==b.id?b.id:"all"})}function h(){var b=g({id:a.projectID});return b?b.name:"全部项目"}function i(){var b=g({id:a.projectID});return b?b.data_import_date:""}function j(b){var c=g(b);c?($.extend(c,b),a.activeProjectName=c.name):a.projects.push(b)}function k(){var b=_.find(c.$current.path,function(a){return"analytics.project"===a.name});b&&(b.data.pageTitle=a.activeProjectName)}a.projectID="all",b.user=f,b.data_import_date="",a.breadcrumbFilter=function(a){return a.data.breadcrumb},a.isAllProjectsPage=function(){return c.includes("analytics.projects.**")||c.includes("analytics.reports.**")||c.includes("analytics.institutions.**")},b.stateGo=a.stateGo=function(b,d,e){d&&a[d](e),c.go(b)},e.get(function(c){c.projects.unshift({id:"all",name:"全部项目"}),b.projects=a.projects=c.projects,a.activeProjectName=h(),b.data_import_date=i(),k()}),a.$on("activeProjectChange",function(c,d){a.projectID!==d.projectID&&("57fb46694ac74b4ba72ceadf"===d.projectID?a.isyqb=!0:a.isyqb=!1,a.projectID=d.projectID||"all",a.activeProjectName=h(),b.data_import_date=i(),k())}),a.$on("activeProjectUpdate",function(a,b){j(b)}),a.summaryMenu={reportsIsCollapsed:!c.includes("analytics.reports.**"),projectsIsCollapsed:!c.includes("analytics.projects.**"),institutionsIsCollapsed:!c.includes("analytics.institutions.**")},a.menu={dashboardIsCollapsed:!c.includes("analytics.project.dashboard.**"),debtorsIsCollapsed:!c.includes("analytics.project.debtors.**"),assetPerformanceIsCollapsed:!c.includes("analytics.project.asset.**"),riskIsCollapsed:!c.includes("analytics.project.risk.**"),cashIsCollapsed:!c.includes("analytics.project.cash.**"),settingsIsCollapsed:!c.includes("analytics.project.settings.**"),repaymentsIsCollapsed:!c.includes("analytics.project.repayments.**")},a.currStateSwitch=function(a){if("all"===a)return void c.go(b.defaultRoute);var e,f;e=function(){return c.includes("analytics.project.debtors.detail.**")?"analytics.project.debtors.list.table":c.includes("analytics.project.**")?c.current.name:"analytics.project.dashboard"}(),f={projectID:a},console.log(c,d),_.each(c.params,function(a,b){"projectID"!==b&&(f[b]=null)}),c.go(e,f)},b.$on("$stateChangeSuccess",function(c,d){d.name===b.defaultRoute&&(a.summaryMenu.reportsIsCollapsed=!1)}),a.updateSummaryMenu=function(b){_.each(a.summaryMenu,function(c,d){d!==b&&(a.summaryMenu[d]=!0)}),a.summaryMenu[b]=!a.summaryMenu[b]},a.updateMenu=function(b){_.each(a.menu,function(c,d){d!==b&&(a.menu[d]=!0)}),a.menu[b]=!a.menu[b]},a.$on("$stateChangeSuccess",function(a,b,c,d){b.name!==d.name&&$(window).scrollTop(0)})}])}();