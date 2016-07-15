
var Mock = require('mockjs')
var proxyMidWare = require('./proxy').proxyMidWare

module.exports = function(app) {
    var apiPrefix = app.get('apiPrefix')

    app.get(apiPrefix + '/institutions', proxyMidWare)
}
