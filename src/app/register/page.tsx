'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Step = 'form' | 'verify'

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: { zonecode: string; roadAddress: string; jibunAddress: string }) => void
      }) => { open: () => void }
    }
  }
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    postalCode: '',
    address: '',
    addressDetail: '',
    marketing: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const scriptLoaded = useRef(false)

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  function onPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))
  }

  function openPostcode() {
    const load = () => {
      new window.daum.Postcode({
        oncomplete(data) {
          setForm((prev) => ({
            ...prev,
            postalCode: data.zonecode,
            address: data.roadAddress || data.jibunAddress,
          }))
        },
      }).open()
    }

    if (scriptLoaded.current) {
      load()
      return
    }
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.onload = () => { scriptLoaded.current = true; load() }
    document.head.appendChild(script)
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
    if (!form.postalCode) {
      setError('배송지 주소를 입력해 주세요.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            phone: form.phone,
            postal_code: form.postalCode,
            address: form.address,
            address_detail: form.addressDetail,
            marketing_agreed: form.marketing,
          },
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

      // Save extra profile fields after signup
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name: form.name,
          phone: form.phone,
          postal_code: form.postalCode,
          address: form.address,
          address_detail: form.addressDetail,
          marketing_agreed: form.marketing,
        })
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
          <Link
            href="/login"
            className="block w-full py-3 text-xs text-stone-500 hover:text-stone-800 border border-stone-200 hover:border-stone-400 transition-colors"
          >
            로그인 페이지로 →
          </Link>
          <p className="text-xs text-stone-300 mt-6">스팸함도 확인해 주세요.</p>
        </div>
      </div>
    )
  }

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-2">JOIN US</p>
          <h1 className="text-xl font-light text-stone-900">회원가입</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-0">

          {/* 계정 정보 */}
          <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-4">계정 정보</p>

          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">이름 *</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                className="w-full px-0 py-2.5 border-b border-stone-200 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
                placeholder="홍길동"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">이메일 *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                autoComplete="email"
                className="w-full px-0 py-2.5 border-b border-stone-200 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">휴대폰 번호 *</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={onPhoneChange}
                required
                className="w-full px-0 py-2.5 border-b border-stone-200 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
                placeholder="010-0000-0000"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">비밀번호 *</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                required
                autoComplete="new-password"
                className="w-full px-0 py-2.5 border-b border-stone-200 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
                placeholder="6자 이상"
              />
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((l) => (
                      <div key={l} className="h-0.5 flex-1 transition-colors duration-300"
                        style={{ backgroundColor: strength >= l ? (l === 1 ? '#ef4444' : l === 2 ? '#f59e0b' : '#22c55e') : '#e7e5e4' }}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    {strength === 1 ? '약함' : strength === 2 ? '보통' : '강함'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">비밀번호 확인 *</label>
              <input
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={onChange}
                required
                autoComplete="new-password"
                className="w-full px-0 py-2.5 border-b border-stone-200 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
                placeholder="비밀번호 재입력"
              />
              {form.confirm && form.password !== form.confirm && (
                <p className="text-[11px] text-red-400 mt-1">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>
          </div>

          {/* 배송지 */}
          <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase mb-4">기본 배송지</p>

          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">우편번호 *</label>
              <div className="flex gap-2">
                <input
                  value={form.postalCode}
                  readOnly
                  className="w-28 px-0 py-2.5 border-b border-stone-200 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300"
                  placeholder="00000"
                />
                <button
                  type="button"
                  onClick={openPostcode}
                  className="px-4 py-2 border border-stone-300 text-xs text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors"
                >
                  주소 찾기
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">기본 주소 *</label>
              <input
                value={form.address}
                readOnly
                className="w-full px-0 py-2.5 border-b border-stone-200 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300"
                placeholder="주소 찾기 버튼을 눌러주세요"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1.5 tracking-wider">상세 주소</label>
              <input
                name="addressDetail"
                value={form.addressDetail}
                onChange={onChange}
                className="w-full px-0 py-2.5 border-b border-stone-200 focus:border-stone-900 focus:outline-none text-sm bg-transparent text-stone-900 placeholder:text-stone-300 transition-colors"
                placeholder="동/호수, 건물명 등"
              />
            </div>
          </div>

          {/* 마케팅 동의 */}
          <div className="mb-8 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-0.5 accent-stone-900" />
              <span className="text-xs text-stone-600 leading-relaxed">
                <Link href="/policy/terms" className="underline underline-offset-2 hover:text-stone-900">이용약관</Link>
                {' '}및{' '}
                <Link href="/policy/privacy" className="underline underline-offset-2 hover:text-stone-900">개인정보처리방침</Link>에 동의합니다. (필수)
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input name="marketing" type="checkbox" checked={form.marketing} onChange={onChange} className="mt-0.5 accent-stone-900" />
              <span className="text-xs text-stone-500 leading-relaxed">
                신상품 및 프로모션 소식을 이메일로 받겠습니다. (선택)
              </span>
            </label>
          </div>

          {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-stone-900 text-white text-xs tracking-[0.25em] hover:bg-stone-700 transition-colors disabled:opacity-40"
          >
            {loading ? '처리 중...' : '가입하기'}
          </button>
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
