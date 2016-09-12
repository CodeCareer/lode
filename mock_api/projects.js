var proxyMidWare = require('./proxy').proxyMidWare
var Mock = require('mockjs')

module.exports = function(app) {
    var apiPrefix = app.get('apiPrefix')

    /*    app.get(apiPrefix + '/statistics/projects/:id/risk/trends', function(req, res, next) {

          res.json({
                'dates': [
                    '2016年02月',
                    '2016年03月',
                    '2016年04月',
                    '2016年05月',
                    '2016年06月',
                    '2016年07月'
                ],
                'overdue_trends': [{
                    'name': 'C',
                    'data': [
                        0.0971992314474412,
                        0.09882826853711281,
                        0.0520634127376784,
                        0.09445401656498424,
                        0.06860739133724574,
                        0.07135225267720932
                    ]
                }, {
                    'name': 'M1',
                    'data': [
                        0.22859564874971175,
                        0.19991822556696215,
                        0.2645273090577451,
                        0.18854098429370583,
                        0.20821666861536986,
                        0.30272886971525764
                    ]
                }, {
                    'name': 'M2',
                    'data': [
                        0.5553854326022651,
                        0.4944209129403974,
                        0.4058582381084858,
                        0.4921789027170965,
                        0.5093099043697615,
                        0.49476091844138176
                    ]
                }, {
                    'name': 'M3',
                    'data': [
                        0.19936515112102124,
                        0.30177193304737904,
                        0.31372265212038514,
                        0.27744791799328017,
                        0.25278243639234654,
                        0.11954521061239863
                    ]
                }, {
                    'name': 'M4',
                    'data': [
                        0.22859564874971175,
                        0.19991822556696215,
                        0.2645273090577451,
                        0.18854098429370583,
                        0.20821666861536986,
                        0.30272886971525764
                    ]
                }, {
                    'name': 'M5',
                    'data': [
                        0.5553854326022651,
                        0.4944209129403974,
                        0.4058582381084858,
                        0.4921789027170965,
                        0.5093099043697615,
                        0.49476091844138176
                    ]
                }, {
                    'name': 'M6',
                    'data': [
                        0.19936515112102124,
                        0.30177193304737904,
                        0.31372265212038514,
                        0.27744791799328017,
                        0.25278243639234654,
                        0.11954521061239863
                    ]
                }, {
                    'name': '逾期率',
                    'data': [
                        0.3270728777081356,
                        0.3094388494763661,
                        0.282768410829948,
                        0.26888855806338724,
                        0.22624845568892005,
                        0.21185726852276018
                    ]
                }, {
                    'name': '不良率',
                    'data': [
                        0.13051235373471248,
                        0.13062296526993952,
                        0.1353830031981423,
                        0.12966603068155097,
                        0.117917969201864,
                        0.11638061783807771
                    ]
                }],
                'migration_trends': [{
                    'name': 'C-M1',
                    'data': [
                        0.0971992314474412,
                        0.09882826853711281,
                        0.0520634127376784,
                        0.09445401656498424,
                        0.06860739133724574,
                        0.07135225267720932
                    ]
                }, {
                    'name': 'M1-C',
                    'data': [
                        0.22859564874971175,
                        0.19991822556696215,
                        0.2645273090577451,
                        0.18854098429370583,
                        0.20821666861536986,
                        0.30272886971525764
                    ]
                }, {
                    'name': 'M1-M1',
                    'data': [
                        0.5553854326022651,
                        0.4944209129403974,
                        0.4058582381084858,
                        0.4921789027170965,
                        0.5093099043697615,
                        0.49476091844138176
                    ]
                }, {
                    'name': 'M1-M2',
                    'data': [
                        0.19936515112102124,
                        0.30177193304737904,
                        0.31372265212038514,
                        0.27744791799328017,
                        0.25278243639234654,
                        0.11954521061239863
                    ]
                }, {
                    'name': 'M2-C',
                    'data': [
                        null,
                        0.01681598367980138,
                        0.0265033230424331,
                        null,
                        null,
                        null
                    ]
                }, {
                    'name': 'M2-M1',
                    'data': [
                        null,
                        null,
                        0.01794258956107947,
                        null,
                        0.06649739432185178,
                        null
                    ]
                }, {
                    'name': 'M2-M2',
                    'data': [
                        0.07355331848375077,
                        0.04552809256505953,
                        0.10867087054937646,
                        0.175607018201716,
                        0.041544038894996325,
                        null
                    ]
                }, {
                    'name': 'M2-M3',
                    'data': [
                        0.9086126425449567,
                        0.923041830594514,
                        0.8318230226055527,
                        0.8025202200521971,
                        0.7757300529321304,
                        null
                    ]
                }, {
                    'name': 'M3-M4',
                    'data': [
                        0.9576749809552939,
                        1,
                        0.8454519573009298,
                        1,
                        0.9774473545151046,
                        null
                    ]
                }]

            })
        })

        //dashboard
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
                },
                'overdue_stat': [{
                    'status': 'C',
                    'loan_count': 100,
                    'loan_amnt_weighted_avg_term': 15.4,
                    'prncp_balns_weighted_avg_remaining_term': 5.3,
                    'avg_prncp_balns': 12156.0,
                    'overdue_prncp': 1000.0
                }, {
                    'status': 'M1-M3',
                    'loan_count': 100,
                    'loan_amnt_weighted_avg_term': 15.4,
                    'prncp_balns_weighted_avg_remaining_term': 5.3,
                    'avg_prncp_balns': 12140.0,
                    'overdue_prncp': 1000.0
                }, {
                    'status': 'M3+',
                    'loan_count': 100,
                    'loan_amnt_weighted_avg_term': 15.4,
                    'prncp_balns_weighted_avg_remaining_term': 5.3,
                    'avg_prncp_balns': 12143.0,
                    'overdue_prncp': 1000.0
                }]
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
        })*/

    //dashboard
    app.get(apiPrefix + '/statistics/projects/:id/repayments', function(req, res, next) {

        res.json({
            'dates': [
                '2016年05月',
                '2016年06月',
                '2016年07月',
                '2016年08月',
                '2016年09月',
                '2016年10月'
            ],
            'repay': [{
                'name': '实际还款',
                'data': [
                    1384783.0000052,
                    1327190.99997552,
                    1384783.0000052,
                    1327190.99997552,
                    0,
                    0
                ]
            }, {
                'name': '计划还款',
                'data': [
                    1903046,
                    1903046,
                    1903041,
                    1903045,
                    0,
                    0
                ]
            }, {
                'name': '实还/计划',
                'data': [
                    0.7276665934534425,
                    0.6974035309580116,
                    0.7276665934534422,
                    0.6974035309580116,
                    null,
                    null
                ]
            }],
            'drate': [{
                'name': 'D0',
                'data': [
                    0.70934281146152,
                    0.7196977897565272,
                    0.7070806485909011,
                    0.7196977897565272,
                    0.7070806485909011,
                    null
                ]
            }, {
                'name': 'D5',
                'data': [
                    0.7241427690031139,
                    0.7464512155800227,
                    0.7116344008385084,
                    0.7464512155800227,
                    0.7116344008385084,
                    null
                ]
            }, {
                'name': 'D15',
                'data': [
                    0.7400809018695292,
                    0.752143668626192,
                    0.7156190654237049,
                    0.752143668626192,
                    0.7156190654237049,
                    null
                ]
            }, {
                'name': 'D30',
                'data': [
                    0.7429268656560063,
                    0.7555592455486625,
                    0.7156190654237049,
                    0.7555592455486625,
                    0.7156190654237049,
                    null
                ]
            }, {
                'name': 'D60',
                'data': [
                    0.7429268656560063,
                    0.7555592455486625,
                    0.7156190654237049,
                    0.7555592455486625,
                    0.7156190654237049,
                    null
                ]
            }, {
                'name': 'D90',
                'data': [
                    0.7429268656560063,
                    0.7555592455486625,
                    0.7156190654237049,
                    0.7555592455486625,
                    0.7156190654237049,
                    null
                ]
            }]
        })
    })

    // 借款人列表
    /*app.get(apiPrefix + '/projects/:id/filters', function(req, res, next) {
        var data = Mock.mock({
            'filters|4-8': [{
                name: '@cword(3,5)',
                'unit|1': ['元', '岁', '%', '个月'],
                'field|+1': ['key1', 'key2', 'key3', 'key4', 'key5', 'key6', 'key7', 'key8'],
                'field_type|1': ['string', 'integer', 'float', 'date'],
                // 'field_type|1': ['string', 'integer', 'float', 'date'],
                // 'perform_type|1': ['search'],
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
    })*/

    app.get(apiPrefix + '/projects/:id/cashflows/history_factors', function(req, res, next) {
        var data = Mock.mock({
            project: {
                periods: ['2015年01月', '2015年02月', '2015年03月', '2015年04月', '2015年05月', '2015年06月', '2015年07月', '2015年08月', '2015年09月', '2015年10月', '2015年11月', '2015年12月'],
                history_params: {
                    'dates': ['2015年01月', '2015年02月', '2015年03月', '2015年04月','2015年05月','2015年06月'],
                    trends: [{
                        name: '早偿率',
                        'data|4': ['@float(0,0,2,2)']
                    }, {
                        name: '违约率',
                        'data|4': ['@float(0,0,2,2)']
                    }, {
                        name: '未还款率',
                        'data|4': ['@float(0,0,2,2)']
                    }]
                }
            }
        })

        res.json(data)
    })

    app.get(apiPrefix + '/projects/:id/cashflow', function(req, res, next) {
        var data = Mock.mock({
            dates: ['2015年01月', '2015年02月', '2015年03月', '2015年04月', '2015年05月', '2015年06月', '2015年07月', '2015年08月', '2015年09月', '2015年10月', '2015年11月', '2015年12月'],
            asset_cashflow_trends: [{
                name: '本金还款',
                'data|12': ['@integer(1000,1000000)']
            }, {
                name: '利息还款',
                'data|12': ['@integer(1000,1000000)']
            }, {
                name: '总现金流',
                'data|12': ['@integer(1000,1000000)']
            }],
            addup_cashflow_trends: [{
                name: '余额',
                'data|12': ['@integer(1000,1000000)']
            }, {
                name: '累计本金',
                'data|12': ['@integer(1000,1000000)']
            }, {
                name: '累计利息',
                'data|12': ['@integer(1000,1000000)']
            }, {
                name: '累计现金流',
                'data|12': ['@integer(1000,1000000)']
            }],
            loss_cashflow_trends: [{
                name: '损失金额',
                'data|12': ['@integer(1000,1000000)']
            }, {
                name: '正常余额',
                'data|12': ['@integer(1000,1000000)']
            }, {
                name: '累计本金还款',
                'data|12': ['@integer(1000,1000000)']
            }, {
                name: '累计早偿金额',
                'data|12': ['@integer(1000,1000000)']
            }],
            params: {
                start_date: '2015年06月',
                // periods: '11',
                prepayment_rate: '0.35',
                default_rate: '0.36',
                pending_rate: '0.43'
            }

        })

        res.json(data)
    })

    app.get(apiPrefix + '/projects/:id/re_forecast', function(req, res, next) {
        var data = Mock.mock({
            dates: ['2015年03月', '2015年04月'],
            addup_cashflow_trends: [{
                name: '累计现金流（真实）',
                'data|2': ['@integer(1000, 1000000)']
            }, {
                name: '累计现金流（回测）',
                'data|2': ['@integer(1000, 1000000)']
            }],
            balns_trends: [{
                name: '余额（真实）',
                'data|2': ['@integer(1000, 1000000)']
            }, {
                name: '余额（回测）',
                'data|2': ['@integer(1000, 1000000)']
            }],
            prepayment_rate_trends: [{
                name: '早偿率（真实）',
                'data|2': ['@float(0,0,2,2)']
            }, {
                name: '早偿率（回测）',
                'data|2': ['@float(0,0,2,2)']
            }],
            lose_rate_trends: [{
                name: '损失率（真实）',
                'data|2': ['@float(0,0,2,2)']
            }, {
                name: '早偿率（回测）',
                'data|2': ['@float(0,0,2,2)']
            }]
        })
        res.json(data)
    })

    app.get(apiPrefix + '/projects', proxyMidWare)
    app.get(apiPrefix + '/projects/:id', proxyMidWare)
    app.get(apiPrefix + '/projects/:id/:dimention', proxyMidWare)
    app.get(apiPrefix + '/projects/:id/:dimention/:type', proxyMidWare)
    app.get(apiPrefix + '/statistics/projects/:id', proxyMidWare)
    app.get(apiPrefix + '/statistics/projects/:id/:dimention', proxyMidWare)
    app.get(apiPrefix + '/statistics/projects/:id/:dimention/:type', proxyMidWare)

}
