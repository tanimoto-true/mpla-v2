const express = require('express');
const helmet = require('helmet');
const validator = require('validator');
let app = express().use(helmet());
app.use(helmet());

const SHA256 = require("crypto-js/sha256");

/**************************************************************************************
 *
 * パスワードのハッシュ化を行う
 *
 * 引数
 *   pass : パスワード
 *
 * 戻り値 : パスワードをハッシュ化したもの
 *
 * 作成日 2017/6/29 H.Tanimoto
 *
 **************************************************************************************/
module.exports.hash_password = function(pass){

    for( let i = 0; i < 1000; i++ ){

        pass = SHA256(pass);
    }

    return pass;
};


/**************************************************************************************
 *
 * 入力値のチェックを行う
 *
 * 引数
 *   pass : パスワード
 *
 * 戻り値 : エラーメッセージ
 *
 * 作成日 2017/7/20 H.Tanimoto
 *
 **************************************************************************************/
module.exports.promise_check_input = async function(user, email, password){

        let error = {
            user: '',
            email: '',
            pw: '',
        };

        if (user === "") {

            error.user = "ユーザーIDを入力してください。";

        } else {

            //UserIDフォーマットチェック
            if (/^[\x21-\x7e]{6,128}$/g.exec(user) === null) {

                error.user = 'ユーザーIDは6桁〜128桁の英数字で入力してください。';
            }
        }

        await (async function (email) {

            if (email === "") {

                error.email = "メールアドレスを入力してください。";

            //メールフォーマットチェック
            } else if(/^[^@]+@[^@]+\.[a-z]{2,}$/g.exec(email) === null) {

                error.email = 'メールアドレスを正しい形式で入力してください。';

            //メールアドレスの重複チェック
            } else {

                const sign_up_funcs = require('./sign_up_funcs');

                // メールアドレスの登録件数を取得する。
                const result = await sign_up_funcs.ret_registered_email_count(email);

                //登録されているメールアドレスが0件出なかった場合
                if (result !== '0') {

                    error.email = 'すでに使用されているメールアドレスです。';
                }
            }
        })(email);

        if (password === "") {

            error.pw = "パスワードを入力してください。";

        } else {

            //パスワードフォーマットチェック
            if (/^[\x21-\x7e]{6,128}$/g.exec(password) === null) {

                error.pw = 'パスワードは6桁〜128桁の英数字で入力してください。';
            }
        }

        return error;
};


/**************************************************************************************
 *
 * 入力エラーが存在するか確認する
 *
 * 引数
 *   error : エラーメッセージを格納するオブジェクト
 *
 * 戻り値 : boolean
 *   true : エラーが存在する  false : エラーが存在しない
 *
 * 作成日 2017/7/20 H.Tanimoto
 *
 **************************************************************************************/
module.exports.is_error_exist = function(error) {

    for( let key in error ){

        //エラーが存在する場合
        if( error[key] !== "" ){

            return true;
        }
    }

    return false;
};


/**************************************************************************************
 *
 * メールアドレスの登録件数を返す
 *
 * 引数
 *   email : メールアドレス
 *
 * 戻り値 : 検索結果の件数
 *
 * 作成日 2017/7/20 H.Tanimoto
 *
 **************************************************************************************/
module.exports.ret_registered_email_count = async function(email) {

    const user_sql = require('../../model/user');

    // メールアドレスの重複チェック
    const result = await user_sql.is_exist_email(email);

    return result.rows[0].count;
};
