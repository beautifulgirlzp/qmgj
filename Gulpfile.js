var gulp = require("gulp"),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();
/*
 * @roots for bootstrap
*/
gulp.task('root-less',function(){
  return gulp.src('ngboots/bower_components/bootstrap/less/bootstrap.less')
        .pipe(plugins.less())
        .pipe(plugins.autoprefixer({
          browsers: ['last 20 versions'],
          cascade: true
         }))
        .pipe(gulp.dest( 'ngboots/dist/' ))
        .pipe(plugins.minifyCss())
        .pipe(plugins.rename('bootstrap.min.css'))
        .pipe(gulp.dest( 'ngboots/dist/' ))
});
gulp.task('root-js',function(){
  return gulp.src([
          'ngboots/bower_components/jquery/dist/jquery.js',
          'ngboots/bower_components/seajs/dist/sea-debug.js',
          'ngboots/bower_components/underscore/underscore.js',
          'ngboots/js/path/path.js'
          ]) 
        .pipe(plugins.plumber())
        .pipe(plugins.concat( "global.js"))
        .pipe( gulp.dest( 'ngboots/dist/' ) )
        .pipe(plugins.uglify())
        .pipe(plugins.rename('global.min.js'))
        .pipe( gulp.dest( 'ngboots/dist/' ) )
        .pipe( gulp.dest( 'client/static/ng-modules/ngweblib/global/0.0.1/' ) )
});
/*
* @roots
*/
gulp.task("build-root",['root-less','root-js']);


var srcPath = 'public/static/qmczweb/';
/*
 * @desc less文件监听、编译
*/
gulp.task('less-min',function(){
  var onError = function(err) {
      plugins.notify.onError({
                  title:    "Gulp",
                  subtitle: "Failure!",
                  message:  "less error: <%= error.message %>",
                  sound:    "Beep"
              })(err);
      this.emit('end');
  };
  return gulp.src([ srcPath + '**/main.less'])
        .pipe(plugins.plumber({errorHandler: onError}))
        .pipe(plugins.less())
        .pipe(plugins.autoprefixer({
          browsers: ['last 20 versions'],
          cascade: true
         }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest( srcPath ))
        .pipe(plugins.notify({
           title: 'Gulp',
           subtitle: 'success',
           message: 'less OK',
           sound: "Pop"
        }))
        .pipe(plugins.livereload());
});

/*
 * @desc Html转js文件
*/
gulp.task('jst',function(){
  var onError = function(err) {
      plugins.notify.onError({
                  title:    "Gulp",
                  subtitle: "Failure!",
                  message:  "html error: <%= error.message %>",
                  sound:    "Beep"
              })(err);
      this.emit('end');
  };
  return gulp.src( [srcPath + '**/*.html'] )
        .pipe(plugins.plumber({errorHandler: onError}))
        .pipe(plugins.cmdJst(
                {
                  templateSettings: {
                    evaluate: /##([\s\S]+?)##/g,
                    interpolate: /\{\{(.+?)\}\}/g,
                    escape: /\{\{\{\{-([\s\S]+?)\}\}\}\}/g
                  },
                  processName: function(filename) {
                    var moudle = filename.slice(0, filename.indexOf('/'))
                    return moudle + '-' + filename.slice(filename.lastIndexOf('/')+1, filename.lastIndexOf('.'));
                  },
                  processContent: function(src) {
                    return src.replace(/(^\s+|\s+$)/gm, '');
                  },
                  prettify: true,         
                  cmd: true
                }
        ))
        .pipe(plugins.rename({suffix: '-html'}))
        .pipe(gulp.dest( srcPath ))
});

/*
* @desc less html变化 刷新浏览器 livereload
*/
gulp.task('look', function () {
    // plugins.livereload.listen();
    gulp.watch([srcPath + '**/*.less'], ['less-min']);
    gulp.watch([srcPath + '**/*.html']).on('change',function(e){
      var onError = function(err) {
          plugins.notify.onError({
                      title:    "Gulp",
                      subtitle: "Failure!",
                      message:  "html error: <%= error.message %>",
                      sound:    "Beep"
                  })(err);
          this.emit('end');
      };
      return gulp.src( e.path,{ base: srcPath } )
            .pipe(plugins.plumber({errorHandler: onError}))
            .pipe(plugins.cmdJst(
                {
                  templateSettings: {
                    evaluate: /##([\s\S]+?)##/g,
                    interpolate: /\{\{(.+?)\}\}/g,
                    escape: /\{\{\{\{-([\s\S]+?)\}\}\}\}/g
                  },
                  processName: function(filename) {
                    var moudle = filename.slice(0, filename.indexOf('/'))
                    return moudle + '-' + filename.slice(filename.lastIndexOf('/')+1, filename.lastIndexOf('.'));
                  },
                  processContent: function(src) {
                    return src.replace(/(^\s+|\s+$)/gm, '');
                  },
                  prettify: true,         
                  cmd: true
                }
            ))
            .pipe(plugins.rename({suffix: '-html'}))
            .pipe(gulp.dest( srcPath ))
            .pipe(plugins.notify({
               title: 'Gulp',
               subtitle: 'success',
               message: 'jst OK',
               sound: "Pop"
            }))
            .pipe(plugins.livereload());
    });
});

var srcFolder = "public/",
    distFolder = "public-dist/";

gulp.task("clean",function(){
  return gulp.src( distFolder , {read: false})
         .pipe(plugins.rimraf());
});

gulp.task("copy",function(){
  return gulp.src([srcFolder + '**/*.*'])
         .pipe( gulp.dest( distFolder ) )
});

var pngquant = require('imagemin-pngquant');
gulp.task('min-image', function () {
    return gulp.src(distFolder + '**/*.{png,jpg,gif}')
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(distFolder));
});

var del = require('del');
gulp.task('del',function(){
  del([
    distFolder+'static/qmczweb/**/*.html',
    distFolder+'static/qmczweb/**/*.less',
    distFolder+'static/qmczweb/**/*.DS_Store'
    ]);
});

gulp.task('localhost', function() {
    plugins.connect.server({
        root: './public/',
        port: 2222
    });
});
gulp.task("default",['less-min','jst','look','localhost']);
gulp.task("build",function(cb){
  plugins.sequence('clean','copy',['del','min-image'], cb);
});
