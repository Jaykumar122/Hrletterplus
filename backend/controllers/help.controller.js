const getHelpCenter = async (req, res) => {
  try {
    return res.json({
      title: 'HrLetterPlus Help Center',
      supportEmail: 'support@hrletterplus.local',
      quickLinks: [
        { title: 'Getting started', description: 'Learn the basics of candidates, offers, and templates.' },
        { title: 'Settings guide', description: 'Manage profile, notifications, security, appearance, and exports.' },
        { title: 'Search tips', description: 'Find records across candidates, offers, templates, and users.' },
      ],
      faqs: [
        {
          question: 'How do I update my profile?',
          answer: 'Open Settings, update your profile information, and click Save settings.',
        },
        {
          question: 'How do I search records?',
          answer: 'Use the Search page from the sidebar and enter a name, email, template, or status.',
        },
        {
          question: 'How do I export data?',
          answer: 'Open Settings and use the Data & Export section to download backups or reports.',
        },
      ],
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getHelpCenter }