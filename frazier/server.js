'use strict';

const mongoose              = require('mongoose');
const express               = require('express');
const app                   = express();
const bodyParser            = require('body-parser').json();
// const authentication        = require(__dirname + '/lib/authentication.js');
// const loginRouter           = require(__dirname + '/routes/login.js');
// const userRouter            = require(__dirname + '/routes/users.js');
const listRouter            = require(__dirname + '/routes/lists.js');
const itemRouter            = require(__dirname + '/routes/items.js');


let DB_PORT = process.env.MOGOLAB_URI || 'mongodb://localhost/db';
mongoose.connect(DB_PORT);
let db = mongoose.connection;
db.on('error', (err) => {
  console.log('__________________________________________________________________');
  console.log('Error connecting with mongoose: ', err);
});
db.once('open', () => {
  app.use(bodyParser);
  // app.use('/login', loginRouter);
  // app.use(authentication);
  // app.use('/users', userRouter);
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });
  app.use('/lists', listRouter);
  app.use('/items', itemRouter);
  app.listen(3000, () => {
    console.log('API listening on 3000');
    require(__dirname + '/app/app-server.js'); 
  });
});
