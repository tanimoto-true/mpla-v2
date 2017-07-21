const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', function (req, res, next){

    //ログインしている場合
    if( req.session.login === 'yes' ){

        res.render('user/user', { user_id: req.session.user_id });

    //ログインしていない場合
    }else{

        res.redirect('login');
    }
});

module.exports = router;
