import { siteDetails } from './siteDetails.js'

const LANG_FALLBACK = 'ru'

function buildOffer(lang) {
  const updatedAt = siteDetails.legal.updatedAt[lang] ?? siteDetails.legal.updatedAt[LANG_FALLBACK]
  const brandTagline = siteDetails.brandTagline[lang] ?? siteDetails.brandTagline[LANG_FALLBACK]
  const activationWindow =
    siteDetails.legal.activationWindow[lang] ??
    siteDetails.legal.activationWindow[LANG_FALLBACK]
  const workingHours =
    siteDetails.support.workingHours[lang] ?? siteDetails.support.workingHours[LANG_FALLBACK]

  const documents = {
    ru: {
      eyebrow: 'Публичная оферта',
      title: 'Условия оказания услуг по сопровождению подписок',
      lead: `${siteDetails.brandName} оказывает услуги по оформлению, сопровождению и технической координации цифровых подписок. ${brandTagline} Оплата заказа означает согласие клиента с условиями этой оферты.`,
      updatedAt,
      sections: [
        {
          title: '1. Что мы оказываем',
          paragraphs: [
            'Мы помогаем подобрать тариф, принять оплату, проверить данные клиента и организовать подключение выбранной цифровой подписки на один из доступных сервисов.',
            'Мы не являемся официальным представителем Spotify, OpenAI, Netflix, Discord и других упомянутых сервисов. Все товарные знаки принадлежат их правообладателям.',
          ],
        },
        {
          title: '2. Как оформляется заказ',
          paragraphs: [
            'Заказ оформляется через сайт, Telegram или другой официальный канал поддержки, указанный на сайте.',
            'Для выполнения заказа клиент может добровольно передать данные, необходимые для активации или продления доступа: адрес электронной почты, логин, ссылку на аккаунт или иные сведения, без которых подключение невозможно.',
          ],
          items: [
            'клиент подтверждает, что данные принадлежат ему либо переданы им на законном основании',
            'мы используем эти сведения только для исполнения оплаченного заказа',
            'если для активации не требуются логин или пароль, мы не запрашиваем их без необходимости',
          ],
        },
        {
          title: '3. Стоимость и оплата',
          paragraphs: [
            'Актуальные тарифы публикуются на сайте и в наших официальных каналах. Цена фиксируется на момент оформления заказа.',
            `Услуги оказываются по полной предоплате. Доступные способы оплаты: ${siteDetails.legal.paymentMethods.ru.join(', ')}.`,
          ],
          items: [
            'платёж считается принятым после подтверждения поступления средств',
            'мы не храним полные реквизиты банковских карт на своей стороне',
            'при ошибке в сумме или дубле платежа клиент может обратиться в поддержку для сверки и корректировки',
          ],
        },
        {
          title: '4. Сроки исполнения',
          paragraphs: [
            `Обычно заказ исполняется ${activationWindow}.`,
            `Поддержка обрабатывает обращения ${workingHours}. Если возникают ограничения со стороны сервиса, банка или платформы, срок может быть увеличен, о чём мы сообщаем клиенту.`,
          ],
        },
        {
          title: '5. Обязанности клиента',
          items: [
            'предоставлять точные и актуальные данные',
            'использовать подключённый сервис только в законных целях и в соответствии с правилами соответствующей платформы',
            'не передавать результат услуги третьим лицам, если это запрещено тарифом или правилами сервиса',
            'своевременно сообщать о проблемах с доступом, чтобы мы могли проверить заказ и помочь с восстановлением',
          ],
        },
        {
          title: '6. Возвраты и спорные ситуации',
          paragraphs: [
            'Если заказ ещё не исполнен и подключение не началось, вопрос возврата рассматривается индивидуально после проверки оплаты и статуса заявки.',
            'Если услуга уже оказана полностью или доступ активирован, возврат возможен только в части, в которой проблема возникла по нашей вине либо если это прямо требуется применимым законодательством.',
            'По любому спорному вопросу мы сначала стараемся восстановить доступ, заменить способ подключения или предложить соразмерное решение.',
          ],
        },
        {
          title: '7. Ограничение ответственности',
          paragraphs: [
            'Мы не отвечаем за изменения правил самих цифровых сервисов, блокировки аккаунтов за нарушения правил платформ, ограничения по странам, а также за перебои, вызванные сторонними поставщиками.',
            'Наша ответственность в любом случае ограничивается стоимостью конкретного оплаченного заказа, по которому возник спор.',
          ],
        },
        {
          title: '8. Контакты и реквизиты',
          paragraphs: [
            `По вопросам заказа и поддержки можно написать в Telegram ${siteDetails.support.telegramHandle}.`,
            'Фактические реквизиты предпринимателя, БИН и регистрационный адрес заполняются в отдельном конфигурационном файле сайта и используются в футере и на этой странице.',
          ],
        },
      ],
    },
    kz: {
      eyebrow: 'Жария оферта',
      title: 'Жазылымдарды сүйемелдеу қызметтерінің шарттары',
      lead: `${siteDetails.brandName} цифрлық жазылымдарды рәсімдеу, сүйемелдеу және техникалық үйлестіру қызметтерін көрсетеді. ${brandTagline} Тапсырысты төлеу осы оферта шарттарымен келісуді білдіреді.`,
      updatedAt,
      sections: [
        {
          title: '1. Қызмет мәні',
          paragraphs: [
            'Біз тарифті таңдауға, төлемді қабылдауға, клиент деректерін тексеруге және қолжетімді сервистердің біріне жазылымды қосуға көмектесеміз.',
            'Біз Spotify, OpenAI, Netflix, Discord және басқа аталған сервистердің ресми өкілі емеспіз. Барлық тауар белгілері олардың құқық иелеріне тиесілі.',
          ],
        },
        {
          title: '2. Тапсырысты рәсімдеу',
          paragraphs: [
            'Тапсырыс сайт, Telegram немесе сайтта көрсетілген ресми қолдау арнасы арқылы рәсімделеді.',
            'Қызметті орындау үшін клиент қосу не ұзарту үшін қажет деректерді өз еркімен бере алады.',
          ],
        },
        {
          title: '3. Төлем',
          paragraphs: [
            'Өзекті тарифтер сайтта және ресми арналарда жарияланады. Баға тапсырыс берілген сәтте бекітіледі.',
            `Қызмет толық алдын ала төлем арқылы көрсетіледі. Қолжетімді тәсілдер: ${siteDetails.legal.paymentMethods.kz.join(', ')}.`,
          ],
        },
        {
          title: '4. Орындау мерзімі',
          paragraphs: [
            `Әдетте тапсырыс ${activationWindow} орындалады.`,
            `Қолдау ${workingHours} режимінде жұмыс істейді.`,
          ],
        },
        {
          title: '5. Қайтарым мен жауапкершілік',
          paragraphs: [
            'Қызмет басталмаған болса, қайтарым төлем мен өтінім күйі тексерілгеннен кейін жеке қаралады.',
            'Сыртқы сервистер ережелерінің өзгеруі немесе елдік шектеулер үшін біз жауап бермейміз.',
          ],
        },
      ],
    },
    en: {
      eyebrow: 'Public offer',
      title: 'Terms for subscription support services',
      lead: `${siteDetails.brandName} provides ordering, activation support, and technical coordination for digital subscriptions. ${brandTagline} Paying for an order means the customer accepts these terms.`,
      updatedAt,
      sections: [
        {
          title: '1. Scope of service',
          paragraphs: [
            'We help customers choose a plan, process payment, verify order details, and coordinate activation of a digital subscription for one of the supported services.',
            'We are not an official representative of Spotify, OpenAI, Netflix, Discord, or any other named platform. All trademarks belong to their owners.',
          ],
        },
        {
          title: '2. Placing an order',
          paragraphs: [
            'Orders can be placed through the website, Telegram, or another official support channel listed on the website.',
            'The customer may voluntarily provide the account details required to activate or renew access.',
          ],
        },
        {
          title: '3. Payment and delivery',
          paragraphs: [
            'Current pricing is published on the website and official support channels. The price is locked at the moment of checkout.',
            `Services are provided on a prepaid basis. Available payment methods include ${siteDetails.legal.paymentMethods.en.join(', ')}.`,
            `Orders are usually fulfilled ${activationWindow}.`,
          ],
        },
        {
          title: '4. Refunds and liability',
          paragraphs: [
            'If activation has not started, refund requests are reviewed after payment verification.',
            'If the service has already been fully delivered, a refund is only available when the issue was caused by us or when required by law.',
          ],
        },
      ],
    },
  }

  return documents[lang] ?? documents[LANG_FALLBACK]
}

function buildPrivacy(lang) {
  const updatedAt = siteDetails.legal.updatedAt[lang] ?? siteDetails.legal.updatedAt[LANG_FALLBACK]
  const documents = {
    ru: {
      eyebrow: 'Политика конфиденциальности',
      title: 'Как мы обрабатываем данные клиентов',
      lead: `${siteDetails.brandName} использует персональные данные только в объёме, который нужен для оформления заказа, связи с клиентом и исполнения оплаченных услуг.`,
      updatedAt,
      sections: [
        {
          title: '1. Какие данные мы можем получать',
          items: [
            'имя или никнейм, указанные клиентом при обращении',
            'контакты для связи: Telegram, e-mail, номер телефона',
            'данные заказа, выбранного тарифа, даты оплаты и статуса подключения',
            'данные аккаунта, если они реально необходимы для подключения или продления услуги',
          ],
        },
        {
          title: '2. Для чего мы используем данные',
          items: [
            'для подтверждения заказа и связи с клиентом',
            'для активации, продления или восстановления цифровой подписки',
            'для ведения платёжного и сервисного учёта',
            'для предотвращения мошенничества и разрешения спорных ситуаций',
          ],
        },
        {
          title: '3. Как долго хранятся данные',
          paragraphs: [
            'Мы стараемся хранить только минимально необходимый набор сведений. Данные, которые нужны исключительно для технической активации, удаляются или обезличиваются после исполнения заказа, если более длительное хранение не требуется законом или для урегулирования спора.',
            'Переписка с поддержкой и сведения об оплате могут храниться дольше в целях учёта, безопасности и подтверждения условий заказа.',
          ],
        },
        {
          title: '4. Кому могут передаваться данные',
          paragraphs: [
            'Мы не продаём и не публикуем персональные данные клиентов.',
            'Передача возможна только платёжным партнёрам, техническим подрядчикам или иным лицам, которые участвуют в исполнении заказа, а также в случаях, когда это требуется законом.',
          ],
        },
        {
          title: '5. Как мы защищаем информацию',
          items: [
            'ограничиваем доступ к данным только тем сотрудникам и подрядчикам, кому они действительно нужны',
            'не запрашиваем лишние платёжные реквизиты и не храним полные номера банковских карт',
            'используем защищённые каналы связи и внутренние правила по обработке обращений',
          ],
        },
        {
          title: '6. Права клиента',
          paragraphs: [
            'Клиент может запросить уточнение, обновление или удаление своих данных, если это не противоречит нашему обязательству хранить сведения по закону или для уже открытого спора.',
            `Для обращений по персональным данным используйте Telegram ${siteDetails.support.telegramHandle}.`,
          ],
        },
      ],
    },
    kz: {
      eyebrow: 'Құпиялық саясаты',
      title: 'Клиент деректерін өңдеу тәртібі',
      lead: `${siteDetails.brandName} жеке деректерді тек тапсырысты рәсімдеу, клиентпен байланысу және ақылы қызметтерді орындау үшін қолданады.`,
      updatedAt,
      sections: [
        {
          title: '1. Жиналуы мүмкін деректер',
          items: [
            'клиент көрсеткен аты немесе никнеймі',
            'байланыс деректері: Telegram, e-mail, телефон',
            'тапсырыс және төлем туралы ақпарат',
            'қосу үшін қажет болса ғана аккаунт деректері',
          ],
        },
        {
          title: '2. Қолдану мақсаттары',
          items: [
            'тапсырысты растау және клиентпен байланысу',
            'жазылымды қосу, ұзарту немесе қалпына келтіру',
            'есеп жүргізу және алаяқтықтың алдын алу',
          ],
        },
        {
          title: '3. Клиент құқықтары',
          paragraphs: [
            `Клиент өз деректерін нақтылау, жаңарту немесе жою туралы өтінішті Telegram ${siteDetails.support.telegramHandle} арқылы жібере алады.`,
          ],
        },
      ],
    },
    en: {
      eyebrow: 'Privacy policy',
      title: 'How we handle customer data',
      lead: `${siteDetails.brandName} only uses personal data to the extent needed to process orders, communicate with customers, and deliver paid services.`,
      updatedAt,
      sections: [
        {
          title: '1. Data we may collect',
          items: [
            'name or nickname provided by the customer',
            'contact details such as Telegram, email, or phone number',
            'order details, payment date, and activation status',
            'account credentials only when they are truly required for activation or renewal',
          ],
        },
        {
          title: '2. Why we use the data',
          items: [
            'to confirm the order and contact the customer',
            'to activate, renew, or restore access',
            'to maintain payment and service records',
            'to prevent fraud and resolve disputes',
          ],
        },
        {
          title: '3. Data sharing and retention',
          paragraphs: [
            'We do not sell customer data. Information may only be shared with payment partners, technical contractors, or where required by law.',
            'We retain the minimum amount of data necessary for order fulfillment, support, security, and legal compliance.',
          ],
        },
      ],
    },
  }

  return documents[lang] ?? documents[LANG_FALLBACK]
}

function buildSafety(lang) {
  const updatedAt = siteDetails.legal.updatedAt[lang] ?? siteDetails.legal.updatedAt[LANG_FALLBACK]
  const activationWindow =
    siteDetails.legal.activationWindow[lang] ??
    siteDetails.legal.activationWindow[LANG_FALLBACK]

  const documents = {
    ru: {
      eyebrow: 'Политика оплаты',
      title: 'Оплата, сроки исполнения и проверка заказов',
      lead: `Эта страница описывает, как ${siteDetails.brandName} принимает оплату, подтверждает заказы и помогает клиенту при спорных или технических ситуациях.`,
      updatedAt,
      sections: [
        {
          title: '1. Способы оплаты',
          paragraphs: [
            `Мы принимаем оплату теми способами, которые указаны на сайте или подтверждены поддержкой: ${siteDetails.legal.paymentMethods.ru.join(', ')}.`,
            'Платёж считается успешным после подтверждения банком или платёжным партнёром.',
          ],
        },
        {
          title: '2. Проверка заказа',
          items: [
            'после оплаты мы сверяем заявку, тариф и переданные клиентом данные',
            'если для подключения не хватает информации, поддержка запрашивает уточнение',
            'подозрительные или противоречивые платежи могут быть временно приостановлены до ручной проверки',
          ],
        },
        {
          title: '3. Сроки подключения',
          paragraphs: [
            `Большинство заказов исполняется ${activationWindow}.`,
            'Если заказ оформлен ночью, в выходной день или при внешних технических ограничениях, подключение может занять больше времени. Мы сообщаем клиенту о задержке в рабочем канале связи.',
          ],
        },
        {
          title: '4. Возврат, повторная активация и отмена',
          paragraphs: [
            'Пока подключение не выполнено, клиент может написать в поддержку для проверки возможности отмены или возврата.',
            'Если проблема возникла уже после активации и она находится на нашей стороне, мы сначала предлагаем повторную активацию, замену решения или частичную компенсацию за неиспользованный период.',
          ],
        },
        {
          title: '5. Безопасность платежей',
          items: [
            'мы не просим отправлять полные данные банковской карты в чат',
            'скриншоты и подтверждения оплаты используются только для сверки заказа',
            'при необходимости ручной проверки клиенту могут задать уточняющие вопросы по времени и сумме платежа',
          ],
        },
      ],
    },
    kz: {
      eyebrow: 'Төлем саясаты',
      title: 'Төлем, орындау мерзімі және тапсырысты тексеру',
      lead: `Бұл бетте ${siteDetails.brandName} төлемді қалай қабылдайтыны, тапсырысты қалай растайтыны және даулы жағдайларда қалай көмектесетіні сипатталады.`,
      updatedAt,
      sections: [
        {
          title: '1. Төлем тәсілдері',
          paragraphs: [
            `Біз сайтта немесе қолдау арқылы расталған тәсілдермен төлем қабылдаймыз: ${siteDetails.legal.paymentMethods.kz.join(', ')}.`,
          ],
        },
        {
          title: '2. Қосылу мерзімі',
          paragraphs: [
            `Көпшілік тапсырыстар ${activationWindow} ішінде орындалады.`,
          ],
        },
        {
          title: '3. Даулы жағдайлар',
          paragraphs: [
            'Қызмет басталмаған болса, қайтару немесе болдырмау мүмкіндігі қолдаумен бірге тексеріледі.',
          ],
        },
      ],
    },
    en: {
      eyebrow: 'Payment policy',
      title: 'Payment, fulfillment, and order checks',
      lead: `This page explains how ${siteDetails.brandName} accepts payments, verifies orders, and handles technical or disputed cases.`,
      updatedAt,
      sections: [
        {
          title: '1. Accepted payments',
          paragraphs: [
            `We accept the payment methods listed on the website or confirmed by support, including ${siteDetails.legal.paymentMethods.en.join(', ')}.`,
          ],
        },
        {
          title: '2. Order review',
          items: [
            'we verify the plan, payment, and customer-provided activation details',
            'if information is missing, support will request clarification',
            'suspicious or inconsistent payments may be paused for manual review',
          ],
        },
        {
          title: '3. Fulfillment and refunds',
          paragraphs: [
            `Most orders are fulfilled ${activationWindow}.`,
            'Before activation starts, customers can contact support to review cancellation or refund options.',
          ],
        },
      ],
    },
  }

  return documents[lang] ?? documents[LANG_FALLBACK]
}

const legalDocumentBuilders = {
  offer: buildOffer,
  privacy: buildPrivacy,
  safety: buildSafety,
}

export function getLegalDocument(documentKey, lang) {
  const builder = legalDocumentBuilders[documentKey] ?? legalDocumentBuilders.offer
  return builder(lang)
}
