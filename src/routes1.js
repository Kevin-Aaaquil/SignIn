// in this all sign in will be written
//success

require('dotenv').config();
const express = require('express')
const routes1 = express.Router();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session')
const methodOveride = require('method-override');
const DB = require('./db.js')

const initializePassport = require('./passport-config.js')
initializePassport(
    passport,
    async email => await (await DB()).collection('credentials').findOne({ "email": email }),    // integrate with db
    async id => await (await DB()).collection('credentials').findOne({ "id": id }),  // integrate with db
)

routes1.use(express.json());
routes1.use(express.urlencoded({extended:true}));
routes1
.use(flash())
.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
.use(passport.initialize())
.use(passport.session())
.use(methodOveride('_method'))


routes1.get('/1',checkAuthenticated,(req,res)=>{
    res.send("Hello Authenticated User")
})

routes1.get('/2', checkNotAuthenticated, (req,res)=>{
    res.send("Hello unidentified user")
})




function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}


module.exports = routes1;