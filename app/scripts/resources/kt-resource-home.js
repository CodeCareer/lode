/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    var tooltipMap = {
        ovd_rate: '推迟还款1天到180天定义为逾期；T日的逾期率定义为:A [T日逾期借款的余额] 除以B [T日所有借款的余额',
        '逾期率': '推迟还款1天到180天定义为逾期；T日的逾期率定义为:A [T日逾期借款的余额] 除以B [T日所有借款的余额',
        'add_up_amnt': '项目开始以来所有借款的放款额总和',
        'add_up_count': '项目开始以来所有借款的个数总和',
        // incrmnt: ''
        np_rate: '推迟还款91天到180天定义为逾期；T日的不良率定义为:A [T日不良借款的余额] 除以B [T日所有借款的余额]',
        '不良率': '推迟还款91天到180天定义为逾期；T日的不良率定义为:A [T日不良借款的余额] 除以B [T日所有借款的余额]'
    }

    var config = {
        accountLogo: 'images/logo-ktjr.svg',
        accountLink: 'http://www.sinoguarantee.com/',
        chartColors: ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
            '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
            '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
            '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'
        ],
        getToolTip: function (key) {
            return tooltipMap[key] || ''
        }
    }

    angular.module('kt.lode')
        .factory('ktHomeResource', function() {
            return {
                get: function() {
                    return config
                }
            }
        })

})();
