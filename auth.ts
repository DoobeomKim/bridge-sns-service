// NextAuth.js Main Configuration
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { query } from './lib/db/client'
import bcrypt from 'bcrypt'

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const email = credentials.email as string
        const password = credentials.password as string

        if (!email || !password) {
          throw new Error('이메일과 비밀번호를 입력해주세요.')
        }

        // 사용자 조회
        const users = await query<{
          id: string
          email: string
          name: string | null
          password_hash: string | null
        }>(`
          SELECT u.id, u.email, u.name, u.password_hash
          FROM users u
          WHERE u.email = $1
        `, [email])

        const user = users[0]

        if (!user || !user.password_hash) {
          throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
        }

        // 비밀번호 확인
        const isValid = await bcrypt.compare(password, user.password_hash)

        if (!isValid) {
          throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
        }

        // 프로필 정보 조회 (role, organization_id)
        const profiles = await query<{
          role: string
          organization_id: string | null
        }>(`
          SELECT role, organization_id
          FROM profiles
          WHERE id = $1
        `, [user.id])

        const profile = profiles[0]

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: profile?.role || 'org_admin',
          organizationId: profile?.organization_id || null,
        }
      },
    }),
  ],
})
