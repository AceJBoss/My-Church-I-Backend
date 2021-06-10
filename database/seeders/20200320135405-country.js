'use strict';
let country = require('../sql/country');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Countries", country, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Countries", null, {});
  }
};
