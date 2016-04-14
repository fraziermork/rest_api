'use strict';



const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const expect = chai.expect;

// const User = require(__dirname + '/../models/users.js');
const List = require(__dirname + '/../models/lists.js');
const Item = require(__dirname + '/../models/items.js');

require(__dirname + '/../server.js');


function resetDatabase(done){ 
  //TODO: make this reset users too
  //TODO: make this reseed the database with new info too
  List.find({}).remove().exec()
  .then(() => {
    return Item.find().remove().exec();
  })
  .then(() => {
    done();
  })
  .catch((err) => {
    console.log('Error occured in before block: ', err);
    done();
  });
}


describe('api integration tests: ', () => {
  
  before('resetDatabase', resetDatabase);
  
  //VARIABLES THAT NEED TO BE CARRIED OVER BETWEEN BLOCKS
  //________________________________________________________________________________________
  let testList = {
    name: 'todo list',
    description: 'List of todo items for the near future.'
  };
  let testItem = {
    name: 'Finish Portfolio',
    description: 'Finish updating portfolio so I can apply to jobs.'
  };
  let testItemId, testListId;
  
  // let testUser = {
  //   
  // };
  // let testUserId;
  //________________________________________________________________________________________


  //   /ITEMS
  //________________________________________________________________________________________
  describe('/items', () => {
    it('should let you POST an item', (done) => {
      request('localhost:3000').post('/items')
        .send(testItem).end((err, res) => {
          // console.log(res.body);
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          testItemId = res.body._id;
          done();
        });
    });
    
    it('should let you GET items', (done) => {
      request('localhost:3000').get('/items')
        .end((err, res) => {
          // console.log(res.body);
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body[0].name).to.equal(testItem.name);
          expect(res.body[0].description).to.equal(testItem.description);
          expect(res.body[0].complete).to.equal(false);
          expect(res.body[0]).to.have.property('creationDate');
          done();
        });
    });
  });
  
  describe('/items/:id', () => {
    it('should let you GET an item by id', (done) => {
      request('localhost:3000').get('/items/' + testItemId)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(testItem.name);
          expect(res.body.description).to.equal(testItem.description);
          expect(res.body.complete).to.equal(false);
          done();
        });
    });
    
    it('should let you PUT an item by id', (done) => {
      testItem.description = 'Finish updating portfolio so I can apply to jobs ASAP.';
      testItem.dueDate = '04-17-2016';
      request('localhost:3000').put('/items/' + testItemId)
        .send(testItem).end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(testItem.name);
          expect(res.body.description).to.equal(testItem.description);
          expect(res.body.complete).to.equal(false);
          expect(res.body).to.have.property('dueDate');
          done();
        });
    });
    
    it('should let you DELETE an item by id', (done) => {
      request('localhost:3000').delete('/items/' + testItemId)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        Item.findById(testItemId, (err, savedItem) => {
          expect(err).to.equal(null);
          done();
        });
      });
    });
  });
  
  
  
  
  
  //LISTS
  //________________________________________________________________________________________
  describe('/lists', () => {
    before('put an item to populate into db', (done) => {
      let newItem = new Item(testItem);
      newItem.save((err, savedItem) => {
        if(err){
          console.log('Error saving testItem in /lists before block: ', err);
          done();
        } else {
          testItemId = savedItem._id;
          done();
        }
      });
    });
    it('should let you POST a list', (done) => {
      request('localhost:3000').post('/lists')
        .send(testList).end((err, res) => {
          // console.log(res.body);
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          testListId = res.body._id;
          done();
        });
    });
    
    it('should let you GET lists', (done) => {
      request('localhost:3000').get('/lists')
        .end((err, res) => {
          // console.log(res.body);
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body[0].name).to.equal(testList.name);
          expect(res.body[0].description).to.equal(testList.description);
          expect(res.body[0]).to.have.property('creationDate');
          done();
        });
    });
  });
  describe('/lists/:id', () => {
    it('should let you GET a list by id', (done) => {
      request('localhost:3000').get('/lists/' + testListId)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(testList.name);
          expect(res.body.description).to.equal(testList.description);
          done();
        });
    });
    
    it('should let you PUT a list by id', (done) => {
      testList.name = 'Job hunt todo';
      testList.description = 'List of todo items related to job-hunting.';
      testList.items = [testItemId.toString()];
      console.log(testList);
      request('localhost:3000').put('/lists/' + testListId)
        .send(testList).end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(testList.name);
          expect(res.body.description).to.equal(testList.description);
          expect(res.body.items.length).to.equal(1);
          done();
        });
    });
    
    it('should let you DELETE a list by id', (done) => {
      request('localhost:3000').delete('/lists/' + testListId)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        List.findById(testListId, (err, savedList) => {
          expect(err).to.equal(null);
          done();
        });
      });
    });
  });
  
  
});
