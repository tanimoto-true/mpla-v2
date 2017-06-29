const express = require('express');
const helmet = require('helmet');
let app = express();
app.use(helmet());

const router  = express.Router();
const validator = require('validator');
const pg = require('pg');
const Pool = require('pg-pool');
const dotenv = require('dotenv').config();
const config = require('../../conf/config');

/* Get register page */
router.get('/', function (req, res, next){

    res.render('register/register');
});

router.post('/', function (req, res, next){

    let user  = req.body.user,
        pw    = req.body.pw,
        error = {
            mail_err: "",
            pw_length: "",
            pw_format: "",
            duplicated: ""
        };

    if( user === "" ){

        error.mail_err = "Empty mail address";

    }else{

        //メールフォーマットチェック
        if( !validator.isEmail(user) ){

            error.mail_err = 'Mail format is not correct';
        }
    }

    if( pw === "" ){

        error.pw_length = "Empty password";

    }else{

        //パスワードケタ数チェック
        if( !validator.isLength(pw, {min:6, max:128})){

            error.pw_length = 'Password should be within 6-128 letters';
        }

        //パスワードフォーマットチェック
        if( !validator.isAlphanumeric(pw) ){

            error.pw_format = 'Password should only contains alphabetical or numeric characters';
        }
    }


    if( !validator.isEmpty(error.mail_err)  ||
        !validator.isEmpty(error.pw_length) ||
        !validator.isEmpty(error.pw_format)) {

        res.render('register/register', error);

    }else{

        let pool = new Pool(config.db_config);

        pool.connect()

            .then(client => {

                //重複するユーザーidが存在するか確認する
                let query = 'select count(1) from users ' +
                    'where id=' + "'" + user + "';";

                client.query(query).then(result => {

                    //重複するユーザーが存在しなかった場合
                    if (result.rows[0].count === '0') {

                        client.release();

                        req.session.user = req.body.user;
                        req.session.pw   = req.body.pw;

                        res.redirect('/register/confirm');

                    } else {

                        client.release();

                        error.duplicated = 'This email is already in use. Please use other one.';
                        res.render('register/register', error);
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

//例外処理
process.on('unhandledRejection', function(error){

    console.log(error);
});

//例外処理
process.on('uncaughtException', function(error){

    console.log(error);
});


module.exports = router;