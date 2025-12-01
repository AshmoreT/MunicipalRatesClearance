import AdminLoginForm from '../AdminLoginForm'

export default function AdminLoginFormExample() {
  return <AdminLoginForm onLogin={(data) => console.log("Login:", data)} />
}
