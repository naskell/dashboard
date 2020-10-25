const express = require('express')
const router = express.Router()
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth')

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => {
    res.render('welcome.ejs')
})

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard.ejs', {
    name: req.user.name
  })
);

module.exports = router