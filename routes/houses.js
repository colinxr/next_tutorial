const router = require('express').Router()
const User = require('../models/User.js')
const House = require('../models/House.js')
const Review = require('../models/Review.js')
const Booking = require('../models/Booking.js')
const sequelize = require('../database.js')

router.get('/houses', (req, res) => {
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
router.get('/houses/:id', (req, res) => {
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

router.post('/houses/reserve', (req, res) => {
  const email = req.session.passport.user 
  const {houseID, userID, startDate, endDate} = req.body
  User.findOne({where: { email }})
    .then(user => {
      Booking.create({
        houseID: houseID,
        userID: userID,
        startDate: startDate,
        endDate: endDate 
      })
      .then(() => {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({status: 'success', message: 'ok'}))
      })
    })
})

module.exports = router