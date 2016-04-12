'use strict';

const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  creationDate: {type: Date, default: Date.now},
  lists: [{ref: 'List', type: mongoose.Schema.Types.ObjectId}]
});

module.exports = mongoose.model('User', userSchema);
