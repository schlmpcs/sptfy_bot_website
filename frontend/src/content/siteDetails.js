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
    telegramHandle: readEnv('VITE_SUPPORT_TELEGRAM_HANDLE', '@sptfy_premium_bot'),
    telegramUrl: readEnv('VITE_SUPPORT_TELEGRAM_URL', 'https://t.me/sptfy_premium_bot'),
    email: readEnv('VITE_SUPPORT_EMAIL', 'sptfykz@outlook.com'),
    phone: readEnv('VITE_SUPPORT_PHONE', '+7777467429'),
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
    inn: readEnv('VITE_LEGAL_INN'),
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
    {
      to: '/refund-policy',
      label:
        {
          ru: 'Политика возврата',
          kz: 'Қайтару саясаты',
          en: 'Refund policy',
        }[lang] ?? 'Политика возврата',
    },
  ]
}

export function getBusinessDetails(lang) {
  const labels =
    {
      ru: {
        inn: 'БИН',
        address: 'Адрес регистрации',
        telegram: 'Telegram',
        email: 'E-mail',
        phone: 'Телефон',
        setup: 'Заполните реквизиты в файле siteDetails.js',
      },
      kz: {
        inn: 'БИН',
        address: 'Тіркеу мекенжайы',
        telegram: 'Telegram',
        email: 'E-mail',
        phone: 'Телефон',
        setup: 'Деректерді siteDetails.js файлына толтырыңыз',
      },
      en: {
        inn: 'BIN',
        address: 'Registered address',
        telegram: 'Telegram',
        email: 'Email',
        phone: 'Phone',
        setup: 'Fill in the business details in siteDetails.js',
      },
    }[lang] ??
    {
      inn: 'БИН',
      address: 'Адрес регистрации',
      telegram: 'Telegram',
      email: 'E-mail',
      phone: 'Телефон',
      setup: 'Заполните реквизиты в файле siteDetails.js',
    }

  const lines = [siteDetails.legal.ownerName]

  if (siteDetails.legal.inn) lines.push(`${labels.inn} ${siteDetails.legal.inn}`)
  if (siteDetails.legal.registrationAddress) {
    lines.push(`${labels.address}: ${siteDetails.legal.registrationAddress}`)
  }
  if (siteDetails.support.telegramHandle) {
    lines.push(`${labels.telegram}: ${siteDetails.support.telegramHandle}`)
  }
  if (siteDetails.support.email) {
    lines.push(`${labels.email}: ${siteDetails.support.email}`)
  }
  if (siteDetails.support.phone) {
    lines.push(`${labels.phone}: ${siteDetails.support.phone}`)
  }

  if (
    !siteDetails.legal.inn &&
    !siteDetails.legal.registrationAddress
  ) {
    lines.push(labels.setup)
  }

  return lines
}
