import { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type HelpData = {
  title: string
  supportEmail: string
  quickLinks: Array<{ title: string; description: string }>
  faqs: Array<{ question: string; answer: string }>
}

const defaultHelp: HelpData = {
  title: 'HrLetterPlus Help Center',
  supportEmail: 'support@hrletterplus.local',
  quickLinks: [],
  faqs: [],
}

export default function HelpPage() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const token = localStorage.getItem('token')
  const [help, setHelp] = useState<HelpData>(defaultHelp)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadHelp = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/help`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const payload = await res.json().catch(() => null)
          throw new Error(payload?.message || 'Failed to load help center')
        }

        const data = await res.json()
        setHelp({ ...defaultHelp, ...data })
      } catch (helpError) {
        setError(helpError instanceof Error ? helpError.message : 'Failed to load help center')
      } finally {
        setLoading(false)
      }
    }

    loadHelp()
  }, [apiUrl, token])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <Badge variant="outline" className="border-primary/30 text-primary">Help</Badge>
            <h1 className="mt-3 text-2xl font-bold">{help.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Get quick answers for setup, settings, search, and workflows.</p>
            <p className="mt-3 text-sm">Support: <span className="font-medium">{help.supportEmail}</span></p>
            {error ? <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">{error}</div> : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick links</CardTitle>
                <CardDescription>Useful starting points for common tasks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? <p className="text-sm text-muted-foreground">Loading help content...</p> : null}
                {help.quickLinks.map((link) => (
                  <div key={link.title} className="rounded-lg border p-3 text-sm">
                    <div className="font-medium">{link.title}</div>
                    <div className="text-muted-foreground">{link.description}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>FAQs</CardTitle>
                <CardDescription>Answers to the most common questions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {help.faqs.map((faq) => (
                  <div key={faq.question} className="rounded-lg border p-3 text-sm">
                    <div className="font-medium">{faq.question}</div>
                    <div className="text-muted-foreground">{faq.answer}</div>
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