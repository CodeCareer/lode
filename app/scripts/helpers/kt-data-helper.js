/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.lode')
        .factory('ktDataHelper', function($timeout, ktUri, ktFormValidator) {
            /*var educationList = [{
                name: '博士',
                index: 0,
                value: 'doctor'
            }, {
                name: '硕士',
                index: 1,
                value: 'postgraduate'
            }, {
                name: '本科',
                index: 2,
                value: 'bachelor'
            }, {
                name: '大专',
                index: 3,
                value: 'junior_college'
            }, {
                name: '高中及以下',
                index: 4,
                value: 'high_school'
            }]*/

            return {
                /**
                 * [filterInit 筛选组件的初始化]
                 * @param  {[Array]} filters [初始filters]
                 * @param  {[Array]} options   [一个和filters 同长度的类型数组,用于不同的展示表现]
                 * @return {[Function]}      [根据参数处理active状态的函数]
                 */
                filterInit: function(filters, options) {
                    var _self = this
                    if (!filters.hasAdapt) {
                        _self._dataAdaptor(filters, options)
                    }
                    return function(params) {
                        _self.filterUpdate(filters, params)
                    }
                },
                filterUpdate: function(filters, params) { // 更新条件选中状态

                    _.each(filters || [], function(v) {
                        var dscrdField = 'discretized_' + v.field // 自定义的条件field 值不同
                        var fromField = 'from_' + v.field
                        var toField = 'to_' + v.field
                        v.customOptionStart = ''
                        v.customOptionEnd = ''

                        if (v.perform_type === 'options') {
                            if (params[dscrdField]) {
                                _.each(v.options, function(o) {
                                    /*eslint-disable*/
                                    o.active = o.value == params[dscrdField]
                                        /*eslint-enable*/
                                })

                            } else if (params[fromField] || params[toField]) { //说明是自定义参数
                                _.each(v.options, function(o) {
                                    /*eslint-disable*/
                                    o.active = false
                                        /*eslint-enable*/
                                })

                                v.customOptionStart = params[fromField] || ''
                                v.customOptionEnd = params[toField] || ''

                            } else { //默认是全部处于选中状态
                                _.each(v.options, function(o, i) {
                                    /*eslint-disable*/
                                    o.active = i === 0
                                        /*eslint-enable*/
                                })
                            }
                        } else if (v.perform_type === 'search') {
                            v.searchValue = params[v.field] || ''
                        }
                    })
                },
                decodeParams: function(params, decodeKeys) {
                    var res = {}
                    _.each(params, function(v, k) {
                        if (_.includes(decodeKeys || [], k)) {
                            $.extend(res, ktUri.decodeParams(v))
                        }
                    })
                    return res
                },
               /* getEducationName: function(value) {
                    var ed = _.find(educationList, function(v) {
                        return v.value === value
                    }) || {}
                    return ed.name || '-'
                },*/
                // 去掉值是all的参数
                pruneDirtyParams: function(params, search, list) {
                    _.each(params, function(v, i) {
                        //如果url地址中不包含则删除
                        if (search) {
                            var l = _.isArray(list) ? list : [list]
                            if (list) { // 如果依据列表删除
                                if (_.includes(l, i) && !search[i]) {
                                    delete params[i]
                                }
                            } else if (!search[i]) { // 没依据则都删除
                                delete params[i]
                            }
                        }
                    })
                },
                //删除全部时候的参数，避免后台出错
                cutDirtyParams: function(params, search, list) {
                    var newParams = $.extend(true, {}, params)
                    _.each(newParams, function(v, i) {
                        if (newParams[i] === 'all') {
                            delete newParams[i]
                        }
                    })

                    this.pruneDirtyParams(newParams, search, list)

                    return newParams
                },
                // 将后台取到的filters数据加工符合前端的数据-市场数据，产品信息，可预约产品页
                _dataAdaptor: function(filters, options) {
                    // var _self = this
                    options = options || []

                    // 将search类型的放到最后
                    filters.sort(function(a, b) {
                        if (a.perform_type > b.perform_type) {
                            return 1
                        } else if (a.perform_type < b.perform_type) {
                            return -1
                        }
                        return 0
                    })

                    _.each(filters, function(v) {

                        // 域的格式
                        v.pattern = (function() {
                            if (v.field_type === 'integer') {
                                return '^\\d+$'
                            } else if (v.field_type === 'float') {
                                return '^\\d+(\\.\\d+)?$'
                            } else if (v.field_type === 'date') {
                                return '^\\d{4}-\\d{2}-\\d{2}$'
                            }
                            return '^.+$'
                        })();

                        if (_.includes(['integer', 'float'], v.field_type) && v.perform_type === 'options') { // 这两个类型才有自定义筛选范围
                            v.customOptionVisible = true

                            v.errors = { start: '', end: '' }
                            v.validate = function() { // 做值得验证
                                var customStart = ktFormValidator.validateInput('#custom_start_' + v.field, '.filter-box')
                                var customEnd = ktFormValidator.validateInput('#custom_end_' + v.field, '.filter-box')
                                var valid = false
                                switch (true) {
                                    case !customStart.valid:
                                        v.errors.start = (v.field_type === 'integer') ? '请填写正整数' : '请填写正数'
                                        v.errors.start_open = true
                                        break
                                    case !customEnd.valid:
                                        v.errors.end = (v.field_type === 'integer') ? '请填写正整数' : '请填写正数'
                                        v.errors.end_open = true
                                        break
                                    default:
                                        valid = true
                                        v.errors.start = ''
                                        v.errors.start_open = false
                                        v.errors.end = ''
                                        v.errors.end_open = false
                                }

                                $timeout(function() {
                                    v.errors.start_open = false
                                    v.errors.end_open = false
                                }, 2000)

                                return valid
                            }
                        } else if (v.perform_type === 'search') {

                            v.errors = { search: '' }
                            v.validate = function() { // 做值得验证
                                var search = ktFormValidator.validateInput('#search_' + v.field, '.filter-box')
                                var valid = false
                                switch (true) {
                                    case !search.valid:
                                        v.errors.search = '请正确填写'
                                        v.errors.search_open = true
                                        break
                                    default:
                                        valid = true
                                        v.errors.search = ''
                                        v.errors.search_open = false
                                }

                                $timeout(function() {
                                    v.errors.search_open = false
                                }, 2000)

                                return valid
                            }
                        }

                        if (v.perform_type === 'options') {
                            v.options = _.map(v.options, function(o) {
                                return {
                                    name: o,
                                    // visible: option && _.isNil(option.visible) ? option.visible : true,
                                    value: o
                                }
                            })
                            v.options.unshift({
                                name: '全部',
                                active: true,
                                // visible: true,
                                value: 'all'
                            })
                        }

                        // var option = _.find(options, { value: v.value }) //自定义可见 option
                        // v.type = (option && option.type) ? option.type : 'list'

                        /*if (v.type === 'dropdown') {
                            v.options.isOpen = false
                        }*/

                        /*v.toggleView = function($event) { //折叠切换
                            v.collapsed = !v.collapsed
                            var target = $($event.target)
                            target = target.hasClass('icon-arrow') ? target.parent() : target
                            target.toggleClass('expand', !v.collapsed)
                        }*/

                        // 用于过滤的函数
                        /*v.filterFn = v.type === 'list' ?
                            (function() {
                                v.collapsed = _.isNil(v.collapsed) ? true : v.collapsed // 默认折叠
                                return _self._optionsLengthLimit(v)
                            })() : function() {
                                return true
                            }*/
                    })

                    filters.getByField = function(field) {
                        return _.find(filters, { field: field })
                    }

                    filters.validateByField = function(field) {
                        var filter = this.getByField(field)
                        return filter.validate()
                    }

                    filters.hasAdapt = true // 打标识，避免重复数据处理
                },
                seperateTwoColumns: function(data, bound) {
                    _.each(data, function(v, k) {
                        if (v.length > bound) {
                            var breakPoint = (function() {
                                if (v.length > bound * 2) {
                                    return Math.ceil(v.length / 2)
                                }
                                return bound
                            })();
                            data[k + '_second'] = _.remove(data[k], function(v2, i2) {
                                return i2 >= breakPoint
                            })
                        }
                    })
                },

                /*filterStatus: function(arr) { //filter:{fn}
                    return function(item) {
                        return _.includes(arr || [], item.value)
                    }
                },
                filterStatusReverse: function(arr) { //filter:{fn}
                    return function(item) {
                        return !_.includes(arr || [], item.status)
                    }
                },
                getEducationMap: function() {
                    return educationList
                },
                getProjectStatusMap: function() {
                    return [{
                        name: '全部',
                        value: 'all'
                    }, {
                        name: '进行中',
                        value: 'ongoing'
                    }, {
                        name: '已结束',
                        value: 'finished'
                    }]
                },
                getPaymentStatusMap: function() { // 单个借款人的还款状态
                    return [{
                        name: '全部',
                        value: 'all'
                    }, {
                        name: '正常还款',
                        value: 'normal'
                    }, {
                        name: '提前还款',
                        value: 'advanced'
                    }, {
                        name: '逾期',
                        value: 'overdue'
                    }]
                },
                getStatementStatusMap: function() { // 每一期的账单状态
                    return [{
                        name: '全部',
                        value: 'all'
                    }, {
                        name: '未上传',
                        value: 'draft'
                    }, {
                        name: '已上传',
                        value: 'uploaded'
                    }, {
                        name: '已对账',
                        value: 'checked'
                    }]
                },
                getLoanStatusMap: function() { // 每一批次的借款放款状态
                    return [{
                        name: '全部',
                        value: 'all'
                    }, {
                        name: '未审核',
                        value: 'draft'
                    }, {
                        name: '已通过',
                        value: 'approved'
                    }, {
                        name: '已拒绝',
                        value: 'rejected'
                    }, {
                        name: '已生成放款计划',
                        value: 'planned'
                    }, {
                        name: '已下发指令',
                        value: 'issued'
                    }]
                },
                getBorrowersApprovalStatusMap: function() {
                    return [{
                        name: '全部',
                        value: 'all'
                    }, {
                        name: '未审核',
                        value: 'draft'
                    }, {
                        name: '已通过',
                        value: 'approved'
                    }, {
                        name: '已拒绝',
                        value: 'rejected'
                    }]
                },
                getBorrowersLoanStatusMap: function() { // 单个借款人的放款结果状态
                    return [{
                        name: '全部',
                        value: 'all'
                    }, {
                        name: '放款成功',
                        value: 'success'
                    }, {
                        name: '放款失败',
                        value: 'fail'
                    }]
                },
                getBillTypes: function() {
                    return [{
                        name: '当日系统还款',
                        value: 'system'
                    }, {
                        name: '当日其他渠道还款',
                        value: 'other'
                    }, {
                        name: '历史还款催收',
                        value: 'urged'
                    }]
                },
                getBillTypeFactory: function($scope) {
                    return function(type) {
                        var typeObj = _.find($scope.billTypes, function(v) {
                            return v.value === (type || $scope.params.type)
                        }) || {}
                        return typeObj.name || '未知状态'
                    }
                },
                getStatusNameNice: function($scope) {
                    return function(status) {
                        var st = _.find($scope.statusList, function(v) {
                            return v.value === (status || $scope.params.status)
                        }) || {}
                        switch (status) {
                            case 'draft':
                                return '<i class="glyphicon glyphicon-time initial-color mr5"></i>' + st.name;
                            case 'approved':
                            case 'planned':
                            case 'issued':
                            case 'normal':
                            case 'checked':
                            case 'success':
                                return '<i class="glyphicon glyphicon-ok approved-color mr5"></i>' + st.name;
                            case 'fail':
                            case 'rejected':
                                return '<i class="glyphicon glyphicon-remove rejected-color mr5"></i>' + st.name;
                            case 'advanced':
                            case 'uploaded':
                                return '<i class="glyphicon glyphicon-thumbs-up approved-color mr5"></i>' + st.name;
                            case 'overdue':
                                return '<i class="glyphicon glyphicon-thumbs-down warn-color mr5"></i>' + st.name;
                            default:
                                return '<i class="glyphicon glyphicon-question-sign warn-color mr5"></i>' + '未知';
                        }
                        // return st.name || '未知'
                    }
                },
                getSubProjectName: function($scope) {
                    return function(id) {
                        var subProject = _.find($scope.subProjects, function(v) {
                            return v.id === (id || $scope.params.subproject_id)
                        }) || {}
                        return $scope.params.subproject_id ? subProject.name : '全部'
                    }
                },*/
                getStatByProject: function() {
                    return {
                        radioDataShowType: 'all', // all ,single
                        fieldNames: [{
                            name: '项目名称',
                            tip: ''
                        }, {
                            name: '累计成交额',
                            tip: '项目开始以来所有借款的放款额总和'
                        }, {
                            name: '累计成交笔数',
                            tip: '项目开始以来所有借款的个数总和'
                        }, {
                            name: '累计借款人数',
                            tip: ''
                        }]
                    }
                }
            }

        })

})();
