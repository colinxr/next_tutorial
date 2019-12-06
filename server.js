const express        = require('express')
const next           = require('next')
const dotenv         = require('dotenv');

const port           = parseInt(process.env.PORT, 10) || 3000
const dev            = process.env.NODE_env !== 'production'
const nextApp        = next({ dev })
const handle         = nextApp.getRequestHandler()

const session        = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const bodyParser     = require('body-parser')

const passport       = require('passport')
const LocalStrategy  = require('passport-local').Strategy

const User           = require('./models/User.js')
const House          = require('./models/House.js')
const Review         = require('./models/Review.js')
const sequelize      = require('./database.js')

dotenv.config();

const sessionStore = new SequelizeStore({
  db: sequelize
})

User.sync({ alter: true })
House.sync({ alter: true })
Review.sync({ alter: true })

// sessionStore.sync()

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async function(email, password, done) {
  if (!email || !password) {
    done('email and password required', null);
    return
  }

  const user = await User.findOne({ where: {email: email}})

  if (!user) {
    done('User not found', null);
    return
  }

  const valid = await user.isPasswordValid(password)

  if (!valid) {
    done('email and password do not match', null);
    return
  }

  done(null, user);
}))

passport.serializeUser((user, done) => {
  done(null, user.email)
})

passport.deserializeUser((email, done) => {
  User.findOne({where: {email: email}}).then(user => done(null, user))
})

nextApp.prepare().then(() => {
  const app = express()
  
  app.use(bodyParser.urlencoded())
  app.use(bodyParser.json())

  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true,
      name: 'nextbnb',
      cookie: {
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000
      },
      store: sessionStore
    }),
    passport.initialize(),
    passport.session() 
  )

  app.post('/api/auth/register', async (req, res) => {
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
          res.end(JSON.stringify({status: 'error', message: error}))
          return
        }

        return res.end(JSON.stringify({status: 'success', message: 'Logged In'}))
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

  app.post('/api/auth/login', (req, res) => {
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

  app.post('/api/auth/logout', (req, res) => {
    req.logout()
    req.session.destroy()
    return res.end(JSON.stringify({status: 'message', message: 'loggedt out'}))
  })

  app.all('*', (req, res) => {
    return handle(req, res)
  })

  app.listen(port, err => {
    if (err) throw err
    console.log('>>> here we go!')
    console.log(`> Ready on http://localhost:${port}`)
  })
})
.catch(err => {
  console.error(err);
})
