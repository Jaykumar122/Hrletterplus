import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Stats {
  drafts: number
  sent: number
  accepted: number
  rejected: number
}

export function SectionCards() {
  const [stats, setStats] = useState<Stats>({
    drafts: 0, sent: 0, accepted: 0, rejected: 0
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.log(err))
  }, [])

  const cards = [
    {
      label: 'Total Drafts',
      value: stats.drafts,
      badge: 'Pending',
      description: 'Offer letters not yet sent',
    },
    {
      label: 'Total Sent',
      value: stats.sent,
      badge: 'Sent',
      description: 'Offer letters sent to candidates',
    },
    {
      label: 'Total Accepted',
      value: stats.accepted,
      badge: 'Accepted',
      description: 'Candidates accepted offers',
    },
    {
      label: 'Total Rejected',
      value: stats.rejected,
      badge: 'Rejected',
      description: 'Candidates rejected offers',
    },
  ]

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:from-primary/10 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          data-slot="card"
          className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-primary/20"
        >
          <CardHeader className="relative">
            <CardDescription>{card.label}</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-primary">
              {card.value}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className="flex gap-1 rounded-lg text-xs border-primary/30 text-primary"
              >
                {card.badge}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              {card.description}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}