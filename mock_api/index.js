var common = require('./common')
var account = require('./account')
var projects = require('./projects')
var inst = require('./inst')

exports.mockApi = function(app) {
    common(app)
    account(app)
    projects(app)
    inst(app)
}
