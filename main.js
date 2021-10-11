const express = require('express');
const cors = require('cors');
const path = require('path')
var app = express();
const bodyParser = require('body-parser');
var apiRouter = require('./src/router/index');

require('dotenv').config()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use('/test',(req,res)=>{
    res.send('Welcome to User Crud Store Project')
})
app.use('/api/v1',apiRouter)


var port = process.env.PORT;
app.listen(process.env.PORT, () => {
    console.log("server start port =>3000")
})
