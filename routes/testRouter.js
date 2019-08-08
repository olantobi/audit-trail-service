var express = require('express');
var router = express.Router();

var test = require('../services/audittest');

// router.post('/', test.sendEmail);
// router.post('/template', test.sendEmailTemplate);
router.post('/queue', test.sendAuditQueue);

module.exports = router;