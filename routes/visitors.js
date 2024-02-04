const express = require('express');

const visitorsController = require('../controller/visitors');

var router = express.Router();

router.post('/', visitorsController.dataList);
router.post('/create', visitorsController.dataCreate);
router.put('/update', visitorsController.dataUpdate);
router.delete('/:id', visitorsController.dataDelete);
router.get('/:id', visitorsController.dataFind);

module.exports = router;