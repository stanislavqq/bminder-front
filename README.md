# Система управления днями рождения

Веб-приложение для управления записями дней рождений с интерактивными вкладками и статистикой на React и Express.

## Возможности

- ✅ Добавление и редактирование записей о днях рождения
- ✅ Поддержка записей с годом и без года
- ✅ Комментарии к записям
- ✅ Встроенное редактирование в таблице
- ✅ Статистика по записям
- ✅ Настройки напоминаний
- ✅ Конфигурация уведомлений (Telegram, Email, VK)
- ✅ Интерактивные вкладки
- ✅ Адаптивный дизайн

## Технический стек

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express.js, Node.js
- **UI**: shadcn/ui, Tailwind CSS
- **State Management**: TanStack Query
- **Validation**: Zod
- **Database**: PostgreSQL (с поддержкой in-memory для разработки)
- **ORM**: Drizzle ORM

## Установка и запуск

### Предварительные требования

- Node.js 18+ или 20+
- npm или yarn
- PostgreSQL (опционально, для production)

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/birthday-management-system.git
cd birthday-management-system
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка окружения

Создайте файл `.env` в корне проекта:

```env
# Для разработки с in-memory хранилищем
NODE_ENV=development

# Для production с PostgreSQL (опционально)
# DATABASE_URL=postgresql://username:password@localhost:5432/birthday_db
```

### 4. Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5000`

### 5. Сборка для production

```bash
npm run build
```

### 6. Запуск production версии

```bash
npm start
```

## Структура проекта

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI компоненты
│   │   ├── pages/       # Страницы
│   │   ├── lib/         # Утилиты
│   │   └── hooks/       # Custom hooks
├── server/          # Express backend
│   ├── index.ts     # Точка входа
│   ├── routes.ts    # API маршруты
│   ├── storage.ts   # Слой данных
│   └── vite.ts      # Vite интеграция
├── shared/          # Общие типы и схемы
└── dist/           # Собранная версия
```

## API Endpoints

- `GET /api/birthdays` - Получить все записи
- `POST /api/birthdays` - Создать запись
- `PUT /api/birthdays/:id` - Обновить запись
- `DELETE /api/birthdays/:id` - Удалить запись
- `GET /api/birthdays/stats` - Статистика
- `GET/PUT /api/reminder-settings` - Настройки напоминаний
- `GET/PUT /api/notification-settings` - Настройки уведомлений

## Настройка базы данных (PostgreSQL)

### Для production

1. Создайте базу данных:
```sql
CREATE DATABASE birthday_db;
```

2. Настройте переменную окружения:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/birthday_db
```

3. Запустите миграции:
```bash
npm run db:push
```

### Для разработки

По умолчанию используется in-memory хранилище, которое не требует настройки базы данных.

## Доступные команды

```bash
# Разработка
npm run dev          # Запуск в режиме разработки

# Сборка
npm run build        # Сборка для production

# Production
npm start           # Запуск production версии

# База данных
npm run db:push     # Применить схему к БД
npm run db:studio   # Открыть Drizzle Studio
```

## Особенности разработки

- **Hot Reload**: Автоматическое обновление при изменении кода
- **Type Safety**: Полная типизация на TypeScript
- **Валидация**: Zod схемы для валидации данных
- **In-Memory Storage**: Быстрая разработка без настройки БД
- **Modern UI**: Компоненты shadcn/ui с Tailwind CSS

## Устранение неполадок

### Порт уже используется
```bash
# Найти процесс на порту 5000
lsof -ti:5000

# Завершить процесс
kill -9 <PID>
```

### Проблемы с зависимостями
```bash
# Очистить кеш и переустановить
rm -rf node_modules package-lock.json
npm install
```

### Ошибки TypeScript
```bash
# Проверить типы
npx tsc --noEmit
```

## Вклад в проект

1. Создайте форк репозитория
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## Лицензия

MIT License