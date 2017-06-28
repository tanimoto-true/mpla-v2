let express = require('express');

const helmet = require('helmet');
let app = express().use(helmet());
app.use(helmet());

let router = express.Router();

router.get('/', function(req, res, next) {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;