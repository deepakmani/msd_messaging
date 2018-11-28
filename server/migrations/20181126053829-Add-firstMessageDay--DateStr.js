'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
       var sequelize = queryInterface.sequelize;

     return sequelize.transaction(function (t) {
          return queryInterface.addColumn('DirectMessages', "firstMessageOfDay",  Sequelize.BOOLEAN, {transaction: t})
      });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    var sequelize = queryInterface.sequelize;

     return sequelize.transaction(function (t) {
          return queryInterface.removeColumn('DirectMessages', "firstMessageOfDay", {transaction: t})
      });
  }
};
