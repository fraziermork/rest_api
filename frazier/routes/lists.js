'use strict';

const express = require('express');
const Item   = require(__dirname + '/../models/items.js');
const List   = require(__dirname + '/../models/lists.js');

let router = express.Router();

router.route('/')
  .get((req, res) => {
    console.log('GET lists');
    List.find({}).populate('items', 'name _id')
      .exec((err, lists) => {
        if(err) {
          console.log('Error getting lists: ', err);
          return res.status(500).end({status: 'failure', message: 'Internal server error.'});
        } else {
          return res.status(200).json(lists);
        }
      });
    
  })
  .post((req, res) => {
    console.log('POST lists');
    console.log(req.body);
    try{
      if(req.body.name){
        let newList = new List(req.body);
        newList.save((err, savedList) => {
          if(err) {
            console.log('Error saving posted list: ', err);
            return res.status(404).end({status: 'failure', message: 'Bad request.'});
          } else {
            console.log(newList.name + ' saved.');
            res.status(200).json(savedList);
            if (newList.items.length > 0){
              console.log('Need to add list references to items.');
              newList.items.forEach((itemId) => {
                Item.findOneAndUpdate({_id: itemId}, {$push: {'lists': newList._id}});
              });
            }
          }
        });
      } else {
        console.log('No req body name');
        return res.status(404).end('400 Bad request.');
      }
    } catch (err){
      console.log(err);
      return res.status(404).end('400 Bad request.');
    }
    
  });








router.route('/:id')
  .get((req, res) => {
    console.log('GET lists/:id');
    List.findById(req.params.id).populate('items') //TODO: make it update users too
      .exec((err, savedList) => {
        if(err) {
          console.log('Error getting list: ', err);
          return res.status(404).end({status: 'failure', message: 'Bad request.'});
        } else {
          console.log('Got list ' + savedList.name + ' successfully.');
          return res.status(200).json(savedList);
        }
      });
    
  })
  .put((req, res) => {
    console.log('PUT lists/:id');
    List.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}) //TODO: make it update users too
    .populate('items').exec((err, savedList) => {
      if(err) {
        console.log('Error updating list: ', err);
        return res.status(500).end({status: 'failure', message: 'Bad request.'});
      } else {
        console.log('Updated list ' + savedList.name + ' successfully.');
        res.status(200).json(savedList);
        savedList.items.forEach((itemId) => {
          Item.findById(itemId, (err, savedItem) => {
            if (savedItem.lists.indexOf(savedList._id) === -1) {
              console.log('Need to update item with id ' + itemId + '.');
              Item.findOneAndUpdate({_id: itemId}, {$push: {'items': savedList._id}});
            }
          });
        });
      }
    });
    
    
  })
  .delete((req, res) => {
    console.log('DELETE lists/:id');
    List.findOneAndRemove({_id: req.params.id}, (err, savedList) => {
      if (err) {
        console.log('Error deleting list: ', err);
        return res.status(404).json({status: 'failure', message: 'Bad request.'});
      } else {
        console.log('Successfully deleted ' + savedList.name + '.');
        res.status(200).json({status: 'sucess', message: 'Deleted ' + savedList.name});
      }
    });
  });




module.exports = router;
