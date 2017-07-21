const SHA256 = require("crypto-js/sha256");

/**************************************************************************************
 *
 * パスワードのハッシュ化を行う
 *
 * 引数
 *   email : メールアドレス
 *   pass  : パスワード
 *
 * 戻り値 : boolean
 *   true : ログイン成功  false : ログイン失敗
 *
 * 作成日 2017/7/20 H.Tanimoto
 *
 **************************************************************************************/
module.exports.login = function( email, password ){

    return new Promise((resolve, reject) => {

        const user_sql = require('../../model/user');

        user_sql.search_user_for_login(email, password).then((ret) => {

            // 検索結果が1件だった場合
            if( ret.rows.length === 1 ){

                // ユーザーIDを次の処理に渡す
                resolve(ret.rows[0].user_id);

            // 検索結果が0件だった場合
            }else{

                // から文字を次の処理に渡す
                resolve('');
            }
        });
    });
};
