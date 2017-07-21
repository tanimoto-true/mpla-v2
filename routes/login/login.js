let express = require('express');
const router = express.Router();

/* GET login */
router.get('/', function(req, res) {

    //ログインしている場合
    if( req.session.login === 'yes' ){

        res.redirect('/user');

    //ログインしていない場合
    }else{

        res.render('login/login', error = { email : '', password : '', fail : '' });
    }
});

/* POST login */
router.post('/', function(req, res, next) {

    //入力されたidとpwを取得
    let input = {
            email     : req.body.email,
            password  : req.body.pw
    },
        error = {
            email    : '',
            password : '',
            fail : ''
    };

    //emailもしくはpwが空の場合
    if( input.email === "" ){

        error.email = 'メールアドレスを入力してください。'
    }

    if( input.password === "") {

        error.password = 'パスワードを入力してください。'
    }

    //メールアドレスもしくはパスワードが空の場合
    if( error.email !== '' || error.password !== '' ){

        res.render('login/login', { email: input.email,  error: error });

    } else {

        const login_funcs = require('./login_funcs');

        const sign_up_funcs = require('./../sign_up/sign_up_funcs');

        login_funcs.login( input.email, sign_up_funcs.hash_password(input.password) ).then((user_id) => {

            //検索結果が一件だった場合
            if( user_id !== '' ){

                //セッションにidをセットする
                req.session.user_id = user_id;

                //セッションにloginステータスをセットする
                req.session.login = 'yes';

                //userページを表示する
                res.redirect('./user');

            }else{

                error.fail = 'ログインできませんでした。';

                //ログイン失敗のメッセージを表示する
                res.render('login/login', { email: input.email, error: error});
            }
        });
    }
});

module.exports = router;
