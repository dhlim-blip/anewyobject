'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError('비밀번호 변경에 실패했습니다. 링크가 만료되었을 수 있습니다.')
      return
    }

    setDone(true)
    setTimeout(() => router.push('/account'), 2000)
  }

  if (done) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-stone-700">비밀번호가 변경되었습니다.</p>
          <p className="text-xs text-stone-400 mt-1">잠시 후 계정 페이지로 이동합니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-2">RESET PASSWORD</p>
          <h1 className="text-xl font-light text-stone-900">새 비밀번호 설정</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">NEW PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-0 py-2.5 border-b border-stone-300 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
              placeholder="6자 이상"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">CONFIRM PASSWORD</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-0 py-2.5 border-b border-stone-300 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
              placeholder="비밀번호 재입력"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-stone-900 text-white text-xs tracking-[0.25em] hover:bg-stone-700 transition-colors disabled:opacity-40"
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
