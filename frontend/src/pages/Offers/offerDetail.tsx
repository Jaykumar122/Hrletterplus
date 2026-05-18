import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Download } from 'lucide-react'

interface Offer {
  id: number
  candidate_name: string
  candidate_email: string
  template_name: string
  salary: number
  joining_date: string
  status: string
  generated_html: string
  current_version: number
}

export default function OfferDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [offer, setOffer] = useState<Offer | null>(null)
  const [editedHtml, setEditedHtml] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchOffer()
  }, [id])

  const fetchOffer = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setOffer(data)
      setEditedHtml(data.generated_html)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSave = async () => {
    if (offer?.status === 'Accepted') {
      setError('Accepted offers cannot be edited')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          generated_html: editedHtml,
          salary: offer?.salary,
          joining_date: offer?.joining_date,
          change_note: 'Manual edit'
        })
      })

      if (res.ok) {
        alert('Offer updated!')
        fetchOffer()
      } else {
        const data = await res.json()
        setError(data.message)
      }
    } catch (error) {
      setError('Server error!')
    }
    setSaving(false)
  }

  const handleDownloadPDF = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/offers/${id}/pdf`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    if (!res.ok) {
      alert('PDF generation failed!')
      return
    }

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `offer-${id}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    alert('PDF download failed!')
  }
}
  if (!offer) return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 text-muted-foreground">Loading...</div>
      </SidebarInset>
    </SidebarProvider>
  )

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
                <h1 className="text-2xl font-bold">{offer.candidate_name}</h1>
                <p className="text-muted-foreground text-sm">
                  {offer.template_name} · v{offer.current_version} · {offer.status}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download size={16} className="mr-2" />
                Download PDF
              </Button>
              {offer.status !== 'Accepted' && (
                <Button onClick={handleSave} disabled={saving}>
                  <Save size={16} className="mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Editor */}
            <div
              className="rounded-xl border p-5 space-y-3"
              style={{ background: 'var(--card)' }}
            >
              <h2 className="font-semibold">Edit Offer Letter</h2>
              {offer.status === 'Accepted' ? (
                <div className="p-3 rounded-lg bg-green-500/10 text-green-500 text-sm">
                  This offer has been accepted and cannot be edited.
                </div>
              ) : (
                <textarea
                  value={editedHtml}
                  onChange={(e) => setEditedHtml(e.target.value)}
                  rows={15}
                  className="w-full px-3 py-2 rounded-lg border outline-none text-sm font-mono"
                  style={{
                    background: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                />
              )}
            </div>

            {/* Preview */}
            <div
              className="rounded-xl border p-5"
              style={{ background: 'var(--card)' }}
            >
              <h2 className="font-semibold mb-4">Live Preview</h2>
              <div
                className="p-4 rounded-lg border prose prose-sm max-w-none"
                style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
                dangerouslySetInnerHTML={{ __html: editedHtml }}
              />
            </div>

          </div>

          {/* Info */}
          <div
            className="rounded-xl border p-5 grid grid-cols-2 md:grid-cols-4 gap-4"
            style={{ background: 'var(--card)' }}
          >
            <div>
              <p className="text-xs text-muted-foreground">Candidate</p>
              <p className="font-medium text-sm mt-1">{offer.candidate_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Salary</p>
              <p className="font-medium text-sm mt-1">₹{Number(offer.salary).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Joining Date</p>
              <p className="font-medium text-sm mt-1">{new Date(offer.joining_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="font-medium text-sm mt-1">{offer.status}</p>
            </div>
          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}