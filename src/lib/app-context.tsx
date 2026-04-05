"use client"

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Lang, TranslationKey } from '@/config/i18n'
import { t as translate } from '@/config/i18n'

type Theme = 'dark' | 'light'

interface AppContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey) => string
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [lang, setLang] = useState<Lang>('en')

  const applyTheme = useCallback((t: Theme) => {
    if (t === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    applyTheme(t)
    localStorage.setItem('theme', t)
  }, [applyTheme])

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) {
      setThemeState(saved)
      applyTheme(saved)
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const systemTheme: Theme = prefersDark ? 'dark' : 'light'
      setThemeState(systemTheme)
      applyTheme(systemTheme)
    }
    const savedLang = localStorage.getItem('lang') as Lang | null
    if (savedLang) setLang(savedLang)
  }, [])

  const handleSetLang = useCallback((l: Lang) => {
    setLang(l)
    localStorage.setItem('lang', l)
    document.documentElement.lang = l === 'ne' ? 'ne' : 'en'
  }, [])

  const t = useCallback((key: TranslationKey) => translate(key, lang), [lang])

  return (
    <AppContext.Provider value={{ theme, setTheme, lang, setLang: handleSetLang, t }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
