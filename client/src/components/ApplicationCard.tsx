import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge, { ApplicationStatus } from "./StatusBadge";
import { Calendar, Inbox, MapPin, User } from "lucide-react";
import { type Application } from "@shared/schema";

export type { Application };

interface ApplicationCardProps {
  application: Application;
  onView?: (application: Application) => void;
  onApprove?: (application: Application) => void;
  onReject?: (application: Application) => void;
  showActions?: boolean;
}

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
// ...existing code...

export default function ApplicationCard({
  application,
  onView,
  onApprove,
  onReject,
  showActions = false,
}: ApplicationCardProps) {
  const [showRejectNotes, setShowRejectNotes] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<String[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleRejectClick = () => {
    setShowRejectNotes(true);
  };

  const handleConfirmReject = () => {
    if (onReject) {
      onReject({ ...application, reason: rejectNotes });
    }
    setShowRejectNotes(false);
    setRejectNotes("");
  };

  const handleCancelReject = () => {
    setShowRejectNotes(false);
    setRejectNotes("");
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  // Upload files to server and get URLs
  const uploadDocuments = async (): Promise<string[]> => {
    if (documents.length === 0) return [];
    setUploading(true);
    const formData = new FormData();
    formData.append("id", application.id); // Attach application ID
    documents.forEach((file) => formData.append("documents", file));
    const response = await fetch(
      `/api/applications/upload/${application?.id}`,
      {
        method: "POST",
        body: formData,
      }
    );
    setUploading(false);
    if (!response.ok) {
      return toast({
        title: "Upload Failed",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive",
      }) as unknown as string[]; // TypeScript workaround
    }
    const data = await response.json();
    toast({
      title: "Files Uploaded",
      description: "Your additional documents uploaded successfully.",
    });
    setUploadedDocuments((prev) => [...prev, ...data.files]);
    return data.files;
  };

  useEffect(() => {
    if (documents?.length > 0) {
      // uploadDocuments();
    }
  }, [documents]);

  return (
    <Card
      className="hover-elevate"
      data-testid={`card-application-${application.id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">
            {application.referenceNumber}
          </CardTitle>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span data-testid="text-applicant-name">
              {application.fullName}
            </span>
          </div>
        </div>
        <StatusBadge status={application.status as ApplicationStatus} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <span data-testid="text-property-address">
              {application.propertyAddress}
            </span>
          </div>
          {application?.adminNotes && (
            <>
              <div className="flex items-start gap-1.5 text-muted-foreground">
                <Inbox className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                 Reason For Rejection:
                <b>
                  <span data-testid="text-property-address">
                    {application.adminNotes}
                  </span>
                </b>
              </div>
              <h6 className="text-sm font-semibold">
                Upload Additional Documents Your Application to Be Approved:
              </h6>
              <input
                type="file"
                multiple
                className="mt-2"
                onChange={handleFileChange}
                data-testid="input-upload-files"
              />
              <button
                className="mt-2 text-sm text-primary underline"
                onClick={() => uploadDocuments()}
                disabled={uploading || documents.length === 0}
                data-testid="button-upload-documents"
              >
                {uploading ? "Submitting documents" : "Upload Documents"}
              </button>
            </>
          )}

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span data-testid="text-submitted-date">
              {new Date(application.submittedDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        {showActions && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView?.(application)}
              data-testid="button-view-details"
            >
              View Details
            </Button>
            {(application.status === "submitted" ||
              application.status === "under_review") && (
              <>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onApprove?.(application)}
                  data-testid="button-approve"
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRejectClick}
                  data-testid="button-reject"
                >
                  Reject
                </Button>
              </>
            )}
            {showRejectNotes && (
              <div className="w-full mt-2">
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={3}
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Enter rejection notes or reason..."
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleConfirmReject}
                    disabled={!rejectNotes.trim()}
                    data-testid="button-confirm-reject"
                  >
                    Confirm Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelReject}
                    data-testid="button-cancel-reject"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
