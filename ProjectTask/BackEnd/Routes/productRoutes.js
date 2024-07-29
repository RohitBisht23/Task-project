const express = require('express');
const router = express.Router();
const { getAllTransaction, getStatsStatus, getPieChartData, getBarChartData, getCombinedData } = require("../Controllers/productController");


router.get('/allTransaction',getAllTransaction)

router.get('/statistics', getStatsStatus)

router.get('/getPieChartData', getPieChartData)

router.get('/getBarChartData', getBarChartData)

router.get('/getCombinedData', getCombinedData)

module.exports = router;