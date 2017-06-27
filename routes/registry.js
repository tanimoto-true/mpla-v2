const express = require('express');
const router  = express.Router();
const validator = require('validator');

/* Get registry page */
router.get('/', function (req, res, next){

    //ログインしている場合
    if( req.session.login === 'yes' ){

        res.redirect('user');

    //ログインしていない場合
    }else{

        res.render('registry');
    }
});

router.post('/', function (req, res, next){

    let id = req.body.id,
        pw = req.body.pw,
        error = {};

    //メールフォーマットチェック
    error.mail_format = '';
    if( !validator.isEmail(id) ){

        error.mail_format = 'MAIL ADDRESS format is not correct';
    }

    //パスワードケタ数チェック
    error.pw_length = '';
    if( !validator.isLength(pw, {min:6, max:12})){

        error.pw_length = 'password should be within 6-12 letters';
    }

    //パスワードフォーマットチェック
    error.pw_format = '';
    if( !validator.isAlphanumeric(pw) ){

        error.pw_format = 'password should only contains alphabetical or numeric characters';
    }

    if( !validator.isEmpty(error.mail_format) ||
        !validator.isEmpty(error.pw_length)   ||
        !validator.isEmpty(error.pw_format)) {

        res.render('registry', error);

    }else{

        res.redirect('confirm');
    }
});



module.exports = router;