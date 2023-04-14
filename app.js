const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql=require('mysql');

const mainRoute = require('./routes/route');
app.use(bodyParser.urlencoded({
    extended:true
}))

 // set the ending to ejs
app.set('view engine','ejs');

// use res.render to load up an ejs view file
app.use('/',mainRoute);
// app.use(bodyParser.urlencoded)({extended:true});
app.use('/static',express.static('public'));

app.use(express.static('bootstrap'));
app.use(express.static('CDN'));

 const http = require("http");

app.listen(3300,function(){
    console.log('server is running in port 3300')
})
