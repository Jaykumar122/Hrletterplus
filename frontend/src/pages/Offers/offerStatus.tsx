import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, XCircle, Send } from 'lucide-react'

interface StatusLog {
  id: number
  from_status: string
  to_status: string
  changed_by: number
  changed_at: string
  remark: string
}

interface Offer {
  id: number
  candidate_name: string
  status: string
}

export default function OfferStatus() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [offer, setOffer] = useState<Offer | null>(null)
  const [logs, setLogs] = useState<StatusLog[]>([])
  const [remark, setRemark] = useState('')
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchOffer()
    fetchLogs()
  }, [id])

  const fetchOffer = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setOffer(data)
  }

  const fetchLogs = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers/${id}/history`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  const updateStatus = async (newStatus: string) => {
    setError('')
    setUpdating(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, remark })
      })

      const data = await res.json()
      if (res.ok) {
        alert(`Status updated to ${newStatus}!`)
        fetchOffer()
        setRemark('')
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Server error!')
    }
    setUpdating(false)
  }

  const getNextActions = () => {
    if (!offer) return []
    if (offer.status === 'Draft') return [{ label: 'Send to Candidate', status: 'Sent', icon: Send, color: 'bg-blue-500' }]
    if (offer.status === 'Sent') return [
      { label: 'Mark Accepted', status: 'Accepted', icon: CheckCircle2, color: 'bg-green-500' },
      { label: 'Mark Rejected', status: 'Rejected', icon: XCircle, color: 'bg-red-500' },
    ]
    return []
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/offers/${id}`)} className="p-2 rounded-lg hover:bg-muted">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Status Management</h1>
              <p className="text-muted-foreground text-sm">
                {offer?.candidate_name} · Current: {offer?.status}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{error}</div>
          )}

          {/* Status Flow */}
          <div
            className="rounded-xl border p-6 space-y-4"
            style={{ background: 'var(--card)' }}
          >
            <h2 className="font-semibold">Status Flow</h2>

            {/* Progress */}
            <div className="flex items-center gap-2">
              {['Draft', 'Sent', 'Accepted/Rejected'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: offer?.status === s || (s === 'Accepted/Rejected' && ['Accepted', 'Rejected'].includes(offer?.status || ''))
                        ? 'var(--primary)'
                        : 'var(--muted)',
                      color: offer?.status === s || (s === 'Accepted/Rejected' && ['Accepted', 'Rejected'].includes(offer?.status || ''))
                        ? 'var(--primary-foreground)'
                        : 'var(--muted-foreground)'
                    }}
                  >
                    {s}
                  </div>
                  {i < 2 && <div className="w-8 h-px" style={{ background: 'var(--border)' }} />}
                </div>
              ))}
            </div>

            {/* Remark */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Add Remark (optional)</label>
              <input
                type="text"
                placeholder="Enter remark..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                style={{
                  background: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              {getNextActions().length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No further status changes available for {offer?.status} offers.
                </p>
              ) : (
                getNextActions().map(action => (
                  <Button
                    key={action.status}
                    onClick={() => updateStatus(action.status)}
                    disabled={updating}
                    className="flex items-center gap-2"
                  >
                    <action.icon size={16} />
                    {action.label}
                  </Button>
                ))
              )}
            </div>
          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}