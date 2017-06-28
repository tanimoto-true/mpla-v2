const express = require('express');
const helmet = require('helmet');
let app = express().use(helmet());
app.use(helmet());

let router = express.Router();
let session = require('express-session');
let pg = require('pg');
let Pool = require('pg-pool');
let dotenv = require('dotenv').config();

const url = require('url');

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

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

        res.render('registry/registry');

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

                        let query = 'insert into users ' +
                            '(id, pass)' +
                            'values( ' +
                            "'" + user + "'," +
                            "'" + pass + "'" + ');';

                        //ユーザー情報を登録する
                        client.query(query)

                            .then(() => {

                                //セッションにloginステータスをセットする
                                req.session.login = 'yes';

                                client.release();

                                //トップページを表示する
                                res.send('registration complete');

                            });

                    } else {

                        res.send('Error : Please registry your info from the beginning!!');
                    }

            });


            }).catch(e => {
                let err = new Error('Unpredicted error : ' + e.message + "\n" + 'query : ' + query);
                err.status = 501;
                client.release();
                next(err);
            })
    }
});



process.on('unhandledRejection', function(error){

    console.log(error);
    process.exit(1);
});


module.exports = router;