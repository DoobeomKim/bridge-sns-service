// Home Page - Redirect to Login
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    // 로그인된 사용자는 대시보드로
    if (session.user.role === 'super_admin') {
      redirect('/admin')
    } else {
      redirect('/dashboard')
    }
  }

  // 비로그인 사용자는 로그인 페이지로
  redirect('/login')
}
