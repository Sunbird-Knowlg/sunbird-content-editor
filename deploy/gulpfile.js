var gulp = require('gulp');
var inject = require('gulp-inject');
var CacheBuster = require('gulp-cachebust');
var mergeStream = require('merge-stream');
var fs = require('fs');
var zip = require('gulp-zip');
var replace = require('gulp-string-replace');
var packageJson = JSON.parse(fs.readFileSync('./package.json'));
var promise = require("any-promise");

var cachebust = new CacheBuster();
gulp.task('renameminifiedfiles', function() {
    var js =  gulp.src('scripts/*.min.js').pipe(cachebust.resources()).pipe(gulp.dest('scripts/'));
    var css = gulp.src('styles/*.min.css').pipe(cachebust.resources()).pipe(gulp.dest('styles/'));
    return mergeStream(js, css);
});

gulp.task('injectrenamedfiles', function() {
    var target = gulp.src('index.html');
    var sources = gulp.src(['scripts/*.min.*.js', 'styles/*.min.*.css'], { read: false });
    return target.pipe(inject(sources, { ignorePath: '/', addRootSlash: false })).pipe(gulp.dest('./'));
});

gulp.task('bower-package', function() {
    return gulp.src(['**', '!scripts/contenteditor.min.js', '!scripts/plugin-framework.min.js', '!scripts/contenteditor.min.js', '!gulpfile.js', '!package.json']).pipe(gulp.dest('build/'));
});

gulp.task('package', ['iframe-package', 'embed-package']);

gulp.task('iframe-package', ['bower-package'], function() {
    var package_id = packageJson['name'] + '-' + 'iframe' + '-' + packageJson['version'];
    return gulp.src('build/**').pipe(zip(package_id + '.zip')).pipe(gulp.dest('dist/'));
});

gulp.task('bower-package-transform', ['iframe-package'], function() {
    return mergeStream[gulp.src('build/index.html').pipe(replace('href="styles', 'href="content-editor-embed/styles')).pipe(replace('src="scripts', 'src="content-editor-embed/scripts')).pipe(replace("'templates", "'content-editor-embed/templates")).pipe(gulp.dest('build/')),
    gulp.src('build/scripts/script.min.js').pipe(replace("src='scripts", "src='content-editor-embed/scripts")).pipe(gulp.dest('build/'))];
});

gulp.task('embed-package', ['bower-package-transform'], function() {
    var package_id = packageJson['name'] + '-' + 'embed' + '-' + packageJson['version'];
    return gulp.src('build/**').pipe(zip(package_id + '.zip')).pipe(gulp.dest('dist/'));
});