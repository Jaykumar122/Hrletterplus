"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const chartConfig = {
  total: {
    label: "Total Offers",
    color: "var(--primary)",
  },
  accepted: {
    label: "Accepted",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartData, setChartData] = React.useState([])
  const [error, setError] = React.useState<string>('')

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  React.useEffect(() => {
    fetchChartData()
  }, [timeRange])

  const fetchChartData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('No authentication token found')
        return
      }

      let range = '3months'
      if (timeRange === '30d') range = '30days'
      if (timeRange === '7d') range = '7days'

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/dashboard/chart?range=${range}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`)
      }

      const data = await res.json()
      setChartData(data || [])
      setError('')
    } catch (error) {
      console.error('Chart fetch error:', error)
      setError(error instanceof Error ? error.message : 'Failed to load chart data')
    }
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Offer Letters Over Time</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total offers created for the selected period
          </span>
          <span className="@[540px]/card:hidden">Offer trends</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {error ? (
          <div className="flex items-center justify-center h-[250px] text-red-600 text-sm border border-red-200 rounded bg-red-50">
            <div className="text-center">
              <p className="font-semibold">Error loading chart</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
            No offer data available for this period
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillAccepted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="accepted"
                type="natural"
                fill="url(#fillAccepted)"
                stroke="var(--primary)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="total"
                type="natural"
                fill="url(#fillTotal)"
                stroke="var(--primary)"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}