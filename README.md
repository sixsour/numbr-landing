# Numbr landing

Лендинг Telegram-сервиса для голосового учёта расходов. Astro 7, без клиентского фреймворка.

```bash
npm install
npm run dev
npm run check
npm run build
```

## Структура

| Путь | Назначение |
|---|---|
| `src/config/product.ts` | Название, ссылки, SEO-тексты и примеры расходов |
| `src/components/` | Секции и общие элементы лендинга |
| `src/layouts/` | Основной и документный HTML-каркас |
| `src/pages/` | Главная, политика конфиденциальности и условия |
| `src/styles/global.css` | Дизайн-система и адаптивность |

Основной CTA ведёт в `@numbr_ai_bot`. Канонический адрес по умолчанию — `https://numbr.app`; его можно заменить через `SITE_URL` при сборке.
