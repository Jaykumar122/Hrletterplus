import { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CandidateCharts } from '@/components/candidates/CandidateCharts'
import { Plus, Search, Pencil, Trash2, Users } from 'lucide-react'

interface Candidate {
  id: number
  full_name: string
  email: string
  phone: string
  designation: string
  department: string
  source: string
  total_offers: number
  created_at: string
}

const DEPARTMENTS = [
  'Engineering', 'Design', 'Product', 'Marketing',
  'Sales', 'Operations', 'Analytics', 'HR', 'Finance',
  'Legal', 'Security'
]

const SOURCES = ['LinkedIn', 'Naukri', 'Indeed', 'Referral', 'Other']

const emptyForm = {
  full_name: '', email: '', phone: '',
  designation: '', department: '', source: ''
}

const cardStyle = {
  background: 'linear-gradient(to top, var(--card), color-mix(in oklch, var(--primary) 5%, transparent))'
}

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchCandidates()
  }, [search, filterDept])

  const fetchCandidates = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filterDept) params.append('department', filterDept)

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/candidates?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      setCandidates(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditCandidate(null)
    setForm(emptyForm)
    setError('')
    setShowModal(true)
  }

  const handleOpenEdit = (candidate: Candidate) => {
    setEditCandidate(candidate)
    setForm({
      full_name: candidate.full_name,
      email: candidate.email,
      phone: candidate.phone,
      designation: candidate.designation,
      department: candidate.department,
      source: candidate.source,
    })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    setError('')
    if (!form.full_name || !form.email) {
      setError('Name and email are required')
      return
    }

    setSaving(true)
    try {
      const url = editCandidate
        ? `${import.meta.env.VITE_API_URL}/api/candidates/${editCandidate.id}`
        : `${import.meta.env.VITE_API_URL}/api/candidates`
      const method = editCandidate ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      if (res.ok) {
        setShowModal(false)
        fetchCandidates()
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Server error!')
    }
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this candidate?')) return
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/candidates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCandidates()
    } catch (error) {
      console.log(error)
    }
  }

  const deptColor = (dept: string) => {
    const colors: Record<string, string> = {
      Engineering: 'bg-blue-500/10 text-blue-500',
      Design: 'bg-pink-500/10 text-pink-500',
      Product: 'bg-purple-500/10 text-purple-500',
      Marketing: 'bg-orange-500/10 text-orange-500',
      Sales: 'bg-green-500/10 text-green-500',
      Analytics: 'bg-cyan-500/10 text-cyan-500',
      HR: 'bg-yellow-500/10 text-yellow-500',
      Finance: 'bg-emerald-500/10 text-emerald-500',
      Legal: 'bg-red-500/10 text-red-500',
      Security: 'bg-slate-500/10 text-slate-500',
      Operations: 'bg-indigo-500/10 text-indigo-500',
    }
    return colors[dept] || 'bg-gray-500/10 text-gray-500'
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
              <h1 className="text-2xl font-bold">Candidates</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage all candidates and their offer letters
              </p>
            </div>
            <Button onClick={handleOpenAdd}>
              <Plus size={16} className="mr-2" />
              Add Candidate
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <Card
              data-slot="card"
              style={cardStyle}
              className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-primary/20"
            >
              <CardHeader className="relative">
                <CardDescription>Total Candidates</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
                  {candidates.length}
                </CardTitle>
                <div className="absolute right-4 top-4">
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                    Total
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="text-muted-foreground">All registered candidates</div>
              </CardFooter>
            </Card>

            <Card
              data-slot="card"
              style={cardStyle}
              className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-primary/20"
            >
              <CardHeader className="relative">
                <CardDescription>Engineering</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
                  {candidates.filter(c => c.department === 'Engineering').length}
                </CardTitle>
                <div className="absolute right-4 top-4">
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                    Dept
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="text-muted-foreground">Engineering candidates</div>
              </CardFooter>
            </Card>

            <Card
              data-slot="card"
              style={cardStyle}
              className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-primary/20"
            >
              <CardHeader className="relative">
                <CardDescription>With Offers</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
                  {candidates.filter(c => c.total_offers > 0).length}
                </CardTitle>
                <div className="absolute right-4 top-4">
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="text-muted-foreground">Have offer letters</div>
              </CardFooter>
            </Card>

            <Card
              data-slot="card"
              style={cardStyle}
              className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-primary/20"
            >
              <CardHeader className="relative">
                <CardDescription>New This Month</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
                  {candidates.filter(c => {
                    const date = new Date(c.created_at)
                    const now = new Date()
                    return date.getMonth() === now.getMonth() &&
                      date.getFullYear() === now.getFullYear()
                  }).length}
                </CardTitle>
                <div className="absolute right-4 top-4">
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                    New
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="text-muted-foreground">Added this month</div>
              </CardFooter>
            </Card>

          </div>

          {/* Charts */}
          <CandidateCharts candidates={candidates} />

          {/* Search and Filter */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border outline-none"
                style={{
                  background: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-3 py-2 rounded-lg border outline-none"
              style={{
                background: 'var(--card)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)'
              }}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Offers</TableHead>
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
                ) : candidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Users size={40} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No candidates found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">
                        {candidate.full_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {candidate.email}
                      </TableCell>
                      <TableCell className="text-sm">
                        {candidate.phone}
                      </TableCell>
                      <TableCell className="text-sm">
                        {candidate.designation}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${deptColor(candidate.department)}`}>
                          {candidate.department}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {candidate.source}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{candidate.total_offers}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEdit(candidate)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(candidate.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 size={14} />
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

        {/* Add/Edit Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editCandidate ? 'Edit Candidate' : 'Add New Candidate'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                  {error}
                </div>
              )}

              {[
                { label: 'Full Name *', key: 'full_name', placeholder: 'John Doe' },
                { label: 'Email *', key: 'email', placeholder: 'john@gmail.com' },
                { label: 'Phone', key: 'phone', placeholder: '9876543210' },
                { label: 'Designation', key: 'designation', placeholder: 'Software Engineer' },
              ].map(field => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-sm font-medium">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                    style={{
                      background: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                </div>
              ))}

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Department</label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                  style={{
                    background: 'var(--card)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Source</label>
                <select
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                  style={{
                    background: 'var(--card)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)'
                  }}
                >
                  <option value="">Select Source</option>
                  {SOURCES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : editCandidate ? 'Update' : 'Add Candidate'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </SidebarInset>
    </SidebarProvider>
  )
}