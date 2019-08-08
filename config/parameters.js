const fs = require('fs');

var configFile = 'config.json';
module.exports = JSON.parse(fs.readFileSync(configFile));
