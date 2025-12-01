import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import ApplicationForm from "@/components/ApplicationForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { set } from "date-fns";

export default function Apply() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<String[]>([]);
  const [uploading, setUploading] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/applications", data);
      return await response.json();
    },
    onSuccess: (data: any) => {
      setReferenceNumber(data.referenceNumber);
      setSubmitted(true);
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description:
          error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    const updatedData = {
      ...data,
      documents: uploadedDocuments,
    };
    submitMutation.mutate(updatedData);
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
    formData.append("id", 'Gene Piki'); // Attach application ID
    documents.forEach((file) => formData.append("documents", file));
    const response = await fetch("/api/applications/upload", {
      method: "POST",
      body: formData,
    });
    setUploading(false);
    if (!response.ok) {
      return toast({
        title: "Upload Failed",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive",
      }) as unknown as string[]; // TypeScript workaround
    };
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
      uploadDocuments();
    }
  }, [documents]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-12">
          <Alert className="bg-status-approved/5 border-status-approved">
            <CheckCircle2 className="h-5 w-5 text-status-approved" />
            <AlertTitle className="text-lg font-semibold">
              Application Submitted Successfully!
            </AlertTitle>
            <AlertDescription className="space-y-4 mt-2">
              <p>
                Your Rate Clearance Certificate application has been received
                and is being processed.
              </p>
              <div className="bg-background/50 p-4 rounded-md">
                <p className="text-sm font-semibold mb-1">
                  Your Reference Number:
                </p>
                <p
                  className="text-2xl font-mono font-bold text-primary"
                  data-testid="text-reference-number"
                >
                  {referenceNumber}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Please save this reference number. You can use it to track your
                application status.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  onClick={() => setLocation("/track")}
                  data-testid="button-track-application"
                >
                  Track Application
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setReferenceNumber("");
                  }}
                  data-testid="button-submit-another"
                >
                  Submit Another Application
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">
            Apply for Rate Clearance Certificate
          </h1>
          <p className="text-muted-foreground">
            Complete all required information to submit your application
          </p>
        </div>
        <ApplicationForm
          onSubmit={handleSubmit}
          uploading={uploading}
          handleFileChange={handleFileChange}
          documents={documents}
          uploadedDocuments={uploadedDocuments}
        />
      </main>
    </div>
  );
}
