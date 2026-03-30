import { createContext, useContext, useState, useCallback } from 'react'
import translations from './translations.js'

const STORAGE_KEY = 'sf_lang'
const SUPPORTED = ['ru', 'kz', 'en']
const DEFAULT_LANG = 'ru'

/**
 * Read the stored / initial locale.
 * Falls back to DEFAULT_LANG if the stored value is unrecognised.
 */
function getInitialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && SUPPORTED.includes(stored)) return stored
  } catch {
    // localStorage blocked (e.g. private browsing)
  }
  return DEFAULT_LANG
}

const LanguageContext = createContext(null)

/**
 * Wraps the app and provides { lang, setLang, t } to all descendants.
 */
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  const setLang = useCallback((newLang) => {
    if (!SUPPORTED.includes(newLang)) return
    setLangState(newLang)
    try {
      localStorage.setItem(STORAGE_KEY, newLang)
    } catch {
      // ignore
    }
  }, [])

  /**
   * Translate a key, with optional variable interpolation.
   * Usage: t('footer.copyright', { year: 2025 })
   *        t('pricing.perMonth', { currency: '₸', price: 700 })
   */
  const t = useCallback(
    (key, vars) => {
      const str =
        translations[lang]?.[key] ??
        translations[DEFAULT_LANG]?.[key] ??
        key

      if (!vars) return str

      return Object.entries(vars).reduce(
        (acc, [k, v]) => acc.replaceAll(`{${k}}`, v),
        str,
      )
    },
    [lang],
  )

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Hook to access translation utilities.
 * Must be used inside <LanguageProvider>.
 */
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
