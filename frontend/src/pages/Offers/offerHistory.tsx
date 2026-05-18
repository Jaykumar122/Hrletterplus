import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ArrowLeft, Clock } from 'lucide-react'

interface Version {
  id: number
  version: number
  html_snapshot: string
  edited_by_name: string
  edited_at: string
  change_note: string
}

export default function OfferHistory() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [versions, setVersions] = useState<Version[]>([])
  const [selected, setSelected] = useState<Version | null>(null)
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchHistory()
  }, [id])

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers/${id}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setVersions(data)
      if (data.length > 0) setSelected(data[0])
    } catch (error) {
      console.log(error)
    }
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
              <h1 className="text-2xl font-bold">Offer History</h1>
              <p className="text-muted-foreground text-sm">All versions of this offer letter</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Version List */}
            <div className="space-y-3">
              {versions.length === 0 ? (
                <p className="text-muted-foreground text-sm">No versions found</p>
              ) : (
                versions.map(v => (
                  <div
                    key={v.id}
                    onClick={() => setSelected(v)}
                    className="rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md"
                    style={{
                      background: selected?.id === v.id ? 'var(--primary)' : 'var(--card)',
                      color: selected?.id === v.id ? 'var(--primary-foreground)' : 'var(--foreground)',
                      borderColor: selected?.id === v.id ? 'var(--primary)' : 'var(--border)'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span className="font-semibold text-sm">Version {v.version}</span>
                    </div>
                    <p className="text-xs mt-1 opacity-80">
                      {v.change_note}
                    </p>
                    <p className="text-xs mt-1 opacity-60">
                      by {v.edited_by_name || 'HR'} · {new Date(v.edited_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Version Preview */}
            <div
              className="lg:col-span-2 rounded-xl border p-5"
              style={{ background: 'var(--card)' }}
            >
              <h2 className="font-semibold mb-4">
                {selected ? `Version ${selected.version} Preview` : 'Select a version'}
              </h2>
              {selected ? (
                <div
                  className="p-4 rounded-lg border prose prose-sm max-w-none"
                  style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
                  dangerouslySetInnerHTML={{ __html: selected.html_snapshot }}
                />
              ) : (
                <p className="text-muted-foreground text-sm">Click a version to preview</p>
              )}
            </div>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}