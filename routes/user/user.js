var express = require('express');
var router  = express.Router();

/* GET home page. */
router.get('/', function (req, res, next){

    //ログインしている場合
    if( req.session.login === 'yes' ){

        res.render('user/user', {"id": req.session.user});

    //ログインしていない場合
    }else{

        res.redirect('login');
    }
});

module.exports = router;
