'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
     return queryInterface.bulkInsert('UserWallets', [
  {
    user_id: 1,
    balance: 0,   
    createdAt: new Date(),
    updatedAt: new Date()
  }
], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserWallets', null, {});
  }
};
