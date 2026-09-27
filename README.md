# Romantic date invitation

Интерактивное приглашение на свидание на React + Vite с серверной отправкой результата в Telegram.

## Локальный запуск

```bash
npm install
npm run dev
```

## Telegram и Vercel

Скопируйте `.env.example` в `.env` только для локальной разработки. Не добавляйте `.env` в репозиторий.

- `TELEGRAM_BOT_TOKEN` — токен Telegram-бота.
- `TELEGRAM_CHAT_ID` — ID чата, куда бот отправляет сообщение.

На Vercel добавьте оба значения в **Project → Settings → Environment Variables**. Фронтенд обращается только к относительному маршруту `/api/send-telegram`; секреты доступны лишь серверной функции `api/send-telegram.js`.

Для деплоя импортируйте репозиторий в Vercel: платформа автоматически соберёт Vite-приложение и обнаружит функцию в `api/`.
