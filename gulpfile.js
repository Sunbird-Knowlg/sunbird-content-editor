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

 var bower_components = [
"app/bower_components/jquery/dist/jquery.js",
"app/bower_components/async/dist/async.min.js",
"app/libs/semantic.min.js",
"app/bower_components/angular/angular.js",
"app/bower_components/fabric/dist/fabric.min.js",
"app/bower_components/lodash/lodash.js",
"app/bower_components/x2js/index.js",
"app/bower_components/eventbus/index.js",
"app/bower_components/uuid/index.js",
"app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
"app/bower_components/ng-dialog/js/ngDialog.js",
"app/bower_components/oclazyload/dist/modules/ocLazyLoad.core.js",
"app/bower_components/oclazyload/dist/modules/ocLazyLoad.directive.js",
"app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.common.js",
"app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.core.js",
"app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.cssLoader.js",
"app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.jsLoader.js",
"app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.templatesLoader.js",
"app/bower_components/oclazyload/dist/modules/ocLazyLoad.polyfill.ie8.js",
"app/bower_components/oclazyload/dist/ocLazyLoad.js"
 ];

 var bower_css = [
"app/bower_components/font-awesome/css/font-awesome.css",
"app/bower_components/ng-dialog/css/ngDialog.min.css",
"app/bower_components/ng-dialog/css/ngDialog-theme-plain.min.css",
"app/bower_components/ng-dialog/css/ngDialog-theme-default.min.css"
 ];

 var scriptfiles = [
  'app/scripts/main/class.js',
 'app/scripts/main/ekstep-editor.js',
 'app/scripts/main/base-plugin.js',
 "app/scripts/manager/event-manager.js",
"app/scripts/manager/plugin-manager.js",
"app/scripts/manager/stage-manager.js",
"app/scripts/manager/toolbar-manager.js",
"app/scripts/manager/media-manager.js",
"app/scripts/main/ekstep-editor-api.js",    
"app/scripts/migration/1_migration-task.js",   
"app/scripts/migration/mediamigration-task.js",   
"app/scripts/migration/stageordermigration-task.js",
"app/scripts/migration/basestagemigration-task.js",
"app/scripts/migration/imagemigration-task.js",
"app/scripts/migration/scribblemigration-task.js",
"app/scripts/migration/readalongmigration-task.js",    
"app/scripts/migration/assessmentmigration-task.js",    
"app/scripts/migration/eventsmigration-task.js",
"app/scripts/migration/settagmigration-task.js",    
"app/scripts/service/iservice.js",
"app/scripts/service/content-service.js",
"app/scripts/service/popup-service.js",
"app/scripts/angular/controller/main.js",
"app/scripts/angular/controller/popup-controller.js",
"app/scripts/angular/directive/draggable-directive.js",
"app/scripts/angular/directive/droppable-directive.js",
"app/scripts/service/assessment-service.js",
"app/scripts/service/asset-service.js",
"app/scripts/service/concept-service.js",
"app/scripts/service/language-service.js"
];

 gulp.task('setup', function() {
     gulp.src('semantic/dist', { read: false }).pipe(clean())
     gulp.src(['app/config/theme.config']).pipe(gulp.dest('semantic/src/'))
     gulp.src(['app/config/site.variables']).pipe(gulp.dest('semantic/src/site/globals/'))
     gulp.src('semantic/gulpfile.js')
         .pipe(chug({ tasks: ['build'] }, function() {
             gulp.src(['semantic/dist/semantic.min.css']).pipe(gulp.dest('app/styles/'));
             gulp.src(['semantic/dist/themes/**/*']).pipe(gulp.dest('app/styles/themes'));
             gulp.src(['semantic/dist/semantic.min.js']).pipe(gulp.dest('app/libs/'));
         }))
 });

 // gulp.task('minifyJS', function() {
 //     return gulp.src([
 //             'app/scripts/main/class.js',
 //             'app/scripts/main/ekstep-editor.js',
 //             'app/scripts/main/base-plugin.js',
 //             "app/scripts/manager/event-manager.js",
 //            "app/scripts/manager/plugin-manager.js",
 //            "app/scripts/manager/stage-manager.js",
 //            "app/scripts/manager/toolbar-manager.js",
 //            "app/scripts/manager/media-manager.js",
 //            "app/scripts/main/ekstep-editor-api.js",    
 //            "app/scripts/migration/1_migration-task.js",   
 //            "app/scripts/migration/stageordermigration-task.js",
 //            "app/scripts/migration/basestagemigration-task.js",
 //            "app/scripts/migration/imagemigration-task.js",
 //            "app/scripts/migration/scribblemigration-task.js",
 //            "app/scripts/migration/readalongmigration-task.js",    
 //            "app/scripts/migration/assessmentmigration-task.js",    
 //            "app/scripts/service/iservice.js",
 //            "app/scripts/service/content-service.js",
 //            "app/scripts/service/popup-service.js",
 //            "app/scripts/angular/controller/main.js",
 //            "app/scripts/angular/controller/popup-controller.js",
 //            "app/scripts/angular/directive/draggable-directive.js",
 //            "app/scripts/angular/directive/droppable-directive.js",
 //            "app/scripts/service/assessment-service.js",
 //            "app/scripts/service/asset-service.js",
 //            "app/scripts/service/concept-service.js"
 //         ])
 //         .pipe(concat('script.min.js'))
 //         .pipe(minify({
 //             minify: true,
 //             collapseWhitespace: true,
 //             conservativeCollapse: true,
 //             removeComments: true,
 //             minifyJS: true,
 //             getKeptComment: function(content, filePath) {
 //                 var m = content.match(/\/\*![\s\S]*?\*\//img);
 //                 return m && m.join('\n') + '\n' || '';
 //             }
 //         }))
 //         .pipe(stripDebug())
 //         .pipe(gulp.dest('content-editor/scripts'));
 // });

 gulp.task('minifyJS', function() {
  return gulp.src(scriptfiles)
    .pipe(concat('script.min.js'))
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


 // gulp.task('minifyJsBower', function() {
 //     var filterJS = gulpFilter([bower_components, 'libs/semantic.min.js', 'libs/lame.min.js'], { restore: true });
 //     return gulp.src('app/bower.json')
 //         .pipe(mainBowerFiles())
 //         .pipe(filterJS)
 //         .pipe(concat('external.min.js'))
 //         .pipe(minify({
 //             minify: true,
 //             collapseWhitespace: true,
 //             conservativeCollapse: true,
 //             minifyJS: true,
 //             minifyCSS: true,
 //             getKeptComment: function(content, filePath) {
 //                 var m = content.match(/\/\*![\s\S]*?\*\//img);
 //                 return m && m.join('\n') + '\n' || '';
 //             }
 //         }))
 //         .pipe(gulp.dest('content-editor/scripts'));
 // });

 gulp.task('minifyJsBower', function() {
  return gulp.src(bower_components)
    .pipe(concat('external.min.js'))
    .pipe(gulp.dest('content-editor/scripts/'));
});

 // gulp.task('minifyCssBower', function() {
 //     var filterJS = gulpFilter(['app/bower_components/**/*.css', 'app/bower_components/**/*.less'], { restore: true });
 //     return gulp.src('app/bower.json')
 //         .pipe(mainBowerFiles())
 //         .pipe(filterJS)
 //         .pipe(concat('external.min.css'))
 //         .pipe(minify({
 //             minify: true,
 //             collapseWhitespace: true,
 //             conservativeCollapse: true,
 //             minifyJS: true,
 //             minifyCSS: true,
 //             getKeptComment: function(content, filePath) {
 //                 var m = content.match(/\/\*![\s\S]*?\*\//img);
 //                 return m && m.join('\n') + '\n' || '';
 //             }
 //         }))
 //         .pipe(gulp.dest('content-editor/styles'));
 // });

 gulp.task('minifyCssBower', function() {
  return gulp.src(bower_css)
    .pipe(concat('external.min.css'))
    .pipe(gulp.dest('content-editor/styles'));
});


 gulp.task('copyfonts', function() {
     return gulp.src(['app/styles/themes/**/*', 'app/styles/webfonts/**/*', 'app/styles/fonts/*'], {
             base: 'app/styles/'
         })
         .pipe(gulp.dest('content-editor/styles'));
 });
 gulp.task('copyFiles', function() {
     return gulp.src(['app/templates/**/*', 'app/images/content-logo.png', 'app/images/geniecontrols.png', 'app/images/editor-frame.png','app/config/*.json', 'app/config/*.js', 'app/index.html'], {
             base: 'app/'
         })
         .pipe(gulp.dest('content-editor'));
 });

 gulp.task('minify', ['minifyJS', 'minifyCSS', 'minifyJsBower', 'minifyCssBower', 'copyfonts', 'copyFiles']);

 gulp.task('inject', ['minify'], function() {
     var target = gulp.src('content-editor/index.html');
     var sources = gulp.src(['content-editor/scripts/*.js', 'content-editor/styles/*.css'], { read: false });
     return target.pipe(inject(sources, { ignorePath: 'content-editor/', addRootSlash: false }))
         .pipe(gulp.dest('./content-editor'));
 });

 gulp.task('zip', ['minify', 'inject'], function() {
     return gulp.src('content-editor/**')
         .pipe(zip('content-editor.zip'))
         .pipe(gulp.dest(''));
 });

 gulp.task('build', ['minify', 'inject', 'zip']);

 //Minification for dev Start
 gulp.task('copyFilesDev', function() {
     return gulp.src(['app/scripts/**', 'app/templates/**/*', 'app/images/content-logo.png', 'app/images/geniecontrols.png',
             'app/config/*.json', 'app/config/*.js', 'app/index.html'
         ], { base: 'app/' })
         .pipe(gulp.dest('content-editor'));
 });

 gulp.task('minifyDev', ['minifyCSS', 'minifyJsBower', 'minifyCssBower', 'copyfonts', 'copyFilesDev']); 

 gulp.task('injectDev', ['minifyDev'], function() {
     var target = gulp.src('content-editor/index.html');
     var sources = gulp.src(['content-editor/scripts/external.min.js', 'content-editor/scripts/main/class.js', 'content-editor/scripts/main/ekstep-editor.js', 'content-editor/scripts/main/base-plugin.js',
         'content-editor/scripts/manager/event-manager.js', 'content-editor/scripts/manager/plugin-manager.js', 'content-editor/scripts/manager/stage-manager.js', 'content-editor/scripts/manager/toolbar-manager.js',
         'content-editor/scripts/manager/media-manager.js', 'content-editor/scripts/main/ekstep-editor-api.js', 'content-editor/scripts/migration/1_migration-task.js', 'content-editor/scripts/migration/stageordermigration-task.js',
         'content-editor/scripts/migration/basestagemigration-task.js', 'content-editor/scripts/migration/imagemigration-task.js', 'content-editor/scripts/migration/scribblemigration-task.js', 'content-editor/scripts/service/iservice.js',
         'content-editor/scripts/service/content-serice.js', 'content-editor/scripts/service/popup-service.js', 'content-editor/scripts/angular/controller/main.js', 'content-editor/scripts/angular/controller/popup-controller.js',
         'content-editor/scripts/angular/directive/draggable-directive.js', 'content-editor/scripts/angular/directive/droppable-directive.js', 'content-editor/scripts/service/assessment-service.js', 'content-editor/scripts/service/asset-service.js',
         'content-editor/scripts/service/concept-service.js', 'content-editor/styles/*.css'
     ], { read: false });
     return target.pipe(inject(sources, { ignorePath: 'content-editor/', addRootSlash: false }))
         .pipe(gulp.dest('./content-editor'));
 });

 gulp.task('zipDev', ['minifyDev', 'injectDev'], function() {
     return gulp.src('content-editor/**')
         .pipe(zip('content-editor.zip'))
         .pipe(gulp.dest(''));
 });

 gulp.task('buildDev', ['minifyDev', 'injectDev', 'zipDev']);

 //Minification for dev End
