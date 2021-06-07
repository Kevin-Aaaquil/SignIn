require('dotenv').config();
const express = require('express')
const signin = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOveride = require('method-override')
const chalk = require('chalk');
const DB = require('./db.js');


const initializePassport = require('./passport-config.js')
const init = ()=>{initializePassport(
    passport,
    async email => await (await DB()).collection('credentials').findOne({ "email": email }),    // integrate with db
    async id => await (await DB()).collection('credentials').findOne({ "id": id }),  // integrate with db
)}
//const users = []   //will use mongodb database instead
//Initialized DB connection
init();

signin.use(express.urlencoded({ extended: true })) // original code = false
signin.use(flash())
signin.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
signin.use(passport.initialize())
signin.use(passport.session())
signin.use(methodOveride('_method'))

signin.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})

signin.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

signin.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

signin.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

signin.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        }
        await (await DB()).collection('credentials').insertOne(user);
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

signin.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) { // allows logged in users
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) { // allows not logged in users
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = {signin,init};