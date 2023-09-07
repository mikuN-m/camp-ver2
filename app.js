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

app.use(express.static('stylesheets'));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const ses_opt = {
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60 * 60 * 1000 }
};
app.use(session(ses_opt));


app.use((req,res,next)=>{
    const name = req.session.userName;
    const login = req.session.login;

   res.locals.login = login;
   res.locals.name = name;

    next();
});


app.get('/',(req,res)=>{
    res.render('top.ejs');
});

//ログイン・登録
app.get('/login',(req,res)=>{
    res.render('login.ejs',{errorMs: null});
});

app.get('/sign-up',(req,res)=>{
    res.render('signUp.ejs',{errorMs: null});
});

app.post('/sign-up',(req,res)=>{
    const name = req.body.userName;
    const mail = req.body.mail;
    const password = req.body.password;

    bcrypt.hash(password,5,(error,hash)=>{
        connection.query(
            'SELECT * FROM users WHERE mail = ?',
            [mail],
            (error,results)=>{
                if (results.length > 0) {
                    res.render('signUp.ejs',{errorMs: 'このメールアドレスは使用されています'});
                } else {
                    connection.query(
                        'INSERT INTO users(userName,password,mail,reservation) VALUES (?,?,?,?)',
                        [name,hash,mail,0],
                        (error,results)=>{
                            req.session.userName = name;
                            req.session.login = true;
                            res.redirect('/');
                        }
                    );
                }
            }
        );
    });
});

app.post('/login',(req,res)=>{
    const mail = req.body.mail;
    const password = req.body.password;

    connection.query(
        'SELECT * FROM users WHERE mail = ?',
        [mail],
        (error,results)=>{
            if (results.length > 0) {
                const hash = results[0].password;
                const name = results[0].userName;
                
                bcrypt.compare(password,hash,(error,isEqual)=>{
                    if (isEqual) {
                        req.session.userName = name;
                        req.session.login = true;
                        res.redirect('/');
                    } else {
                        res.render('login.ejs',{errorMs: 'パスワードが間違っています'});
                    }
                });

            } else {
                res.render('login.ejs',{errorMs: 'メールアドレスが間違っています'})
            }
        }
    );
});

app.get('/logout',(req,res)=>{
    req.session.login = false;
    res.redirect('/');
});


//予約・プラン
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

app.get('/reservation/:id',(req,res)=>{
    const name = req.params.id;

    connection.query(
        'SELECT * FROM sites WHERE siteName = ?',
        [name],
        (error,results)=>{
            const pplNum = results[0].pplNum;
            res.render('reservation.ejs',{name: name, pplNum: pplNum})
        }
    );

});

app.get('/confirmation',(req,res)=>{
    // const name = req.body.name;
    // const tel = req.body.tel;
    // const site = req.body.site;
    // const data = req.body.data;
    // const time = req.body.time;
    // const pplNum = req.body.pplNum;
    

    res.render('confirmation.ejs');
});



app.listen(3000);