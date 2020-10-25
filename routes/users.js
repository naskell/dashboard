const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')

// User model
const User = require('../models/User')

// Login
router.get('/login', (req, res) => {
    res.render('login.ejs')
})

// Register
router.get('/register', (req, res) => {
    res.render('register.ejs')
})

// Register Handle
router.post('/register', (req, res) => {
   const { name, email, password, password2 } = req.body 
   let errors = []

   // Check required fields
   if(!name || !email || !password || !password2){
       errors.push({ msg: 'Please fill in all of the fields'})
   }

   // Check passwords match
   if(password!==password2){
       errors.push({ msg: 'Passwords do not match'})
   }

   // Check pass length 
   if(password.length < 6){
       errors.push({ msg: 'Password must be at least 6 characters'})
   }

   if(errors.length > 0 ){
       res.render('register.ejs', {
           errors,
           name,
           email,
           password,
           password2
       })
   } else {
       // User validated
       User.findOne({ email: email }).then(user => {
            if(user){ // user exists
                errors.push({ msg: 'Email is already registered'})
                res.render('register.ejs', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name, // same as name: name
                    email,
                    password
                })

                // Hash password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err
                    // Set password to hash and then save
                    newUser.password = hash
                    // Save the user in mongo
                    newUser.save()
                        .then(user => {
                            req.flash('success-msg', 'You have registered and can now log in') 
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err))

                }) )
            }
        })
   }
})

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next)
})

// Logout Handle
router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success_msg', 'You are now logged out')
    res.redirect('/users/login')
})

module.exports = router