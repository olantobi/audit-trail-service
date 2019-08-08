const request = require('request');
const parameters = require('./parameters');

module.exports = function(req, section, action, details) {
     var token = req.headers['authorization'];
     var moduleName = "Cooperative";
     var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      const options = {
        method: 'POST',
        uri: parameters.auditUrl,
        form: {moduleName: moduleName, sectionName: section, actionName: action, details: details, sourceIp: ipAddress},
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log("Audit log posted successfully");
      } else if (error) {
          console.log("Error in posting Audit log: "+error);
      } else {
          console.log("Audit log posted successfully");
      }
    }

    request(options, callback);
};
