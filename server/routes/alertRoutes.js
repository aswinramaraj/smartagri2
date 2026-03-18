// routes/alertRoutes.js
const express = require('express')
const router  = express.Router()
const { sendWhatsAppAlert } = require('../controllers/twilioController')
const { authenticateToken } = require('../controllers/authController')

// POST /api/alerts/whatsapp
// Body: { type, message, severity }
// Requires JWT auth
router.post('/whatsapp', authenticateToken, sendWhatsAppAlert)

module.exports = router