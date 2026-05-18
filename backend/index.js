require('dotenv').config()

const express = require('express')
const cors = require('cors')
const pool = require('./config/db')
const authRoutes = require('./routes/auth.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
const candidateRoutes = require('./routes/candidate.routes')
const templateRoutes = require("./routes/Template.routes");


const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/candidates', candidateRoutes)
app.use("/api/templates", templateRoutes)
const offerRoutes = require('./routes/offer.routes')
app.use('/api/offers', offerRoutes)

pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.log('❌ Database connection failed:', err.message)
  } else {
    console.log('✅ Database connected at:', result.rows[0].now)
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})