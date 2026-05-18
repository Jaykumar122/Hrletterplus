import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'

interface Candidate {
  id: number
  full_name: string
  email: string
  designation: string
  department: string
}

interface Template {
  id: number
  name: string
  body_html: string
}

export default function NewOffer() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [form, setForm] = useState({
    candidate_id: '',
    template_id: '',
    salary: '',
    joining_date: ''
  })
  const [preview, setPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchCandidates()
    fetchTemplates()
  }, [])

  useEffect(() => {
    if (form.candidate_id && form.template_id) {
      generatePreview()
    }
  }, [form])

  const fetchCandidates = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/candidates`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setCandidates(data)
  }

  const fetchTemplates = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/templates`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setTemplates(data)
  }

  const generatePreview = () => {
    const candidate = candidates.find(c => c.id === parseInt(form.candidate_id))
    const template = templates.find(t => t.id === parseInt(form.template_id))
    if (!candidate || !template) return

    let html = template.body_html
    html = html.replace(/\{\{name\}\}/g, candidate.full_name)
    html = html.replace(/\{\{designation\}\}/g, candidate.designation || '')
    html = html.replace(/\{\{salary\}\}/g, form.salary || '___')
    html = html.replace(/\{\{doj\}\}/g, form.joining_date
      ? new Date(form.joining_date).toLocaleDateString()
      : '___')
    html = html.replace(/\{\{department\}\}/g, candidate.department || '')
    setPreview(html)
  }

  const handleSave = async () => {
    setError('')
    if (!form.candidate_id || !form.template_id || !form.salary || !form.joining_date) {
      setError('All fields are required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          candidate_id: parseInt(form.candidate_id),
          template_id: parseInt(form.template_id),
          salary: parseFloat(form.salary),
          joining_date: form.joining_date
        })
      })

      const data = await res.json()
      if (res.ok) {
        alert('Offer created successfully!')
        navigate('/offers')
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Server error!')
    }
    setSaving(false)
  }

  const selectedCandidate = candidates.find(c => c.id === parseInt(form.candidate_id))

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/offers')} className="p-2 rounded-lg hover:bg-muted">
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Generate Offer Letter</h1>
                <p className="text-muted-foreground text-sm">Pick candidate and template</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save size={16} className="mr-2" />
              {saving ? 'Creating...' : 'Create Offer'}
            </Button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Form */}
            <div className="space-y-4">
              <div
                className="rounded-xl border p-5 space-y-4"
                style={{ background: 'var(--card)' }}
              >
                <h2 className="font-semibold">Offer Details</h2>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Select Candidate</label>
                  <select
                    value={form.candidate_id}
                    onChange={(e) => setForm({ ...form, candidate_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                    style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    <option value="">Select candidate...</option>
                    {candidates.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.full_name} — {c.designation}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCandidate && (
                  <div
                    className="p-3 rounded-lg text-sm space-y-1"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', opacity: 0.9 }}
                  >
                    <p><strong>Email:</strong> {selectedCandidate.email}</p>
                    <p><strong>Department:</strong> {selectedCandidate.department}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Select Template</label>
                  <select
                    value={form.template_id}
                    onChange={(e) => setForm({ ...form, template_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                    style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    <option value="">Select template...</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Salary (per month)</label>
                  <input
                    type="number"
                    placeholder="e.g. 75000"
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                    style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Joining Date</label>
                  <input
                    type="date"
                    value={form.joining_date}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                    onChange={(e) => setForm({ ...form, joining_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                    style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div
              className="rounded-xl border p-5"
              style={{ background: 'var(--card)' }}
            >
              <h2 className="font-semibold mb-4">Live Preview</h2>
              {preview ? (
                <div
                  className="prose prose-sm max-w-none p-4 rounded-lg border"
                  style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
                  dangerouslySetInnerHTML={{ __html: preview }}
                />
              ) : (
                <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                  Select candidate and template to see preview
                </div>
              )}
            </div>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}