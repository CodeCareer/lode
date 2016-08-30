!function(){"use strict";angular.module("kt.lode").controller("ktVintageLayoutCtrl",["$scope","$state","$stateParams","$location",function(a,b,c,d){a.shared={},a.shared.params=$.extend({filter:""},d.search()||{}),a.dateOptions={field:"date",field_type:"date",name:"Vintage",options:[{name:"自定义",type:"datepicker",onUpdate:function(c){this.name=this.value=c,b.go(b.current.name,{filter:$.param($.extend({},a.shared.fParams,{date:c}))})},value:""}],perform_type:"options",option_type:"object",no_discretized:!0,unit:""},a.shared.filters=[{field:"vintage_index",field_type:"string",name:"指标",options:[{name:"C",value:"C"},{name:"M1",value:"M1"},{name:"M2",value:"M2"},{name:"M3",value:"M3"},{name:"C-M1",value:"C-M1"},{name:"M1-C",value:"M1-C"},{name:"M1-M2",value:"M1-M2"},{name:"逾期率",value:"ovd_rate"},{name:"不良率",value:"np_rate"}],perform_type:"options",option_type:"object",no_discretized:!0,unit:""},a.dateOptions],a.shared.filters.cannotDelete=!0}]).controller("ktVintageCtrl",["$scope","$rootScope","$location","$stateParams","ktProjectsService","ktProjectStaticsReportService","ktDataHelper",function(a,b,c,d,e,f,g){function h(){var c=_.cloneDeep(a.shared.fParams),e=c.date.split("~");c.vintage_start_date=e[0]||null,c.vintage_end_date=e[1]||null,delete c.date,f.get($.extend({projectID:d.projectID,type:"vintages",dimention:"risk",vintage_start_date:c.vintage_start_date,vintage_end_date:c.vintage_end_date},c),function(c){a.data=c,a.shared.fParams.date=c.params.vintage_start_date+"~"+c.params.vintage_end_date;var d=_.find(a.dateOptions.options,function(b){return a.shared.fParams.date===b.value});if(!d){var e=_.last(a.dateOptions.options);e.value=e.name=a.shared.fParams.date}a.shared.updateFilterFParams?(g.filterInit(k)(a.shared.fParams),a.shared.updateFilterFParams()):b.$on("filterInitDone",function(){g.filterInit(k)(a.shared.fParams),a.shared.updateFilterFParams()}),a.vintageChart.chartOptions=$.extend(!0,{},l,{legend:{data:_.map(c.trends,"name")},xAxis:{type:"category",data:c.dates},series:_.map(c.trends,function(a){return a.type="line",a})})})}var i=c.search(),j=a.shared.params,k=a.shared.filters;$.extend(j,i),g.pruneDirtyParams(j,i,["filter"]),a.shared.fParams=$.extend({vintage_index:"ovd_rate",date:""},g.cutDirtyParams(g.decodeParams(j,["filter"]))),a.vintageIndexName=function(){return a.shared.filterFParams?_.find(a.shared.filterFParams,{value:"vintage_index"}).name:""},a.vintageChart={radioDataShowType:"table",chartOptions:{}};var l={tooltip:{axisPointer:{type:"line"},yAxisFormat:"percent"}};h()}])}();