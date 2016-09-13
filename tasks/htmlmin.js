module.exports = {
    dist: {
        options: {
            collapseWhitespace: true,
            collapseInlineTagWhitespace: false,
            conservativeCollapse: true,
            collapseBooleanAttributes: true,
            removeCommentsFromCDATA: true,
            removeComments: true,
            keepClosingSlash: true,
            removeOptionalTags: true
        },
        files: [{
            expand: true,
            cwd: '<%= kt.dist %>',
            src: ['*.html', 'views/**/*.html', 'common/directives/**/*.html', 'scripts/directives/**/*.html'],
            dest: '<%= kt.dist %>'
        }]
    }
};
