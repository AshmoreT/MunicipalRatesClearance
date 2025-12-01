import TrackingForm from '../TrackingForm'

export default function TrackingFormExample() {
  return (
    <div className="max-w-2xl">
      <TrackingForm onSearch={(ref) => console.log("Searching for:", ref)} />
    </div>
  )
}
