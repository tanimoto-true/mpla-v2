const express = require('express');
const config = require('../conf/config');
const pool = require('pg-pool')(config.db_config);

/**************************************************************************************
 *
 * SQLを実行する
 *
 * 引数
 *   sql : 実行するクエリ
 *
 * 戻り値 : sql実行結果
 *
 * 作成日 2017/7/19 H.Tanimoto
 *
 **************************************************************************************/
module.exports.exec_sql = (sql) => {

    //クエリをログに出力する
    console.log('query:', sql);

    return pool.query(sql);
};