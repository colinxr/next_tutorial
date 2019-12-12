const router = require('express').Router()
const Op = require('sequelize').Op
const User = require('../models/User.js')
const House = require('../models/House.js')
const Review = require('../models/Review.js')
const Booking = require('../models/Booking.js')
const utils = require('../utils');

router.get('/list', (req, res) => {
  Booking.findAndCountAll({
    where: {
      endDate: { [Op.gte]: new Date() },
    },
    order: [['startDate', 'ASC']]
  }).then(async result => {
    const bookings = await Promise.all(
      result.rows.map(async booking => {
        const data = {}
        data.booking = booking.dataValues 
        data.house = (await House.findByPk(data.booking.houseID)).dataValues 
        return data
      })
    )

    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(bookings))
  })
})

module.exports = router
