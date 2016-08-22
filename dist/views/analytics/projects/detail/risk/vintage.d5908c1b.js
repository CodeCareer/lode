!function(){"use strict";angular.module("kt.lode").controller("ktVintageCtrl",["$scope","$location","$stateParams","ktProjectStaticsReportService","ktDateHelper",function(a,b,c,d,e){function f(){d.get($.extend({projectID:c.projectID,type:"vintages",dimention:"risk",vintage_start_date:g.vintage_start_date,vintage_end_date:g.vintage_end_date},g),function(b){a.data=b,$.extend(a.params,b.params||{}),a.vintageRange=b.params.vintage_start_date+"~"+g.vintage_end_date,a.vintageChart.chartOptions=$.extend(!0,{},h,{legend:{data:_.map(b.trends,"name")},xAxis:{type:"category",data:b.dates},series:_.map(b.trends,function(a){return a.type="line",a})})})}a.datepickerSettings={triggerEvent:"datepicker-change"};var g=a.params=$.extend({vintage_index:"ovd_rate",vintage_start_date:null,vintage_end_date:null},b.search()||{});a.vintage_indexs=[{name:"C-M1",value:"C-M1"},{name:"M1-C",value:"M1-C"},{name:"M1-M2",value:"M1-M2"},{name:"逾期率",value:"ovd_rate"},{name:"不良率",value:"np_rate"}],a.vintageRange=function(){return g.vintage_start_date+"~"+g.vintage_end_date}(),a.vintage_indexs.activeName=function(){var b=_.find(a.vintage_indexs,function(a){return a.value===g.vintage_index})||a.vintage_indexs[0];return b.name},e.initPeriod(a,g),a.data={},a.$watch("vintageRange",function(a,c){if(a!==c){var d=a.split("~");b.search($.extend(g,{vintage_start_date:d[0]||null,vintage_end_date:d[1]||null}))}}),a.goTo=function(a,c){var d={};d[a]=c,b.search($.extend(g,d))},a.vintageChart={radioDataShowType:"table",chartOptions:{}};var h={tooltip:{axisPointer:{type:"line"},yAxisFormat:"percent"}};f()}])}();