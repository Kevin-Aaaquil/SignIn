require('dotenv').config();
const express = require('express')
const app = express();
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOveride = require('method-override')
const chalk = require('chalk');

const initializePassport = require('./passport-config.js')
initializePassport(
    passport,
    email => users.find(user => user.email === email),    // integrate with db
    id => users.find(user => user.id === id),  // integrate with db
)

const users = []   //will use database instead

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: true })) // original code = false
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOveride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs',{name:req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email:req.body.email,
            password: hashedPassword
        })
        console.log(users)
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

app.delete('/logout',checkAuthenticated, (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated  (req, res, next)  {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(chalk.magenta(`listening on port ${port}`));
})