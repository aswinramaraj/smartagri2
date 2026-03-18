const IrrigationLog = require('../models/irrigationLog')

// in-memory fallback list for fast demo
let irrigationLogs = [
  { date: new Date(Date.now() - 1000 * 60 * 60 * 4), duration: 17, waterUsed: 120 },
  { date: new Date(Date.now() - 1000 * 60 * 60 * 2), duration: 12, waterUsed: 90 }
]

async function getLogs(req, res) {
  try {
    // try DB first
    const dbLogs = await IrrigationLog.find().sort({ date: -1 }).limit(50).lean().exec()
    if (dbLogs && dbLogs.length) {
      return res.json({ logs: dbLogs })
    }
  } catch (err) {
    // ignore db failure, fallback to memory
  }

  return res.json({ logs: irrigationLogs })
}

async function addLog(req, res) {
  const { duration, waterUsed } = req.body

  const logEntry = {
    date: new Date(),
    duration: duration || Math.round(10 + Math.random() * 20),
    waterUsed: waterUsed || Math.round(70 + Math.random() * 80)
  }

  irrigationLogs.unshift(logEntry)
  if (irrigationLogs.length > 100) irrigationLogs.pop()

  // save to DB if available, but do not fail if unavailable
  try {
    const created = new IrrigationLog(logEntry)
    await created.save()
  } catch (err) {
    // ignore
  }

  res.status(201).json({ success: true, log: logEntry })
}

module.exports = { getLogs, addLog }
