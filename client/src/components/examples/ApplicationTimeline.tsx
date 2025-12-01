import ApplicationTimeline from '../ApplicationTimeline'

export default function ApplicationTimelineExample() {
  return (
    <div className="max-w-md">
      <ApplicationTimeline 
        status="under_review" 
        submittedDate="2025-01-15"
        reviewDate="2025-01-16"
      />
    </div>
  )
}
