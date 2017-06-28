const express = require('express');
const router  = express.Router();
const validator = require('validator');

/* Get registry page */
router.get('/', function (req, res, next){

    res.render('registry/registry');
});

router.post('/', function (req, res, next){

    let user  = req.body.user,
        pw    = req.body.pw,
        error = {
            mail_err: "",
            pw_length: "",
            pw_format: ""
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
        if( !validator.isLength(pw, {min:6, max:12})){

            error.pw_length = 'Password should be within 6-12 letters';
        }

        //パスワードフォーマットチェック
        if( !validator.isAlphanumeric(pw) ){

            error.pw_format = 'Password should only contains alphabetical or numeric characters';
        }
    }


    if( !validator.isEmpty(error.mail_err)  ||
        !validator.isEmpty(error.pw_length) ||
        !validator.isEmpty(error.pw_format)) {

        res.render('registry/registry', error);

    }else{

        req.session.user = req.body.user;
        req.session.pw   = req.body.pw;

        res.redirect('/registry/confirm');
    }
});



module.exports = router;