import ApplicationForm from '../ApplicationForm'

export default function ApplicationFormExample() {
  return (
    <div className="max-w-3xl">
      <ApplicationForm onSubmit={(data) => console.log("Form submitted:", data)} />
    </div>
  )
}
