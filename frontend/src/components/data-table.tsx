import { useEffect, useState } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Activity {
  id: number
  candidate_name: string
  from_status: string
  to_status: string
  changed_by: string
  changed_at: string
}

export function DataTable() {
  const [activity, setActivity] = useState<Activity[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/activity`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setActivity(data))
      .catch(err => console.log(err))
  }, [])

  const statusColor = (status: string) => {
    if (status === 'Accepted') return 'text-green-600'
    if (status === 'Rejected') return 'text-red-600'
    if (status === 'Sent') return 'text-blue-600'
    return 'text-purple-600'
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-xl border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <p className="text-sm text-muted-foreground">Latest offer letter status changes</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Changed By</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activity.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No recent activity yet
                </TableCell>
              </TableRow>
            ) : (
              activity.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.candidate_name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor(item.from_status)}>
                      {item.from_status || '-'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor(item.to_status)}>
                      {item.to_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.changed_by || 'System'}</TableCell>
                  <TableCell>
                    {new Date(item.changed_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}