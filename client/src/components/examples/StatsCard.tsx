import StatsCard from '../StatsCard'
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"

export default function StatsCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="Total Applications" value={248} icon={FileText} description="+12 from last month" />
      <StatsCard title="Pending Review" value={23} icon={Clock} description="Awaiting approval" />
      <StatsCard title="Approved" value={198} icon={CheckCircle} description="This month: 45" />
      <StatsCard title="Rejected" value={27} icon={XCircle} description="Requires resubmission" />
    </div>
  )
}
