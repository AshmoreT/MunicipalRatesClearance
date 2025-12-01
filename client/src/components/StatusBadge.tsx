import { Badge } from "@/components/ui/badge";
import { Clock, FileCheck, CheckCircle2, XCircle } from "lucide-react";

export type ApplicationStatus = "submitted" | "under_review" | "approved" | "rejected";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    submitted: {
      label: "Submitted",
      icon: Clock,
      className: "bg-status-submitted/10 text-status-submitted border-status-submitted/20",
    },
    under_review: {
      label: "Under Review",
      icon: FileCheck,
      className: "bg-status-review/10 text-status-review border-status-review/20",
    },
    approved: {
      label: "Approved",
      icon: CheckCircle2,
      className: "bg-status-approved/10 text-status-approved border-status-approved/20",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      className: "bg-status-rejected/10 text-status-rejected border-status-rejected/20",
    },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <Badge variant="outline" className={`${className} gap-1.5`} data-testid={`badge-status-${status}`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
