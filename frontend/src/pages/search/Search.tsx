import { useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type SearchResults = {
  candidates: Array<{ id: number; full_name: string; email: string; phone?: string; designation?: string; department?: string; source?: string }>
  offers: Array<{ id: number; candidate_name: string; candidate_email: string; status: string; template_name: string }>
  templates: Array<{ id: number; name: string; version: number }>
  users: Array<{ id: number; name: string; email: string; role: string }>
}

const emptyResults: SearchResults = {
  candidates: [],
  offers: [],
  templates: [],
  users: [],
}

export default function SearchPage() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const token = localStorage.getItem('token')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults>(emptyResults)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const runSearch = async () => {
    if (!query.trim()) {
      setError('Enter a search term')
      return
    }

    try {
      setLoading(true)
      setError('')

      const res = await fetch(`${apiUrl}/api/search?q=${encodeURIComponent(query.trim())}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        throw new Error(payload?.message || 'Search failed')
      }

      const data = await res.json()
      setResults(data.results || emptyResults)
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : 'Search failed')
      setResults(emptyResults)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1 space-y-2">
                <Badge variant="outline" className="border-primary/30 text-primary">Search</Badge>
                <h1 className="text-2xl font-bold">Search records</h1>
                <p className="text-sm text-muted-foreground">Find candidates, offers, templates, and users from one place.</p>
              </div>
              <div className="flex w-full gap-2 md:max-w-xl">
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email, template, or status" />
                <Button onClick={runSearch} disabled={loading}>{loading ? 'Searching...' : 'Search'}</Button>
              </div>
            </div>
            {error ? <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">{error}</div> : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Candidates</CardTitle>
                <CardDescription>People that match your search.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.candidates.length === 0 ? <p className="text-sm text-muted-foreground">No candidates found.</p> : results.candidates.map((candidate) => (
                  <div key={candidate.id} className="rounded-lg border p-3 text-sm">
                    <div className="font-medium">{candidate.full_name}</div>
                    <div className="text-muted-foreground">{candidate.email}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {candidate.designation || 'No designation'}
                      {candidate.department ? ` • ${candidate.department}` : ''}
                      {candidate.source ? ` • ${candidate.source}` : ''}
                      {candidate.phone ? ` • ${candidate.phone}` : ''}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Offers</CardTitle>
                <CardDescription>Offer letters that match your search.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.offers.length === 0 ? <p className="text-sm text-muted-foreground">No offers found.</p> : results.offers.map((offer) => (
                  <div key={offer.id} className="rounded-lg border p-3 text-sm">
                    <div className="font-medium">{offer.candidate_name}</div>
                    <div className="text-muted-foreground">{offer.candidate_email}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{offer.template_name} • {offer.status}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Templates</CardTitle>
                <CardDescription>Templates that match your search.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.templates.length === 0 ? <p className="text-sm text-muted-foreground">No templates found.</p> : results.templates.map((template) => (
                  <div key={template.id} className="rounded-lg border p-3 text-sm flex items-center justify-between">
                    <span className="font-medium">{template.name}</span>
                    <Badge variant="secondary">v{template.version}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Workspace users that match your search.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.users.length === 0 ? <p className="text-sm text-muted-foreground">No users found.</p> : results.users.map((user) => (
                  <div key={user.id} className="rounded-lg border p-3 text-sm">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-muted-foreground">{user.email}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{user.role}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}