!function(){"use strict";angular.module("kt.lode").controller("ktRepaymentsLayoutCtrl",["$scope","$state","$stateParams","$location","ktProjectsService","ktDateHelper",function(a,b,c,d,e,f){a.shared={},a.shared.params=$.extend({filter:""},d.search()||{}),a.dateOptions={field:"date",field_type:"date",name:"期限",options:[{name:"上月",value:f.getDate("lastMonth")},{name:"近三月",value:f.getDate("last3Month")},{name:"近六个月",value:f.getDate("last6Month")},{name:"自定义",type:"datepicker",onUpdate:function(c){this.name=this.value=c,b.go(b.current.name,{filter:$.param($.extend({},a.shared.fParams,{date:c}))})},value:""}],perform_type:"options",option_type:"object",no_discretized:!0,unit:""},a.shared.filters=[a.dateOptions],a.shared.filters.hideFParams=!0,a.shared.filters.cannotDelete=!0}]).controller("ktRepaymentsCtrl",["$scope","$rootScope","$location","$stateParams","ktProjectsService","ktProjectStaticsReportService","ktValueFactory","ktDataHelper","ktDateHelper",function(a,b,c,d,e,f,g,h,i){function j(){var b=_.cloneDeep(a.shared.fParams),c=b.date.split("~");b.start_date=c[0],b.end_date=c[1],delete b.date,f.get($.extend({projectID:d.projectID,dimention:"repayments"},b),function(b){a.data=b,a.realPayChart.chartOptions=$.extend(!0,{},p,{grid:{right:50},legend:{data:_.map(b.repay,"name")},xAxis:{type:"category",data:b.dates},yAxis:[{type:"value",name:"万元",axisLabel:{formatter:function(a){return g(a,"rmb").replace("万元","")}}},{type:"value",name:"百分比(%)",position:"right",axisLabel:{formatter:function(a){return g(a,"percent").replace("%","")}}}],tooltip:{axisPointer:{type:"line"},yAxisFormat:"rmb{0,1}|percent{2,3}"},series:[{name:b.repay[0].name,type:"line",yAxisIndex:0,data:b.repay[0].data},{name:b.repay[1].name,type:"line",yAxisIndex:0,data:b.repay[1].data},{name:b.repay[2].name,type:"line",yAxisIndex:1,data:b.repay[2].data}]}),a.drateRateChart.legend=_.chain(b.drate).map(function(a){return{name:a.name,value:!0}}).value(),a.drateRateChart.chartOptions=$.extend(!0,{},p,{legend:{data:_.map(b.drate,"name")},xAxis:{type:"category",data:b.dates},yAxis:{name:"百分比(%)"},series:_.map(b.drate,function(a){return a.type="line",a})})})}var k=c.search(),l=a.shared.params,m=a.shared.filters;$.extend(l,k),h.pruneDirtyParams(l,k,["filter"]),a.shared.fParams=$.extend({date:i.getDate("last6Month")},h.cutDirtyParams(h.decodeParams(l,["filter"])));var n=_.find(a.dateOptions.options,function(b){return a.dateOptions.options[3].value="",a.shared.fParams.date===b.value});if(!n){var o=_.last(a.dateOptions.options);o.value=o.name=a.shared.fParams.date}a.shared.updateFilterFParams?(h.filterInit(m)(a.shared.fParams),a.shared.updateFilterFParams()):b.$on("filterInitDone",function(){h.filterInit(m)(a.shared.fParams),a.shared.updateFilterFParams()}),a.realPayChart={overdueTab:!0,badTab:!0,radioDataShowType:"table",chartOptions:{}},a.drateRateChart={legend:[],radioDataShowType:"table",chartDimension:"扣款成功率",chartOptions:{}};var p={tooltip:{axisPointer:{type:"line"},yAxisFormat:"percent"}};j()}])}();