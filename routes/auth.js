const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/User.js')
const sequelize = require('../config/database.js')

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      res.statusCode = 500
      res.end(
        JSON.stringify({
          status: 'error',
          message: error
        })
      )
      return
    }

    if (!user) {
      res.status = 500
      res.end(
        JSON.stringify({
          status: 'error',
          message: 'No User found'
        })
      )
    }

    req.login(user, error => {
      if (error) {
        res.statusCode = 500
        res.end(
          JSON.stringify({
            status: 'error',
            message: error
          })
        )
        return
      }

      return res.end(
        JSON.stringify({
          status: 'success',
          message: 'Logged in'
        })
      )
    })
  })(req, res, next)
})

router.post('/logout', (req, res, next) => {
  req.logout()
  req.session.destroy()
  return res.end(JSON.stringify({ status: 'message', message: 'loggedt out' }))
})

router.post('/register', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body

  if (password !== passwordConfirmation) {
    res.end(
      JSON.stringify({ status: 'error', message: 'Passwords do not match' })
    )
    return
  }

  try {
    const user = await User.create({ email, password })
    // res.login(user, error => {
    //   if (error) {
    //     res.statusCode = 500
    //     return res.end(JSON.stringify({ status: 'error', message: 'fuck' }))
    //   }

    //   return res.end(
    //     JSON.stringify({ status: 'success', message: 'Logged in' })
    //   )
    // })

    req.login(user, error => {
      if (error) {
        res.statusCode = 500
        res.end(JSON.stringify({ status: 'error', message: error }))
        return
      }

      return res.end(JSON.stringify({ status: 'success', message: 'Logged In' }))
    })

    res.end(JSON.stringify({ status: 'success', message: 'User added' }))
  } catch (error) {
    res.statusCode = 500
    let message = 'An error occurred'
    if (error.name === 'SequelizeUniqueConstraintError') {
      message = 'User already exists'
    }
    console.log(error)
    res.end(JSON.stringify({ status: 'error', message: message }))
  }
})

module.exports = router

