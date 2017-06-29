let express = require('express');

const helmet = require('helmet');
let app = express().use(helmet());
app.use(helmet());

const router = express.Router();
const session = require('express-session');
const pg = require('pg');
const Pool = require('pg-pool');
const dotenv = require('dotenv').config();

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
    let id   = req.body.id,
        pass = req.body.pw;

    //idもしくはpwが空の場合
    if( id === "" ||  pass === ""){

        res.render('login/login', {"id": id});

    }else{

        let pool = new Pool(config.db_config);

        (function login(){

        pool.connect()

            .then(client => {

                const register = require('../register/register_funcs');

                let query = 'SELECT count(1) from users where id =' + "'" + id + "'" + ' and pass=' + "'" + register.hash_password(pass) + "'";

                client.query(query)

                    .then(result => {

                        if(result.rows[0].count === "1"){

                            //セッションにidをセットする
                            req.session.user = id;

                            //セッションにloginステータスをセットする
                            req.session.login = 'yes';

                            client.release();

                            //userページを表示する
                            res.render('user/user', {"id": id});

                        }else{

                            //ログイン失敗のメッセージを表示する
                            res.send('login失敗');
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
    process.exit(1);
});

module.exports = router;
