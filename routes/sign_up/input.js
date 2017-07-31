const router = require('express').Router();
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
router.post('/', async function (req, res){

    let input = {
            user  : req.body.user,
            email : req.body.email,
            pw    : req.body.pw
    };

    // 入力されたユーザー情報をチェックしてエラーメッセージを返す
    let error = await sign_up_funcs.promise_check_input(input.user, input.email, input.pw);

    // エラーメッセージが存在する場合
    if (sign_up_funcs.is_error_exist(error) === true) {

        // ユーザー情報入力画面にエラーを出力
        res.render('sign_up/input', {error: error, input: input, user_id: req.session.user_id});

    // 入力エラーが存在しない場合
    } else {

        // セッションテーブルにユーザーの入力値を保存する
        req.session.user_info = input;

        // 入力内容確認画面に遷移する
        res.render('sign_up/confirm', {input: input, user_id: req.session.user_id});
    }
});


module.exports = router;
