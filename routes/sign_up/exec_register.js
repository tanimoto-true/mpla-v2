const express = require('express');
const router = express.Router();
const sign_up_funcs = require('./sign_up_funcs');

router.post('/', function (req, res, next){

    let input = {
            user        : req.body.user,
            email       : req.body.email,
            password    : req.body.pw
        },
        error = sign_up_funcs.check_input(input.user, input.email, input.password);

    // メールアドレス重複チェック処理を行う。エラーが存在する場合はpromiseを通して返す。
    sign_up_funcs.promised_check_email_duplication(input.email).then((err_msg)=> {

        //エラーメッセージが存在する場合
        if (err_msg) {

            //エラーメッセージをセットする
            error.email = err_msg;
        }

    }).then(() => {

        if(sign_up_funcs.is_error_exist(error) === false){

            const user_sql = require('../../model/user');

            // ユーザー情報を登録する
            return user_sql.insert_user_info(input.user, input.email, sign_up_funcs.hash_password(input.password));

        }else{

            return rowCount = 0;
        }

    }).then(ret => {

        //処理結果が一件のみだった場合
        if(ret.rowCount === 1) {

            //セッションにloginステータスをセットする
            req.session.login = 'yes';

            //登録完了のメッセージを送信
            res.render('sign_up/register_fin');

        }else{

            //重複するデータが存在したことを表示
            res.send('Error : Please input your info from the beginning!!');
        }

    //例外処理
    }).catch(e => {
        let err = new Error('DB connection : ' + e.message + "\n");
        err.status = 501;
        next(err);
    });
});


module.exports = router;