const express = require('express');
const helmet = require('helmet');
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

    for( i = 0; i < 1000; i++ ){

        pass = SHA256(pass);
    }

    return pass;
};

