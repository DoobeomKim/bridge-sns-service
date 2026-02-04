// Login Page
import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-3xl font-bold">SNS 자동화 매니저</h1>
          <p className="mt-2 text-gray-600">로그인하여 시작하세요</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
