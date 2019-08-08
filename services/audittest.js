const amqp = require('amqplib');
const settings = require('../config/parameters');

var test = {    
    sendAuditQueue: function(req, res) {                                  
        var auditObject = req.body;
        auditObject.ipAddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
        
        var queueName = settings.rabbitParams.queueName;
        var rabbitConn = amqp.connect(settings.rabbitParams);
        rabbitConn.then( (conn) => {
            console.log("Creating a channel");
            return conn.createChannel() })
        .then((ch) => {
            ch.assertQueue(queueName);
            console.log("sending to queue");
            return ch.sendToQueue(queueName, new Buffer(JSON.stringify(auditObject)));
        }).then((ch) => {
            res.json("Audit log submitted successfully");            
        }).catch((err) => {
            console.warn("There is a problem: "+JSON.stringify(err));            
        });               
    },

    sendNotification: function(req, res) {                        
        res.json({"title": "This is just the beginning"});         
    }
}

module.exports = test;