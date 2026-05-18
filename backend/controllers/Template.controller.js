// backend/controllers/template.controller.js
const pool = require("../config/db");

// ─── Helper: extract {{placeholders}} from body_html ─────────────────────────
function extractPlaceholders(bodyHtml) {
  const matches = [...bodyHtml.matchAll(/\{\{(\w+)\}\}/g)];
  return [...new Set(matches.map((m) => `{{${m[1]}}}` ))];
}

// ─── Helper: safely parse placeholders_json from DB ──────────────────────────
function parsePlaceholders(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
}

// ─── POST /api/templates ─────────────────────────────────────────────────────
const createTemplate = async (req, res) => {
  try {
    const { name, body_html, placeholders_json } = req.body;
    const created_by = req.user?.id ?? 1;

    if (!name || !name.trim())
      return res.status(400).json({ message: "Template name is required." });
    if (!body_html || !body_html.trim())
      return res.status(400).json({ message: "Template body cannot be empty." });

    const detectedPlaceholders = Array.isArray(placeholders_json)
      ? placeholders_json
      : extractPlaceholders(body_html);

    // Unique name check
    const existing = await pool.query(
      "SELECT id FROM templates WHERE name = $1 AND is_active = true",
      [name.trim()]
    );
    if (existing.rows.length > 0)
      return res.status(409).json({ message: "A template with this name already exists." });

    const result = await pool.query(
      `INSERT INTO templates
         (name, body_html, placeholders_json, version, created_by, is_active, created_at)
       VALUES ($1, $2, $3::jsonb, 1, $4, true, NOW())
       RETURNING *`,
      [name.trim(), body_html, JSON.stringify(detectedPlaceholders), created_by]
    );

    const row = result.rows[0];
    return res.status(201).json({
      ...row,
      placeholders_json: parsePlaceholders(row.placeholders_json),
    });
  } catch (err) {
    console.error("createTemplate ERROR:", err);
    return res.status(500).json({ message: err.message || "Internal server error." });
  }
};

// ─── GET /api/templates ──────────────────────────────────────────────────────
const getTemplates = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.name AS created_by_name
       FROM templates t
       LEFT JOIN users u ON u.id = t.created_by
       WHERE t.is_active = true
       ORDER BY t.created_at DESC`
    );

    const templates = result.rows.map((row) => ({
      ...row,
      placeholders_json: parsePlaceholders(row.placeholders_json),
    }));

    return res.json(templates);
  } catch (err) {
    console.error("getTemplates ERROR:", err);
    return res.status(500).json({ message: err.message || "Internal server error." });
  }
};

// ─── GET /api/templates/:id ──────────────────────────────────────────────────
const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM templates WHERE id = $1 AND is_active = true",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Template not found." });

    const row = result.rows[0];
    return res.json({
      ...row,
      placeholders_json: parsePlaceholders(row.placeholders_json),
    });
  } catch (err) {
    console.error("getTemplateById ERROR:", err);
    return res.status(500).json({ message: err.message || "Internal server error." });
  }
};

// ─── PUT /api/templates/:id ──────────────────────────────────────────────────
const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, body_html, placeholders_json } = req.body;

    if (!name || !name.trim())
      return res.status(400).json({ message: "Template name is required." });
    if (!body_html || !body_html.trim())
      return res.status(400).json({ message: "Template body cannot be empty." });

    const detectedPlaceholders = Array.isArray(placeholders_json)
      ? placeholders_json
      : extractPlaceholders(body_html);

    const existing = await pool.query(
      "SELECT * FROM templates WHERE id = $1 AND is_active = true",
      [id]
    );
    if (existing.rows.length === 0)
      return res.status(404).json({ message: "Template not found." });

    const nameConflict = await pool.query(
      "SELECT id FROM templates WHERE name = $1 AND is_active = true AND id != $2",
      [name.trim(), id]
    );
    if (nameConflict.rows.length > 0)
      return res.status(409).json({ message: "Another template with this name already exists." });

    const newVersion = (existing.rows[0].version ?? 1) + 1;

    const result = await pool.query(
      `UPDATE templates
       SET name = $1, body_html = $2, placeholders_json = $3::jsonb,
           version = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [name.trim(), body_html, JSON.stringify(detectedPlaceholders), newVersion, id]
    );

    const row = result.rows[0];
    return res.json({
      ...row,
      placeholders_json: parsePlaceholders(row.placeholders_json),
    });
  } catch (err) {
    console.error("updateTemplate ERROR:", err);
    return res.status(500).json({ message: err.message || "Internal server error." });
  }
};

// ─── DELETE /api/templates/:id (soft delete) ─────────────────────────────────
const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE templates SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Template not found." });

    return res.json({ message: "Template deleted successfully.", id });
  } catch (err) {
    console.error("deleteTemplate ERROR:", err);
    return res.status(500).json({ message: err.message || "Internal server error." });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
};