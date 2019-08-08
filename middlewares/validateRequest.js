const request = require('request');
const parameters = require('../config/parameters');

module.exports = function(req, res, next) {
    var token = req.headers['authorization'];

    if (token) {
        try {
          var urlSplit = req.url.split("/");
          //console.log("Split3: "+urlSplit[3]);
          urlSplit[3] = urlSplit[3].includes("?") ? urlSplit[3].split("?")[0] : urlSplit[3];

          var key = 'can_'+req.method.toLowerCase()+'_'+urlSplit[3];
          //console.log("req. key: "+key);
          const options = {
            method: 'POST',
            uri:  parameters.userMgtUrl + 'api/permission/validate',
            form: {permissionKey: key},
            json: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
              var sess = req.session;
              sess.currentUser = body.id;
              sess.role = body.roleName;
              sess.cooperativeId = body.cooperativeId;
              //console.log(JSON.stringify(body));
              next();
            } else if (error) {
                if (error.code == 'ECONNREFUSED') {
                  res.status(500).json("Unable to connect to authentication server");
                } else {
                  res.status(400).json(error);
                }
            } else {
                res.status(response.statusCode).json(body);
            }
        }

        request(options, callback);
      } catch (err) {
          res.status(500);
          res.json({
            "status": 500,
            "message": "Oops something went wrong",
            "error": err
          });
      }
    } else {
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid Token"
        });
        return;
    }
};
