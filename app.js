const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pg = require('pg');

const index = require('./routes/index');
const login = require('./routes/login/login');
const logout = require('./routes/login/logout');
const user = require('./routes/user/user');
const async = require('./routes/async');
const input = require('./routes/sign_up/input');
const confirm = require('./routes/sign_up/confirm');
const exec_register = require('./routes/sign_up/exec_register');

const err_handler = require('./routes/err_handler');

const app = express();


  ///////////////////////
 //     log setup     //
///////////////////////

// let logDirectory = path.join(__dirname, 'log/');
//
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// accessLogStream = rfs('access.log', {
//     interval: '1d', // rotate daily
//     path: logDirectory,
//     size:     '10M', // rotate every 10 MegaBytes written
//     compress: 'gzip' // compress rotated files
// });

app.use(helmet());

  ///////////////////////
 // view engine setup //
///////////////////////

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('combined', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


  ////////////////////
 // セッションの設定 //
////////////////////

pg.defaults.ssl = true;
app.use(session({
    store: new pgSession({
        // Connection
        conString: process.env.DATABASE_URL
    }),
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    resave: false,
    cookie: {maxAge: 30 * 60 * 1000} // 30分
}));

  /////////////////////////
 // 各ページのルーティング //
/////////////////////////

app.use('/', index);
app.use('/login', login);
app.use('/logout', logout);
app.use('/user', user);
app.use('/async', async);
app.use('/sign_up', input);
app.use('/sign_up/confirm', confirm);
app.use('/sign_up/exec_register', exec_register);


  ////////////////////////////////////////////
 // catch 404 and forward to error handler //
////////////////////////////////////////////

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

  ///////////////////
 // error handler //
///////////////////

app.use(err_handler);

module.exports = app;
