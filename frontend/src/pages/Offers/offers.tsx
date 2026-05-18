import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Card, CardDescription, CardFooter,
  CardHeader, CardTitle
} from '@/components/ui/card'
import { Plus, Eye, History, Settings2 } from 'lucide-react'

interface Offer {
  id: number
  candidate_name: string
  candidate_email: string
  template_name: string
  salary: number
  joining_date: string
  status: string
  current_version: number
  created_at: string
}

const statusColor = (status: string) => {
  if (status === 'Accepted') return 'bg-green-500/10 text-green-500 border-green-500/20'
  if (status === 'Rejected') return 'bg-red-500/10 text-red-500 border-red-500/20'
  if (status === 'Sent') return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
}

const cardStyle = {
  background: 'linear-gradient(to top, var(--card), color-mix(in oklch, var(--primary) 5%, transparent))'
}

export default function Offers() {
  const navigate = useNavigate()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setOffers(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const filtered = filter
    ? offers.filter(o => o.status === filter)
    : offers

  const stats = {
    total: offers.length,
    draft: offers.filter(o => o.status === 'Draft').length,
    sent: offers.filter(o => o.status === 'Sent').length,
    accepted: offers.filter(o => o.status === 'Accepted').length,
    rejected: offers.filter(o => o.status === 'Rejected').length,
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Offer Letters</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Generate and manage offer letters
              </p>
            </div>
            <Button onClick={() => navigate('/offers/new')}>
              <Plus size={16} className="mr-2" />
              Generate Offer
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Offers', value: stats.total, badge: 'All' },
              { label: 'Drafts', value: stats.draft, badge: 'Draft' },
              { label: 'Accepted', value: stats.accepted, badge: 'Accepted' },
              { label: 'Rejected', value: stats.rejected, badge: 'Rejected' },
            ].map(card => (
              <Card
                key={card.label}
                data-slot="card"
                style={cardStyle}
                className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-primary/20"
              >
                <CardHeader className="relative">
                  <CardDescription>{card.label}</CardDescription>
                  <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
                    {card.value}
                  </CardTitle>
                  <div className="absolute right-4 top-4">
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      {card.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                  <div className="text-muted-foreground">Offer letters</div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {['', 'Draft', 'Sent', 'Accepted', 'Rejected'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-4 py-1.5 rounded-full text-sm border transition-all"
                style={{
                  background: filter === s ? 'var(--primary)' : 'var(--card)',
                  color: filter === s ? 'var(--primary-foreground)' : 'var(--foreground)',
                  borderColor: filter === s ? 'var(--primary)' : 'var(--border)'
                }}
              >
                {s || 'All'}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No offers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{offer.candidate_name}</p>
                          <p className="text-xs text-muted-foreground">{offer.candidate_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{offer.template_name}</TableCell>
                      <TableCell className="text-sm">
                        ₹{Number(offer.salary).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(offer.joining_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${statusColor(offer.status)}`}>
                          {offer.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        v{offer.current_version}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(offer.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <button
                            onClick={() => navigate(`/offers/${offer.id}`)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary"
                            title="View/Edit"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => navigate(`/offers/${offer.id}/history`)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary"
                            title="History"
                          >
                            <History size={14} />
                          </button>
                          <button
                            onClick={() => navigate(`/offers/${offer.id}/status`)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary"
                            title="Status"
                          >
                            <Settings2 size={14} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}