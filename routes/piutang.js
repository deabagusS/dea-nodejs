const express = require('express');
const controller = require('../controller/piutang');
var router = express.Router();

router.post('/', controller.getData);
router.post('/export', controller.exportData);
router.post('/change-page', controller.changeData);
router.post('/update/status-paid', controller.updateStatus);

module.exports = router;