var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    rename = require("gulp-rename"),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    //connect = require('gulp-connect'),
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
    browserify = require('gulp-browserify');
    styl = require('gulp-styl');
    refresh = require('gulp-livereload');
    lr = require('tiny-lr');
    server = lr();


var bc = './bower_components/';
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
        fonts: './build/fonts/',
        fontsBootstrap: 'build/fonts/bootstrap/'
    },
    src: {
        js: 'js/script.js',
        styles: 'src/styles/template_styles.scss',
        css: './css/**/*.css',
        stylesPartials: 'src/styles/partials/',
        spriteTemplate: 'src/sass.template.mustache',
        images: 'img/**/*.*',
        sprite: 'sprite/*.*',
        fonts: 'fonts/**/*.*',
        fontsBootstrap: 'bower_components/bootstrap-sass/assets/fonts/bootstrap/*.*'
    },
    watch: {
        js: 'js/**/*.js',
        styles: 'styles/**/*.scss',
        css: 'css/**/*.css',
        images: 'img/**/*.*',
        sprite: 'sprite/*.*',
        fonts: 'fonts/**/*.*'
    }
};

// Clean up
gulp.task('clean', function (cb) {
    rimraf('./build', cb);

    gulp.dest('./build/img/')
    gulp.dest('./build/js/')
    gulp.dest('./build/css/')
});

gulp.task('clean1', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del(['build'], cb);
});

// Основные

gulp.task('js', function () {
    gulp.src('./js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'))
    //.pipe(connect.reload());
});
gulp.task('jslibs', function () {
    gulp.src('./js/libs/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/libs/'))
    //.pipe(connect.reload());
});

gulp.task('jsmods', function () {
    gulp.src('./js/modules/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/modules/'))
    //.pipe(connect.reload());
});

gulp.task('css', function () {

    gulp.src(path.src.css)
        .pipe(concatCss("style.min.css"))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(path.build.css));

    gulp.src('./css/fight/*.css')
        .pipe(concatCss("fight.min.css"))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./build/css/'))
    //.pipe(connect.reload());
});


//http://www.graphicsmagick.org/download.html
gulp.task('imr', function () {
    gulp.src('img/*.{jpg,png}')
        //.pipe(imageResize({ width : 100 }))
        .pipe(imageResize({
            width : 600,
            height : 300,
            //crop : true,
            upscale : true
        }))
        //.pipe(gulp.dest('dist'));
        .pipe(rename({suffix: '-300'}))
        .pipe(gulp.dest('build/img'))
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
        .pipe(gulp.dest('./build/img/'))
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

gulp.task('html', function () {
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

// Watch
gulp.task('watch', function () {
    gulp.watch("./css/**/*.css", ["css"]);
    gulp.watch("./*.html", ["html"]);
    gulp.watch("./js/*.js", ["js"]);


    gulp.watch("./img/**/*", ["img"]);
    gulp.watch("./img/**/*", ["imr"]);

    //gulp.watch("./assets/js/libs/*.js", ["jslibs"]);
    //gulp.watch("./assets/js/modules/**/*.js", ["jsmods"]);
});


gulp.task('libs', function() {
    gulp.src(bc+'jquery/dist/jquery.js')
        .pipe(gulp.dest('./builds/dist/libs/jquery/'));

    gulp.src(bc+'bootstrap/dist/!**!/!*.*')
        .pipe(gulp.dest('./builds/dist/libs/bootstrap/'));

    gulp.src(bc+'bootstrap-material-design/dist/!**!/!*.*')
        .pipe(gulp.dest('./builds/dist/libs/bootstrap-material-design/'));

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
        .pipe(gulp.dest('./builds/dist/libs/angular/'));
});

gulp.task('webserver', function() {
    gulp.src('builds/dist/')
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

gulp.task('lr-server', function() {
    server.listen(35729, function(err) {
        if(err) return console.log(err);
    });
})

// Default
//gulp.task('default', ["html", "css", "sass", "js","jslibs", "jsmods", "connect", "watch"]);
gulp.task('default', ["clean","html", "css", "js", "img"]);
