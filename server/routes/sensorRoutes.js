// routes/sensorRoutes.js
const express = require('express')
const router  = express.Router()
const {
  getSensors,
  getAlerts,
  getHistory,
  getStats,
  pauseAlerts,
  resumeAlerts,
  getAlertStatus
} = require('../controllers/sensorController')

const { authenticateToken } = require('../controllers/authController')

router.get('/',               getSensors)        // GET /api/sensors
router.get('/alerts',         getAlerts)         // GET /api/sensors/alerts
router.get('/history',        getHistory)        // GET /api/sensors/history?limit=100&from=&to=
router.get('/stats',          getStats)          // GET /api/sensors/stats

router.get('/alerts/status',  getAlertStatus)    // GET  /api/sensors/alerts/status
router.post('/alerts/pause',  pauseAlerts)       // POST /api/sensors/alerts/pause
router.post('/alerts/resume', resumeAlerts)      // POST /api/sensors/alerts/resume

module.exports = router