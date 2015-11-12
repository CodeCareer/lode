module.exports = {
    development: {
        options: {
            sourceMap: true,
            sourceMapRootpath: '/',
            sourceMapBasepath: '/',
            sourceMapFileInline: true,
            optimization: 2
        },
        files: [{
            '.tmp/styles/style.css': 'app/less/style.less',
            '.tmp/styles/analytics.css': 'app/less/analytics.less',
            '.tmp/styles/bootstrap-custom-lode.css': 'app/less/bootstrap.less',
            'app/less/theme/v2/icon_img.css': 'app/less/theme/v2/icon_img.less'
        }, {
            expand: true,
            cwd: '<%= kt.app %>',
            src: ['common/directives/**/*.less', 'scripts/directives/**/*.less'],
            dest: '.tmp',
            ext: '.css'
        }]
    },
    // common: {
    //     options: {
    //         sourceMap: true,
    //         sourceMapFileInline: true,
    //         optimization: 2
    //     },
    //     files: [{
    //         expand: true,
    //         cwd: '<%= kt.app %>',
    //         src: ['common/directives/**/*.less', 'scripts/directives/**/*.less'],
    //         dest: '.tmp',
    //         ext: '.css'
    //     }]
    // },
    production: {
        options: {
            // optimization: 2,
            compress: true
        },
        files: [{
            '.tmp/styles/style.css': 'app/less/style.less',
            '.tmp/styles/bootstrap-custom-lode.css': 'app/less/bootstrap.less',
            'app/less/theme/v2/icon_img.css': 'app/less/theme/v2/icon_img.less',
            '.tmp/styles/analytics.css': 'app/less/analytics.less',
            // expand: true,
            // cwd: '<%= kt.app %>',
            // src: ['less/portal.less', 'less/platform.less', 'common/directives/**/*.less', 'scripts/directives/**/*.less'],
            // dest: '<%= kt.dist %>',
            // ext: '.css'
        }, {
            expand: true,
            cwd: '<%= kt.app %>',
            src: ['common/directives/**/*.less', 'scripts/directives/**/*.less'],
            dest: '<%= kt.dist %>',
            ext: '.css'
        }]
        // files: {
        //     'dist/styles/portal.css': 'app/less/portal.less',
        //     'dist/styles/platform.css': 'app/less/platform.less',
        // }
    }
};
