const express = require('express');
const router  = express.Router();

router.get('/', function (req, res){

    res.render('sign_up/confirm', { user: req.session.user,
                                     email: req.session.email,
                                     pw: req.session.pw
    });
});


module.exports = router;