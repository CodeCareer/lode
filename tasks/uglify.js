module.exports = {
    options: {
        mangle: false
    },
    forLazyLoad: {
        files: [{
            expand: true,
            cwd: '<%= kt.app %>',
            src: [
                'scripts/controllers/**/*.js',
                'scripts/directives/**/*.js',
                'common/directives/**/*.js',
                'common/factories/kt-captcha.js',
            ],
            dest: '<%= kt.dist %>'
        }]
    }
};
