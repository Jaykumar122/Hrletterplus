import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts"
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card"

interface Candidate {
  department: string
  source: string
  created_at: string
}

export function CandidateCharts({ candidates }: { candidates: Candidate[] }) {

  // Bar chart - by department
  const deptData = Object.entries(
    candidates.reduce((acc: Record<string, number>, c) => {
      acc[c.department] = (acc[c.department] || 0) + 1
      return acc
    }, {})
  )
  .map(([dept, count]) => ({ dept: dept.slice(0, 6), count }))
  .sort((a, b) => b.count - a.count)

  // Line chart - by source
  const sourceData = Object.entries(
    candidates.reduce((acc: Record<string, number>, c) => {
      const src = c.source || 'Other'
      acc[src] = (acc[src] || 0) + 1
      return acc
    }, {})
  ).map(([source, count]) => ({ source, count }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Bar Chart - Department */}
      <Card>
        <CardHeader>
          <CardTitle>Candidates by Department</CardTitle>
          <CardDescription>
            Top departments by candidate count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deptData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="dept"
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)'
                }}
              />
              <Bar
                dataKey="count"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                name="Candidates"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart - Source */}
      <Card>
        <CardHeader>
          <CardTitle>Candidates by Source</CardTitle>
          <CardDescription>
            Where candidates are coming from
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sourceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="source"
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)'
                }}
              />
              <Bar
                dataKey="count"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                name="Candidates"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  )
}