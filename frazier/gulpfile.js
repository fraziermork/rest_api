'use strict';
const gulp    = require('gulp');
const eslint  = require('gulp-eslint');

//MODULES FOR BACKEND TESTING
const mocha   = require('gulp-mocha');

//MODULES FOR REBUILD
const webpack = require('webpack-stream');
const del     = require('del');

//MODULES FOR FRONT END TESTING
// const protractor = require('gulp-protractor');



// let lintPaths = [__dirname + '/lib/*.js', __dirname + '/test/*.js', __dirname + '/server.js', __dirname + '/server.js', __dirname + '/server.js', __dirname + '/server.js', __dirname + '/server.js'];

//https://gist.github.com/justinmc/9149719
let paths = {  
  'frontend': [__dirname + '/app/*.js', __dirname + '/app/controllers/*.js', __dirname + '/app/services/*.js', __dirname + '/app/directives/*.js'],
  'backend': [__dirname + '/server.js', __dirname + '/lib/*.js', __dirname + '/test/*.js', __dirname + '/routes/*.js', __dirname + '/models/*.js'],
  'html': [__dirname + '/app/views/*.html'],
  'css': [__dirname + '/app/css/*.css']
};


//RUN ESLINT
gulp.task('eslint', () => {
  gulp.src(paths.frontend.concat(paths.backend))
  .pipe(eslint())
  .pipe(eslint.format());
});




//RUN TESTS
//TODO: write E2E tests using protractor and selenium
//TODO: write unit tests using karma, jasmine, angular-mocks
gulp.task('test:api', () => { //TESTS THE BACKEND
  return gulp.src(__dirname + '/test/backend/api/*.js')
  .pipe(mocha());
});
// gulp.task('test:unit', () => {
//   return gulp.src(__dirname + '/test/frontend/unit/*.js')
//   .pipe();
// });
// gulp.task('test:e2e', () => {
//   return gulp.src(__dirname + '/test/frontend/e2e/*.js')
//   .pipe();
// });
gulp.task('test', ['test:api'], () => { //'test:unit', 'test:e2e'
  console.log('__________________________________________________________________');
  console.log('TESTING');
  console.log('__________________________________________________________________');
});




//REBUILD TEST FILES FOR E2E AND UNIT TESTS
gulp.task('build:clear-test', () => {
  return del([__dirname + '/test/frontend/bundles/*']);
});
gulp.task('build:unit-tests', () => {
  return gulp.src()
    .pipe(webpack({ output: { filename: 'unit_bundle.js' } }))
    .pipe(gulp.dest(__dirname + '/test/bundles'));
});
gulp.task('build:e2e-tests', () => {
  return gulp.src()
    .pipe(webpack({ output: { filename: 'e2e_bundle.js' } }))
    .pipe(gulp.dest(__dirname + '/test/bundles'));
});
gulp.task('rebuild:tests', ['build:clear-test', 'build:unit-tests', 'build:e2e-tests'], () => {
  console.log('__________________________________________________________________');
  console.log('BUILD TESTS');
  console.log('__________________________________________________________________');
});






//REBUILD APP FRONTEND ON FILE CHANGES
gulp.task('build:clear-app', () => { //empty the build directory
  return del([__dirname + '/build/*']);
});
gulp.task('build:html', () => { //copy the index.html file over
  return gulp.src(paths.html)
    .pipe(gulp.dest(__dirname + '/build'));
});
gulp.task('build:css', () => { //copy the index.html file over
  return gulp.src(paths.css)
    .pipe(gulp.dest(__dirname + '/build'));
});
gulp.task('build:js', () => { //copy over the js and css files
  return gulp.src(__dirname + '/app/entry.js')
    .pipe(webpack(require(__dirname + '/webpack.config.js')))
    .pipe(gulp.dest(__dirname + '/build/'));
});
gulp.task('rebuild:app', ['build:clear-app', 'build:html', 'build:css', 'build:js'], () => { //clears the build directory and repopulates it
  console.log('__________________________________________________________________');
  console.log('REBUILT');
  console.log('__________________________________________________________________');
});
gulp.task('watch-app', () => { //watches for file changes and rebuilds the build directory
  gulp.watch(paths.frontend.concat(paths.html), ['eslint', 'rebuild:app']);
});





























// require(__dirname + '/server.js');
// let Item   = require(__dirname + '/models/items.js');
// let List   = require(__dirname + '/models/lists.js');
// const exec    = require('child_process').exec;
// const exec    = require('gulp-exec');
// let testItemIds = [];
// let testListId = null;
// let testItems = [
//   {
//     name: 'Finish Portfolio',
//     description: 'Finish updating portfolio so I can apply to jobs.'
//   }, 
//   {
//     name: 'Do laundry',
//     description: 'Do laundry so that you aren\'t disgusting.'
//   }, 
//   {
//     name: 'Do homework',
//     description: 'Do homework so that you pass the class.'
//   }, 
//   {
//     name: 'Clean room',
//     description: 'Clean room so that there is more room for activities.'
//   }
// ];
// let testList = {
//   name: 'todo list',
//   description: 'List of todo items for the near future.',
//   items: testItemIds
// };
// gulp.task('empty-db', () => {
//   List.find({}).remove().exec()
//   .then(() => {
//     return Item.find({}).remove().exec();
//   })
//   .then(() => {
//     console.log('Database emptied.');
//   });
// });
// gulp.task('seed-db-items', () => {
//   testItems.forEach((testItem) => {
//     let newItem = new Item(testItem);
//     newItem.save((err, savedItem) => {
//       if(err){
//         console.log('Error saving testItem: ', err);
//       }
//       testItemIds.push(savedItem._id.toString());
//     });
//   });
// });
// gulp.task('seed-db-lists', ['seed-db-items'], () => {
//   console.log(testItemIds);
//   let newList = new List(testList);
//   newList.save((err, savedList) => {
//     console.log(err);
//     console.log('Done seeding lists and items');
//   });
// });
// gulp.task('reset-db', ['empty-db', 'seed-db-lists'], () => {
//   console.log('Database reset.');
// });
















































// gulp.task('api-start', () => {
//   
//   
// });

//http://stackoverflow.com/questions/28665395/using-gulp-to-manage-opening-and-closing-mongodb
// gulp.task('init-mongo', () => {
//   exec('mongod -dbpath=./db/ --smallfiles');
//   // runCommand('mongod --dbpath ./db/');
// });
// gulp.task('end-mongo', () => {
//   runCommand('mongo --eval"use admin;" db.shutdownServer();');
// });
// function runCommand(command){
//   return function(cb){
//     exec(command, function(err, stdout, stderr) {
//       console.log(stdout);
//       console.log(stderr);
//       cb(err);
//     });
//   };
// }
