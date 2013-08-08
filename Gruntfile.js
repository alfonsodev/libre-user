module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        express: {
            options: {
                port: 9000,
                hostname: '*'
            },
            livereload: {
                options: {
                    server: path.resolve('./server'),
                    livereload: true,
                    serverreload: true,
                    bases: [path.resolve('./.tmp'), path.resolve(__dirname, yeomanConfig.app)]
                }
            }

        },
        watch: {
            options: {
                livereload: true,
            },
            scripts: {
                files: ['lib/libre-user/*.js', 'examples/**/*.js'],
            },
        }
    });

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express');
    grunt.registerTask('default', ['express', 'watch']);
};

