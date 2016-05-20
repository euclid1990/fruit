if (typeof Meteor === typeof undefined) {
    'use strict'
    /**
     *  Require packages
     */
    var r = require;
    var gulp        = r('gulp'),
        ts          = r('gulp-typescript'),
        tslint      = r('gulp-tslint'),
        compass     = r('gulp-compass'),
        cssmin      = r('gulp-cssmin'),
        concat      = r('gulp-concat'),
        uglify      = r('gulp-uglify'),
        rename      = r('gulp-rename'),
        watch       = r('gulp-watch'),
        browserify  = r('gulp-browserify'),
        runSequence = r('run-sequence');

    var tsProject = ts.createProject('tsconfig.json', {
        typescript: r('typescript')
    });

    /**
     * Configuration assets of project
     */
    var project = {
        basePath: '.',
        init: function() {
            this.scripts        = this.basePath + '/private/scripts';
            this.stylesheets    = this.basePath + '/private/stylesheets';
            this.js             = this.basePath + '/public/js';
            this.css            = this.basePath + '/public/css';
            return this;
        }
    }.init();

    gulp.task('javascript', function() {
      return gulp.src(project.scripts + '/*.js')
            .pipe(gulp.dest(project.js))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(project.js));
    });

    gulp.task('typescript', function () {
        return gulp.src([
                'typings/browser.d.ts',
                project.scripts + '/*.ts',
                project.scripts + '/*/*.ts'
            ])
            .pipe(tslint()).pipe(tslint.report('prose'))
            .pipe(ts(tsProject))
            .pipe(gulp.dest(project.js));
    });

    gulp.task('scss', function() {
      return gulp.src(project.stylesheets + '/*.scss')
            .pipe(compass({
                css: project.css,
                sass: project.stylesheets
            }))
            .pipe(gulp.dest(project.css))
            .pipe(cssmin())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(project.css));
    });

    /**
     * Default task
     */
    gulp.task('default', ['javascript', 'typescript', 'scss']);

    /**
     * Watch task
     */
    gulp.task('watch', function() {
        gulp.watch(project.scripts + '/*.js', ['javascript']);
        gulp.watch(project.scripts + '/**/*.ts', ['typescript']);
        gulp.watch(project.stylesheets + '/*.scss', ['scss']);
    });
}