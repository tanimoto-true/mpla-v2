let express = require('express');

const helmet = require('helmet');
let app = express().use(helmet());
app.use(helmet());

const router = express.Router();
const session = require('express-session');
const pg = require('pg');
const Pool = require('pg-pool');
// const dotenv = require('dotenv').config();

const config = require('../../conf/config');

/* GET login listing. */
router.get('/', function(req, res) {

    //ログインしている場合
    if( req.session.login === 'yes' ){

        res.redirect('/user');

    //ログインしていない場合
    }else{

        res.render('login/login');
    }
});

/* POST login listing. */
router.post('/', function(req, res, next) {

    //入力されたidとpwを取得
    let user_id    = req.body.user_id,
        pass  = req.body.pw;

    //idもしくはpwが空の場合
    if( user_id === "" ||  pass === ""){

        res.render('login/login', { user_id: user_id,
                                    error: 'Empty input!!'});

    }else{

        let pool = new Pool(config.db_config);

        (function login(){

        pool.connect()

            .then(client => {

                const register = require('../sign_up/sign_up_funcs');

                let query = `SELECT count(1) from "public"."user" where (user_id ='${user_id}' or email='${user_id}') and password=` + "'" + register.hash_password(pass) + "'" + ` limit 1`;

                client.query(query)

                    .then(result => {

                        if(result.rows[0].count === "1"){

                            //セッションにidをセットする
                            req.session.user = user_id;

                            //セッションにloginステータスをセットする
                            req.session.login = 'yes';

                            client.release();

                            //userページを表示する
                            res.render('user/user', {user_id: user_id});

                        }else{

                            client.release();

                            //ログイン失敗のメッセージを表示する
                            res.render('login/login', {user_id: user_id,
                                                       error: 'Login failed'});
                        }
                    })
                    .catch(e => {
                        let err = new Error('query error : ' + e.message + "\n" + 'query : ' + query);
                        err.status = 501;
                        client.release();
                        next(err);
                    });
            })
            .catch(e => {
                let err = new Error('DB connection error : ' + e.message);
                err.status = 501;
                next(err);
            });
        }());
    }
});

process.on('unhandledRejection', function(error){

    console.log(error);
});

//例外処理
process.on('uncaughtException', function(error){

    console.log(error);
});


module.exports = router;
