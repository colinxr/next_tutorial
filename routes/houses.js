const router    = require('express').Router()
const Op        = require('sequelize').Op
const User      = require('../models/User.js')
const House     = require('../models/House.js')
const Review    = require('../models/Review.js')
const Booking   = require('../models/Booking.js')
const utils     = require('../utils');

router.get('/', (req, res) => {
  House.findAndCountAll()
    .then(results => {
      console.log(results)

      const houses = results.rows.map(house => house.dataValues)

      res.writeHead(200, {
        'Content-Type': 'application/json'
      })

      res.end(JSON.stringify(houses))
    })
})

// find the House 
// if House exists, find the reviews, where houseID === house.id 
// add the reviews to the house object 
// add the count to the house object 
router.get('/:id', (req, res) => {
  const { id } = req.params
  House.findByPk(id).then(house => {
    if (house) {
      Review.findAndCountAll({
        where: { houseID: house.id }
      }).then(reviews => {
        house.dataValues.reviews = reviews.rows.map(review =>
          review.dataValues)
        house.dataValues.reviewsCount = reviews.count

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(house.dataValues))
      })
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Not Found' }))
    }
  })
})

router.post('/reserve', (req, res) => {
  const email = req.session.passport.user 
  const {houseID, userID, startDate, endDate} = req.body
  User.findOne({where: { email }})
    .then(user => {
      Booking.create({
        userID: user.id,
        houseID,
        startDate,
        endDate,
      })
      .then(() => {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({status: 'success', message: 'ok'}))
      })
    })
})

router.post('/booked', async (req, res) => {
  if (!req.session.passport) {
    res.writeHead(403, {
      'Content-Type': 'application/json'
    })
    res.end(
      JSON.stringify({
        status: 'error',
        message: 'Unauthorized'
      })
    )

    return
  }

  if (
    !(await utils.canBookThoseDates(
      req.body.houseId,
      req.body.startDate,
      req.body.endDate
    ))
  ) {
    //busy
    res.writeHead(500, {
      'Content-Type': 'application/json'
    })
    res.end(
      JSON.stringify({
        status: 'error',
        message: 'House is already booked'
      })
    )

    return
  }

  const houseID = req.body.houseID 

  const results = await Booking.findAll({
    where: {
      houseID: houseID,
      endDate: {
        [Op.gte]: new Date()
      }
    }
  })

  const bookedDates = results.map(result => {
    const start = new Date(result.startDate)
    const end = new Date(result.endDate)

    return utils.getDatesBetweenDates(start, end)
  })

  const uniqueDates = [...new Set(bookedDates)]

  res.json({
    status: 'success',
    message: 'ok',
    dates: uniqueDates[0]
  })
})

router.post('/check', async (req, res) => {
  const { houseID, startDate, endDate } = req.body
  const isFree = await utils.canBookThoseDates(houseID, startDate, endDate)
  const message = isFree ? 'free' : 'busy' 

  res.json({
    status: 'success',
    message: message
  })
})

module.exports = router