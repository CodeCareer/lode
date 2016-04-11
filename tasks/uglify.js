module.exports = {
    options: {
        mangle: true
    },
    forLazyLoad: {
        files: [{
            expand: true,
            cwd: '<%= kt.dist %>',
            src: [
                'scripts/controllers/**/*.js',
                'views/**/*.js',
                'scripts/directives/**/*.js',
                'common/directives/**/*.js',
                'common/factories/kt-captcha.js',
            ],
            dest: '<%= kt.dist %>'
        }]
    }
};
