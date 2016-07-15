var proxyMidWare = require('./proxy').proxyMidWare
var Mock = require('mockjs')

module.exports = function(app) {
    var apiPrefix = app.get('apiPrefix')

    // 借款人列表
    app.get(apiPrefix + '/projects/:id/borrowers_settings', function(req, res, next) {
        var data = Mock.mock({
            'filters|4-8': [{
                name: '@cword(3,5)',
                'unit|1': ['元', '岁', '%', '个月'],
                'field|+1': ['dstrbtn_key1', 'dstrbtn_key2', 'dstrbtn_key3', 'dstrbtn_key4', 'dstrbtn_key5', 'dstrbtn_key6', 'dstrbtn_key7', 'dstrbtn_key8'],
                'field_type|1': ['string', 'integer', 'float', 'date'],
                'perform_type|1': ['options', 'search'],
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
                    "pymnt_no": 1,
                    "sched_pymnt_date": "2015年8月1日",
                    "settle_date": "2015年08月1日",
                    "sched_loan_amnt": 100,
                    "sched_prncp": 80,
                    "sched_int": 10,
                    "other_amnt": 10,
                    "pymnt_prncp": 50,
                    "overdue_status": "M1",
                    "shed_prncp_balns": 90,
                    "prncp_blans": 100
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
