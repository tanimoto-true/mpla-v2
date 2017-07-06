var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    setTimeout(console.log('initial log'), 3000);

    console.log('second log');

    let promise = new Promise((resolve, reject) => {

        let val1 = 100;
        let val2 = 50;

        let total = val1 + val2;

        if (total === 150) {

                resolve('calc val is 150');

            }else{

                reject('calc val is not 150');
        }
    });

    promise.then((data) => {

        console.log(data);

        return 'data 2 string';
    })
        .then((data) => console.log('data2 : ' + data))
        .then(() => res.send('this is promise test!!'));

    promise.catch((error) => {
        next(new Error(error));
    });

    process.on('unhandledRejection', console.dir);

    console.log('third log');

});

module.exports = router;
