const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pg = require('pg');
const dotenv = require('dotenv').config();
const rfs = require('rotating-file-stream');

let index = require('./routes/index');
let login = require('./routes/login/login');
let logout = require('./routes/login/logout');
let user = require('./routes/user/user');
let async = require('./routes/async');
let register = require('./routes/register/register');
let confirm = require('./routes/register/confirm');
let register_fin = require('./routes/register/register_fin');

let err_handler = require('./routes/err_handler');


let app = express();


  ///////////////////////
 //     log setup     //
///////////////////////

let logDirectory = path.join(__dirname, 'log/');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory,
    size:     '10M', // rotate every 10 MegaBytes written
    compress: 'gzip' // compress rotated files
});

app.use(helmet());

  ///////////////////////
 // view engine setup //
///////////////////////

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('combined', {stream: accessLogStream}));
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
    secret: 'iufhefirgfi3ufw',
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
app.use('/register', register);
app.use('/register/confirm', confirm);
app.use('/register/register_fin', register_fin);


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
