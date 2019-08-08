var rabbit = require('amqplib');
const parameters = require('../config/parameters');
const AuditService = require('./auditService');

/* this.queueName = 'orders.q';
  this.exchangeName = 'orders.ex';
  this.exchangeType = 'direct';
  */
var queueName = parameters.rabbitParams.queueName;
var connection;
var channel;
var queueOptions = { durable: true };
//this.routingKey = '';

function initSubscriber(server) {
  return rabbit.connect(server)
    .then(registerChannel)
    //    .then(registerExchange)
    .then(registerQueue)
    //    .then(bindQueueToExchange)
    ;  // you can pass that back from the factory
}

exports.listen = function () {
  initSubscriber(parameters.rabbitParams).then(listenToMessages);
}

function registerChannel(conn) {
  console.log('registering channel');
  if (conn) {
    console.log("Connection is set and defined.");
  } else {
    console.log("Connection is not set.");
  }
  connection = conn;
  return conn.createChannel();
}

function registerQueue(ch) {
  channel = ch;
  console.log('registering queue');
  return channel.assertQueue(queueName, queueOptions);
}

function listenToMessages() {
  console.log('listening for incoming audit logs from rabbitmq');

  channel.consume(queueName, function (msg) {
    console.log("Incoming message: " + msg.content.toString());

    if (!msg) { return; }
    // do the message processing here        
    var auditDto = JSON.parse(msg.content.toString());

    if (auditDto) {
      var auditService = new AuditService(auditDto);

      auditService.saveAudit();

    }
    channel.ack(msg);
  });

  connection.on('close', function () {
    console.log('connection closed');
    console.log('trying to reconnect...');
    setTimeout(listen, 60);
    //initSubscriber().then(listenToMessages);
  });
}

