const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
const sequelize = require('../database.js')


class Review extends Sequelize.Model {}

Review.init({
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  houseID: {type: Sequelize.DataTypes.INTEGER, allowNull: false, },
  userID: { type: Sequelize.DataTypes.INTEGER, allowNull: false},
  comment: { type: Sequelize.DataTypes.TEXT, allowNull: false}
}, {
  sequelize,
  modelName: 'review',
  timestamps: false,
})

module.exports = Review