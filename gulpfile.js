let gulp = require('gulp'),
  config = require('./config'),
  browserSync = require('browser-sync').create();
  $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del', 'yargs', 'run-sequence', 'main-bower-files']
  });


gulp.task('dev', ['build', 'server', 'watch']);

gulp.task('dist', ['build'], () => {
  let jsFilter = $.filter("**/*.js", { restore: true }),
    cssFilter = $.filter("**/*.css", { restore: true }),
    indexHtmlFilter = $.filter(['!**/*.html'], { restore: true });

  return gulp.src([
      config.files.build.concat('/*.html'),
      config.files.build.concat('/**/*.html')
    ])
    .pipe($.useref())
    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore)
    .pipe(indexHtmlFilter)
    .pipe($.rev())
    .pipe(indexHtmlFilter.restore)
    .pipe($.revReplace())
    .pipe(gulp.dest(config.files.dist));
});

gulp.task('build', done => {
  $.runSequence('clean', ['styles', 'scripts', 'bower'], 'inject', done);
});

gulp.task('inject', done => {
  $.runSequence('inject:assets', 'inject:bower', done);
});

// build/vendor/*.(css|js) into build/*.html
gulp.task('inject:bower', () => {
  let sources = gulp.src([
    config.files.build.concat('/assets/vendor/**/*.css'),
    config.files.build.concat('/assets/vendor/**/*.js')
  ], {read: false})
  .pipe($.debug({title: 'inject:bower:sources'}));

  return gulp.src([
    config.files.build.concat('/*.html'),
    config.files.build.concat('/**/*.html')
  ])
  .pipe($.debug({title: 'inject:bower'}))
  .pipe($.inject(sources, {
    addRootSlash: false,
    ignorePath: '/build',
    name: 'bower'
  }))
  .pipe(gulp.dest(config.files.build));
});

// move html to /build
// build/*.(css|js) into build/*.html
gulp.task('inject:assets', () => {
  let sources = gulp.src([
    config.files.build.concat('/assets/styles/*.css'),
    config.files.build.concat('/assets/styles/**/*.css'),
    config.files.build.concat('/assets/scripts/*.js'),
    config.files.build.concat('/assets/scripts/**/*.js')
  ], {read: false})
  .pipe($.debug({title: 'inject:assets:sources'}));

  return gulp.src([
    config.files.src.concat('/*.html'),
    config.files.src.concat('/**/*.html')
  ])
  .pipe($.debug({title: 'inject:assets'}))
  .pipe($.inject(sources, {
    addRootSlash: false,
    ignorePath: '/build'
  }))
  .pipe(gulp.dest(config.files.build));
});

// scss => css
gulp.task('styles', () => {
  return gulp.src([
    config.files.src.concat('/*.scss'),
    config.files.src.concat('/**/*.scss'),
    '!'+ config.files.src.concat('/_*.scss'),
    '!'+ config.files.src.concat('/**/_*.scss')
  ])
  .pipe($.debug({title: 'styles'}))
  //.pipe($.sourcemaps.init())
  .pipe($.sass().on('error', $.sass.logError))
  //.pipe($.sourcemaps.write())
  .pipe(gulp.dest(config.files.build.concat('/assets/styles')));

});

// es6 => .js
gulp.task('scripts', () => {
  return gulp.src([
    config.files.src.concat('/*.js'),
    config.files.src.concat('/**/*.js')
  ])
  .pipe($.debug({title: 'scripts'}))
  .pipe($.babel({
      presets: ['es2015']
  }))
  .pipe(gulp.dest(config.files.build.concat('/assets/scripts')));

});

// move bower's main files
gulp.task('bower', () => {
  return gulp.src($.mainBowerFiles(), {base: 'bower_components'})
    .pipe($.debug({title: 'bower'}))
    .pipe(gulp.dest(config.files.build.concat('/assets/vendor')));
});

gulp.task('clean', () => {
  $.del.sync([
    config.files.build,
    config.files.dist
  ]);
});

gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: config.files.build
    }
  });
});

gulp.task('watch', () => {
  gulp.watch([
    config.files.src.concat('/*.scss'),
    config.files.src.concat('/**/*.scss')
  ], ['styles'])
  .on('change', browserSync.reload);

  gulp.watch([
    config.files.src.concat('/*.js'),
    config.files.src.concat('/**/*.js')
  ], ['scripts'])
  .on('change', browserSync.reload);

});
