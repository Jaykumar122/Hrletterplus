const pool = require('../config/db')

// Get all offers
const getOffers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.*,
        c.full_name AS candidate_name,
        c.email AS candidate_email,
        c.designation AS candidate_designation,
        c.department AS candidate_department,
        t.name AS template_name
      FROM offers o
      LEFT JOIN candidates c ON o.candidate_id = c.id
      LEFT JOIN templates t ON o.template_id = t.id
      ORDER BY o.created_at DESC
    `)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get offer by id
const getOfferById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
      SELECT 
        o.*,
        c.full_name AS candidate_name,
        c.email AS candidate_email,
        c.phone AS candidate_phone,
        c.designation AS candidate_designation,
        c.department AS candidate_department,
        t.name AS template_name,
        t.body_html AS template_body
      FROM offers o
      LEFT JOIN candidates c ON o.candidate_id = c.id
      LEFT JOIN templates t ON o.template_id = t.id
      WHERE o.id = $1
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Offer not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Create offer
const createOffer = async (req, res) => {
  try {
    const { candidate_id, template_id, salary, joining_date } = req.body

    if (!candidate_id || !template_id || !salary || !joining_date) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Validate salary
    if (salary <= 0) {
      return res.status(400).json({ message: 'Salary must be positive' })
    }

    // Validate joining date must be future
    const jDate = new Date(joining_date)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (jDate < tomorrow) {
      return res.status(400).json({ message: 'Joining date must be a future date' })
    }

    // Get template and candidate
    const templateResult = await pool.query(
      'SELECT * FROM templates WHERE id=$1', [template_id]
    )
    const candidateResult = await pool.query(
      'SELECT * FROM candidates WHERE id=$1', [candidate_id]
    )

    if (templateResult.rows.length === 0) {
      return res.status(404).json({ message: 'Template not found' })
    }
    if (candidateResult.rows.length === 0) {
      return res.status(404).json({ message: 'Candidate not found' })
    }

    const template = templateResult.rows[0]
    const candidate = candidateResult.rows[0]

    // Substitute placeholders
    let generated_html = template.body_html
    generated_html = generated_html.replace(/\{\{name\}\}/g, candidate.full_name)
generated_html = generated_html.replace(/\{\{designation\}\}/g, candidate.designation || '')
generated_html = generated_html.replace(/\{\{doj\}\}/g, new Date(joining_date).toLocaleDateString('en-IN'))
generated_html = generated_html.replace(/\{\{department\}\}/g, candidate.department || '')
generated_html = generated_html.replace(/\{\{email\}\}/g, candidate.email || '')
generated_html = generated_html.replace(/\{\{phone\}\}/g, candidate.phone || '')
generated_html = generated_html.replace(/\{\{company\}\}/g, 'HrLetterPlus')

    // Create offer
    const result = await pool.query(`
      INSERT INTO offers (candidate_id, template_id, salary, joining_date, generated_html, status, current_version)
      VALUES ($1, $2, $3, $4, $5, 'Draft', 1) RETURNING *
    `, [candidate_id, template_id, salary, joining_date, generated_html])

    const offer = result.rows[0]

    // Log status
    await pool.query(`
      INSERT INTO offer_status_log (offer_id, from_status, to_status, changed_by, remark)
      VALUES ($1, 'Draft', 'Draft', $2, 'Offer created')
    `, [offer.id, req.user.id])

    // Save version
    await pool.query(`
      INSERT INTO offer_versions (offer_id, version, html_snapshot, edited_by, change_note)
      VALUES ($1, 1, $2, $3, 'Initial version')
    `, [offer.id, generated_html, req.user.id])

    res.status(201).json(offer)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Update offer
const updateOffer = async (req, res) => {
  try {
    const { id } = req.params
    const { generated_html, salary, joining_date, change_note } = req.body

    // Check if accepted - cannot edit
    const existing = await pool.query(
      'SELECT * FROM offers WHERE id=$1', [id]
    )
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Offer not found' })
    }
    if (existing.rows[0].status === 'Accepted') {
      return res.status(400).json({ message: 'Accepted offers cannot be edited' })
    }

    const newVersion = existing.rows[0].current_version + 1

    // Update offer
    const result = await pool.query(`
      UPDATE offers 
      SET generated_html=$1, salary=$2, joining_date=$3, current_version=$4
      WHERE id=$5 RETURNING *
    `, [generated_html, salary, joining_date, newVersion, id])

    // Save version history
    await pool.query(`
      INSERT INTO offer_versions (offer_id, version, html_snapshot, edited_by, change_note)
      VALUES ($1, $2, $3, $4, $5)
    `, [id, newVersion, generated_html, req.user.id, change_note || 'Updated offer'])

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get offer history
const getOfferHistory = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
      SELECT 
        ov.*,
        u.name AS edited_by_name
      FROM offer_versions ov
      LEFT JOIN users u ON ov.edited_by = u.id
      WHERE ov.offer_id = $1
      ORDER BY ov.version DESC
    `, [id])
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Update offer status
const updateOfferStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, remark } = req.body

    const existing = await pool.query(
      'SELECT * FROM offers WHERE id=$1', [id]
    )
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Offer not found' })
    }

    const currentStatus = existing.rows[0].status

    // Validate status transition
    const validTransitions = {
  'Draft': ['Sent'],
  'Sent': ['Accepted', 'Rejected'],
  'Accepted': [],
  'Rejected': []
}

    if (!validTransitions[currentStatus]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${currentStatus} to ${status}`
      })
    }

    // Update status
    await pool.query(
      'UPDATE offers SET status=$1 WHERE id=$2', [status, id]
    )

    // Log status change
    await pool.query(`
      INSERT INTO offer_status_log (offer_id, from_status, to_status, changed_by, remark)
      VALUES ($1, $2, $3, $4, $5)
    `, [id, currentStatus, status, req.user.id, remark || ''])

    res.json({ message: 'Status updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  getOfferHistory,
  updateOfferStatus
}