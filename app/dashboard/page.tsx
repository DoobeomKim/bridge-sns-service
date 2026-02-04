// Dashboard Page
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // 슈퍼 관리자는 관리자 페이지로 리다이렉트
  if (session.user.role === 'super_admin') {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">SNS 자동화 매니저</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{session.user.email}</span>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  로그아웃
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">대시보드</h2>
            <p className="text-gray-600">환영합니다, {session.user.email}!</p>

            <div className="mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-blue-800">
                  🚧 현재 개발 중입니다. 곧 Instagram 연동 기능이 추가됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
