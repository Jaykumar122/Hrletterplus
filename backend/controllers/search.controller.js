const pool = require('../config/db')

const searchApp = async (req, res) => {
  try {
    const query = String(req.query.q || '').trim()

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' })
    }

    const pattern = `%${query}%`

    const [candidates, offers, templates, users] = await Promise.all([
      pool.query(
        `SELECT id, full_name, email, phone, designation, department, source
         FROM candidates
         WHERE full_name ILIKE $1
            OR email ILIKE $1
            OR phone ILIKE $1
            OR designation ILIKE $1
            OR department ILIKE $1
            OR source ILIKE $1
         ORDER BY full_name ASC
         LIMIT 10`,
        [pattern]
      ),
      pool.query(
        `SELECT o.id, c.full_name AS candidate_name, c.email AS candidate_email, o.status, t.name AS template_name, o.created_at
         FROM offers o
         LEFT JOIN candidates c ON o.candidate_id = c.id
         LEFT JOIN templates t ON o.template_id = t.id
         WHERE c.full_name ILIKE $1
            OR c.email ILIKE $1
            OR t.name ILIKE $1
            OR o.status ILIKE $1
         ORDER BY created_at DESC
         LIMIT 10`,
        [pattern]
      ),
      pool.query(
        `SELECT id, name, version, created_at
         FROM templates
         WHERE name ILIKE $1
         ORDER BY created_at DESC
         LIMIT 10`,
        [pattern]
      ),
      pool.query(
        `SELECT id, name, email, role
         FROM users
         WHERE name ILIKE $1 OR email ILIKE $1 OR role ILIKE $1
         ORDER BY name ASC
         LIMIT 10`,
        [pattern]
      ),
    ])

    return res.json({
      query,
      results: {
        candidates: candidates.rows,
        offers: offers.rows,
        templates: templates.rows,
        users: users.rows,
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { searchApp }