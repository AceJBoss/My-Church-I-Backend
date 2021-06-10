'use strict';
let userTypes = require('../sql/usertype');

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('UserTypes', userTypes, {}); 
  },

  down: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkDelete('UserTypes', null, {});    
  }
};
