var proxyMidWare = require('./proxy').proxyMidWare
var Mock = require('mockjs')

module.exports = function(app) {
    var apiPrefix = app.get('apiPrefix')

    app.get(apiPrefix + '/users', proxyMidWare)
    app.post(apiPrefix + '/sessions', proxyMidWare)
}
