const express = require('express');

const queueController = require('../controller/queue');

var router = express.Router();

router.post('/', queueController.dataCreate);

module.exports = router;