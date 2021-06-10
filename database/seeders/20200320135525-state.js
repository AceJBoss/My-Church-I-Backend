'use strict';
let state = require('../sql/states');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("States", state, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("States", null, {});
  }
};
