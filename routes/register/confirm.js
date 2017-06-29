const express = require('express');
const router  = express.Router();

router.get('/', function (req, res, next){

    res.render('register/confirm', { user: req.session.user,
                                     pw: req.session.pw
    });
});


module.exports = router;