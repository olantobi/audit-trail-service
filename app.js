const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const expressValidator = require('express-validator');
const session = require('express-session');
const http = require('http');
const fs = require('fs');
const swaggerSpec = require('./config/swaggerConfig');
const parameters = require('./config/parameters');
const auditQueue = require('./services/AuditQueueListener');

var app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//app.use(expressValidator());

app.use(session({
  secret: parameters.appSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

auditQueue.listen();

app.all('/*', function (req, res, next) {
  // CORS Headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Access-Token,Authorization");

  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.use('/api/v1/test', require('./routes/testRouter'));

app.use('/api/v1/audit', require('./routes/testRouter'));

// serve swagger
app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// serve swagger
app.use('/', express.static('api-docs'));


app.use(function (req, res) {
  res.status(404).json('Endpoint Not Found');
});

app.set('port', process.env.PORT || parameters.appPort);

// Start the server
var nodeServer = http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + nodeServer.address().port);
});
