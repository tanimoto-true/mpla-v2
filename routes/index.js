const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){

  if(req.session.login === 'yes'){

      res.render('index', { user: req.session.user });

  }else{

      res.render('index');
  }

});

module.exports = router;
