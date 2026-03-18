const express = require('express')
const router = express.Router()
const { getLogs, addLog } = require('../controllers/logController')
const { authenticateToken } = require('../controllers/authController')

router.get('/', authenticateToken, getLogs)
router.post('/', authenticateToken, addLog)

module.exports = router
