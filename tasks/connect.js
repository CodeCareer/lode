var modRewrite = require('connect-modrewrite'),
    gzip = require('connect-gzip');
var appConfig = {
    app: 'app',
    dist: 'dist'
}
// var server = 'http://dev-lode.kaitongamc.com'
var server = 'http://10.132.1.113:3000'
// var server = 'http://op-fame.ktjr.com'
var modRewriteUri = [
    // '^/mock_data/v\d{1,}/([^?]*).*$ /mock_data/$1 [L]',
    '^/(ajax/api/v\\d{1,}/.*)$ ' + server + '/$1 [P]',
    '^/(uploads/.*)$ ' + server + '/$1 [P]',
    '^/(.(?!\\.))*$ /index.html [L]',
    // '^/seallogo.dll.*$ /mock_data/seallogo.dll'
    // '^\/src/([^\\?]*)(?:\\?.*)?$ /Users/luxueyan/work/tanx-m-ssp/src/$1 [L]',
]
module.exports = {
    options: {
        port: 8000,
        hostname: '*',
        livereload: 35727
    },
    livereload: {
        options: {
            open: {
                target: 'http://localhost:8000',
            },
            middleware: function(connect, options) {

                return [
                    /**
                     * @author luxueyan
                     * 模拟服务器端环境， 
                     * 1.第一次无token, session写入xsrf token 和用户登录状态
                     * 2.无token访问API接口 返回401错误
                     * 3.登录login过期以后返回419错误
                     */
                    connect.cookieParser(),
                    connect.session({
                        secret: 'jiami',
                        cookie: {
                            maxAge: 60 * 60 * 1000 * 24
                        }
                    }),

                    function(req, res, next) {

                        var token = req.session.token
                            // console.log(req.url,'---',req.url.match(/\.json\??\.*/),'++++',req.headers)
                        if ((!token || !req.headers['authorization']) && req.url.match(/sessions\.post\.json\??.*/)) {
                            // res.cookie("XSRF-TOKEN", "test-xsrf", {
                            //     maxAge: 60 * 60 * 1000
                            // });
                            req.session.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNTVhMWNhODY2OTVhMzJlYTUyMDAwMDAwIiwiZXhwIjoxNDM2NzU5NjA4fQ.2CwqRebKd8HPJlG0nAmYBal2eNgkbhgWLdw6Qp6Aix0';
                            // req.session.login = 'true'
                            // } else if (req.url.match(/logout\.post\.json\??.*/)) {
                            //     req.session.token = '';
                            //     req.session.login = '';
                        } else if (req.url.match(/news\.[^?#]*json/) || req.url.match(/users\.post\.json\??.*/) || req.url.match(/capcha\.get\.json\??.*/)) {
                            console.log('no need to authorize')
                        } else if (req.url.match(/\.json\??\.*/) && !req.session.token) {
                            res.writeHead(419, {
                                "Content-Type": "application/json"
                            })
                            res.end('{"error":"session expired"}')
                        } else if (token && req.url.match(/\.json\??\.*/) && token !== req.headers['authorization']) {

                            res.writeHead(401, {
                                "Content-Type": "application/json"
                            })
                            res.end('{"error":"no token post"}')
                        }

                        // if (!req.url.match(/\.json\??|\/api\/v\d+|\/index\.html/g)) {
                        //     res.setHeader("Cache-Control", "max-age=6000")
                        // }
                        return next()
                    },

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
                target: 'http://localhost:8000',
            },
            base: '<%= kt.dist %>',
            middleware: function(connect, options) {
                return [
                    //mock data API0
                    function(req, res, next) {
                        if (!req.url.match(/\.json\??|\/api\/v\d+|\/index\.html|asset-rev.*\.js/g)) {
                            res.setHeader("Cache-Control", "max-age=" + 60 * 60 * 24 * 365)
                        }
                        return next()
                    },
                    modRewrite(modRewriteUri),
                    gzip.staticGzip(appConfig.dist, {matchType: /text|css|javascript|image|font/}), //启用gzip
                    // connect.static(appConfig.dist),
                ]
            }
        }
    }
};
