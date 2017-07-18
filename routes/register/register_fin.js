const express = require('express');
const helmet = require('helmet');
let app = express().use(helmet());
app.use(helmet());

const router = express.Router();
const session = require('express-session');
const pg = require('pg');
const Pool = require('pg-pool');
// const dotenv = require('dotenv').config();

const config = require('../../conf/config');

router.get('/', function (req, res, next){

    //登録完了のメッセージを送信
    res.render('register/register_fin');
});

router.post('/', function (req, res, next){

    //入力されたuser_idとpwを取得
    let user   = req.body.user,
        email  = req.body.email,
        pass   = req.body.pw;

    //UserID, emailもしくはpwが空の場合
    if( typeof user === "undefined" || typeof email=== "undefined" || typeof pass === "undefined"){

        res.redirect('register/register');

    }else{

        let pool = new Pool(config.db_config);

        pool.connect()

            .then(client => {

                //重複するUserIDが存在するか確認する
                let query = 'select count(1) from "public"."user" ' +
                    'where user_id=' + "'" + user + "';";

                client.query(query).then(result => {

                    //重複するユーザーが存在しなかった場合
                    if (result.rows[0].count === '0') {

                        const register = require('./register_funcs');

                        pass = register.hash_password(pass);

                        //ユーザー情報を登録する
                        let query = 'insert into "public"."user" ' +
                            '(user_id, email, password)' +
                            'values( ' +
                            "'" + user + "'," +
                            "'" + email + "'," +
                            "'" + pass + "'" + ');';

                        client.query(query)

                            .then(result => {

                                //セッションにloginステータスをセットする
                                req.session.login = 'yes';


                                client.release();

                                //登録完了のメッセージを送信
                                res.render('register/register_fin');

                            });

                    } else {

                        client.release();
                        //重複するデータが存在したことを表示
                        res.send('Error : Please register your info from the beginning!!');
                    }

            });

            //例外処理
            }).catch(e => {
                let err = new Error('DB connection : ' + e.message + "\n");
                err.status = 501;
                next(err);
            })
    }
});


//例外処理
process.on('unhandledRejection', function(error){

    console.log(error);
});

//例外処理
process.on('uncaughtException', function(error){

    console.log(error);
});

module.exports = router;