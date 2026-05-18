const pool = require('../config/db')

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'Draft') AS drafts,
        COUNT(*) FILTER (WHERE status = 'Sent') AS sent,
        COUNT(*) FILTER (WHERE status = 'Accepted') AS accepted,
        COUNT(*) FILTER (WHERE status = 'Rejected') AS rejected,
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

    let interval = "3 months"
    if (range === '30days') interval = "30 days"
    if (range === '7days') interval = "7 days"

    const result = await pool.query(`
      SELECT 
        DATE(created_at) AS date,
        COUNT(*) FILTER (WHERE status = 'Draft') AS draft,
        COUNT(*) FILTER (WHERE status = 'Sent') AS sent,
        COUNT(*) FILTER (WHERE status = 'Accepted') AS accepted,
        COUNT(*) FILTER (WHERE status = 'Rejected') AS rejected,
        COUNT(*) AS total
      FROM offers
      WHERE created_at >= NOW() - INTERVAL '${interval}'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `)

    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getDashboardStats, getRecentActivity, getOffersChart }