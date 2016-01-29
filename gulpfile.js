var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefix = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync'),
    filter = require('gulp-filter'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    csscomb = require('gulp-csscomb');

// add Error handling method for plumber plugin
var onError = function (err) {
    gutil.beep();
};

// compile SASS, autoprefix & css nano
gulp.task('styles', function() {
    return gulp.src(['sass/*.scss', 'sass/*.sass'])
        .pipe(plumber({
          errorHandler: onError
        }))
        .pipe(sass({errLogToConsole: true})) // compile SASS
        .pipe(autoprefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('build/css'))
        .pipe(rename({ suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('build/css'))
});

// uglify and concat JS
gulp.task('scripts', function() {
  return gulp.src([
        'js/*.js',
        '!js/*.min.js'
    ])
    .pipe(plumber({
            errorHandler: onError
        }))
    .pipe(concat('global.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(rename({ suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
});

// clean target directory
gulp.task('clean:build', function() {
    del(['build/css/**', 'build/js/**'], function (err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

// Initialize BrowserSync proxy server
gulp.task('watch', function() {
    browserSync({
        proxy: "DOMAIN.dev",
        files: ['build/css/*.css', 'build/js/*.js', '*.php', '*.html']

    });

    gulp.watch(['sass/**/*.scss', 'sass/**/*.sass', '*.css'], ['styles']);
    gulp.watch('js/*.js', ['scripts']);
});

// default task
gulp.task('default', ['clean:build'], function() {
    gulp.start('styles', 'scripts');
});
