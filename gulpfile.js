var gulp = require('gulp'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    htmlmin = require('gulp-htmlmin'),
    cssmin = require('gulp-cssmin'),
    jsmin = require('gulp-jsmin'),
    del = require('del');

gulp.task('js', function() {
    gulp.src('./src/**/*.js')
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('css', function() {
    gulp.src('./src/**/*.css')
        .pipe(plumber())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./build'));
});

gulp.task('copy-index', function() {
    gulp.src('./src/index.html')
        .pipe(gulp.dest('./build'));
});

gulp.task('minify', function() {
    gulp.src('build/index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./release'));

    gulp.src('build/app.css')
        .pipe(cssmin())
        .pipe(gulp.dest('./release'));

    gulp.src('build/app.js')
        .pipe(jsmin())
        .pipe(gulp.dest('./release'));
});

gulp.task('clean', function() {
    del(['./build', './release'], function(err, deletedDir) {
        console.log('Dirs deleted:', deletedDir.join(', '));
    });
});

gulp.task('watch', function() {
    gulp.watch([
        'build/**/*.html',
        'build/**/*.js',
        'build/**/*.css'
    ], function(event) {
        return gulp.src(event.path)
            .pipe(connect.reload());
    });
    gulp.watch('./src/**/*.js', ['js']);
    gulp.watch('./src/**/*.css', ['css']);
    gulp.watch('./src/index.html', ['copy-index']);
});

gulp.task('connect', function() {
    connect.server({
        root: 'build',
        livereload: true,
        port: 9000
    });
});

gulp.task('default', ['connect', 'js', 'css', 'copy-index', 'watch']);
gulp.task('build', ['js', 'css', 'copy-index']);
gulp.task('release-build', ['build', 'minify']);
