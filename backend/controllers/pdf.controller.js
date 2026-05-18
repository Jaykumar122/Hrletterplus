const htmlPdf = require('html-pdf-node')
const pool = require('../config/db')

const downloadPDF = async (req, res) => {
  try {
    const { id } = req.params
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: `Invalid offer ID: "${id}"` })
    }

    console.log('PDF requested for offer:', id)

    const result = await pool.query(`
      SELECT o.*, c.full_name AS candidate_name, c.email AS candidate_email,
        c.designation AS candidate_designation, c.department AS candidate_department,
        t.name AS template_name
      FROM offers o
      LEFT JOIN candidates c ON o.candidate_id = c.id
      LEFT JOIN templates t ON o.template_id = t.id
      WHERE o.id = $1
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Offer not found' })
    }

    const offer = result.rows[0]
    console.log('Offer found:', offer.candidate_name)

    // Escape {{ }} so Handlebars inside html-pdf-node does not crash
    const safeHtml = (offer.generated_html || '')
      .replace(/\{\{/g, '&#123;&#123;')
      .replace(/\}\}/g, '&#125;&#125;')

    const joiningDate = offer.joining_date
      ? new Date(offer.joining_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : '-'

    const todayDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

    const statusColor = {
      Accepted: '#16a34a',
      Rejected: '#dc2626',
      Sent: '#2563eb',
      Draft: '#9333ea',
    }[offer.status] || '#9333ea'

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Arial', sans-serif; background: #ffffff; color: #1a1a1a; }

  /* ── Header Banner ── */
  .header-banner {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
    padding: 36px 48px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo-area {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .logo-box {
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, #e94560, #0f3460);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: -1px;
  }
  .logo-text h1 {
    font-size: 22px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0.5px;
  }
  .logo-text p {
    font-size: 11px;
    color: rgba(255,255,255,0.6);
    margin-top: 2px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .header-right {
    text-align: right;
  }
  .header-right .ref {
    font-size: 11px;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .header-right .date {
    font-size: 13px;
    color: #ffffff;
    margin-top: 4px;
    font-weight: 600;
  }
  .status-pill {
    display: inline-block;
    margin-top: 8px;
    padding: 3px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    background: ${statusColor};
    color: #ffffff;
  }

  /* ── Accent bar ── */
  .accent-bar {
    height: 4px;
    background: linear-gradient(90deg, #e94560, #0f3460, #e94560);
  }

  /* ── Body ── */
  .body { padding: 40px 48px; }

  .offer-title {
    font-size: 22px;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 4px;
    letter-spacing: -0.5px;
  }
  .offer-subtitle {
    font-size: 13px;
    color: #666;
    margin-bottom: 32px;
  }

  /* ── Candidate Card ── */
  .candidate-card {
    background: linear-gradient(135deg, #f8faff, #f0f4ff);
    border: 1px solid #dde4f5;
    border-radius: 12px;
    padding: 24px 28px;
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .candidate-card .name {
    font-size: 20px;
    font-weight: 800;
    color: #1a1a2e;
  }
  .candidate-card .role {
    font-size: 13px;
    color: #4f6eb4;
    font-weight: 600;
    margin-top: 4px;
  }
  .candidate-card .email {
    font-size: 12px;
    color: #888;
    margin-top: 4px;
  }
  .candidate-card .dept-badge {
    background: #1a1a2e;
    color: #ffffff;
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  /* ── Info Grid ── */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }
  .info-card {
    background: #f9f9f9;
    border: 1px solid #ececec;
    border-radius: 10px;
    padding: 16px 18px;
  }
  .info-card .label {
    font-size: 10px;
    font-weight: 700;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }
  .info-card .value {
    font-size: 15px;
    font-weight: 700;
    color: #1a1a2e;
  }
  .info-card.highlight {
    background: linear-gradient(135deg, #1a1a2e, #0f3460);
    border-color: transparent;
  }
  .info-card.highlight .label { color: rgba(255,255,255,0.6); }
  .info-card.highlight .value { color: #ffffff; }

  /* ── Section ── */
  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }
  .section-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e94560, #0f3460);
    flex-shrink: 0;
  }
  .section-title {
    font-size: 13px;
    font-weight: 800;
    color: #1a1a2e;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .section-line {
    flex: 1;
    height: 1px;
    background: #ececec;
  }

  .content-box {
    background: #fafafa;
    border: 1px solid #ececec;
    border-radius: 10px;
    padding: 24px 28px;
    font-size: 13px;
    line-height: 1.9;
    color: #444;
    margin-bottom: 36px;
  }

  /* ── Signatures ── */
  .signature-row {
    display: flex;
    justify-content: space-between;
    margin-top: 48px;
    gap: 40px;
  }
  .sig-block { flex: 1; text-align: center; }
  .sig-line {
    border-top: 2px solid #1a1a2e;
    margin-bottom: 10px;
    padding-top: 0;
  }
  .sig-name { font-size: 13px; font-weight: 700; color: #1a1a2e; }
  .sig-role { font-size: 11px; color: #999; margin-top: 2px; }

  /* ── Watermark ── */
  .watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 90px;
    color: rgba(0,0,0,0.035);
    font-weight: 900;
    z-index: -1;
    pointer-events: none;
    white-space: nowrap;
    letter-spacing: 8px;
  }

  /* ── Footer ── */
  .page-footer {
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px solid #ececec;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .page-footer .left { font-size: 10px; color: #bbb; }
  .page-footer .right { font-size: 10px; color: #bbb; }
  .footer-dot { display: inline-block; width: 3px; height: 3px; border-radius: 50%; background: #ccc; margin: 0 6px; vertical-align: middle; }
</style>
</head>
<body>

${offer.status === 'Draft' ? '<div class="watermark">DRAFT</div>' : ''}

<!-- Header Banner -->
<div class="header-banner">
  <div class="logo-area">
    <div class="logo-box">H+</div>
    <div class="logo-text">
      <h1>HrLetterPlus</h1>
      <p>Human Resources Platform</p>
    </div>
  </div>
  <div class="header-right">
    <div class="ref">Offer Reference #${String(offer.id).padStart(4, '0')}</div>
    <div class="date">${todayDate}</div>
    <span class="status-pill">${offer.status}</span>
  </div>
</div>
<div class="accent-bar"></div>

<!-- Body -->
<div class="body">

  <div class="offer-title">Offer of Employment</div>
  <div class="offer-subtitle">We are pleased to extend this formal offer of employment.</div>

  <!-- Candidate Card -->
  <div class="candidate-card">
    <div>
      <div class="name">${offer.candidate_name || '-'}</div>
      <div class="role">${offer.candidate_designation || 'Candidate'}</div>
      <div class="email">${offer.candidate_email || '-'}</div>
    </div>
    <div class="dept-badge">${offer.candidate_department || 'Department'}</div>
  </div>

  <!-- Info Grid -->
  <div class="info-grid">
    <div class="info-card highlight">
      <div class="label">Annual Salary</div>
      <div class="value">Rs.${Number(offer.salary).toLocaleString('en-IN')}</div>
    </div>
    <div class="info-card">
      <div class="label">Joining Date</div>
      <div class="value">${joiningDate}</div>
    </div>
    <div class="info-card">
      <div class="label">Template</div>
      <div class="value">${offer.template_name || '-'}</div>
    </div>
  </div>

  <!-- Offer Content -->
  <div class="section-header">
    <div class="section-dot"></div>
    <div class="section-title">Offer Letter</div>
    <div class="section-line"></div>
  </div>
  <div class="content-box">
    ${safeHtml || '<p style="color:#aaa;font-style:italic;">No content generated yet.</p>'}
  </div>

  <!-- Signatures -->
  <div class="section-header">
    <div class="section-dot"></div>
    <div class="section-title">Signatures</div>
    <div class="section-line"></div>
  </div>
  <div class="signature-row">
    <div class="sig-block">
      <div style="height:50px;"></div>
      <div class="sig-line"></div>
      <div class="sig-name">HR Manager</div>
      <div class="sig-role">HrLetterPlus</div>
    </div>
    <div class="sig-block">
      <div style="height:50px;"></div>
      <div class="sig-line"></div>
      <div class="sig-name">${offer.candidate_name || 'Candidate'}</div>
      <div class="sig-role">Candidate Signature</div>
    </div>
  </div>

  <!-- Page Footer -->
  <div class="page-footer">
    <div class="left">Generated by HrLetterPlus<span class="footer-dot"></span>Version ${offer.current_version}<span class="footer-dot"></span>Confidential</div>
    <div class="right">${todayDate}</div>
  </div>

</div>
</body>
</html>`

    console.log('Generating PDF...')
    const pdfBuffer = await htmlPdf.generatePdf({ content: htmlContent }, {
      format: 'A4',
      margin: { top: '0mm', right: '0mm', bottom: '10mm', left: '0mm' },
      printBackground: true,
    })
    console.log('PDF generated! Size:', pdfBuffer.length)

    const filename = `offer-${(offer.candidate_name || 'offer').replace(/\s+/g, '-')}-${id}.pdf`
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', pdfBuffer.length)
    res.end(pdfBuffer)

  } catch (error) {
    console.error('PDF error:', error.message)
    console.error('PDF stack:', error.stack)
    res.status(500).json({ message: 'PDF generation failed', error: error.message })
  }
}

module.exports = { downloadPDF }