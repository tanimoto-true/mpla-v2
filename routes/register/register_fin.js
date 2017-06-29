const express = require('express');
const helmet = require('helmet');
let app = express().use(helmet());
app.use(helmet());

const router = express.Router();
const session = require('express-session');
const pg = require('pg');
const Pool = require('pg-pool');
const dotenv = require('dotenv').config();
const url = require('url');

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

//DBアクセス情報
const db_config = {
    host:  params.hostname,
    database: params.pathname.split('/')[1],
    user: auth[0],
    password: auth[1],
    port: params.port,
    ssl: true,
    max: 10, //set pool max size to 20
    min: 4, //set min pool size to 4
    idleTimeoutMillis: 1000 //close idle clients after 1 second
};


router.post('/', function (req, res, next){

    //入力されたuser_idとpwを取得
    let user   = req.body.user,
        pass = req.body.pw;

    //idもしくはpwが空の場合
    if( user === "" ||  pass === ""){

        res.render('register/register');

    }else{

        let pool = new Pool(db_config);

        pool.connect()

            .then(client => {

                //重複するユーザーidが存在するか確認する
                let query = 'select count(1) from users ' +
                    'where id=' + "'" + user + "';";

                client.query(query).then(result => {

                    //重複するユーザーが存在しなかった場合
                    if (result.rows[0].count === '0') {

                        const register = require('./register_funcs');

                        pass = register.hash_password(pass);

                        //ユーザー情報を登録する
                        let query = 'insert into users ' +
                            '(id, pass)' +
                            'values( ' +
                            "'" + user + "'," +
                            "'" + pass + "'" + ');';

                        client.query(query)

                            .then(() => {

                                //セッションにloginステータスをセットする
                                req.session.login = 'yes';

                                client.release();

                                //登録完了のメッセージを送信
                                res.send('registration complete');

                            });

                    } else {

                        //重複するデータが存在したことを表示
                        res.send('Error : Please register your info from the beginning!!');
                    }

            });

            //例外処理
            }).catch(e => {
                let err = new Error('Unpredicted error : ' + e.message + "\n" + 'query : ' + query);
                err.status = 501;
                client.release();
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