const Sequelize = require('sequelize')
const sequelize = require('../config/database.js')

class Booking extends Sequelize.Model {}

Booking.init({
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  houseID: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
  userID: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
  startDate: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
  endDate: { type: Sequelize.DataTypes.DATEONLY, allowNull: false },
  paid: { type: Sequelize.DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
}, {
    sequelize,
    modelName: 'booking',
    timestamps: true
  })

module.exports = Booking