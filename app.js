const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const mysql = require('mysql');

const app = express();

app.get('/',(req,res)=>{
    res.render('top.ejs');
});



app.listen(3000);