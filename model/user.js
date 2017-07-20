const common = require('../common/common_func');

/**************************************************************************************
 *
 * メールアドレスが登録されているか確認する
 *
 * 引数
 *   email : メールアドレス
 *
 * 戻り値 : クエリ実行結果
 *
 * 作成日 2017/7/20 H.Tanimoto
 *
 **************************************************************************************/
module.exports.is_exist_email = function( email ) {

    //クエリを定義
    let query = `select count(1) 
                 from "user" 
                 where email='${email}';`;

    return common.exec_sql(query);
};


/**************************************************************************************
 *
 * ユーザー情報を登録する
 *
 * 引数
 *   user     : ユーザーID
 *   email    : メールアドレス
 *   password : パスワード
 *
 * 戻り値 : クエリ実行結果
 *
 * 作成日 2017/7/20 H.Tanimoto
 *
 **************************************************************************************/
module.exports.insert_user_info = function( user, email, password ) {

    //クエリを定義
    let query = `insert into "user" 
                     (
                         user_id,
                         email,
                         password
                     )
                     VALUES(
                         '${user}',
                         '${email}',
                         '${password}'
                     );`;

    return common.exec_sql(query);
};


//例外処理
process.on('unhandledRejection', function(error){

    console.log(error);
});

//例外処理
process.on('uncaughtException', function(error){

    console.log(error);
});
