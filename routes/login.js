let express = require('express');
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
      max: 20, //set pool max size to 20
      min: 4, //set min pool size to 4
      idleTimeoutMillis: 1000 //close idle clients after 1 second
};

/* GET login listing. */
router.get('/', function(req, res) {

    //ログインしている場合
    if( req.session.login === 'yes' ){

        res.render('user', {"id": req.session.user});

    //ログインしていない場合
    }else{

        res.render('login');
    }
});

/* POST login listing. */
router.post('/', function(req, res, next) {

    //入力されたidとpwを取得
    let id   = req.body.id,
        pass = req.body.pw;

    //idもしくはpwが空の場合
    if( id === "" ||  pass === ""){

        res.render('login', {"id": id});

    }else{

        let pool = new Pool(db_config);

        pool.connect().then(client => {

            client.query('SELECT count(1) from users where id =' + "'" + id + "'" + ' and pass=' + "'" + pass + "'")

                .then(result => {

                    if(result.rows[0].count === "1"){

                        //セッションにidをセットする
                        req.session.user = id;

                        //セッションにloginステータスをセットする
                        req.session.login = 'yes';

                        client.release();

                        //userページを表示する
                        res.render('user', {"id": id});

                    }else{

                        //ログイン失敗のメッセージを表示する
                        res.send('login失敗');
                    }

                })
                .catch(e => {
                    client.release();
                    console.error('query error', e.message, e.stack);
                });
        })
            .catch(() => {
                let err = new Error('DB connection error');
                err.status = 501;
                next(err);
            });
    }
});

process.on('unhandledRejection', function(error){

    console.log(error);
    process.exit(1);
});


module.exports = router;
