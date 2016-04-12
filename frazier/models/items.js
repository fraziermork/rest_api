'use strict';

const mongoose = require('mongoose');

let itemSchema = new mongoose.Schema({
  name: {type: String, required: true},
  creationDate: {type: Date, default: Date.now},
  dueDate: {type: Date, min: Date.now},
  complete: {type: Boolean, default: false},
  description: String,
  lists: [{ref: 'List', type: mongoose.Schema.Types.ObjectId}]
  // user: [{ref: 'User', type: mongoose.Schema.Types.ObjectId}]
});

module.exports = mongoose.model('Item', itemSchema);
