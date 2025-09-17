const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

router.get('/rincian-pelaporan-excel', exportController.rincianPelaporan);
router.get('/rincian-pelaporan-excel-helpdesk', exportController.rincianPelaporanExcelHelpdesk);
router.get('/rincian-pelaporan-excel-implementator', exportController.rincianPelaporanExcelImplementator);

module.exports = router;
