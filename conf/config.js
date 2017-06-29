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
        max: 3, //set pool max size to 3
        min: 1, //set min pool size to 1
        idleTimeoutMillis: 1000 //close idle clients after 1 second
    }
};

module.exports = config;