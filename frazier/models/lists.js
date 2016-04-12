'use strict';

const mongoose = require('mongoose');

let listSchema = new mongoose.Schema({
  name: {type: String, required: true},
  creationDate: {type: Date, default: Date.now},
  description: String,
  items: [{ref: 'Item', type: mongoose.Schema.Types.ObjectId}]
  // user: [{ref: 'User', type: mongoose.Schema.Types.ObjectId}]
});

module.exports = mongoose.model('List', listSchema);
