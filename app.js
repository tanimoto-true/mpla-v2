const express = require('express');
const helmet = require('helmet');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let pgSession = require('connect-pg-simple')(session);
let pg = require('pg');
let dotenv = require('dotenv').config();

let index = require('./routes/index');
let login = require('./routes/login/login');
let logout = require('./routes/login/logout');
let user = require('./routes/user/user');
let async = require('./routes/async');
let registry = require('./routes/registry/registry');
let confirm = require('./routes/registry/confirm');
let registry_fin = require('./routes/registry/registry_fin');

let err_handler = require('./routes/err_handler');


let app = express();

app.use(helmet());

  ///////////////////////
 // view engine setup //
///////////////////////

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
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
app.use('/registry', registry);
app.use('/registry/confirm', confirm);
app.use('/registry/registry_fin', registry_fin);


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
