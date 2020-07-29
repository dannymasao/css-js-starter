const { src, dest, watch, series, parallel } = require("gulp");
// const nunjucks = require('gulp-nunjucks-render');
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const clean = require("gulp-clean-css");
const autoprefixer = require("autoprefixer");
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const purgecss = require('@fullhuman/postcss-purgecss')
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();


// gulp.task('css', () => {
//   const postcss    = require('gulp-postcss')
//   const sourcemaps = require('gulp-sourcemaps')

//   return gulp.src('src/**/*.css')
//     .pipe( sourcemaps.init() )
//     .pipe( postcss([ require('precss'), require('autoprefixer') ]) )
//     .pipe( sourcemaps.write('.') )
//     .pipe( gulp.dest('build/') )
// })


function devCss() {
    return src('src/css/style.scss')
    .pipe(plumber(notify.onError('Error: <%= error.message %>')))
    .pipe(sourcemaps.init())
    .pipe(
        sass({
            outputStyle: "expanded"
        })
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest('dist/css'));
}

function prodCss() {
  return src('src/css/style.scss')
  .pipe(plumber(notify.onError('Error: <%= error.message %>')))
  .pipe(
      sass({
          outputStyle: "expanded"
      })
  )
  .pipe(postcss([
    autoprefixer(),
    purgecss({
      content: ['./dist/**/*.html']
    })
  ]))
  .pipe(clean())
  .pipe(rename({
      suffix: '.min'
  }))
  .pipe(dest('dist/css'));
}


// function js() {
//     return src('src/js/script.js')
//     .pipe(plumber(notify.onError('Error: <%= error.message %>')))
//     .pipe(uglify())
//     .pipe(rename({
//         suffix: '.min'
//     }))
//     .pipe(dest('dist/js'));
// }

function browserInit(done) {
    browserSync.init({
        server: {
            baseDir: "./dist/",
            index: 'index.html'
        }
    });
    done();
}

function browserReload(done) {
    browserSync.reload();
    done();
};


function watchFiles(done) {
    // watch('src/nunjucks/**/*.njk', series(html, browserReload));
    watch('dist/index.html', browserReload);
    watch('src/css/**/*.scss', series(devCss, browserReload));
    // watch('src/js/**/*.js', series(js, browserReload));
    done();
};


// exports.html = html;
exports.devCss = devCss;
exports.prodCss = prodCss;
// exports.js = js;

// exports.build = parallel(html, css, js);
exports.prod = prodCss;
exports.default = series(devCss, parallel(browserInit, watchFiles));