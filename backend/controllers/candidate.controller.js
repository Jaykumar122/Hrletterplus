const pool = require('../config/db')

const getCandidates = async (req, res) => {
  try {
    const { search, department } = req.query
    let query = `
      SELECT c.*, 
        COUNT(o.id) as total_offers
      FROM candidates c
      LEFT JOIN offers o ON o.candidate_id = c.id
      WHERE 1=1
    `
    const params = []

    if (search) {
      params.push(`%${search}%`)
      query += ` AND (c.full_name ILIKE $${params.length} 
        OR c.email ILIKE $${params.length} 
        OR c.designation ILIKE $${params.length})`
    }

    if (department) {
      params.push(department)
      query += ` AND c.department = $${params.length}`
    }

    query += ` GROUP BY c.id ORDER BY c.created_at DESC`

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const createCandidate = async (req, res) => {
  try {
    const { full_name, email, phone, designation, department, source } = req.body

    if (!full_name || !email) {
      return res.status(400).json({ message: 'Name and email are required' })
    }

    const existing = await pool.query(
      'SELECT id FROM candidates WHERE email = $1', [email]
    )
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const result = await pool.query(
      `INSERT INTO candidates (full_name, email, phone, designation, department, source)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [full_name, email, phone, designation, department, source]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, email, phone, designation, department, source } = req.body

    const result = await pool.query(
      `UPDATE candidates 
       SET full_name=$1, email=$2, phone=$3, designation=$4, department=$5, source=$6
       WHERE id=$7 RETURNING *`,
      [full_name, email, phone, designation, department, source, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Candidate not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM candidates WHERE id=$1', [id])
    res.json({ message: 'Candidate deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getCandidates, createCandidate, updateCandidate, deleteCandidate }