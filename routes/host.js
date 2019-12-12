const router = require('express').Router()
const Op = require('sequelize').Op
const User = require('../models/User.js')
const House = require('../models/House.js')
const Booking = require('../models/Booking.js')

router.get('/list', async (req, res) => {
  const email = req.session.passport.user 
  
  const user = await User.findOne({where: { email }})

  const houses = await House.findAll({ where: { host: user.id } })
  
  const houseIDs = houses.map(house => house.dataValues.id)

  const bookingData = await Booking.findAll({
    where: {
      houseID: {
        [Op.in]: houseIDs,
      },
      endDate: {
        [Op.gte]: new Date()
      }
    },
    order: [['startDate', 'ASC']]
  })

  const bookings = await Promise.all(
    bookingData.map(async booking => {
      return {
        booking: booking.dataValues,
        house: houses.filter(
          house => house.dataValues.id === booking.dataValues.houseID
        )[0].dataValues
      }
    })
  )

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify({houses, bookings}))
})

module.exports = router