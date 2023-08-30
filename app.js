const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const mysql = require('mysql');

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'reiwa123',
    database: 'campVer2'
});

app.set('view engine', 'ejs');


app.get('/',(req,res)=>{
    res.render('top.ejs');
});

app.get('/plans',(req,res)=>{

    const plans = []

    connection.query(
        'SELECT siteCategory ,siteName ,section ,pplNum ,siteNote from sites',
        (error,results)=>{
            
            for(let i=0; i<results.length; i++){
                plans.push(
                    {
                        category: results[i].siteCategory,
                        category: results[i].siteCategory,
                        name: results[i].siteName,
                        section: results[i].section,
                        pplNum: results[i].pplNum,
                        siteNote: results[i].siteNote
                    }
                );                
            }
            
            res.render('plans.ejs',{plans: plans});
        }
    );
});



app.listen(3000);