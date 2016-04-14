'use strict';

const angular = require('angular');

//TODO: refactor to be more in line with John Papa angular guidelines
//split out into different files
//split out to attach to different modules
//handle urls less clumsily



//TAB SERVICE
//______________________________________________________________________________________________________________________________________________________________________
// (function(){
//   angular.module('tabs', [])
//   .factory('tabManager', function(){
//     let tabManager                  = {};
//     
//     tabManager.sections = {
//       allLists: {name: 'AllListsController', source: './all-lists.html'}, 
//       editList: {name: 'EditListController', source: './edit-list.html'} 
//     };
//     tabManager.sectionName          = 'allLists';
//     tabManager.listIdForEditSection = null;
//     tabManager.section              = tabManager.sections[tabManager.sectionName].source;
//     tabManager.toggleTab            = toggleTab;
//     tabManager.updateSection        = updateSection;
//     
//     function toggleTab(listId){
//       if(tabManager.sectionName === 'allLists' && listId){
//         tabManager.updateTest(listId);
//         tabManager.listIdForEditSection = listId;
//         tabManager.sectionName = 'editList';
//         tabManager.updateSection();
//       } else {
//         tabManager.sectionName = 'allLists';
//         tabManager.updateSection();
//       }
//     }
//     function updateSection(){
//       tabManager.section = tabManager.sections[tabManager.sectionName].source;
//     }
//     
//     
//     return tabManager;
//   });
// })(); 


let app = angular.module('app', []);


//MAIN CONTROLLER
//______________________________________________________________________________________________________________________________________________________________________
(function(){
  app.controller('MainController', ['$http', '$scope', MainController]);

  function MainController($http, $scope) { 
    const vm                    = this;
    vm.test                     = 'blah blah blah';
    vm.lists                    = [{name: 'lists text'}];

    vm.sections = {
      allLists: {name: 'AllListsController', source: './all-lists.html'}, 
      editList: {name: 'EditListController', source: './edit-one-list.html'} 
    };
    vm.sectionName              = 'allLists';
    vm.section                  = vm.sections[vm.sectionName].source;
    
    vm.updateSection            = updateSection;
    $scope.initialize           = initialize;
    $scope.toggleTab            = toggleTab;
    $scope.back                 = back;
    $scope.listIdForEditSection = null;
    
    function toggleTab(listId){
      if(vm.sectionName === 'allLists' && listId){
        $scope.listIdForEditSection = listId;
        vm.sectionName = 'editList';
        vm.updateSection();
      } else {
        vm.sectionName = 'allLists';
        vm.updateSection();
      }
    }
    
    function updateSection(){
      vm.section = vm.sections[vm.sectionName].source;
    }
    
    function initialize(cb){
      $http.get('http://localhost:3000/lists')
      .then((result) => {
        vm.lists = result.data;
        if(cb){
          cb(null, result.data);
        }
      }, function(err){
        vm.test = err;
        if(cb){
          cb(err);
        }
      });
    }
    
    function back(){
      $scope.initialize($scope.toggleTab()); 
    }
    
  }
  
  
})();





//INDIVIDUAL LIST SUMMARY ON OVERVIEW PAGE
//______________________________________________________________________________________________________________________________________________________________________
(function(){
  app.directive('listSummary', listSummary);
  
  function listSummary(){
    return {
      restrict: 'E',
      templateUrl: 'one-list-summary.html',
      scope: {
        list: '=', 
        toggleTab: '&'
      }
    };
  }
  
})();



//ALL LISTS
//______________________________________________________________________________________________________________________________________________________________________
(function(){
  app.controller('AllListsController', ['$http', '$scope', '$log', AllListsController]);

  function AllListsController($http, $scope, $log){
    const vm                    = this;
    vm.addListFormVisible       = false;
    vm.postError                = null;
    vm.addListName              = null;
    vm.addListDescription       = null;
    vm.addButtonText            = 'Make a new list';
    
    vm.toggleAddListFormVisible = toggleAddListFormVisible;
    vm.addListFormHandler       = addListFormHandler;  
    
    function toggleAddListFormVisible() {
      // $log.log('toggleAddListFormVisible');
      if(vm.addListFormVisible){
        vm.addListFormVisible   = false; 
        vm.addButtonText        = 'Make a new list';
      } else {
        vm.addListFormVisible   = true;
        vm.addButtonText        = 'Cancel';
      }
    }
    
    
    //__________________________________________________________________
    //ADD LIST METHODS
    //__________________________________________________________________
    function addListFormHandler() {
      // $log.log('addListFormHandler');
      let postObj = {name: vm.addListName, description: vm.addListDescription};
      $log.log(postObj);
      $http.post('http://localhost:3000/lists', postObj)
        .then((result) => {
          vm.postError = null;
          $scope.initialize(function(err){
            if (err) {
              $log.log('err was ', err);
              vm.postError = 'Error creating list.';
            } else {
              vm.addListFormVisible = false;
              $log.log('result was ', result);
              $scope.listIdForEditSection = result.data._id.toString();
              $scope.toggleTab($scope.listIdForEditSection);
            }
          });
        }, function(err) {
          $log.log('err was ' + err);
          vm.postError = 'Error creating list.';
        });
    }
  }
  
})();










//EDIT AN INDIVIDUAL LIST
//______________________________________________________________________________________________________________________________________________________________________
(function(){
  app.controller('EditListController', ['$http', '$scope', '$log', EditListController]);
  
  function EditListController($http, $scope, $log){
    const vm                      = this;
    //Flags for whether to show the forms 
    vm.addItemFormVisible         = false;
    vm.editListFormVisible        = false;
    //Data that will come in from the API
    vm.result                     = {};
    vm.list                       = [];
    vm.listCopy                   = [];
    vm.editListError              = null;
    //Button text for buttons whose text will change 
    vm.addItemButtonText          = 'Add an item to this list.';
    vm.editListButtonText         = 'Edit or delete this list.';
    vm.deleteListButtonText       = 'Delete this list.';
    //Possible properties for an item to post
    vm.addItemName                = null;
    vm.addItemDescription         = null;
    vm.addItemDueDate             = null;
    vm.addItemComplete            = false;
    //Methods I'm attaching to the controller
    $scope.loadListToEdit         = loadListToEdit;
    vm.updateListCopy             = updateListCopy;
    vm.toggleAddItemFormVisible   = toggleAddItemFormVisible;
    vm.addItemFormHandler         = addItemFormHandler;
    vm.resetNewItemInfo           = resetNewItemInfo;
    vm.toggleEditListFormVisible  = toggleEditListFormVisible;
    vm.editListFormHandler        = editListFormHandler;
    vm.deleteListFormHandler      = deleteListFormHandler;
    vm.updateListAfterPut         = updateListAfterPut;
    
    
    
    function loadListToEdit(){
      $http.get('http://localhost:3000/lists/' + $scope.listIdForEditSection)
      .then(function(result){
        $log.log(result.data);
        vm.result = result.data;
        vm.list   = result.data.items;
        vm.updateListCopy();
      }, function(err){
        $log.log('Err was ', err);
      });
    }
    function updateListCopy(){
      vm.listCopy = angular.copy(vm.list);
    }
    
    
    
    
    
    
    
    //__________________________________________________________________
    //EDIT LIST METHODS
    //__________________________________________________________________
    function toggleEditListFormVisible() {
      if(vm.editListFormVisible){
        vm.editListFormVisible  = false;
        vm.editListButtonText   = 'Edit or delete this list.';
      } else {
        vm.editListFormVisible  = true;
        vm.editListButtonText   = 'Cancel';
      }
    }
    function editListFormHandler() {
      let postObj = {};
      postObj.name = vm.listCopy.name;
      if(vm.listCopy.description) {
        postObj.description = vm.listCopy.description;
      }
      
      $http.put('http://localhost:3000/lists/' + vm.result._id, postObj)
        .then(function(result) {
          vm.editListFormVisible = false;
          vm.updateListAfterPut();
        }, function(err) {
          $log.log('Error editing this list ', err);
        });
    }
    function updateListAfterPut(){
      $log.log(vm.result);
      vm.result.name = vm.listCopy.name;
      if(vm.listCopy.description) {
        vm.result.description = vm.listCopy.description;
      }
      vm.updateListCopy();
    }
    function deleteListFormHandler(){
      if(vm.deleteListButtonText === 'Click again to confirm list deletion.') {
        deleteList();
      } else {
        confirmDeleteList();
      }
    }
    function confirmDeleteList() {
      vm.deleteListButtonText = 'Click again to confirm list deletion.';
    }
    function deleteList () {
      vm.deleteListButtonText = 'Delete this list.';
      $http.delete('http://localhost:3000/lists/' + vm.result._id)
        .then(function(result) {
          vm.editListFormVisible = false;
          vm.addItemFormVisible = false;
          $scope.back();
        }, function(err) {
          $log.log('Error deleting this list ', err);
        });
    }
    
    
    
    //__________________________________________________________________
    //ADD ITEM METHODS
    //__________________________________________________________________
    function toggleAddItemFormVisible() {
      if(vm.addItemFormVisible){
        vm.addItemFormVisible   = false;
        vm.addItemButtonText    = 'Add an item to this list.';
      } else {
        vm.addItemFormVisible   = true;
        vm.addItemButtonText    = 'Cancel';
      }
    }
    function addItemFormHandler() {
      let postObj = {};
      postObj.name = vm.addItemName;
      postObj.lists = [$scope.listIdForEditSection];
      if(vm.addItemDescription) {
        postObj.description = vm.addItemDescription;
      }
      if(vm.addItemDueDate) {
        postObj.dueDate     = vm.addItemDueDate;
      }
      if (vm.addItemComplete) {
        postObj.complete    = vm.addItemComplete;
      }
      $http.post('http://localhost:3000/items', postObj)
        .then(function(result) {
          $log.log(result.data);
          vm.addItemFormVisible = false;
          vm.addItemButtonText = 'Add an item to this list.';
          vm.resetNewItemInfo();
          $scope.loadListToEdit(); //can't be done locally with cacheing, because if they want to edit the item afterwards, we need to have the database id of the item
        }, function(err) {
          $log.log('Error posting this item ', err);
        });
    }
    function resetNewItemInfo(){
      vm.addItemName                = null;
      vm.addItemDescription         = null;
      vm.addItemDueDate             = null;
      vm.addItemComplete            = false;
    }
    
    
    
    
    
    
    
    
    
  }
  
})();






//__________________________________________________________________
//EDIT AN INDIVIDUAL ITEM
//__________________________________________________________________ 
(function() {
  app.directive('listItem', function(){
    return {
      restrict: 'E',
      templateUrl: 'one-item.html',
      scope: {
        item: '=', 
        toggleTab: '&'
      },
      controller: ['$http', '$scope', '$log', listItem], 
      controllerAs: 'itemCtrl'
    };
  });
  
  function listItem($http, $scope, $log) {
    const vm = this;
    //controls whether the form or summary is visable
    vm.editItemFormVisible        = false;
    //this is the copy that edits get made to 
    vm.itemCopy                   = null;
    //attach methods to the scope
    vm.initialize                 = initialize;
    vm.toggleEditItemFormVisible  = toggleEditItemFormVisible;
    vm.updateLocalItemAfterPut    = updateLocalItemAfterPut;
    vm.editItemFormHandler        = editItemFormHandler;
    vm.deleteItemFormHandler      = deleteItemFormHandler;
    //text of buttons whose text changes
    vm.editItemButtonText         = 'Edit or delete this item.';
    vm.deleteItemButtonText       = 'Delete.';
    
    
    
    
    function initialize() {
      vm.itemCopy = angular.copy($scope.item);
    }
    
    
    
    //__________________________________________________________________
    //EDIT ITEM METHODS
    //__________________________________________________________________
    function toggleEditItemFormVisible() {
      if(vm.editItemFormVisible){
        vm.editItemFormVisible    = false;
        vm.editItemButtonText     = 'Edit or delete this item.';
      } else {
        vm.editItemFormVisible    = true;
        vm.editItemButtonText     = 'Cancel';
      }
    }
    function editItemFormHandler() {
      let postObj = {};
      postObj.name = vm.itemCopy.name;
      if(vm.itemCopy.description) {
        postObj.description = vm.itemCopy.description;
      }
      if(vm.itemCopy.dueDate) {
        postObj.dueDate = vm.itemCopy.dueDate;
      }
      if(vm.itemCopy.complete) {
        postObj.complete = vm.itemCopy.complete;
      }

      $http.put('http://localhost:3000/items/' + $scope.item._id, postObj)
        .then(function(result) {
          vm.editItemButtonText = 'Edit or delete this item.';
          vm.editItemFormVisible = false;
          $log.log(result.data);
          $scope.item = result.data;
          vm.updateLocalItemAfterPut();
        }, function(err) {
          $log.log('Error updating item: ', err);
        });
    }
    function updateLocalItemAfterPut (){
      $scope.item.name = vm.itemCopy.name;
      if(vm.itemCopy.description) {
        $scope.item.description = vm.itemCopy.description;
      }
      if(vm.itemCopy.dueDate) {
        $scope.item.dueDate = vm.itemCopy.dueDate;
      }
      if(vm.itemCopy.complete) {
        $scope.item.complete = vm.itemCopy.complete;
      }
    }
    
    
    function deleteItemFormHandler() {
      if(vm.deleteItemButtonText === 'Click again to confirm item deletion.') {
        deleteItem();
      } else {
        confirmDeleteItem();
      }
    }
    function confirmDeleteItem() {
      vm.deleteItemButtonText = 'Click again to confirm item deletion.';
    }
    function deleteItem() {
      vm.deleteItemButtonText = 'Delete.';
      $http.delete('http://localhost:3000/items/' + $scope.item._id)
        .then(function(result) {
          vm.editItemFormVisible = false;
          $scope.item = null; //will this work?
          //do stuff locally not with api call
        }, function(err) {
          $log.log('Error deleting item: ', err);
        });
    }
    
    
  }
  
  
  
  
  
})();
