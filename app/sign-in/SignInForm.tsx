'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    await signIn('resend', { email, redirect: false, callbackUrl: '/dashboard' })
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="overflow-hidden rounded-xl bg-background shadow-sm md:grid md:grid-cols-2">

          {/* Left panel — branding */}
          <div className="relative hidden flex-col justify-between bg-navy-800 p-10 text-white md:flex">
            <Image src="/logo.png" alt="Kisku" width={110} height={36} className="brightness-0 invert" />
            <div>
              <p className="mb-2 text-[22px] font-medium leading-snug tracking-[-0.02em]">
                Print-ready photo albums, in minutes.
              </p>
              <p className="text-[13px] text-white/60">
                Upload, adjust, and export photos at 300 DPI — right in your browser. No app needed.
              </p>
            </div>
            <p className="text-[11px] text-white/40">© 2026 Kisku. All rights reserved.</p>
          </div>

          {/* Right panel — form */}
          <div className="flex flex-col justify-center p-8 md:p-10">
            {sent ? (
              <FieldGroup className="items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Check your email</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We sent a sign-in link to <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
                <FieldDescription className="text-center">
                  Didn&apos;t receive it?{' '}
                  <button onClick={() => setSent(false)} className="underline underline-offset-4 hover:text-primary">
                    Try again
                  </button>
                </FieldDescription>
              </FieldGroup>
            ) : (
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">Sign in</h1>
                    <p className="text-sm text-muted-foreground text-balance">
                      Enter your email and we&apos;ll send you a magic link — no password needed.
                    </p>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </Field>

                  <Field>
                    <Button type="submit" className="w-full bg-navy-800 hover:bg-navy-600" disabled={loading}>
                      {loading ? 'Sending…' : 'Send magic link'}
                    </Button>
                  </Field>

                  <FieldDescription className="text-center">
                    No account yet? One will be created automatically on first sign‑in.
                  </FieldDescription>
                </FieldGroup>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
