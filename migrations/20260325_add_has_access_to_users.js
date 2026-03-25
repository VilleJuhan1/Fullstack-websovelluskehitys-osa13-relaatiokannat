const { DataTypes } = require('sequelize')

// This migration adds a new column 'has_access' to the 'users' table
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'has_access', {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'has_access')
  },
}