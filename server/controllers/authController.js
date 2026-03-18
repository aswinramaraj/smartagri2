const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'smartagri_dev_secret'
const MOCK_USER = { username: 'farmer', password: 'password123', name: 'Smart Farmer' }

function login(req, res) {
  const { username, password } = req.body
  if (username === MOCK_USER.username && password === MOCK_USER.password) {
    const token = jwt.sign({ username, name: MOCK_USER.name }, JWT_SECRET, { expiresIn: '2h' })
    return res.json({ accessToken: token, user: { username, name: MOCK_USER.name } })
  }
  return res.status(401).json({ error: 'Invalid credentials' })
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Missing token' })

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = user
    next()
  })
}

module.exports = { login, authenticateToken }
