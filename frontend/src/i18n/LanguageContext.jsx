import { createContext, useContext, useState, useCallback } from 'react'
import translations from './translations.js'

const STORAGE_KEY = 'sf_lang'
const SUPPORTED = ['ru', 'kz', 'en']
const DEFAULT_LANG = 'ru'
const TRANSLATION_OVERRIDES = {
  ru: {
    'footer.tagline': 'Подписки на Spotify, YouTube Premium, ChatGPT Plus, Discord Nitro и другие сервисы',
    'footer.copyright': '© {year} Подписки на сервисы. Все товарные знаки принадлежат их правообладателям.',
    'landing.hero.title1': 'Подписки на',
    'landing.hero.title2': 'сервисы',
    'landing.hero.subtitle': 'Оформляем и сопровождаем подписки на Spotify, YouTube Premium, ChatGPT Plus, Discord Nitro и другие сервисы для Казахстана и России.',
    'landing.features.subtitle': 'Полностью управляемый сервис цифровых подписок для рынков KZ и RU.',
    'landing.feature3.desc': 'Автоматические ежедневные напоминания до наступления даты платежа. Никогда не теряйте доступ к нужному сервису.',
    'landing.step4.desc': 'После подтверждения администратором вы сразу получите доступ к выбранному сервису.',
    'landing.cta.desc': 'Подключайте нужный сервис быстро и без лишней рутины через Telegram.',
    'pricing.feature.kz1': 'Подключение выбранного сервиса',
    'pricing.feature.rug1': 'Подключение выбранного сервиса',
    'pricing.feature.ind1': 'Личный аккаунт сервиса',
    'faq.subtitle': 'Всё, что нужно знать о нашем сервисе подписок. Не нашли ответ?',
    'faq.a3': 'Подтверждение администратором обычно занимает несколько часов. У вас есть 30 минут на завершение оплаты после начала заказа. После подтверждения доступ к выбранному сервису предоставляется максимально быстро.',
    'faq.a5': 'Групповой план — место в общем плане сервиса, если такой формат доступен. Индивидуальный — личный аккаунт только для вас. Duo — аккаунт на двух человек.',
    'footer.supportLink': 'Написать @sptfy_premium_bot',
    'pricing.noteLink': '@sptfy_premium_bot',
    'faq.a1': 'Откройте наш Telegram-бот @sptfy_premium_bot, нажмите «Старт» и следуйте инструкциям. Выберите регион, план, совершите оплату и загрузите квитанцию.',
    'faq.a8': 'Если квитанция отклонена, вы можете повторно отправить данные в рамках того же запроса. Обратитесь в поддержку @sptfy_premium_bot.',
    'dashboard.reminder.overdue': '✕ Просрочен платёж. Обратитесь @sptfy_premium_bot срочно.',
  },
  kz: {
    'footer.tagline': 'Spotify, YouTube Premium, ChatGPT Plus, Discord Nitro және басқа сервистерге жазылымдар',
    'footer.copyright': '© {year} Сервистерге жазылымдар. Барлық тауар белгілері өз иелеріне тиесілі.',
    'landing.hero.title1': 'Сервистерге',
    'landing.hero.title2': 'жазылымдар',
    'landing.hero.subtitle': 'Қазақстан мен Ресей үшін Spotify, YouTube Premium, ChatGPT Plus, Discord Nitro және басқа сервистерге жазылымдарды рәсімдеп, сүйемелдейміз.',
    'landing.features.subtitle': 'KZ және RU нарықтарына арналған толық басқарылатын цифрлық жазылымдар сервисі.',
    'landing.feature3.desc': 'Төлем мерзімі жақындағанда автоматты күнделікті еске салулар. Қажетті сервиске қолжетімділікті жоғалтпаңыз.',
    'landing.step4.desc': 'Әкімші растағаннан кейін таңдалған сервиске қолжетімділікті дереу аласыз.',
    'landing.cta.desc': 'Қажетті сервиске Telegram арқылы тез және ыңғайлы қосылыңыз.',
    'pricing.feature.kz1': 'Таңдалған сервисті қосу',
    'pricing.feature.rug1': 'Таңдалған сервисті қосу',
    'pricing.feature.ind1': 'Жеке сервис аккаунты',
    'faq.subtitle': 'Жазылымдар сервисіміз туралы білу қажет нәрсенің бәрі. Жауап таппадыңыз ба?',
    'faq.a3': 'Әкімші растауы әдетте бірнеше сағат ішінде жасалады. Тапсырыс бастағаннан кейін төлемді аяқтауға 30 минут уақытыңыз бар. Растағаннан кейін таңдалған сервиске қолжетімділік мүмкіндігінше тез беріледі.',
    'faq.a5': 'Топтық жоспар — егер сервис қолдаса, ортақ жоспардағы орын. Жеке жоспар — тек сізге арналған жеке аккаунт. Duo — екі адамға арналған аккаунт.',
    'footer.supportLink': '@sptfy_premium_bot жазу',
    'pricing.noteLink': '@sptfy_premium_bot',
    'faq.a1': '@sptfy_premium_bot Telegram-ботымызды ашып, «Старт» басыңыз да, нұсқауларды орындаңыз. Аймақты, жоспарды таңдап, төлем жасап, чекті жүктеңіз.',
    'faq.a8': 'Чек қабылданбаса, сол сұраныс шеңберінде деректерді қайта жіберуге болады. @sptfy_premium_bot қолдауына хабарласыңыз.',
    'dashboard.reminder.overdue': '✕ Төлем кешіктірілді. @sptfy_premium_bot-қа шұғыл хабарласыңыз.',
  },
  en: {
    'footer.tagline': 'Subscriptions for Spotify, YouTube Premium, ChatGPT Plus, Discord Nitro, and more',
    'footer.copyright': '© {year} Service subscriptions. All trademarks belong to their respective owners.',
    'landing.hero.title1': 'Subscriptions to',
    'landing.hero.title2': 'popular services',
    'landing.hero.subtitle': 'We help customers in Kazakhstan and Russia subscribe to Spotify, YouTube Premium, ChatGPT Plus, Discord Nitro, and other services through Telegram.',
    'landing.features.subtitle': 'A fully managed digital subscription service built for the KZ and RU markets.',
    'landing.feature3.desc': 'Automated daily reminders before your payment is due. Never lose access to the service you use.',
    'landing.step4.desc': 'Once approved by an admin, you receive access to your chosen service right away.',
    'landing.cta.desc': 'Get the subscription you need quickly and conveniently through Telegram.',
    'pricing.feature.kz1': 'Activation of your chosen service',
    'pricing.feature.rug1': 'Activation of your chosen service',
    'pricing.feature.ind1': 'Personal service account',
    'faq.subtitle': 'Everything you need to know about our subscription service. Can\'t find an answer?',
    'faq.a3': 'Admin approval is typically done within a few hours. You have a 30-minute window to complete the payment after starting an order. Once approved, you receive access to your chosen service as quickly as possible.',
    'faq.a5': 'Group plans place you into a shared plan when the service supports it. Individual plans give you a personal account. Duo plans cover two people on one account.',
    'footer.supportLink': 'Contact @sptfy_premium_bot',
    'pricing.noteLink': '@sptfy_premium_bot',
    'faq.a1': 'Open our Telegram bot @sptfy_premium_bot, press Start, and follow the guided buy flow. Select your region, choose a plan, make the payment, and upload your receipt.',
    'faq.a8': 'If your receipt is rejected by the admin, you can resend updated credentials within the same request. Contact @sptfy_premium_bot for support.',
    'dashboard.reminder.overdue': '✕ Payment overdue. Contact @sptfy_premium_bot immediately.',
  },
}

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
        TRANSLATION_OVERRIDES[lang]?.[key] ??
        translations[lang]?.[key] ??
        TRANSLATION_OVERRIDES[DEFAULT_LANG]?.[key] ??
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
