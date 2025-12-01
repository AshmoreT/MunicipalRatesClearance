import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import ApplicationCard, { Application } from "@/components/ApplicationCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea"; // Add this import if you have a Textarea component

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState(""); // Add state for rejection notes
  const [showRejectNotes, setShowRejectNotes] = useState(false); // Show/hide notes input

  // Check authentication
  const { data: session, isLoading: sessionLoading } = useQuery<{
    authenticated: boolean;
  }>({
    queryKey: ["/api/admin/session"],
  });

  useEffect(() => {
    if (!sessionLoading && !session?.authenticated) {
      setLocation("/admin");
    }
  }, [session, sessionLoading, setLocation]);

  // Fetch applications
  const { data: applications = [], isLoading: appsLoading } = useQuery<
    Application[]
  >({
    queryKey: ["/api/admin/applications"],
    enabled: session?.authenticated,
  });

  // Fetch statistics
  const { data: stats } = useQuery<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }>({
    queryKey: ["/api/admin/statistics"],
    enabled: session?.authenticated,
  });

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      adminNotes,
    }: {
      id: string;
      status: string;
      adminNotes?: string;
    }) => {
      const response = await apiRequest(
        "PATCH",
        `/api/admin/applications/${id}/status`,
        { status, reason: adminNotes, adminNotes }
      );
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/statistics"] });
      setDialogOpen(false);
    },
  });

  const filteredApplications = applications.filter((app: Application) => {
    const matchesSearch =
      searchQuery === "" ||
      app.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (application: Application) => {
    updateStatusMutation.mutate(
      { id: application.id, status: "approved" },
      {
        onSuccess: () => {
          toast({
            title: "Application Approved",
            description: `${application.referenceNumber} has been approved successfully.`,
          });
        },
      }
    );
  };

  const handleReject = (application: Application) => {
    updateStatusMutation.mutate(
      { id: application.id, status: "rejected", adminNotes: application.reason },
      {
        onSuccess: () => {
          toast({
            title: "Application Rejected",
            description: `${application.referenceNumber} has been rejected.`,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  if (sessionLoading || !session?.authenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and review Rate Clearance Certificate applications
          </p>
        </div>

        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard
              title="Total Applications"
              value={stats.total}
              icon={FileText}
              description="All time"
            />
            <StatsCard
              title="Pending Review"
              value={stats.pending}
              icon={Clock}
              description="Awaiting action"
            />
            <StatsCard
              title="Approved"
              value={stats.approved}
              icon={CheckCircle}
              description="Certificates issued"
            />
            <StatsCard
              title="Rejected"
              value={stats.rejected}
              icon={XCircle}
              description="Requires resubmission"
            />
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Applications</CardTitle>
            <CardDescription>
              Review and manage all certificate applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by reference, name, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-applications"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  className="w-full sm:w-[180px]"
                  data-testid="select-status-filter"
                >
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all" data-testid="tab-all">
                  All ({filteredApplications.length})
                </TabsTrigger>
                <TabsTrigger value="pending" data-testid="tab-pending">
                  Pending (
                  {
                    filteredApplications.filter(
                      (a: Application) =>
                        a.status === "under_review" || a.status === "submitted"
                    ).length
                  }
                  )
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {appsLoading ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Loading applications...
                  </div>
                ) : filteredApplications.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No applications found
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredApplications.map((application: Application) => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        showActions={true}
                        onView={handleViewDetails}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {filteredApplications.filter(
                  (a: Application) =>
                    a.status === "under_review" || a.status === "submitted"
                ).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No pending applications
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredApplications
                      .filter(
                        (a: Application) =>
                          a.status === "under_review" ||
                          a.status === "submitted"
                      )
                      .map((application: Application) => (
                        <ApplicationCard
                          key={application.id}
                          application={application}
                          showActions={true}
                          onView={handleViewDetails}
                          onApprove={handleApprove}
                          onReject={handleReject}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="dialog-application-details">
          <DialogHeader>
            <DialogTitle className="font-heading">
              Application Details
            </DialogTitle>
            <DialogDescription>
              {selectedApplication?.referenceNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-muted-foreground">
                    Applicant Name
                  </p>
                  <p className="text-foreground">
                    {selectedApplication.fullName}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground">
                    Submitted Date
                  </p>
                  <p className="text-foreground">
                    {new Date(
                      selectedApplication.submittedDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold text-muted-foreground">
                    Property Address
                  </p>
                  <p className="text-foreground">
                    {selectedApplication.propertyAddress}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold text-muted-foreground">
                    Attached Documents
                  </p>
                  {selectedApplication?.documents &&
                  selectedApplication?.documents.length > 0 ? (
                    <ul className="list-disc ml-5">
                      {selectedApplication.documents.map((doc, idx) => (
                        <li key={idx}>
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Download Document {idx + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">
                      No documents attached
                    </p>
                  )}
                </div>
              </div>
              {/* {selectedApplication.status === "under_review" && (
                <div className="flex flex-col gap-2 pt-4">
                  <Button
                    onClick={() => handleApprove(selectedApplication)}
                    data-testid="button-dialog-approve"
                    disabled={updateStatusMutation.isPending}
                  >
                    Approve Application
                  </Button>
                  <Button
                    variant="destructive"
                    // onClick={() => handleReject(selectedApplication)}
                    onClick={() => setShowRejectNotes(true)}
                    data-testid="button-dialog-reject"
                    disabled={updateStatusMutation.isPending}
                  >
                    Reject Application
                  </Button>
                  {showRejectNotes && (
                    <div className="mt-4">
                      <label className="font-semibold mb-2 block">
                        Rejection Reason / Notes
                      </label>
                      <Textarea
                        value={rejectNotes}
                        onChange={(e) => setRejectNotes(e.target.value)}
                        placeholder="Enter reason for rejection..."
                        rows={3}
                        className="mb-2"
                      />
                      <Button
                        variant="destructive"
                        onClick={confirmReject}
                        disabled={
                          updateStatusMutation.isPending || !rejectNotes.trim()
                        }
                        data-testid="button-confirm-reject"
                      >
                        Confirm Reject
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowRejectNotes(false);
                          setRejectNotes("");
                        }}
                        className="ml-2"
                        data-testid="button-cancel-reject"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )} */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
