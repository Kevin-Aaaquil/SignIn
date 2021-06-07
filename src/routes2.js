// this will call init from signin
//success

const express = require('express')
const routes2 = express.Router();
const passport = require('passport');
const {init} = require('./signin')
const methodOveride = require('method-override')
init();

routes2
.use(passport.initialize())
.use(passport.session())
.use(methodOveride('_method'))

routes2
.get('/1',checkAuthenticated,(req,res)=>{
res.send("Hello Authenticated User")
})

.get('/2',checkNotAuthenticated,(req,res)=>{
    res.send("Hello Unidentified User")
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


module.exports = routes2