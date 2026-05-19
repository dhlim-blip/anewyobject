'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/account'
  const justRegistered = searchParams.get('registered') === '1'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const [showReset, setShowReset] = useState(false)

  async function handleSocialLogin(provider: 'google' | 'kakao') {
    setSocialLoading(provider)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      },
    })
    setSocialLoading(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      if (authError.message.includes('Email not confirmed')) {
        setError('이메일 인증이 필요합니다. 메일함을 확인해 주세요.')
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      }
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault()
    if (!email) {
      setError('이메일을 먼저 입력해 주세요.')
      return
    }
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account/reset-password`,
    })
    setResetSent(true)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        {/* Success banner from registration */}
        {justRegistered && (
          <div className="mb-6 px-4 py-3 bg-stone-50 border border-stone-200 text-xs text-stone-600 text-center leading-relaxed">
            이메일 인증을 완료하면 로그인할 수 있습니다.
          </div>
        )}

        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-2">WELCOME BACK</p>
          <h1 className="text-xl font-light text-stone-900">로그인</h1>
        </div>

        {!showReset ? (
          <>
            {/* Social login buttons */}
            <div className="space-y-3 mb-6">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={!!socialLoading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-stone-200 hover:border-stone-400 transition-colors text-sm text-stone-700 disabled:opacity-40"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                {socialLoading === 'google' ? '연결 중...' : 'Google로 로그인'}
              </button>

              {/* Kakao */}
              <button
                type="button"
                onClick={() => handleSocialLogin('kakao')}
                disabled={!!socialLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-[#FEE500] hover:bg-[#F0D800] transition-colors text-sm text-[#191919] font-medium disabled:opacity-40"
              >
                <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.029 0 0 3.13 0 6.99c0 2.467 1.587 4.638 3.996 5.875L3.03 16.11a.3.3 0 0 0 .435.337L8.1 13.93c.296.026.596.04.9.04 4.971 0 9-3.13 9-6.98C18 3.13 13.971 0 9 0z" fill="#191919"/>
                </svg>
                {socialLoading === 'kakao' ? '연결 중...' : '카카오로 로그인'}
              </button>

              {/* Naver */}
              <button
                type="button"
                disabled
                className="w-full flex items-center justify-center gap-3 py-3 bg-[#03C75A] text-sm text-white font-medium opacity-40 cursor-not-allowed"
                title="준비 중"
              >
                <span className="font-extrabold text-base leading-none">N</span>
                네이버 로그인 (준비 중)
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-stone-100" />
              <span className="text-[11px] text-stone-300 tracking-widest">OR</span>
              <div className="flex-1 h-px bg-stone-100" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-0 py-2.5 border-b border-stone-300 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
                  placeholder="이메일 주소"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-0 py-2.5 border-b border-stone-300 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
                  placeholder="비밀번호"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-stone-900 text-white text-xs tracking-[0.25em] hover:bg-stone-700 transition-colors disabled:opacity-40"
                >
                  {loading ? '로그인 중...' : '로그인'}
                </button>
              </div>

              <p className="text-center">
                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  className="text-xs text-stone-400 hover:text-stone-700 transition-colors"
                >
                  비밀번호를 잊으셨나요?
                </button>
              </p>
            </form>
          </>
        ) : (
          <div>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed text-center">
              가입하신 이메일로 비밀번호 재설정 링크를 보내드립니다.
            </p>
            {!resetSent ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">EMAIL</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-0 py-2.5 border-b border-stone-300 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
                    placeholder="이메일 주소"
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  type="submit"
                  className="w-full py-4 bg-stone-900 text-white text-xs tracking-widest hover:bg-stone-700 transition-colors"
                >
                  재설정 메일 보내기
                </button>
                <button
                  type="button"
                  onClick={() => setShowReset(false)}
                  className="w-full py-2 text-xs text-stone-400 hover:text-stone-700 transition-colors"
                >
                  ← 로그인으로
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto">
                  <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-stone-600">
                  재설정 메일을 보냈습니다.<br />메일함을 확인해 주세요.
                </p>
                <button
                  onClick={() => { setShowReset(false); setResetSent(false) }}
                  className="text-xs text-stone-500 underline"
                >
                  로그인으로 돌아가기
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-400">
            아직 계정이 없으신가요?{' '}
            <Link href="/register" className="text-stone-700 underline underline-offset-2 hover:text-stone-900">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
