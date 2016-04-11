module.exports = {
    options: {
        plugins: [{
            removeViewBox: false
        }, {
            removeUselessStrokeAndFill: false
        }, {
            convertTransform: false
        }, {
            convertPathData: false
        }, {
            removeUnknownsAndDefaults: false
        }]
    },
    dist: {
        files: [{
            expand: true,
            dot: true,
            cwd: '<%= kt.dist %>',
            src: ['images/**/*.svg'],
            dest: '<%= kt.dist %>'
        }]
    }
};
