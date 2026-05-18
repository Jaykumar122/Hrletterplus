const pool = require('../config/db')

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(CASE WHEN status = 'Draft' THEN 1 END) AS drafts,
        COUNT(CASE WHEN status = 'Sent' THEN 1 END) AS sent,
        COUNT(CASE WHEN status = 'Accepted' THEN 1 END) AS accepted,
        COUNT(CASE WHEN status = 'Rejected' THEN 1 END) AS rejected,
        COUNT(*) AS total
      FROM offers
    `)

    res.json({
      drafts: parseInt(stats.rows[0].drafts) || 0,
      sent: parseInt(stats.rows[0].sent) || 0,
      accepted: parseInt(stats.rows[0].accepted) || 0,
      rejected: parseInt(stats.rows[0].rejected) || 0,
      total: parseInt(stats.rows[0].total) || 0,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get recent activity
const getRecentActivity = async (req, res) => {
  try {
    const activity = await pool.query(`
      SELECT 
        osl.id,
        osl.from_status,
        osl.to_status,
        osl.changed_at,
        osl.remark,
        c.full_name AS candidate_name,
        u.name AS changed_by
      FROM offer_status_log osl
      LEFT JOIN offers o ON osl.offer_id = o.id
      LEFT JOIN candidates c ON o.candidate_id = c.id
      LEFT JOIN users u ON osl.changed_by = u.id
      ORDER BY osl.changed_at DESC
      LIMIT 10
    `)

    res.json(activity.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get offers chart data
const getOffersChart = async (req, res) => {
  try {
    const { range = '3months' } = req.query

    let days = 90
    if (range === '30days') days = 30
    if (range === '7days') days = 7

    const result = await pool.query(`
      SELECT 
        DATE(created_at) AS date,
        COUNT(CASE WHEN status = 'Draft' THEN 1 END) AS draft,
        COUNT(CASE WHEN status = 'Sent' THEN 1 END) AS sent,
        COUNT(CASE WHEN status = 'Accepted' THEN 1 END) AS accepted,
        COUNT(CASE WHEN status = 'Rejected' THEN 1 END) AS rejected,
        COUNT(*) AS total
      FROM offers
      WHERE created_at >= NOW() - INTERVAL '1 day' * $1
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [days])

    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getDashboardStats, getRecentActivity, getOffersChart }