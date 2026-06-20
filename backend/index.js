require('dotenv').config()

const express = require('express')
const cors = require('cors')
const pool = require('./config/db')
const authRoutes = require('./routes/auth.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
const candidateRoutes = require('./routes/candidate.routes')
const templateRoutes = require("./routes/Template.routes");
const settingsRoutes = require('./routes/settings.routes')
const searchRoutes = require('./routes/search.routes')
const helpRoutes = require('./routes/help.routes')


const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'HrLetterPlus backend is running',
    health: 'ok'
  })
})

app.get('/health', (req, res) => {
  res.status(200).json({ health: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/candidates', candidateRoutes)
app.use("/api/templates", templateRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/help', helpRoutes)
const offerRoutes = require('./routes/offer.routes')
app.use('/api/offers', offerRoutes)

const ensureSettingsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      settings_json JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.log('❌ Database connection failed:', err.message)
  } else {
    console.log('✅ Database connected at:', result.rows[0].now)
  }
})

ensureSettingsTable().catch((error) => {
  console.log('❌ Settings table initialization failed:', error.message)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})