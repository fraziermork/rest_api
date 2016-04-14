'use strict';

module.exports = {
  // webdriver-manager start
  // will show the ip address for the selenium address at the bottom, like http://localhost:4444/wd/hub

  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [ './test/frontend/bundles/e2e_bundle.js']
  
};
