const express= require('express')
const app = express()
const chalk = require('chalk')
const mongodb=require('mongodb')
const DB = require('./db.js')
const {signin} = require('./signin.js');
const routes1 = require('./routes1.js');
const routes2 = require('./routes2.js');



DB().catch(e=>console.log(e)); // initialize DB

app.set('view-engine','ejs');
app.use(signin);
app.use('/routes1',routes1);
app.use('/routes2',routes2);


port = process.env.PORT || 3000
app.listen(port,()=>{
console.log(chalk.magenta(`listening to port ${port}`))
})