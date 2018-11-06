var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var cssnano = require('gulp-cssnano');
var header = require('gulp-header');
var autoprefixer = require('autoprefixer');


gulp.task('watch', function () {
	gulp.watch(['miniprogram/pages/**/*.less','!miniprogram/pages/component/**/*.less','miniprogram/app.wxss'], ['less']);
	gulp.watch(['miniprogram/pages/component/**/*.less'],['component-less']);
});
gulp.task('less', function () {
	gulp.src(['miniprogram/pages/**/*.less','!miniprogram/pages/component/**/*.less'])
		.pipe(less())
		.pipe(postcss([autoprefixer(['iOS >= 8', 'Android >= 4.1'])]))
		.pipe(
			cssnano({
				zindex: false,
				autoprefixer: false,
				discardComments: {
					removeAll: true
				}
			})
		)
		.pipe(rename(function (path) {
			path.extname = '.wxss';
		}))
		.pipe(gulp.dest('miniprogram/pages/'))
});

gulp.task('component-less', function () {
	gulp.src('miniprogram/pages/component/**/*.less')
		.pipe(less())
		.pipe(postcss([autoprefixer(['iOS >= 8', 'Android >= 4.1'])]))
		.pipe(
			cssnano({
				zindex: false,
				autoprefixer: false,
				discardComments: {
					removeAll: true
				}
			})
		)
		.pipe(header('@import "../../../../style/weui.wxss";'))
		.pipe(rename(function (path) {
			path.extname = '.wxss';
		}))
		.pipe(gulp.dest('miniprogram/pages/component/'))
});

gulp.task('default', ['watch', 'less','component-less']);
