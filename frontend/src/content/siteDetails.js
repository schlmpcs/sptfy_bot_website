function readEnv(key, fallback = '') {
  const value = import.meta.env[key]
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export const siteDetails = {
  brandName: 'Подписки на сервисы',
  brandTagline: {
    ru: 'Сервис сопровождения подписок на Spotify, YouTube Premium, ChatGPT Plus, Discord Nitro и другие цифровые сервисы.',
    kz: 'Spotify, YouTube Premium, ChatGPT Plus, Discord Nitro және басқа цифрлық сервистерге жазылымдарды сүйемелдеу сервисі.',
    en: 'A managed service for Spotify, YouTube Premium, ChatGPT Plus, Discord Nitro, and other digital subscriptions.',
  },
  support: {
    telegramHandle: readEnv('VITE_SUPPORT_TELEGRAM_HANDLE', '@sptfy_premium'),
    telegramUrl: readEnv('VITE_SUPPORT_TELEGRAM_URL', 'https://t.me/sptfy_premium'),
    email: readEnv('VITE_SUPPORT_EMAIL'),
    phone: readEnv('VITE_SUPPORT_PHONE'),
    workingHours: {
      ru: 'ежедневно, обычно отвечаем в течение нескольких часов',
      kz: 'күн сайын, әдетте бірнеше сағат ішінде жауап береміз',
      en: 'daily, we usually reply within a few hours',
    },
  },
  legal: {
    updatedAt: {
      ru: '30 марта 2026',
      kz: '2026 жылғы 30 наурыз',
      en: 'March 30, 2026',
    },
    footerTitle: {
      ru: 'Реквизиты ИП',
      kz: 'ЖК деректемелері',
      en: 'Business details',
    },
    ownerName: readEnv('VITE_LEGAL_OWNER_NAME', 'ИП / ФИО предпринимателя'),
    bin: readEnv('VITE_LEGAL_BIN'),
    registrationAddress: readEnv('VITE_LEGAL_REGISTRATION_ADDRESS'),
    paymentMethods: {
      ru: ['банковская карта', 'СБП', 'локальные переводы по согласованию'],
      kz: ['банк картасы', 'Kaspi немесе аударым', 'келісім бойынша өзге тәсілдер'],
      en: ['bank card', 'SBP or local transfer', 'other methods by agreement'],
    },
    activationWindow: {
      ru: 'обычно в день оплаты, в отдельных случаях до 48 часов',
      kz: 'көбіне төлем жасалған күні, кейде 48 сағатқа дейін',
      en: 'usually on the day of payment, up to 48 hours in exceptional cases',
    },
  },
}

export function getLegalLinks(lang) {
  return [
    {
      to: '/offer',
      label:
        {
          ru: 'Публичная оферта',
          kz: 'Жария оферта',
          en: 'Public offer',
        }[lang] ?? 'Публичная оферта',
    },
    {
      to: '/privacy',
      label:
        {
          ru: 'Политика конфиденциальности',
          kz: 'Құпиялық саясаты',
          en: 'Privacy policy',
        }[lang] ?? 'Политика конфиденциальности',
    },
    {
      to: '/safety',
      label:
        {
          ru: 'Политика оплаты',
          kz: 'Төлем саясаты',
          en: 'Payment policy',
        }[lang] ?? 'Политика оплаты',
    },
  ]
}

export function getBusinessDetails(lang) {
  const labels =
    {
      ru: {
        bin: 'БИН',
        address: 'Адрес регистрации',
        setup: 'Заполните реквизиты в файле siteDetails.js',
      },
      kz: {
        bin: 'БИН',
        address: 'Тіркеу мекенжайы',
        setup: 'Деректерді siteDetails.js файлына толтырыңыз',
      },
      en: {
        bin: 'BIN',
        address: 'Registered address',
        setup: 'Fill in the business details in siteDetails.js',
      },
    }[lang] ??
    {
      bin: 'БИН',
      address: 'Адрес регистрации',
      setup: 'Заполните реквизиты в файле siteDetails.js',
    }

  const lines = [siteDetails.legal.ownerName]

  if (siteDetails.legal.bin) lines.push(`${labels.bin} ${siteDetails.legal.bin}`)
  if (siteDetails.legal.registrationAddress) {
    lines.push(`${labels.address}: ${siteDetails.legal.registrationAddress}`)
  }

  if (
    !siteDetails.legal.bin &&
    !siteDetails.legal.registrationAddress
  ) {
    lines.push(labels.setup)
  }

  return lines
}
