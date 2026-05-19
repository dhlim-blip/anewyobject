'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Step = 'form' | 'verify'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { name: form.name },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
        },
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('이미 가입된 이메일입니다. 로그인해 주세요.')
        } else {
          setError(authError.message)
        }
        return
      }

      setStep('verify')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'verify') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-3">CHECK YOUR EMAIL</p>
          <h2 className="text-xl font-light text-stone-900 mb-4">이메일을 확인해 주세요</h2>
          <p className="text-sm text-stone-500 leading-relaxed mb-2">
            <span className="font-medium text-stone-700">{form.email}</span>
          </p>
          <p className="text-sm text-stone-500 leading-relaxed mb-8">
            인증 링크를 보내드렸습니다.<br />
            메일을 확인한 뒤 링크를 클릭하면 가입이 완료됩니다.
          </p>

          <div className="space-y-3">
            <button
              onClick={async () => {
                const supabase = createClient()
                const { error } = await supabase.auth.resend({
                  type: 'signup',
                  email: form.email,
                  options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
                  },
                })
                alert(error ? '메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.' : '인증 메일을 다시 보냈습니다.')
              }}
              className="w-full py-3 text-xs text-stone-500 hover:text-stone-800 border border-stone-200 hover:border-stone-400 transition-colors"
            >
              인증 메일 재발송
            </button>
            <Link
              href="/login"
              className="block w-full py-3 text-xs text-stone-500 hover:text-stone-800 transition-colors"
            >
              로그인 페이지로 →
            </Link>
          </div>

          <p className="text-xs text-stone-300 mt-8 leading-relaxed">
            스팸함도 확인해 주세요.<br />
            메일이 오지 않으면 hello@anewyobject.com으로 문의해 주세요.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-2">JOIN US</p>
          <h1 className="text-xl font-light text-stone-900">회원가입</h1>
          <p className="text-xs text-stone-400 mt-2">
            anewy와 함께하는 식물 이야기
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">NAME</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              autoComplete="name"
              className="w-full px-0 py-2.5 border-b border-stone-300 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
              placeholder="이름을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">EMAIL</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              autoComplete="email"
              className="w-full px-0 py-2.5 border-b border-stone-300 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
              placeholder="이메일 주소"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">PASSWORD</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
              autoComplete="new-password"
              className="w-full px-0 py-2.5 border-b border-stone-300 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
              placeholder="6자 이상"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">CONFIRM PASSWORD</label>
            <input
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={onChange}
              required
              autoComplete="new-password"
              className="w-full px-0 py-2.5 border-b border-stone-300 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
              placeholder="비밀번호 재입력"
            />
          </div>

          {/* Password strength */}
          {form.password && (
            <div className="pt-1">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className="h-0.5 flex-1 transition-colors duration-300"
                    style={{
                      backgroundColor:
                        form.password.length >= level * 4
                          ? level === 1 ? '#ef4444' : level === 2 ? '#f59e0b' : '#22c55e'
                          : '#e7e5e4',
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-stone-400">
                {form.password.length < 4 ? '너무 짧음'
                  : form.password.length < 8 ? '보통'
                  : '강함'}
              </p>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 pt-1">{error}</p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-stone-900 text-white text-xs tracking-[0.25em] hover:bg-stone-700 transition-colors disabled:opacity-40"
            >
              {loading ? '처리 중...' : '가입하기'}
            </button>
          </div>

          <p className="text-xs text-stone-400 text-center leading-relaxed pt-2">
            가입하면{' '}
            <Link href="/policy/terms" className="underline underline-offset-2 hover:text-stone-700">
              이용약관
            </Link>{' '}
            및{' '}
            <Link href="/policy/privacy" className="underline underline-offset-2 hover:text-stone-700">
              개인정보처리방침
            </Link>
            에 동의하게 됩니다.
          </p>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-400">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-stone-700 underline underline-offset-2 hover:text-stone-900">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
