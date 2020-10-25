const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const favicon = require('serve-favicon')
const path = require('path')

const app = express()

// DB Config
const db = require('./config/keys').mongoURI

// Passport config
require('./config/passport')(passport)

// Connect to Mongoose
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS middleware
app.use(expressLayouts) 
app.set('view engine', 'ejs') 

// Favicon
app.use(favicon(__dirname + '/public/logos/favicon.ico'))

// Bodyparser
app.use(express.urlencoded({ extended: false}))

// Express Session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    //cookie: { secure: true }
  }))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());  

//Connect flash
app.use(flash())

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg'),
    res.locals.error_msg = req.flash('error_msg'),
    res.locals.error = req.flash('error')
    next()
} )

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server started on port ${PORT}`))