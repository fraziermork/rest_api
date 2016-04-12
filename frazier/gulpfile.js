'use strict';
const gulp    = require('gulp');
const mocha   = require('gulp-mocha');
const eslint  = require('gulp-eslint');
const webpack = require('gulp-webpack');
const del     = require('del');


// let lintPaths = [__dirname + '/lib/*.js', __dirname + '/test/*.js', __dirname + '/server.js', __dirname + '/server.js', __dirname + '/server.js', __dirname + '/server.js', __dirname + '/server.js'];


let paths = {  //https://gist.github.com/justinmc/9149719
  frontend: [__dirname + '/app/*.js', __dirname + '/app/controllers/*.js', __dirname + '/app/services/*.js', __dirname + '/app/directives/*.js'],
  backend: [__dirname + '/server.js', __dirname + '/lib/*.js', __dirname + '/test/*.js', __dirname + '/routes/*.js', __dirname + '/models/*.js'],
  html: [__dirname + '/app/views/*.html'],
  css: [__dirname + '/app/css/*.css']
};


//RUN ESLINT
gulp.task('eslint', () => {
  gulp.src(paths.frontend.concat(paths.backend))
  .pipe(eslint())
  .pipe(eslint.format());
});

//RUN TESTS
gulp.task('test', () => {
  gulp.src(__dirname + '/test/*.js')
  .pipe(mocha());
});


//REBUILD APP FRONTEND ON FILE CHANGES
gulp.task('clear-build', () => { //empty the build directory
  return del([__dirname + '/build/*']);
});
gulp.task('html-build', () => { //copy the index.html file over
  gulp.src(paths.html)
    .pipe(gulp.dest(__dirname + '/build'));
});
gulp.task('css-build', () => { //copy the index.html file over
  gulp.src(paths.css)
    .pipe(gulp.dest(__dirname + '/build'));
});
gulp.task('webpack-build', () => { //copy over the js and css files
  gulp.src(__dirname + '/app/entry.js')
    .pipe(webpack(require(__dirname + '/webpack.config.js')))
    .pipe(gulp.dest(__dirname + '/build/'));
});
gulp.task('rebuild', ['clear-build', 'webpack-build', 'html-build', 'css-build'], () => { //clears the build directory and repopulates it
  console.log('__________________________________________________________________');
  console.log('rebuilt');
});
gulp.task('watch-app', () => { //watches for file changes and rebuilds the build directory
  gulp.watch(paths.frontend.concat(paths.html), ['eslint', 'rebuild']);
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
