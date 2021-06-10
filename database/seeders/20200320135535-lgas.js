'use strict';
let lga = require('../sql/lgas');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Lgas", lga, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Lgas", null, {});
  }
};
