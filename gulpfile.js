'use strict';

var port = 8000;
var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    rename = require("gulp-rename"),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    connect = require('gulp-connect'),
    //sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant  = require('imagemin-pngquant'),
    notify      = require('gulp-notify'),
    rimraf = require('rimraf'),
    changed = require('gulp-changed'),
    gutil = require('gulp-util'),
    ftp = require('gulp-ftp'),
    webserver = require('gulp-webserver'),
    concat = require('gulp-concat'),
    imageResize = require('gulp-image-resize'),
    del = require('del'),
    browserify = require('gulp-browserify'),
    styl = require('gulp-styl'),
    jshint = require('gulp-jshint'),
    jsdoc = require("gulp-jsdoc"),
    sass = require('gulp-sass'),
    //docco = require("gulp-docco"),
    //screenshot = require('gulp-local-screenshots'),
    livereload = require('gulp-livereload'),
    opn = require('opn'),
    open = require('gulp-open'),
    lr = require('tiny-lr'),
    server = lr();


var bc = './comp/';
//http://habrahabr.ru/post/261467/
//http://codereview.stackexchange.com/questions/62986/optimizing-gulpfile-js
//https://github.com/kriasoft/SPA-Seed.Front-end/blob/master/gulpfile.js
//http://frontender.info/getting-started-with-gulp-2/
//http://frontender.info/handling-sync-tasks-with-gulp-js/


//Пути
var path = {
    build: {
        js: './build/js/',
        css: './build/css/',
        images: './build/img/',
        imgres: './build/img/resize/',
        fonts: './build/fonts/',
        fontsBootstrap: 'build/fonts/bootstrap/'
    },
    src: {
        js: './app/js/*.js',
        styles: 'src/styles/template_styles.scss',
        css: './app/css/**/*.css',
        stylesPartials: 'src/styles/partials/',
        spriteTemplate: 'src/sass.template.mustache',
        images: './app/img/**/*.*',
        sprite: 'sprite/*.*',
        fonts: 'fonts/**/*.*',
        fontsBootstrap: 'comp/bootstrap-sass/assets/fonts/bootstrap/*.*'
    },
    watch: {
        js: './app/js/**/*.js',
        styles: 'styles/**/*.scss',
        css: './app/css/**/*.css',
        images: 'img/**/*.*',
        sprite: 'sprite/*.*',
        fonts: 'fonts/**/*.*'
    },
    clean: './build',
    cleanDoc: './DocHelp-jsdoc'
};


gulp.task('make_build', ['clean','js:build','css:build','html:build','img']);

// JS hint task
gulp.task('jshint', function() {
    gulp.src('./js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//Предварительная очистка
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

//Предварительная очистка
gulp.task('cleanDoc', function (cb) {
    rimraf(path.cleanDoc, cb);
});

// middleware function to pass to connect
function middlewares(connect, opt) {
    return [getTranslatorKey, naverTranslator.route, redirectToChat]
}
// Запуск сервера
gulp.task('connectSrvLR', function() {
    connect.server({
        //root: '.', //Не дает с корня работать - ошибка доступа при localhost
        root: 'app/',
        port: port,
        livereload: true
        //middleware: middlewares
    });
    opn('http://localhost:'+port)
});


/* Архив

gulp.task('clean1', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del(['build'], cb);
});

gulp.task('jsmods', function () {
 gulp.src('./js/modules/!**!/!*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/modules/'))
//.pipe(connect.reload());
});


 gulp.task('webserver', function() {
 gulp.src('builds/dist/')
 .pipe(webserver({
 livereload: true,
 open: true
 }));
 });

 gulp.task('lr-server', function() {
 server.listen(63342, function(err) {
 if(err) return console.log(err);
 });
 })

 gulp.task('connect', function() {
 connect.server({
 root: 'app',
 livereload: true
 });
 });


 gulp.task('ftp', function () {
 return gulp.src('src/*')
 .pipe(ftp({
 host: 'website.com',
 user: 'johndoe',
 pass: '1234'
 }))
 // you need to have some kind of stream after gulp-ftp to make sure it's flushed
 // this can be a gulp plugin, gulp.dest, or any kind of stream
 // here we use a passthrough stream
 .pipe(gutil.noop());
 });


*/



//============== Основные =======================
gulp.task('js:livereload', function () {
    gulp.src(path.src.js)
    .pipe(livereload(server))
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())            //Инициализируем sourcemap
        .pipe(uglify())                     //Сожмем наш js
        .pipe(rename(function (path) {
            if (path.extname === '.js') {
                path.basename += '.min';
            }
        }))
        .pipe(sourcemaps.write())           //Пропишем карты
        .pipe(gulp.dest(path.build.js));     //Выплюнем готовый файл в build
        //.pipe(connect.reload());
});



gulp.task('css:build', function () {
    gulp.src(path.src.css)
        .pipe(concatCss("style.min.css"))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(path.build.css));
});

gulp.task('sass', function () {
    gulp.src('./app/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/css'));
});

//http://www.graphicsmagick.org/download.html
gulp.task('imgResize:build', function () {
    gulp.src('./app/img/*.{jpg,png}')
        //.pipe(imageResize({ width : 100 }))
        .pipe(imageResize({
            width : 600,
            height : 300,
            //crop : true,
            upscale : true
        }))
        //.pipe(gulp.dest('dist'));
        .pipe(rename({suffix: '-300'}))
        .pipe(gulp.dest(path.build.imgres));
    //.pipe(notify('images-resize task COMPLETE'));
});

// img-opt task optimizes all images
gulp.task('img-opt', function () {
    return gulp.src('./app/img/*.{jpg,png}')
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
        //.pipe(rename(function (path) { path.basename += "-thumbnail"; }))
        .pipe(gulp.dest('build/img-opt'));
    //.pipe(notify('img-opt task COMPLETE'));
});

gulp.task('img', function () {
    gulp.src('./app/img/*.{jpg,png}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.build.images));
    //.pipe(connect.reload());
});


/*
 gulp.task('sass', function () {
 gulp.src('./sass/*.ccss')
 .pipe(sass("style.css"))
 .pipe(minifyCss(''))
 .pipe(rename("style.sass.min.css"))
 .pipe(autoprefixer({
 browsers: ['last 10 versions'],
 cascade: false
 }))
 .pipe(gulp.dest('./public/css/'))
 .pipe(connect.reload());
 });
 */

gulp.task('html:build', function () {
    gulp.src('./app/*.html')
        .pipe(changed('./build'))
        .pipe(gulp.dest('./build/'));
    //.pipe(connect.reload());
});

gulp.task('fonts', function () {
    gulp.src('./app/font/**/*')
        .pipe(gulp.dest('./build/font/'));
    //.pipe(connect.reload());
});






/*
 // Connect
 gulp.task('connect', function() {
 connect.server({
 root: 'public',
 livereload: true
 });
 });
 */


gulp.task('libs', function() {
    gulp.src(bc+'jquery/dist/jquery.js')
        .pipe(gulp.dest('./build/dist/libs/jquery/'));

    gulp.src(bc+'bootstrap/dist/!**!/!*.*')
        .pipe(gulp.dest('./build/dist/libs/bootstrap/'));

    gulp.src(bc+'bootstrap-material-design/dist/!**!/!*.*')
        .pipe(gulp.dest('./build/dist/libs/bootstrap-material-design/'));

    gulp.src([bc+'angular/angular.js',
        bc+'angular-animate/angular-animate.js',
        bc+'angular-cookies/angular-cookies.js',
        bc+'angular-i18n/angular-locale_ru-ru.js',
        bc+'angular-loader/angular-loader.js',
        bc+'angular-resource/angular-resource.js',
        bc+'angular-route/angular-route.js',
        bc+'angular-sanitize/angular-sanitize.js',
        bc+'angular-touch/angular-touch.js',
        bc+'firebase/firebase.js',
        bc+'angularfire/dist/angularfire.js',
    ])
        .pipe(concat('angular.concat.js'))
        .pipe(gulp.dest('./build/dist/libs/angular/'));
});


gulp.task('html', function () {
    gulp.src('./app/*.html')
        .pipe(livereload());
        //.pipe(connect.reload());
});




// Default
//gulp.task('default', ["html", "css", "sass", "js","jslibs", "jsmods", "connect", "watch"]);



//--------------------------------------------------------------------
var opts = {
    showPrivate: true,
    monospaceLinks: true,
    cleverLinks: true,
    outputSourceFiles: true
};

gulp.task('doc-1-jsdoc',['cleanDoc'], function() {
    gulp.src(["./app/js/**/*.js", "README.md"])
        .pipe(jsdoc.parser())
        .pipe(jsdoc.generator('./DocHelp-jsdoc'));
//      .pipe(open({app: 'google-chrome', uri: 'http://localhost:'+port}));
//      opn('/DocHelp-jsdoc/index.html')
        opn('http://localhost:63342/TestOnJob/DocHelp-jsdoc')
});

//-----------------------------------------------
var opts2 = {
    showPrivate: true,
    monospaceLinks: true,
    encoding: 'utf8',
    cleverLinks: true,
    outputSourceFiles: true
};
var tpl2 = {
    path            : 'ink-docstrap',
    systemName      : 'ПРИМЕР заголовка',
    footer          : 'Generated with ViktorTat',
    copyright       : 'Сделанно  2015!!!',
    navType         : 'vertical',
    theme           : 'journal', //'journal', //'cerulean'//'cosmo',
    linenums        : false,
    collapseSymbols : false,
    inverseNav      : false
};

//'c:\Users\viktor\Desktop\TestOnJob\node_modules\gulp-jsdoc\node_modules\jsdoc\...DocTempl-default-godamnawful/publish'
//var tmp2 = 'node_modules/gulp-jsdoc/node_modules/ink-docstrap/template';
var tmp2 = './DocTempl/default/tmpl';

gulp.task('doc-2-jsdoc', function() {
    gulp.src(["./app/js/**/*.js", "README.md"])
        .pipe(jsdoc.parser())
        .pipe(jsdoc.generator('./DocHelp-jsdoc-2', tpl2, opts2));
//      .pipe(open({app: 'google-chrome', uri: 'http://localhost:'+port}));
    opn('http://localhost:63342/TestOnJob/DocHelp-jsdoc-2')
});


/*
gulp.task('doc-2-docco', function() {
    gulp.src("./js/!**!/!*.js")
    .pipe(docco())
    .pipe(gulp.dest('./DocHelp-docco'))
});
*/


//--------------------------------------------------------------------
// Работа с html
gulp.task('html:watch', function () {
    gulp.src('./app/*.html')
    .pipe(connect.reload());
});

// Работа с css
gulp.task('css:watch', function () {
    gulp.src('./app/css/*.css')
    .pipe(autoprefixer())
    .pipe(connect.reload());
});

// Работа с js
gulp.task('js:watch', function () {
    gulp.src('./app/js/*.js')
    .pipe(connect.reload());
});
gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});
//--------------------------------------------------------------------


gulp.task('default', ['connectSrvLR','watch']);
// Watch
gulp.task('watch', function () {
    //gulp.watch("./css/**/*.css", ["css"]);
    //gulp.watch("./*.html", ["html"]);
    //gulp.watch("./img/**/*", ["img"]);
    //gulp.watch("./img/**/*", ["imr"]);
    //gulp.watch("./assets/js/libs/*.js", ["jslibs"]);
    //gulp.watch("./assets/js/modules/**/*.js", ["jsmods"]);

    gulp.watch(['./app/**/*.html'], ['html:watch']);
    gulp.watch(['./app/css/**/*.css'], ['css:watch']);
    gulp.watch(['./app/js/**/*.js'], ['js:watch']);
    gulp.watch(['./app/sass/**/*.scss'], ['sass:watch']);

/*
    gulp.watch("./js/*.js", ["js:livereload"]);
    livereload.listen();
    gulp.watch(['./*.html']).on('change', livereload.reload);
*/
    //gulp.watch(['./js/*.js']).on('change', livereload.changed);
    //gulp.watch(['./**/*.js']).on('change', livereload.reload);
    //gulp.watch(['./*.html'], ['html']);
});