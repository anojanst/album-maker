'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { EnvelopeSimpleIcon, CircleNotchIcon } from '@phosphor-icons/react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    await signIn('resend', { email, redirect: false })
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-(--color-background-primary) px-4">
      <div className="w-full max-w-[360px]">
        <div className="mb-8 flex justify-center">
          <Image src="/logo.png" alt="Kisku.online" width={140} height={46} />
        </div>

        <div className="rounded-[16px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-primary) p-8">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-[10px] bg-(--color-background-secondary)">
                <EnvelopeSimpleIcon className="h-5 w-5 text-(--color-text-secondary)" weight="light" />
              </div>
              <p className="text-[15px] font-medium tracking-[-0.02em] text-(--color-text-primary)">Check your email</p>
              <p className="mt-1.5 text-[13px] text-(--color-text-secondary)">
                We&apos;ve sent a sign-in link to <span className="text-(--color-text-primary)">{email}</span>
              </p>
            </div>
          ) : (
            <>
              <p className="mb-1 text-[18px] font-medium tracking-[-0.02em] text-(--color-text-primary)">Sign in</p>
              <p className="mb-6 text-[13px] text-(--color-text-secondary)">
                Enter your email to receive a magic link. No password needed.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-(--color-text-tertiary)">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="rounded-[8px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-secondary) px-3 py-2.5 text-[13px] text-(--color-text-primary) outline-none placeholder:text-(--color-text-tertiary) focus:border-(--color-border-primary)"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-[8px] bg-navy-800 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-navy-600 active:scale-[0.98] disabled:opacity-60"
                >
                  {loading && <CircleNotchIcon className="h-3.5 w-3.5 animate-spin" weight="light" />}
                  Send magic link
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
