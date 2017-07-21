const express = require('express');
const router  = express.Router();
const sign_up_funcs = require('./sign_up_funcs');

/* Get sign_up page */
router.get('/', function (req, res){

    let input = {
            user  : req.body.user,
            email : req.body.email,
            pw    : req.body.pw
        },
        error = {
            user     : '',
            email    : '',
            pw       : ''
        };

    res.render('sign_up/input', {input: input, error: error, user_id: req.session.user_id} );
});


/*  POST sign up page */
router.post('/', function (req, res, next){

    let input = {
            user  : req.body.user,
            email : req.body.email,
            pw    : req.body.pw
        },
        error = sign_up_funcs.check_input(input.user, input.email, input.pw);

    // メールアドレス重複チェック処理を行う。エラーが存在する場合はpromiseを通して返す。
    sign_up_funcs.promised_check_email_duplication(input.email, error.email).then((err_msg)=>{

        //エラーメッセージが存在する場合
        if(err_msg) {

            //エラーメッセージをセットする
            error.email = err_msg;
        }

         // 入力エラーが存在する場合
        if( sign_up_funcs.is_error_exist(error) === true ) {

            res.render('sign_up/input', { error: error, input: input, user_id: req.session.user_id });

        // 入力エラーが存在しない場合
        }else{

            req.session.user_info = input;

            res.render('sign_up/confirm', { input: input, user_id: req.session.user_id });
        }

    }).catch(e => {

        let err = new Error('Unpredicted error : ' + e.message + "\n");
        err.status = 501;
        next(err);
    });
});

module.exports = router;