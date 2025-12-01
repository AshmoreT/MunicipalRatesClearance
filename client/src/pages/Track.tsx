import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import TrackingForm from "@/components/TrackingForm";
import ApplicationCard, { Application } from "@/components/ApplicationCard";
import ApplicationTimeline from "@/components/ApplicationTimeline";
import CertificatePreview from "@/components/CertificatePreview";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { type ApplicationStatus } from "@/components/StatusBadge";

export default function Track() {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(false);

  const { data: application, isLoading, error } = useQuery<Application>({
    queryKey: ["/api/applications/track", referenceNumber],
    queryFn: async () => {
      const res = await fetch(`/api/applications/track/${referenceNumber}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      return await res.json();
    },
    enabled: searchAttempted && !!referenceNumber,
    retry: false,
  });

  const handleSearch = (ref: string) => {
    setReferenceNumber(ref);
    setSearchAttempted(true);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">
            Track Your Application
          </h1>
          <p className="text-muted-foreground">
            Enter your reference number to view the status of your application
          </p>
        </div>

        <div className="space-y-6">
          <TrackingForm onSearch={handleSearch} />

          {isLoading && (
            <Alert>
              <AlertDescription>Searching for your application...</AlertDescription>
            </Alert>
          )}

          {searchAttempted && error && !isLoading && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Application not found. Please check your reference number and try again.
              </AlertDescription>
            </Alert>
          )}

          {application && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <ApplicationCard application={application} />
                <ApplicationTimeline 
                  status={application.status as ApplicationStatus}
                  adminNotes={application.adminNotes as string | undefined}
                  submittedDate={formatDate(application.submittedDate)}
                  reviewDate={application.reviewDate ? formatDate(application.reviewDate) : undefined}
                  completedDate={application.completedDate ? formatDate(application.completedDate) : undefined}
                />
              </div>

              {application.status === "approved" && (
                <div className="lg:sticky lg:top-24 h-fit">
                  <CertificatePreview
                    referenceNumber={application.referenceNumber}
                    applicantName={application.fullName}
                    propertyAddress={application.propertyAddress}
                    approvalDate={application.completedDate ? formatDate(application.completedDate) : ""}
                    onDownload={() => console.log("Download certificate")}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
