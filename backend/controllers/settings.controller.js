const pool = require('../config/db')

const defaultSettings = {
  profile: {
    displayName: '',
    jobTitle: '',
    team: '',
  },
  notifications: {
    emailAlerts: true,
    offerUpdates: true,
    candidateUpdates: true,
  },
  appearance: {
    theme: 'system',
    sidebarDense: false,
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeoutMinutes: 60,
  },
  integrations: {
    emailProvider: '',
    storageProvider: '',
  },
}

const mergeSettings = (base, incoming) => {
  const result = Array.isArray(base) ? [...base] : { ...base }

  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
    return result
  }

  for (const [key, value] of Object.entries(incoming)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      result[key] = mergeSettings(base[key], value)
    } else {
      result[key] = value
    }
  }

  return result
}

const getSettings = async (req, res) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const userResult = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [userId]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    const settingsResult = await pool.query(
      'SELECT settings_json, updated_at FROM user_settings WHERE user_id = $1',
      [userId]
    )

    const settingsJson = settingsResult.rows[0]?.settings_json || {}
    const updatedAt = settingsResult.rows[0]?.updated_at || null

    return res.json({
      user: userResult.rows[0],
      settings: mergeSettings(defaultSettings, settingsJson),
      updatedAt,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateSettings = async (req, res) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const incomingSettings = req.body?.settings

    if (!incomingSettings || typeof incomingSettings !== 'object' || Array.isArray(incomingSettings)) {
      return res.status(400).json({ message: 'settings object is required' })
    }

    const currentResult = await pool.query(
      'SELECT settings_json FROM user_settings WHERE user_id = $1',
      [userId]
    )

    const currentSettings = currentResult.rows[0]?.settings_json || {}
    const mergedSettings = mergeSettings(mergeSettings(defaultSettings, currentSettings), incomingSettings)

    const result = await pool.query(
      `INSERT INTO user_settings (user_id, settings_json, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET settings_json = EXCLUDED.settings_json, updated_at = NOW()
       RETURNING settings_json, updated_at`,
      [userId, JSON.stringify(mergedSettings)]
    )

    return res.json({
      message: 'Settings updated successfully',
      settings: result.rows[0].settings_json,
      updatedAt: result.rows[0].updated_at,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  getSettings,
  updateSettings,
}