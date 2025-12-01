import ApplicationCard from '../ApplicationCard'

export default function ApplicationCardExample() {
  const application = {
    id: "1",
    referenceNumber: "RCC-2025-001234",
    fullName: "Tendai Moyo",
    idNumber: "63-123456X78",
    phoneNumber: "+263 77 123 4567",
    email: "tendai@example.com",
    propertyAddress: "123 Robert Mugabe Avenue, Masvingo",
    standNumber: "12345",
    propertyType: "residential",
    reason: "Property sale",
    status: "under_review",
    submittedDate: new Date("2025-01-15"),
    reviewDate: new Date("2025-01-16"),
    completedDate: null,
    adminNotes: null,
    reviewedBy: null,
  };

  return (
    <div className="max-w-md">
      <ApplicationCard 
        application={application}
        showActions={true}
        onView={() => console.log("View clicked")}
        onApprove={() => console.log("Approve clicked")}
        onReject={() => console.log("Reject clicked")}
      />
    </div>
  )
}
