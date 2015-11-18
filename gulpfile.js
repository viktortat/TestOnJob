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
    docco = require("gulp-docco"),
    //screenshot = require('gulp-local-screenshots'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();


var bc = './comp/';
//http://habrahabr.ru/post/261467/
//http://codereview.stackexchange.com/questions/62986/optimizing-gulpfile-js
//https://github.com/kriasoft/SPA-Seed.Front-end/blob/master/gulpfile.js
//http://frontender.info/getting-started-with-gulp-2/

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
        js: './js/*.js',
        styles: 'src/styles/template_styles.scss',
        css: './css/**/*.css',
        stylesPartials: 'src/styles/partials/',
        spriteTemplate: 'src/sass.template.mustache',
        images: 'img/**/*.*',
        sprite: 'sprite/*.*',
        fonts: 'fonts/**/*.*',
        fontsBootstrap: 'comp/bootstrap-sass/assets/fonts/bootstrap/*.*'
    },
    watch: {
        js: 'js/**/*.js',
        styles: 'styles/**/*.scss',
        css: 'css/**/*.css',
        images: 'img/**/*.*',
        sprite: 'sprite/*.*',
        fonts: 'fonts/**/*.*'
    },
    clean: './build'
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


//http://www.graphicsmagick.org/download.html
gulp.task('imgResize:build', function () {
    gulp.src('./img/*.{jpg,png}')
        //.pipe(imageResize({ width : 100 }))
        .pipe(imageResize({
            width : 600,
            height : 300,
            //crop : true,
            upscale : true
        }))
        //.pipe(gulp.dest('dist'));
        .pipe(rename({suffix: '-300'}))
        .pipe(gulp.dest(path.build.imgres))
    //.pipe(notify('images-resize task COMPLETE'));
});

// img-opt task optimizes all images
gulp.task('img-opt', function () {
    return gulp.src('img/*.{jpg,png}')
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
        //.pipe(rename(function (path) { path.basename += "-thumbnail"; }))
        .pipe(gulp.dest('build/img-opt'))
    //.pipe(notify('img-opt task COMPLETE'));
});

gulp.task('img', function () {
    gulp.src('./img/*.{jpg,png}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.build.images))
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
    gulp.src('./*.html')
        .pipe(changed('./build'))
        .pipe(gulp.dest('./build/'))
    //.pipe(connect.reload());
});

gulp.task('fonts', function () {
    gulp.src('./font/**/*')
        .pipe(gulp.dest('./build/font/'))
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
    gulp.src('./*.html')
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


gulp.task('doc-1-jsdoc', function() {
    gulp.src(["./js/*.js", "README.md"])
        .pipe(jsdoc.parser())
        .pipe(jsdoc.generator('./DocHelp-jsdoc'))
});

gulp.task('doc-2-docco', function() {
    gulp.src("./js/**/*.js")
        .pipe(docco())
        .pipe(gulp.dest('./DocHelp-docco'))
});

//--------------------------------------------------------------------







gulp.task('default', ['watch']);
// Watch
gulp.task('watch', function () {
    //gulp.watch("./css/**/*.css", ["css"]);
    //gulp.watch("./*.html", ["html"]);
    //gulp.watch("./img/**/*", ["img"]);
    //gulp.watch("./img/**/*", ["imr"]);
    //gulp.watch("./assets/js/libs/*.js", ["jslibs"]);
    //gulp.watch("./assets/js/modules/**/*.js", ["jsmods"]);
    gulp.watch("./js/*.js", ["js:livereload"]);

    livereload.listen();


    gulp.watch(['./*.html']).on('change', livereload.reload);

    //gulp.watch(['./js/*.js']).on('change', livereload.changed);
    //gulp.watch(['./**/*.js']).on('change', livereload.reload);
    //gulp.watch(['./*.html'], ['html']);
});