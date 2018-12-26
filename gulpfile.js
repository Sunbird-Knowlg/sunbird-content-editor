var gulp = require('gulp');
var chug = require('gulp-chug');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var minify = require('gulp-minifier');
var stripDebug = require('gulp-strip-debug');
var mainBowerFiles = require('gulp-main-bower-files');
var gulpFilter = require('gulp-filter');
var inject = require('gulp-inject');
var CacheBuster = require('gulp-cachebust');
var mergeStream = require('merge-stream');
var rename = require("gulp-rename");
var merge = require('merge-stream');
var cleanCSS = require('clean-css');
var replace = require('gulp-string-replace');
var uglify = require('gulp-uglify');
var git = require('gulp-git'); 
var frameworkVersionNumber = process.env.framework_version_number;
var editorVersionNumber = process.env.editor_version_number;
var buildNumber = process.env.build_number;
var branchName = process.env.branch || 'master';

if (!editorVersionNumber && !buildNumber && !frameworkVersionNumber) {
    console.error('Error!!! Cannot find framework_version_number, editor_version_number and build_number env variables');
    return process.exit(1);
}
var versionPrefix = '.' + editorVersionNumber + '.' + buildNumber;
var cachebust = function(path) {
    path.basename += versionPrefix
}
var baseEditorCachebust = function(path) {
    path.basename += '.' + frameworkVersionNumber;
}

//var cachebust = new CacheBuster();
const zip = require('gulp-zip');


var bower_components = [
    "app/bower_components/jquery/dist/jquery.min.js",
    "app/bower_components/async/dist/async.min.js",
    "app/libs/semantic.min.js",
    "app/libs/mousetrap.min.js",
    "app/libs/telemetry-lib-v3.min.js",
    "app/libs/webfont.js",
    "app/bower_components/angular/angular.min.js",
    "app/bower_components/fabric/dist/fabric.min.js",
    "app/bower_components/lodash/dist/lodash.min.js",
    "app/bower_components/x2js/index.js",
    "app/bower_components/eventbus/index.js",
    "app/bower_components/uuid/index.js",
    "app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
    "app/bower_components/ng-dialog/js/ngDialog.min.js",
    "app/bower_components/ngSafeApply/index.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.core.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.directive.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.common.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.core.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.cssLoader.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.jsLoader.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.loaders.templatesLoader.js",
    "app/bower_components/oclazyload/dist/modules/ocLazyLoad.polyfill.ie8.js",
    "app/bower_components/oclazyload/dist/ocLazyLoad.min.js",
    "app/scripts/contenteditor/md5.js",
    "app/bower_components/fingerprintjs2/dist/fingerprint2.min.js",
    "app/libs/ng-tags-input.js"
];

var bower_css = [
    "app/bower_components/font-awesome/css/font-awesome.min.css",
    "app/bower_components/ng-dialog/css/ngDialog.min.css",
    "app/bower_components/ng-dialog/css/ngDialog-theme-plain.min.css",
    "app/bower_components/ng-dialog/css/ngDialog-theme-default.min.css",
    "app/libs/ng-tags-input.css",
];

var contentEditorApp = [
    "app/scripts/angular/controller/main.js",
    "app/scripts/angular/controller/popup-controller.js",
    "app/scripts/angular/directive/draggable-directive.js",
    "app/scripts/angular/directive/droppable-directive.js",
    "app/scripts/angular/directive/template-compiler-directive.js",
    "app/scripts/contenteditor/migration/1_migration-task.js",
    "app/scripts/contenteditor/migration/mediamigration-task.js",
    "app/scripts/contenteditor/migration/stageordermigration-task.js",
    "app/scripts/contenteditor/migration/basestagemigration-task.js",
    "app/scripts/contenteditor/migration/imagemigration-task.js",
    "app/scripts/contenteditor/migration/scribblemigration-task.js",
    "app/scripts/contenteditor/migration/readalongmigration-task.js",
    "app/scripts/contenteditor/migration/assessmentmigration-task.js",
    "app/scripts/contenteditor/migration/eventsmigration-task.js",
    "app/scripts/contenteditor/migration/settagmigration-task.js",
    "app/scripts/contenteditor/migration/textmigration-task.js",
    "app/scripts/contenteditor/manager/stage-manager.js"
];

var editorFramework = [
    "app/libs/fontfaceobserver.min.js",
    "app/libs/telemetry-lib-v3.min.js",
    "app/bower_components/fingerprintjs2/dist/fingerprint2.min.js",
    "app/scripts/contenteditor/bootstrap-editor.js",
    "app/scripts/contenteditor/ce-config.js",
    "app/scripts/contenteditor/content-editor.js",
    "app/scripts/contenteditor/content-editor-api.js",
    "app/scripts/contenteditor/base-plugin.js",
    "app/scripts/contenteditor/manager/toolbar-manager.js",
    "app/scripts/contenteditor/manager/media-manager.js",
    "app/scripts/contenteditor/manager/sidebar-manager.js",
    "app/scripts/contenteditor/manager/header-manager.js",
    "app/scripts/contenteditor/service/popup-service.js",
    "app/scripts/contenteditor/service/manifest-generator.js",
    "app/scripts/contenteditor/service/telemetry-service.js",
    "app/scripts/contenteditor/dispatcher/idispatcher.js",
    "app/scripts/contenteditor/dispatcher/console-dispatcher.js",
    "app/scripts/contenteditor/dispatcher/local-dispatcher.js",
    "app/scripts/contenteditor/dispatcher/piwik-dispatcher.js"
]

var pluginFramework = [
    "app/scripts/framework/libs/ES5Polyfill.js",
    "app/scripts/framework/class.js",
    "app/scripts/framework/libs/eventbus.min.js",
    "app/scripts/framework/libs/mousetrap.min.js",
    "app/scripts/framework/bootstrap-framework.js",
    "app/scripts/framework/manager/resource-manager.js",
    "app/scripts/framework/manager/event-manager.js",
    "app/scripts/framework/manager/plugin-manager.js",
    "app/scripts/framework/manager/keyboard-manager.js",
    "app/scripts/framework/service/iservice.js",
    "app/scripts/framework/service/content-service.js",
    "app/scripts/framework/service/assessment-service.js",
    "app/scripts/framework/service/asset-service.js",
    "app/scripts/framework/service/meta-service.js",
    "app/scripts/framework/service/language-service.js",
    "app/scripts/framework/service/search-service.js",
    "app/scripts/framework/service/dialcode-service.js",
    "app/scripts/framework/service/textbook-service.js",
    "app/scripts/framework/service/lock-service.js",
    "app/scripts/framework/service/user-service.js",
    "app/scripts/framework/repo/irepo.js",
    "app/scripts/framework/repo/published-repo.js",
    "app/scripts/framework/repo/draft-repo.js",
    "app/scripts/framework/repo/host-repo.js"
];

gulp.task('setup', function() {
    gulp.src('semantic/dist', {
        read: false
    }).pipe(clean())
    gulp.src(['app/config/theme.config']).pipe(gulp.dest('semantic/src/'))
    gulp.src(['app/config/site.variables']).pipe(gulp.dest('semantic/src/site/globals/'))
    gulp.src('semantic/gulpfile.js')
        .pipe(chug({
            tasks: ['build']
        }, function() {
            gulp.src(['semantic/dist/semantic.min.css']).pipe(gulp.dest('app/styles/'));
            gulp.src(['semantic/dist/themes/**/*']).pipe(gulp.dest('app/styles/themes'));
            gulp.src(['semantic/dist/semantic.min.js']).pipe(gulp.dest('app/libs/'));
        }))
});

var appScripts = pluginFramework.concat(editorFramework).concat(contentEditorApp);
var editorScripts = pluginFramework.concat(editorFramework);

gulp.task('minifyallJS', function() {
    return gulp.src(appScripts)
        .pipe(concat('script.min.js'))
        .pipe(minify({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true
        }))
        .pipe(uglify())
        .pipe(rename(cachebust))
        .pipe(gulp.dest('content-editor/scripts'));
});

gulp.task('minifyBaseEditor', function() {
    return gulp.src(editorScripts)
        .pipe(concat('base-editor.min.js'))
        .pipe(uglify())
        .pipe(rename(baseEditorCachebust))
        .pipe(gulp.dest('content-editor/scripts'));
});

gulp.task('minifyFramework', function() {
    return gulp.src(pluginFramework)
        .pipe(concat('plugin-framework.min.js'))
        .pipe(uglify())
        .pipe(rename(baseEditorCachebust))
        .pipe(gulp.dest('content-editor/scripts'));
});

gulp.task('dist', function() {
    var cesrc = gulp.src(scriptfiles).pipe(concat('script.min.js')).pipe(gulp.dest('dist/'));
    var celibs = gulp.src(bower_components).pipe(concat('external.min.js')).pipe(gulp.dest('dist/'));
    var pluginframework = gulp.src(pluginFramework).pipe(concat('plugin-framework.min.js')).pipe(gulp.dest('dist/'));
    return merge(cesrc, celibs, pluginframework);
});

gulp.task('minifyCSS', function() {
    return gulp.src([
            'app/styles/semantic.min.css',
            'app/styles/MyFontsWebfontsKit.css',
            'app/styles/iconfont.css',
            'app/styles/icomoon/style.css',
            'app/styles/header.css',
            'app/styles/commonStyles.css',
            'app/styles/content-editor.css'
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
        .pipe(rename(cachebust))
        .pipe(gulp.dest('content-editor/styles'));
});

gulp.task('minifyJsBower', function() {
    return gulp.src(bower_components)
        .pipe(concat('external.min.js'))
        .pipe(minify({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true
        }))
        .pipe(uglify())
        .pipe(rename(cachebust))
        .pipe(gulp.dest('content-editor/scripts/'));
});

gulp.task('minifyCssBower', function() {
    return gulp.src(bower_css)
        .pipe(concat('external.min.css'))
        .pipe(rename(cachebust))
        .pipe(gulp.dest('content-editor/styles'));
});


gulp.task('copyfonts', function() {
    return gulp.src(['app/styles/themes/**/*', 'app/styles/webfonts/**/*', 'app/styles/fonts/*', 'app/styles/noto.css'], {
            base: 'app/styles/'
        })
        .pipe(gulp.dest('content-editor/styles'));
});
gulp.task('copycommonfonts', function() {
    return gulp.src(['app/styles/icomoon/fonts/*'], {
            base: 'app/styles/icomoon/fonts/'
        })
        .pipe(gulp.dest('content-editor/styles/fonts'));
});
gulp.task('copyfontawesomefonts', function() {
    return gulp.src(['app/bower_components/font-awesome/fonts/fontawesome-webfont.ttf', 'app/bower_components/font-awesome/fonts/fontawesome-webfont.woff'], {
            base: 'app/bower_components/font-awesome/fonts/'
        })
        .pipe(gulp.dest('content-editor/styles/fonts'));
});
gulp.task('copyFiles', function() {
    return gulp.src(['app/templates/**/*', 'app/images/content-logo.png', 'app/images/geniecontrols.png', 'app/images/editor-frame.png', 'app/config/*.json', 'app/config/*.js', 'app/index.html'], {
            base: 'app/'
        })
        .pipe(gulp.dest('content-editor'));
});

gulp.task('copydeploydependencies', function() {
    return gulp.src(['deploy/gulpfile.js', 'deploy/package.json'], {
            base: ''
        })
        .pipe(gulp.dest('content-editor'));
});

gulp.task('minify', ['minifyallJS', 'minifyBaseEditor', 'minifyCSS', 'minifyJsBower', 'minifyFramework', 'minifyCssBower', 'copyfonts', 'copycommonfonts', 'copyfontawesomefonts', 'copyFiles', 'copydeploydependencies']);

gulp.task('inject', ['minify'], function() {
    var target = gulp.src('content-editor/index.html');
    var sources = gulp.src(['content-editor/scripts/*.js', '!content-editor/scripts/base-editor*.js', '!content-editor/scripts/plugin-framework.*.js', '!content-editor/scripts/coreplugins.js', 'content-editor/styles/*.css'], {
        read: false
    });
    return target
        .pipe(inject(sources, {
            ignorePath: 'content-editor/',
            addRootSlash: false
        }))
        .pipe(gulp.dest('./content-editor'));
});

gulp.task('replace', ['inject'], function() {
    return mergeStream([
        gulp.src(["content-editor/styles/external.*.css"]).pipe(replace('../fonts', 'fonts')).pipe(gulp.dest('content-editor/styles')),
        gulp.src(["content-editor/scripts/script.*.js"]).pipe(replace('/plugins', '/content-plugins')).pipe(replace("https://dev.ekstep.in", "")).pipe(replace('dispatcher: "local"', 'dispatcher: "console"')).pipe(gulp.dest('content-editor/scripts/'))
    ]);
});

gulp.task('zip', ['minify', 'inject', 'replace', 'packageCorePlugins'], function() {
    return gulp.src('content-editor/**')
        .pipe(zip('content-editor.zip'))
        .pipe(gulp.dest(''));
});

gulp.task('build', ['minify', 'inject', 'zip']);

//Minification for dev Start
gulp.task('copyFilesDev', function() {
    return gulp.src(['app/scripts/**', 'app/templates/**/*', 'app/images/content-logo.png', 'app/images/geniecontrols.png',
            'app/config/*.json', 'app/config/*.js', 'app/index.html'
        ], {
            base: 'app/'
        })
        .pipe(gulp.dest('content-editor'));
});

gulp.task('minifyDev', ['minifyCSS', 'minifyJsBower', 'minifyCssBower', 'copyfonts', 'copyfontawsomefonts', 'copyFilesDev']);

gulp.task('injectDev', ['minifyDev'], function() {
    var target = gulp.src('content-editor/index.html');
    var sources = gulp.src(['content-editor/scripts/external.min.js', 'content-editor/scripts/main/class.js', 'content-editor/scripts/main/ekstep-editor.js', 'content-editor/scripts/main/base-plugin.js',
        'content-editor/scripts/manager/event-manager.js', 'content-editor/scripts/manager/plugin-manager.js', 'content-editor/scripts/manager/stage-manager.js', 'content-editor/scripts/manager/toolbar-manager.js',
        'content-editor/scripts/manager/media-manager.js', "app/scripts/contenteditor/manager/header-manager.js", "app/scripts/contenteditor/manager/sidebar-manager.js", 'content-editor/scripts/main/ekstep-editor-api.js', 'content-editor/scripts/migration/1_migration-task.js', 'content-editor/scripts/migration/stageordermigration-task.js',
        'content-editor/scripts/migration/basestagemigration-task.js', 'content-editor/scripts/migration/imagemigration-task.js', 'content-editor/scripts/migration/scribblemigration-task.js', 'content-editor/scripts/service/iservice.js',
        'content-editor/scripts/service/content-serice.js', 'content-editor/scripts/service/popup-service.js', 'content-editor/scripts/angular/controller/main.js', 'content-editor/scripts/angular/controller/popup-controller.js',
        'content-editor/scripts/angular/directive/draggable-directive.js', 'content-editor/scripts/angular/directive/droppable-directive.js', 'content-editor/scripts/service/assessment-service.js', 'content-editor/scripts/service/asset-service.js',
        'content-editor/scripts/service/concept-service.js', 'content-editor/styles/*.css'
    ], {
        read: false
    });
    return target.pipe(inject(sources, {
            ignorePath: 'content-editor/',
            addRootSlash: false
        }))
        .pipe(gulp.dest('./content-editor'));
});

gulp.task('zipDev', ['minifyDev', 'injectDev'], function() {
    return gulp.src('content-editor/**')
        .pipe(zip('content-editor.zip'))
        .pipe(gulp.dest(''));
});

gulp.task('buildDev', ['minifyDev', 'injectDev', 'zipDev', "cachebust"]);

var corePlugins = [
    "org.ekstep.colorpicker-1.0",
    "org.ekstep.config-1.0",
    "org.ekstep.readalongbrowser-1.0",
];

gulp.task('minifyCorePlugins', function() {
    var tasks = [];
    corePlugins.forEach(function(plugin) {
        tasks.push(
            gulp.src('plugins/' + plugin + '/editor/plugin.js')
            .pipe(minify({
                minify: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                minifyJS: true,
                minifyCSS: true,
                mangle: false
            }))
            .pipe(rename('plugin.min.js'))
            .pipe(gulp.dest('plugins/' + plugin + '/editor'))
        );
    });
    return mergeStream(tasks);
});

gulp.task('packageCorePluginsDev', ["minifyCorePlugins"], function() {
    var fs = require('fs');
    var _ = require('lodash');
    var jsDependencies = [];
    var cssDependencies = [];
    if (fs.existsSync('app/scripts/coreplugins.js')) {
        fs.unlinkSync('app/scripts/coreplugins.js');
    }
    corePlugins.forEach(function(plugin) {
        var manifest = JSON.parse(fs.readFileSync('plugins/' + plugin + '/manifest.json'));
        if (manifest.editor.dependencies) {
            manifest.editor.dependencies.forEach(function(dependency) {
                var resource = '/plugins/' + plugin + '/' + dependency.src;
                if (dependency.type == 'js') {
                    fs.appendFile('app/scripts/coreplugins.js', "org.ekstep.pluginframework.resourceManager.loadExternalResource('" + resource + "', 'js')" + "\n");
                } else if (dependency.type == 'css') {
                    fs.appendFile('app/scripts/coreplugins.js', "org.ekstep.pluginframework.resourceManager.loadExternalResource('" + resource + "', 'css')" + "\n");
                }
            });
        }
        var plugin = fs.readFileSync('plugins/' + plugin + '/editor/plugin.min.js', 'utf8');
        fs.appendFile('app/scripts/coreplugins.js', 'org.ekstep.pluginframework.pluginManager.registerPlugin(' + JSON.stringify(manifest) + ',eval(\'' + plugin.replace(/'/g, "\\'") + '\'))' + '\n');
    });
    return gulp.src('plugins/**/plugin.min.js', {
        read: false
    }).pipe(clean());
});

gulp.task('packageCorePlugins', ["minifyFramework", "minifyBaseEditor", "minifyCorePlugins"], function() {
    var fs = require('fs');
    var _ = require('lodash');
    var jsDependencies = [];
    var cssDependencies = [];
    if (fs.existsSync('content-editor/scripts/coreplugins.js')) {
        fs.unlinkSync('content-editor/scripts/coreplugins.js');
    }
    corePlugins.forEach(function(plugin) {
        var manifest = JSON.parse(fs.readFileSync('plugins/' + plugin + '/manifest.json'));
        if (manifest.editor.dependencies) {
            manifest.editor.dependencies.forEach(function(dependency) {
                var resource = '/content-plugins/' + plugin + '/' + dependency.src;
                //var resource = '/plugins/' + plugin + '/' + dependency.src;
                if (dependency.type == 'js') {
                    fs.appendFile('content-editor/scripts/coreplugins.js', "org.ekstep.pluginframework.resourceManager.loadExternalResource('" + resource + "', 'js')" + "\n");
                } else if (dependency.type == 'css') {
                    fs.appendFile('content-editor/scripts/coreplugins.js', "org.ekstep.pluginframework.resourceManager.loadExternalResource('" + resource + "', 'css')" + "\n");
                }
            });
        }
        var plugin = fs.readFileSync('plugins/' + plugin + '/editor/plugin.min.js', 'utf8');
        fs.appendFile('content-editor/scripts/coreplugins.js', 'org.ekstep.pluginframework.pluginManager.registerPlugin(' + JSON.stringify(manifest) + ',eval(\'' + plugin.replace(/'/g, "\\'") + '\'))' + '\n');
    });
    return gulp.src('plugins/**/plugin.min.js', {
        read: false
    }).pipe(clean());
});

gulp.task("clone-plugins", function(done) {
    git.clone('https://github.com/project-sunbird/sunbird-content-plugins.git', {args: '-b '+ branchName +' ./plugins'}, function (err) {
        if (err) {
            done(err);
        }
        done();
    });
});



