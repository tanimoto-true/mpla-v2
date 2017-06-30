const url = require('url');
const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {

    //DBアクセス情報
    db_config : {
        host: params.hostname,
        database: params.pathname.split('/')[1],
        user: auth[0],
        password: auth[1],
        port: params.port,
        ssl: true,
        max: 1, //set max pool size to 1
        min: 0, //set min pool size to 0
        idleTimeoutMillis: 1000 //close idle clients after 1 second
    }
};

module.exports = config;