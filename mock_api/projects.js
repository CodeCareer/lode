var proxyMidWare = require('./proxy').proxyMidWare
var Mock = require('mockjs')

module.exports = function(app) {
    var apiPrefix = app.get('apiPrefix')

    app.get(apiPrefix + '/statistics/projects/:id/dashboard', function(req, res, next) {

        res.json({
            'summary_stat': {
                'sum_prncp_balns': 1477924000,
                'sum_loan_amnt': 477924000,
                'borrower_count': 9526,
                'loan_count': 9526
            },
            'loan_amnt_stat': {
                'max_loan_amnt': 500000,
                'min_loan_amnt': 10000,
                'avg_loan_amnt': 50170.480789418434
            },
            'interest_rate_stat': {
                'max_interest_rate': 0.10768312960863113,
                'min_interest_rate': 0.003079165006056428,
                'loan_amnt_weighted_avg_interest_rate': 0.04263763724415814
            },
            'term_stat': {
                'max_term': 36,
                'min_term': 6,
                'loan_amnt_weighted_avg_term': 18.3400268661963,
                'max_remaining_term': 16.2,
                'min_remaining_term': 1.3,
                'prncp_balns_weighted_avg_remaining_term': 5.742
            }
        })
    })

    app.get(apiPrefix + '/projects/:id/discretized_dimensions', function(req, res, next) {

        res.json({
            'dimensions': [{
                'key': 'sex',
                'name': '性别',
                'description': '借款人的性别'
            }, {
                'key': 'age',
                'name': '年龄',
                'description': '借款人借款时的年龄'
            }]
        })
    })

    //请求现金流预测分析画图表的数据
    // app.get(apiPrefix + '/statistics/projects/:id/cash/cash_forecast', function(req, res, next) {
         app.get(apiPrefix + '/projects/:id/cash/cash_forecast', function(req, res, next) {

        res.json({
            'dates': [
                '2016年01月',
                '2016年02月',
                '2016年03月',
                '2016年04月',
                '2016年05月',
                '2016年06月'
            ],
            'trends': [{
                'name': '资产剩余本金',
                'data': [
                    12000000,
                    8100000,
                    5001111,
                    4131111,
                    1001111,
                    10000
                ]
            }, {
                'name': '累计本金还款',
                'data': [
                    12000001,
                    8100002,
                    5001113,
                    2131111,
                    901111,
                    10001
                ]
            }, {
                'name': '累计损失',
                'data': [
                    11000000,
                    8300000,
                    6001111,
                    3131111,
                    5001111,
                     10009
                ]
            }]

        })
    })

    //请求资产风险分析画图表的数据
    app.get(apiPrefix + '/statistics/projects/:id/risk/asset', function(req, res, next) {

        res.json({
            'dates': [
                '2016年01月',
                '2016年02月',
                '2016年03月',
                '2016年04月',
                '2016年05月',
                '2016年06月'
            ],
            'trends': [{
                'name': '0-1000元',
                'data': [
                    0.10128951812834373,
                    0.10332570398472926,
                    0.13486538575969836,
                    null,
                    null,
                    null
                ]
            }, {
                'name': '1001-3000元',
                'data': [
                    0.156581595423538,
                    0.14523721907483214,
                    0.14629891277543497,
                    null,
                    null,
                    null
                ]
            }, {
                'name': '3001-8000元',
                'data': [
                    0.1041889554544227,
                    0.10568893200818066,
                    0.14270619735008544,
                    null,
                    null,
                    null
                ]
            }]

        })
    })

    // 借款人列表
    app.get(apiPrefix + '/projects/:id/filters', function(req, res, next) {
        var data = Mock.mock({
            'filters|4-8': [{
                name: '@cword(3,5)',
                'unit|1': ['元', '岁', '%', '个月'],
                'field|+1': ['key1', 'key2', 'key3', 'key4', 'key5', 'key6', 'key7', 'key8'],
                'field_type|1': ['string', 'integer', 'float', 'date'],
                // 'field_type|1': ['string', 'integer', 'float', 'date'],
                'perform_type|1': ['search'],
                // 'perform_type|1': ['options', 'search'],
                'options': ['1-2测试', '3-4测试', '4-5测试', '5-6测试', '6-7测试', '7-8测试', '8-9测试', '9+测试']
            }]
        })
        res.json(data)
    })

    app.get(apiPrefix + '/projects/:id/borrowers', function(req, res, next) {
        var data = Mock.mock({
            'fields|10': [{
                name: '@cword(3,6)',
                'field|+1': ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f0'],
                'format|1': ['date', 'percent', 'currency', 'normal']
            }],
            'borrowers|5-10': [{
                id: '@id',
                f1: '@integer(1,5)',
                f2: '@integer(1,5)',
                f3: '@integer(1,5)',
                f4: '@integer(1,5)',
                f5: '@integer(1,5)',
                f6: '@integer(1,5)',
                f7: '@integer(1,5)',
                f8: '@integer(1,5)',
                f9: '@integer(1,5)',
                f0: '@integer(1,5)',
            }],
            total_items: 100
        })
        res.json(data)
    })

    app.get(apiPrefix + '/projects/:id/borrowers/:borrower_id', function(req, res, next) {
        var data = Mock.mock({
            info: {
                'basic_info|5-20': [{
                    'name': '@cword(3,8)',
                    'value|1': ['@cword(3,10)', '@integer(5,9)']
                }],
                'contact_info|5-20': [{
                    'name': '@cword(3,8)',
                    'value|1': ['@cword(3,10)', '@integer(5,9)']
                }],
                'other_info|5-20': [{
                    'name': '@cword(3,8)',
                    'value|1': ['@cword(3,10)', '@integer(5,9)']
                }]
            },
            repayments: {
                'loan_info': {
                    'loan_amount': 50000,
                    'term': 12,
                    'product_type': '等本等息',
                    'interest_rate': '8.9%'
                },
                'payments|12': [{
                    'pymnt_no': 1,
                    'sched_pymnt_date': '2015年8月1日',
                    'settle_date': '2015年08月1日',
                    'sched_loan_amnt': 100,
                    'sched_prncp': 80,
                    'sched_int': 10,
                    'other_amnt': 10,
                    'pymnt_prncp': 50,
                    'shed_prncp_balns': 90,
                    'prncp_blans': 100,
                    'overdue_status': 'M1',
                }]
            }
        })
        res.json(data)
    })

    app.get(apiPrefix + '/projects/', proxyMidWare)
    app.get(apiPrefix + '/projects', proxyMidWare)
    app.get(apiPrefix + '/projects/:id', proxyMidWare)
    app.get(apiPrefix + '/projects/:id/:dimention', proxyMidWare)
    app.get(apiPrefix + '/statistics/projects/:id', proxyMidWare)
    app.get(apiPrefix + '/statistics/projects/:id/:dimention', proxyMidWare)
    app.get(apiPrefix + '/statistics/projects/:id/:dimention/:type', proxyMidWare)


}
