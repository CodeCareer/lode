var modRewrite = require('connect-modrewrite')
var gzip = require('connect-gzip')
var appConfig = {
    app: 'app',
    dist: 'dist'
}
var port = 8000
var livereloadPort = 35727

 // var server = 'http://dev-lode.ktjr.com'
// var server = 'http://lode.ktjr.com'
// var server = 'http://10.132.1.114:3000'
// var server = 'http://10.132.1.94:3000'
// var server = 'http://10.132.1.1:3000'
// 10.132.1.1:3000
var server = 'http://localhost:3000'

var modRewriteUri = [
    // '^/mock_data/v\d{1,}/([^?]*).*$ /mock_data/$1 [L]',
    '^/(ajax/v\\d{1,}/.*)$ ' + server + '/$1 [P]',
    '^/(uploads/.*)$ ' + server + '/$1 [P]',
    '^/(.(?!\\.))*$ /index.html [L]',
]

module.exports = {
    options: {
        port: port,
        hostname: '*',
        livereload: livereloadPort
    },
    livereload: {
        options: {
            open: {
                target: 'http://localhost:' + port,
            },
            middleware: function(connect) {

                return [
                    /**
                     * @author luxueyan @deprecated
                     * 模拟服务器端环境，
                     * 1.第一次无token, session写入xsrf token 和用户登录状态
                     * 2.无token访问API接口 返回401错误
                     * 3.登录login过期以后返回419错误
                     */
                    /*connect.cookieParser(),
                    connect.session({
                        secret: 'jiami',
                        cookie: {
                            maxAge: 60 * 60 * 1000 * 24
                        }
                    }),

                    sessionMidWare(),*/

                    //mock data API
                    modRewrite(modRewriteUri),
                    connect.static('.tmp'),
                    connect().use(
                        '/bower_components',
                        connect.static('./bower_components')
                    ),
                    connect().use(
                        '/app',
                        connect.static('./app')
                    ),
                    connect.static(appConfig.app),
                ];
            }
        }
    },
    dist: {
        options: {
            livereload: false,
            open: {
                target: 'http://localhost:' + port,
            },
            base: '<%= kt.dist %>',
            middleware: function() {
                return [
                    //mock data API0
                    /*function(req, res, next) {
                        if (!req.url.match(/\.json\??|\/api\/v\d+|\/index\.html|asset-rev.*\.js/g)) {
                            res.setHeader('Cache-Control', 'max-age=' + 60 * 60 * 24 * 365)
                        }
                        return next()
                    },*/
                    modRewrite(modRewriteUri),
                    gzip.staticGzip(appConfig.dist, {
                        matchType: /text|css|javascript|image|font/
                    }), //启用gzip
                    // connect.static(appConfig.dist),
                ]
            }
        }
    }
};
