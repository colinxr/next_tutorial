const port           = parseInt(process.env.PORT, 10) || 3000
const dev            = process.env.NODE_env !== 'production'
const dotenv         = require('dotenv');

const express        = require('express')
const next           = require('next')
const nextApp        = next({ dev })
const handle         = nextApp.getRequestHandler()

const session        = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const bodyParser     = require('body-parser')
const passport       = require('passport')

const User           = require('./models/User.js')
const House          = require('./models/House.js')
const Review         = require('./models/Review.js')
const Booking        = require('./models/Booking.js')
const sequelize      = require('./config/database.js')

const houseRoutes    = require('./routes/houses')
const hostRoutes     = require('./routes/host')
const bookingRoutes  = require('./routes/bookings')
const authRoutes     = require('./routes/auth')

dotenv.config();

const sessionStore = new SequelizeStore({
  db: sequelize
})

User.sync({ alter: true })
House.sync({ alter: true })
Review.sync({ alter: true })
Booking.sync({ alter: true })

// sessionStore.sync()
// passport.serializeUser((user, done) => {
//   done(null, user.email)
// })

// passport.deserializeUser((email, done) => {
//   User.findOne({ where: { email: email } }).then(user => done(null, user))
// })

// passport.use(new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password'
// }, async function(email, password, done) {
//   if (!email || !password) {
//     done('email and password required', null);
//     return
//   }

//   const user = await User.findOne({ where: {email: email}})

//   if (!user) {
//     done('User not found', null);
//     return
//   }

//   const valid = await user.isPasswordValid(password)

//   if (!valid) {
//     done('email and password do not match', null);
//     return
//   }

//   done(null, user);
// }))

/*------------------------------------*
//
//  Passport configuration
//
/*------------------------------------*/

require('./config/passport')(passport);  // pass passport for configuration


/*------------------------------------*
//
//  Next.js initialiation
//
/*------------------------------------*/

nextApp.prepare().then(() => {
  const app = express()
  
  // set up body-parser
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())

  // set up session info 
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

  /*------------------------------------*
  //
  //  Route handlers
  //
  /*------------------------------------*/
  
  app.use('/api/houses', houseRoutes)
  app.use('/api/bookings', bookingRoutes)
  app.use('/api/host', hostRoutes)
  app.use('/api/auth', authRoutes)

  // next routes 
  app.all('*', (req, res) => {
    return handle(req, res)
  })

  /*------------------------------------*
  //
  //  Launch Server 
  //
  /*------------------------------------*/
  
  app.listen(port, err => {
    if (err) throw err
    console.log('>>> here we go!')
    console.log(`> Ready on http://localhost:${port}`)
  })
})
.catch(err => {
  console.error(err);
})
