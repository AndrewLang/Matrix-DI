const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];
const merge = require('merge2');
const shell = require('shelljs');
const chalk = require('chalk');

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('build:ts', () => {
  const tsResult = tsProject.src()
    .pipe(tsProject());
    
  return merge([
    tsResult.dts.pipe(gulp.dest('dist')),
    tsResult.js.pipe(gulp.dest('dist'))
  ]);
});

gulp.task('clean', () => {
  shell.echo('Clean dist folder');
  shell.rm('-rf', './dist');

});

gulp.task('build', ['clean', 'build:ts', 'assets:copy', 'package:copy'], () => {

});

gulp.task('watch', ['scripts'], () => {
  gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('assets:copy', function () {
  return gulp.src(JSON_FILES)
    .pipe(gulp.dest('dist'));
});
gulp.task('package:copy', () => {
  return gulp.src('./package.json')
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'assets']);