const express = require('express');
const helmet = require('helmet');
let app = express().use(helmet());
app.use(helmet());

const SHA256 = require("crypto-js/sha256");

module.exports.hash_password = function(pass){

    for( i = 0; i < 1000; i++ ){

        pass = SHA256(pass);
    }

    return pass;
};

