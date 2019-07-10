var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });
    gulp.watch("./src/*.*").on('change', reload);;
});

