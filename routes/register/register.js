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
        email = req.body.email,
        pw    = req.body.pw,
        error = {
            user: "",
            email: "",
            pw: ""
        };

    if( user === "" ){

        error.user = "Empty user id";

    }else{

        //UserIDケタ数チェック
        if( !validator.isLength(user, {min:6, max:128})){

            error.user = 'User id should be within 6-128 letters';
        }

        //UserIDフォーマットチェック
        if( !validator.isAlphanumeric(user) ){

            error.pw = 'User id should only contains alphabetical or numeric characters';
        }

    }

    if( email === "" ){

        error.email = "Empty mail address";

    }else{

        //メールフォーマットチェック
        if( !validator.isEmail(email) ){

            error.email = 'Mail format is not correct';
        }
    }

    if( pw === "" ){

        error.pw = "Empty password";

    }else{

        //パスワードケタ数チェック
        if( !validator.isLength(pw, {min:6, max:128})){

            error.pw = 'Password should be within 6-128 letters';
        }

        //パスワードフォーマットチェック
        if( !validator.isAlphanumeric(pw) ){

            error.pw = 'Password should only contains alphabetical or numeric characters';
        }
    }


    if( !validator.isEmpty(error.user)  ||
        !validator.isEmpty(error.email) ||
        !validator.isEmpty(error.pw)) {

        res.render('register/register', error);

    }else{

        let pool = new Pool(config.db_config);

        pool.connect()

            .then(client => {

                //重複するユーザーidが存在するか確認する
                query = 'select count(1) from' + '"public"."user" ' +
                    'where user_id=' + "'" + user + "';";

                client.query(query).then(result => {

                    //重複するユーザーが存在しなかった場合
                    if (result.rows[0].count === '0') {

                        req.session.user  = req.body.user;
                        req.session.email = req.body.email;
                        req.session.pw    = req.body.pw;

                        res.redirect('/register/confirm');

                    } else {

                        error.user = 'This user id is already in use. Please use other one.';
                        res.render('register/register', error);
                    }

                    client.release();

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