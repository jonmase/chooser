//Gulp recipe for "Fast browserify builds with watchify"
//https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var assign = require('lodash.assign');
var gulp = require('gulp');
//Use gulp-load-plugins, which loads all gulp plugins from package.json automatically
//Plugins can then be accessed using plugins.camelCaseName, e.g. plugins.util
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

// add custom browserify options here
var customOpts = {
  entries: ['./src/main.jsx'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)); 

// add transformations here
b.transform(reactify);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', plugins.util.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    //.pipe(plugins.sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    //.pipe(plugins.sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'))
    .pipe(plugins.livereload({ start: true })); //Need start: true to auto start livereload listening
}

gulp.task('default', ['js']);
