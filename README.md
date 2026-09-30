# Трекер расходов

Простое веб-приложение для учёта личных трат: React + Vite на фронте, Express на бэкенде, данные хранятся в PostgreSQL (Supabase).

## Возможности

- Добавление траты (сумма, категория, дата, заметка)
- Список всех трат с удалением
- Сумма по категориям и общая сумма за текущий месяц

## Запуск

1. Скопируйте `server/.env.example` в `server/.env` и укажите `DATABASE_URL` — строку подключения к вашей базе Supabase.
   Используйте **Connection pooling** (Supabase Dashboard → кнопка "Connect" → "Session pooler"/"Transaction pooler"), а не прямой хост `db.<ref>.supabase.co` — он резолвится только в IPv6 и может быть недоступен из некоторых сетей (например, WSL2 без IPv6-маршрута).

   ```
   DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-<n>-<region>.pooler.supabase.com:5432/postgres
   ```

2. Установите зависимости и запустите:

```bash
npm install
npm run dev
```

Это поднимает и бэкенд (`http://localhost:3001`), и фронтенд (`http://localhost:5173`) одновременно. Открывайте `http://localhost:5173`.

Таблица `expenses` создаётся автоматически при старте сервера, если её ещё нет.

`server/.env` не коммитится в git (см. `.gitignore`) — храните в нём реальную строку подключения только локально.

## Структура проекта

```
expense-tracker/
├── server/    Express API + PostgreSQL (Supabase)
└── client/    React (Vite) фронтенд
```

## API

| Метод  | Путь                | Описание                                  |
|--------|---------------------|--------------------------------------------|
| GET    | /api/expenses        | Список всех трат                          |
| POST   | /api/expenses        | Добавить трату `{amount, category, date, note}` |
| DELETE | /api/expenses/:id    | Удалить трату                             |
| GET    | /api/stats           | Сумма за текущий месяц + разбивка по категориям |
