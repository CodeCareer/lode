!function(){"use strict";angular.module("kt.lode").controller("ktCashSettingsCtrl",["$scope","$state","$stateParams","$location","$window","$timeout","ktProjectsService","ktFormValidator",function(a,b,c,d,e,f,g,h){function i(){var b=a.params,c=a.project,d=b.startIndex=_.indexOf(c.periods,b.start_date);if(b.customOnly=!1,b.periods=c.periods.length-d,0===d)return b.customOnly=!0,void(b.active_param="custom");var e=c.history_params.trends,f=e[0].data.slice(0,d).slice(-6),g=e[1].data.slice(0,d).slice(-6),h=e[2].data.slice(0,d).slice(-6);switch(b.active_param){case"average":b.prepayment_rate=_.round(_.chain(f).sum().value()/f.length,2),b.default_rate=_.round(_.chain(g).sum().value()/g.length,2),b.pending_rate=_.round(_.chain(h).sum().value()/h.length,2);break;case"max":b.prepayment_rate=_.chain(f).max().round(2).value(),b.default_rate=_.chain(g).max().round(2).value(),b.pending_rate=_.chain(h).max().round(2).value();break;case"min":b.prepayment_rate=_.chain(f).min().round(2).value(),b.default_rate=_.chain(g).min().round(2).value(),b.pending_rate=_.chain(h).min().round(2).value();break;case"lastest":b.prepayment_rate=_.chain(f).last().round(2).value(),b.default_rate=_.chain(g).last().round(2).value(),b.pending_rate=_.chain(h).last().round(2).value()}}a.project={history_params:{dates:[],trends:[]},periods:[]};var j=JSON.parse(e.localStorage.getItem(c.projectID+".cashForecast")||"{}"),k=_.isEmpty(j);a.params=$.extend({start_date:moment().format("YYYY年MM月"),periods:0,customOnly:!1,startIndex:0,active_param:"average",prepayment_rate:0,default_rate:0,pending_rate:0},j),a.paramsList=[{name:"平均",value:"average"},{name:"最大",value:"max"},{name:"最小",value:"min"},{name:"最新",value:"lastest"},{name:"自定义",value:"custom"}],a.changeStartDate=function(b){a.params.start_date=b,i()},a.updateActiveParam=function(b){a.customOnly||(a.params.active_param=b,i())},a.customParams={prepayment_rate:{errors:"年化早偿率填写错误",open:!1},default_rate:{errors:"年化违约率填写错误",open:!1},pending_rate:{errors:"未还款率填写错误",open:!1},validate:function(){var a=h.validateInput("#prepayment_rate",".cash-filter"),b=h.validateInput("#default_rate",".cash-filter"),c=h.validateInput("#pending_rate",".cash-filter"),d=!1,e=this;switch(!0){case!a.valid:e.prepayment_rate.open=!0;break;case!b.valid:e.default_rate.open=!0;break;case!c.valid:e.pending_rate.open=!0;break;default:d=!0,e.prepayment_rate.open=!1,e.default_rate.open=!1,e.pending_rate.open=!1}return f(function(){e.prepayment_rate.open=!1,e.default_rate.open=!1,e.pending_rate.open=!1},2e3),d}},a.applySettings=function(){("custom"!==a.params.active_param||a.customParams.validate())&&(e.localStorage.setItem(c.projectID+".cashForecast",JSON.stringify(a.params||{})),b.go("analytics.project.cash.forecast.index"))},g.get({projectID:c.projectID,subContent:"cashflows",subID:"history_factors"},function(b){var c=a.project=b.project,d=_.clone(c.history_params.dates);d.length<c.periods.length&&(k&&(a.params.start_date=c.periods[d.length]),d.push(c.periods[d.length])),a.project.validPeriods=d,k&&i()})}])}();