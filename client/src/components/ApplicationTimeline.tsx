import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { ApplicationStatus } from "./StatusBadge";

interface TimelineItem {
  status: string;
  date: string;
  completed: boolean;
  current: boolean;
}

interface ApplicationTimelineProps {
  status: ApplicationStatus;
  submittedDate: string;
  reviewDate?: string;
  completedDate?: string;
  adminNotes?: string;
}

export default function ApplicationTimeline({
  status,
  submittedDate,
  reviewDate,
  completedDate,
  adminNotes,
}: ApplicationTimelineProps) {
  const timeline: TimelineItem[] = [
    {
      status: "Application Submitted",
      date: submittedDate,
      completed: true,
      current: status === "submitted",
    },
    {
      status: "Under Review",
      date: reviewDate || "Pending",
      completed:
        status === "under_review" ||
        status === "approved" ||
        status === "rejected",
      current: status === "under_review",
    },
    {
      status: adminNotes ? `Rejected: ${adminNotes}` : "Approved",
      date: completedDate || "Pending",
      completed: status === "approved" || status === "rejected",
      current: status === "approved" || status === "rejected",
    },
    {
      status:
        status === "rejected" ? "Application Rejected" : "Certificate Approved",
      date: completedDate || "Pending",
      completed: status === "approved" || status === "rejected",
      current: status === "approved" || status === "rejected",
    },
  ];

  return (
    <Card data-testid="card-timeline">
      <CardHeader>
        <CardTitle className="text-lg font-heading">
          Application Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div
              key={index}
              className="flex gap-4"
              data-testid={`timeline-item-${index}`}
            >
              <div className="flex flex-col items-center">
                {item.completed ? (
                  <CheckCircle2
                    className={`h-6 w-6 ${
                      item.current ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                ) : item.current ? (
                  <Clock className="h-6 w-6 text-status-review" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground" />
                )}
                {index < timeline.length - 1 && (
                  <div
                    className={`w-0.5 h-12 mt-2 ${
                      item.completed ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pb-8">
                <h4
                  className={`font-semibold ${
                    item.current ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.status}
                </h4>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
