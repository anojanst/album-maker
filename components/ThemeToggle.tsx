'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@phosphor-icons/react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  return (
    <button
      onClick={() => mounted && setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="flex h-7 w-7 items-center justify-center rounded-[7px] border-[0.5px] border-(--color-border-tertiary) bg-(--color-background-secondary) text-(--color-text-secondary) transition-colors hover:border-(--color-border-secondary) hover:bg-(--color-background-tertiary)"
      aria-label="Toggle theme"
    >
      {mounted && resolvedTheme === 'dark'
        ? <SunIcon className="h-3.5 w-3.5" weight="light" />
        : <MoonIcon className="h-3.5 w-3.5" weight="light" />}
    </button>
  )
}
