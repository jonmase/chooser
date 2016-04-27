//Gulp recipe for "Fast browserify builds with watchify"
//https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
//For using multiple sources and destinations, have a look at:
//https://www.madetech.com/blog/making-multiple-browserify-bundles-with-gulp
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
/*var customOpts = {
  //entries: ['src/choices-add.jsx', 'src/choices-manage.jsx'],
  entries: ['src/choices-add.jsx'],
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

*/
// Makes the bundle, logs errors, and saves to the destination.
function makeBundle(src, watcher, dst) {
    // This must return a function for watcher.on('update').
    return function() {
        // Logs the compilation.
        console.log('Compiling ' + src + ' -> ' + dst)

        // Bundles the example!, which then:
        return watcher.bundle()
            // Logs errors
            .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))

            // Uses our new bundle as the source for the sourcemaps.
            .pipe(source(dst))
            .pipe(buffer())

            // Creates the sourcemaps.
            //.pipe(sourcemaps.init({ loadMaps: true }))
            //.pipe(sourcemaps.write('.'))

            // And writes them to the destination too.
            .pipe(gulp.dest(''))
            .pipe(plugins.livereload({ start: true })); //Need start: true to auto start livereload listening
    }
}

// Watchifies the examples and their local import trees for bundling.
function makeWatcher(src, dst) {
    // add custom browserify options here
    var customOpts = {
      entries: ['src/' + src],
      debug: true
    };
    var opts = assign({}, watchify.args, customOpts);
    var watcher = watchify(browserify(opts)); 
    watcher.transform(reactify);

    // `bundle` becomes a function that will be called on update.
    var bundle = makeBundle(src, watcher, dst);

    // Listens for updates.
    watcher.on('update', bundle);
    watcher.on('log', plugins.util.log); // output build logs to terminal
    
    return bundle();
}

gulp.task('js', function() {
    var files = ['choices-add.jsx', 'choices-dashboard.jsx', 'choices-roles.jsx', 'choices-form.jsx', 'choices-view.jsx'];
    
    files.forEach(function (entry, i, entries) {
        // Get the destination for this bundle.
        var bundleDest = ('dist/' + entry).split('.')[0] + '-bundle.js';

        // Make a watcher
        makeWatcher(entry, bundleDest);
    });

    return;
});


gulp.task('default', ['js']);
