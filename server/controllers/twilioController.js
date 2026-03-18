// controllers/twilioController.js
const twilio = require('twilio')

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'
const TO   = process.env.ALERT_WHATSAPP_TO   || 'whatsapp:+919025958422'

// ── Cooldown: prevent spamming same alert ────────────────────────
const sentAlerts = new Map() // type -> last sent timestamp
const COOLDOWN_MS = 5 * 60 * 1000 // 5 minutes per alert type

function isOnCooldown(type) {
  const last = sentAlerts.get(type)
  if (!last) return false
  return Date.now() - last < COOLDOWN_MS
}

function markSent(type) {
  sentAlerts.set(type, Date.now())
}

// ── Send WhatsApp alert ──────────────────────────────────────────
async function sendWhatsAppAlert(req, res) {
  const { type, message, severity } = req.body

  if (!type || !message) {
    return res.status(400).json({ error: 'type and message are required' })
  }

  // Block if same alert was sent recently
  if (isOnCooldown(type)) {
    const remaining = Math.ceil(
      (COOLDOWN_MS - (Date.now() - sentAlerts.get(type))) / 1000 / 60
    )
    return res.status(429).json({
      error: `Alert "${type}" already sent. Try again in ${remaining} min.`,
      cooldown: true
    })
  }

  const severityEmoji = {
    danger:  '🚨',
    warning: '⚠️',
    info:    'ℹ️',
  }[severity] || '🔔'

  const body = `${severityEmoji} *Smart Agri Alert*\n\n*Type:* ${type}\n*Severity:* ${severity?.toUpperCase() || 'ALERT'}\n*Message:* ${message}\n\n_Sent at ${new Date().toLocaleString()}_`

  try {
    const msg = await client.messages.create({
      from: FROM,
      to:   TO,
      body,
    })

    markSent(type)
    console.log(`[Twilio] WhatsApp alert sent: ${msg.sid} | type=${type}`)

    return res.status(200).json({
      success: true,
      sid: msg.sid,
      message: 'WhatsApp alert sent successfully',
    })
  } catch (err) {
    console.error('[Twilio] Failed to send WhatsApp alert:', err.message)
    return res.status(500).json({
      error: 'Failed to send WhatsApp alert',
      details: err.message,
    })
  }
}

module.exports = { sendWhatsAppAlert }