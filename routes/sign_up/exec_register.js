const router = require('express').Router();
const sign_up_funcs = require('./sign_up_funcs');

router.post('/', function (req, res){

    let input = {
            user        : req.body.user,
            email       : req.body.email,
            password    : req.body.pw
        };

    // 入力チェック
    (async function(input){

        // 入力されたユーザー情報をチェックしてエラーメッセージを返す
        let error = await sign_up_funcs.promise_check_input(input.user, input.email, input.pw);

        // エラーメッセージが存在する場合
        if (sign_up_funcs.is_error_exist(error) === true) {

            // ユーザー情報入力画面にエラーを出力
            res.render('sign_up/input', {error: error, input: input, user_id: req.session.user_id});

        // 入力エラーが存在しない場合
        } else {

            const user_sql = require('../../model/user');

            // ユーザー情報を登録する
            const ret = await user_sql.insert_user_info(input.user, input.email, sign_up_funcs.hash_password(input.password));

            //処理結果が一件のみだった場合
            if (ret.rowCount === 1) {

                //セッションにloginステータスをセットする
                req.session.login = 'yes';

                req.session.user_id = input.user;

                //登録完了のメッセージを送信
                res.render('sign_up/register_fin', {user_id: input.user});

            } else {

                //重複するデータが存在したことを表示
                res.send('Error : Please input your info from the beginning!!');
            }
        }

    })(input);
});


module.exports = router;