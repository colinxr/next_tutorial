const bcrypt = require('bcrypt')
const Sequelize = require('sequelize');
const Database = require('./database.js');
const Model = Sequelize.Model
const DataTypes = Sequelize.DataTypes
const { database, user, password, host } = Database

const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: 'postgres',
  logging: false,
})



class User extends Model {}

User.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'user',
  timestamps: false,
  hooks: {
    beforeCreate: async user => {
      const saltRounds = 10
      const salt = await bcrypt.genSalt(saltRounds)
      user.password = await bcrypt.hash(user.password, salt)
    }
  }
})

User.prototype.isPasswordValid = async function(password) {
  console.log(password)
  return await bcrypt.compare(password, this.password)
}

exports.User = User
exports.sequelize = sequelize