import { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bell, Lock, Palette, ShieldCheck, Users, Database, Download, LayoutGrid } from 'lucide-react'

type SettingsState = {
  profile: {
    displayName: string
    jobTitle: string
    team: string
  }
  notifications: {
    emailAlerts: boolean
    offerUpdates: boolean
    candidateUpdates: boolean
  }
  appearance: {
    theme: string
    sidebarDense: boolean
  }
  security: {
    twoFactorEnabled: boolean
    sessionTimeoutMinutes: number
  }
  integrations: {
    emailProvider: string
    storageProvider: string
  }
}

const settingsSections = [
  {
    title: 'Profile',
    description: 'Update your name, role, email, and team details.',
    icon: Users,
    badge: 'Account',
  },
  {
    title: 'Notifications',
    description: 'Choose email alerts for offers, candidates, and approvals.',
    icon: Bell,
    badge: 'Alerts',
  },
  {
    title: 'Security',
    description: 'Manage password rules, sessions, and login protection.',
    icon: Lock,
    badge: 'Access',
  },
  {
    title: 'Appearance',
    description: 'Switch themes, density, and sidebar behavior.',
    icon: Palette,
    badge: 'UI',
  },
  {
    title: 'Integrations',
    description: 'Connect tools for email, storage, and workflow automation.',
    icon: LayoutGrid,
    badge: 'Tools',
  },
  {
    title: 'Data & Export',
    description: 'Backup records and export candidate or offer data.',
    icon: Database,
    badge: 'Admin',
  },
]

const quickActions = [
  'Update profile',
  'Enable notifications',
  'Change password',
  'Export data',
]

const defaultSettings: SettingsState = {
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

export default function SettingsPage() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const token = localStorage.getItem('token')
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Failed to load settings')
        }

        const data = await res.json()
        setSettings({ ...defaultSettings, ...data.settings })
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [apiUrl, token])

  const updateProfile = (field: keyof SettingsState['profile'], value: string) => {
    setSettings((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [field]: value,
      },
    }))
  }

  const toggleNotification = (field: keyof SettingsState['notifications'], checked: boolean) => {
    setSettings((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [field]: checked,
      },
    }))
  }

  const toggleAppearance = (field: keyof SettingsState['appearance'], value: string | boolean) => {
    setSettings((current) => ({
      ...current,
      appearance: {
        ...current.appearance,
        [field]: value,
      },
    }))
  }

  const updateSecurity = (field: keyof SettingsState['security'], value: string | boolean) => {
    setSettings((current) => ({
      ...current,
      security: {
        ...current.security,
        [field]: field === 'sessionTimeoutMinutes' ? Number(value) : value,
      },
    }))
  }

  const updateIntegration = (field: keyof SettingsState['integrations'], value: string) => {
    setSettings((current) => ({
      ...current,
      integrations: {
        ...current.integrations,
        [field]: value,
      },
    }))
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      setMessage('')
      setError('')

      const res = await fetch(`${apiUrl}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings }),
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        throw new Error(payload?.message || 'Failed to save settings')
      }

      setMessage('Settings saved successfully')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border border-primary/20 bg-primary/10">
                <AvatarFallback className="text-primary font-semibold">HR</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">Settings</h1>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    Workspace control
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage account preferences, privacy, notifications, and exports.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Security check
              </Button>
              <Button variant="outline" onClick={() => setProfileOpen((current) => !current)}>
                <Users className="mr-2 h-4 w-4" />
                {profileOpen ? 'Close profile' : 'Open profile'}
              </Button>
              <Button onClick={saveSettings} disabled={saving || loading}>
                <Download className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save settings'}
              </Button>
            </div>
          </div>

          {message ? (
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {profileOpen ? (
            <Card className="border-primary/20 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Open and edit your profile details here.</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setProfileOpen(false)}>
                  Close
                </Button>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="displayName">Display name</Label>
                  <Input id="displayName" value={settings.profile.displayName} onChange={(event) => updateProfile('displayName', event.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="jobTitle">Job title</Label>
                  <Input id="jobTitle" value={settings.profile.jobTitle} onChange={(event) => updateProfile('jobTitle', event.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="team">Team</Label>
                  <Input id="team" value={settings.profile.team} onChange={(event) => updateProfile('team', event.target.value)} />
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Basic account information shown across the app.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p className="text-sm text-muted-foreground">
                  Click Open profile to edit display name, job title, and team.
                </p>
                <Button variant="outline" onClick={() => setProfileOpen(true)}>
                  <Users className="mr-2 h-4 w-4" />
                  Open profile
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose which updates you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {[
                  ['emailAlerts', 'Email alerts'],
                  ['offerUpdates', 'Offer updates'],
                  ['candidateUpdates', 'Candidate updates'],
                ].map(([field, label]) => (
                  <label key={field} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                    <span>{label}</span>
                    <Checkbox checked={settings.notifications[field as keyof SettingsState['notifications']]} onCheckedChange={(checked) => toggleNotification(field as keyof SettingsState['notifications'], Boolean(checked))} />
                  </label>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Control the UI theme and sidebar density.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Input id="theme" value={settings.appearance.theme} onChange={(event) => toggleAppearance('theme', event.target.value)} />
                </div>
                <label className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                  <span>Dense sidebar</span>
                  <Checkbox checked={settings.appearance.sidebarDense} onCheckedChange={(checked) => toggleAppearance('sidebarDense', Boolean(checked))} />
                </label>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>Security and integrations</CardTitle>
                <CardDescription>Session controls and connected tools.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sessionTimeoutMinutes">Session timeout (minutes)</Label>
                  <Input id="sessionTimeoutMinutes" type="number" min={15} step={15} value={settings.security.sessionTimeoutMinutes} onChange={(event) => updateSecurity('sessionTimeoutMinutes', event.target.value)} />
                </div>
                <label className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                  <span>Two-factor authentication</span>
                  <Checkbox checked={settings.security.twoFactorEnabled} onCheckedChange={(checked) => updateSecurity('twoFactorEnabled', Boolean(checked))} />
                </label>
                <div className="grid gap-2">
                  <Label htmlFor="emailProvider">Email provider</Label>
                  <Input id="emailProvider" value={settings.integrations.emailProvider} onChange={(event) => updateIntegration('emailProvider', event.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="storageProvider">Storage provider</Label>
                  <Input id="storageProvider" value={settings.integrations.storageProvider} onChange={(event) => updateIntegration('storageProvider', event.target.value)} />
                </div>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <div className="rounded-lg border px-4 py-3 text-sm text-muted-foreground">Loading settings...</div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {settingsSections.map((section) => {
              const Icon = section.icon

              return (
                <Card key={section.title} className="border-primary/10 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {section.badge}
                      </Badge>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription className="mt-1">{section.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="px-0 text-primary hover:bg-transparent hover:text-primary/80">
                      Open {section.title.toLowerCase()}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>Quick actions</CardTitle>
                <CardDescription>Common settings tasks in one place.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {quickActions.map((action) => (
                  <Button key={action} variant="outline" className="justify-start">
                    {action}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-sm">
              <CardHeader>
                <CardTitle>Account status</CardTitle>
                <CardDescription>Current workspace and profile summary.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
                  <span className="text-muted-foreground">Workspace</span>
                  <span className="font-medium">HrLetterPlus</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">Standard</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
                  <span className="text-muted-foreground">Theme</span>
                  <span className="font-medium">System</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}