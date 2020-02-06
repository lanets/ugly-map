const fs = require('fs');
const path = require('path');
const NODE_ENV = process.env.NODE_ENV;
let conf = null;

// Init config_buffer according to the NODE_ENV
switch (NODE_ENV) {
    case 'production':
        conf = fs.readFileSync(path.resolve(__dirname, 'production.json'), 'utf-8');
        break;
    default:
        conf = fs.readFileSync(path.resolve(__dirname, 'default.json'), 'utf-8');
}

let config = JSON.parse(conf);
module.exports = config;
