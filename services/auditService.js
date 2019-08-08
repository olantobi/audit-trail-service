// const request = require('request');
const elasticsearch = require('elasticsearch');
const parameters = require('../config/parameters');

class AuditService {
    constructor(auditDto) {
        this.auditDto = auditDto;
    }

    async saveAudit() {
        const elasticClient = new elasticsearch.Client({
            hosts: [parameters.elasticsearch.host]
        });

        console.log("Host: ", parameters.elasticsearch.host );
        console.log("Index: ", parameters.elasticsearch.indexName );

        try {
            const addResp = await elasticClient.index({
                index: parameters.elasticsearch.indexName,
                type: 'log',
                body: this.auditDto
            });
            console.log("Response: ", addResp);

        } catch (exception) {
            console.log("Exception: ", exception);
        }
    }
}

module.exports = AuditService;

// module.exports = function(ipAddress, token, section, action, details) {
//      var moduleName = "Cooperative";

//       const options = {
//         method: 'POST',
//         uri: parameters.auditUrl,
//         form: {moduleName: moduleName, sectionName: section, actionName: action, details: details, sourceIp: ipAddress},
//         json: true,
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': token
//         }
//     }

//     function callback(error, response, body) {
//       if (!error && response.statusCode == 200) {
//           console.log("Audit log posted successfully");
//       } else if (error) {
//           console.log("Error in posting Audit log: "+error);
//       } else {
//           console.log("Audit log posted successfully");
//       }
//     }

//     request(options, callback);
// };
