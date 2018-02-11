// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    zetzer = require('gulp-zetzer');

// HTML
gulp.task('zetzer', function(){
    gulp.src('./src/html/*.html')
        .pipe(zetzer({
            partials: './src/html/partials',
            templates: './src/html/templates',
            dot_template_settings: {
                strip: false
            },
            env: {
                env_string: 'Some plain string to use with it.document.env_string'
            }
        }))
        .pipe(gulp.dest('./dist'));
});

// Styles
gulp.task('scss', function() {
    return gulp.src('src/scss/main.scss')
        .pipe(sass({ style: 'expanded', }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(livereload(server))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: 'Images task complete' }));
});

// Default task
gulp.task('default', function() {
    gulp.run('styles');
});

// Watch
gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });

    gulp.watch("src/scss/**/*.scss", ['scss']).on('change', browserSync.reload);
    gulp.watch("src/html/**/*.html", ['zetzer']).on('change', browserSync.reload);
});
