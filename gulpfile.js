 var gulp = require('gulp');
 var chug = require('gulp-chug');
 var clean = require('gulp-clean');
 
 gulp.task('sematic-ui-build', function() {
     gulp.src('semantic/dist', { read: false }).pipe(clean())
     gulp.src(['app/config/theme.config']).pipe(gulp.dest('semantic/src/'))
     gulp.src('semantic/gulpfile.js')
         .pipe(chug({tasks: ['build']}, function() {
             gulp.src(['semantic/dist/semantic.min.css']).pipe(gulp.dest('app/styles/'));
             gulp.src(['semantic/dist/themes/**/*']).pipe(gulp.dest('app/styles/themes'));    
             gulp.src(['semantic/dist/semantic.min.js']).pipe(gulp.dest('app/libs/'));
         }))
 });
