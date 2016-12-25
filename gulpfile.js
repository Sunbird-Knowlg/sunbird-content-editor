 var gulp = require('gulp');
 var chug = require('gulp-chug');
 var clean = require('gulp-clean');
 var concat = require('gulp-concat');
 var minify = require('gulp-minifier');
 var stripDebug = require('gulp-strip-debug');
 var mainBowerFiles = require('gulp-main-bower-files');
 var gulpFilter = require('gulp-filter');
 var inject = require('gulp-inject');
 const zip = require('gulp-zip');

 gulp.task('setup', function() {
     gulp.src('semantic/dist', { read: false }).pipe(clean())
     gulp.src(['app/config/theme.config']).pipe(gulp.dest('semantic/src/'))
     gulp.src(['app/config/site.variables']).pipe(gulp.dest('semantic/src/site/globals/'))
     gulp.src('semantic/gulpfile.js')
         .pipe(chug({tasks: ['build']}, function() {
             gulp.src(['semantic/dist/semantic.min.css']).pipe(gulp.dest('app/styles/'));
             gulp.src(['semantic/dist/themes/**/*']).pipe(gulp.dest('app/styles/themes'));    
             gulp.src(['semantic/dist/semantic.min.js']).pipe(gulp.dest('app/libs/'));
         }))
 });

 gulp.task('minifyJS', function() {
     return gulp.src([
             'app/scripts/main/class.js',
             'app/scripts/main/ekstep-editor.js',
             'app/scripts/service/iservice.js',
             'app/scripts/**'
         ])
         .pipe(concat('script.min.js'))
         .pipe(minify({
             minify: true,
             collapseWhitespace: true,
             conservativeCollapse: true,
             removeComments: true,
             minifyJS: true,
             getKeptComment: function(content, filePath) {
                 var m = content.match(/\/\*![\s\S]*?\*\//img);
                 return m && m.join('\n') + '\n' || '';
             }
         }))
         .pipe(stripDebug())
         .pipe(gulp.dest('content-editor/scripts'));
 });

 gulp.task('minifyCSS', function() {
     return gulp.src([
             'app/styles/semantic.min.css',
             'app/styles/content-editor.css',
             'app/styles/MyFontsWebfontsKit.css',
             'app/styles/iconfont.css'
         ])
         .pipe(concat('style.min.css'))
         .pipe(minify({
             minify: true,
             collapseWhitespace: true,
             conservativeCollapse: true,
             minifyJS: true,
             minifyCSS: true,
             getKeptComment: function(content, filePath) {
                 var m = content.match(/\/\*![\s\S]*?\*\//img);
                 return m && m.join('\n') + '\n' || '';
             }
         }))
         .pipe(gulp.dest('content-editor/styles'));
 });


 gulp.task('minifyJsBower', function() {
     var filterJS = gulpFilter(['app/bower_components/**/*.js', 'libs/semantic.min.js'], { restore: true });
     return gulp.src('app/bower.json')
         .pipe(mainBowerFiles())
         .pipe(filterJS)
         .pipe(concat('external.min.js'))
         .pipe(minify({
             minify: true,
             collapseWhitespace: true,
             conservativeCollapse: true,
             minifyJS: true,
             minifyCSS: true,
             getKeptComment: function(content, filePath) {
                 var m = content.match(/\/\*![\s\S]*?\*\//img);
                 return m && m.join('\n') + '\n' || '';
             }
         }))
         .pipe(gulp.dest('content-editor/scripts'));
 });

 gulp.task('minifyCssBower', function() {
     var filterJS = gulpFilter(['app/bower_components/**/*.css', 'app/bower_components/**/*.less'], { restore: true });
     return gulp.src('app/bower.json')
         .pipe(mainBowerFiles())
         .pipe(filterJS)
         .pipe(concat('external.min.css'))
         .pipe(minify({
             minify: true,
             collapseWhitespace: true,
             conservativeCollapse: true,
             minifyJS: true,
             minifyCSS: true,
             getKeptComment: function(content, filePath) {
                 var m = content.match(/\/\*![\s\S]*?\*\//img);
                 return m && m.join('\n') + '\n' || '';
             }
         }))
         .pipe(gulp.dest('content-editor/styles'));
 });


 gulp.task('copyfonts', function() {
     return gulp.src(['app/styles/themes/**/*', 'app/styles/webfonts/**/*', 'app/styles/fonts/*'], {
             base: 'app/styles/'
         })
         .pipe(gulp.dest('content-editor/styles'));
 });
 gulp.task('copyFiles', function() {
     return gulp.src(['app/templates/**/*', 'app/images/content-logo.png', 'app/config/*.json', 'app/config/*.js', 'app/index.html'], {
             base: 'app/'
         })
         .pipe(gulp.dest('content-editor'));
 });

 gulp.task('minify', ['minifyJS', 'minifyCSS', 'minifyJsBower', 'minifyCssBower', 'copyfonts', 'copyFiles']);

 gulp.task('inject', ['minify'], function() {
     var target = gulp.src('content-editor/index.html');
     var sources = gulp.src(['content-editor/scripts/*.js', 'content-editor/styles/*.css'], { read: false });
     return target.pipe(inject(sources, { addRootSlash: false }))
         .pipe(gulp.dest('./content-editor'));
 });

 gulp.task('zip', ['minify', 'inject'], function () {
    return gulp.src('content-editor/**')
        .pipe(zip('content-editor.zip'))
        .pipe(gulp.dest('ansible'));
 });

 gulp.task('build', ['minify', 'inject', 'zip']);
