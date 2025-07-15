# Инструкция по развертыванию

## Развертывание на Replit

### Автоматическое развертывание

1. Откройте проект в Replit
2. Нажмите кнопку "Deploy" в правом верхнем углу
3. Выберите тип развертывания "Replit Deployments"
4. Подтвердите развертывание

Приложение будет автоматически развернуто и доступно по адресу `*.replit.app`

### Настройка переменных окружения

В разделе "Secrets" добавьте необходимые переменные:

```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
```

## Развертывание на других платформах

### Vercel

1. Установите Vercel CLI:
```bash
npm install -g vercel
```

2. Настройте `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. Разверните:
```bash
vercel --prod
```

### Railway

1. Подключите GitHub репозиторий к Railway
2. Настройте переменные окружения
3. Railway автоматически развернет приложение

### Heroku

1. Создайте приложение:
```bash
heroku create birthday-app
```

2. Добавьте переменные окружения:
```bash
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=postgresql://...
```

3. Разверните:
```bash
git push heroku main
```

### Docker

1. Создайте `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

2. Создайте `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/birthday_db
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=birthday_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

3. Запустите:
```bash
docker-compose up -d
```

## Настройка базы данных

### PostgreSQL на Neon

1. Создайте аккаунт на [Neon](https://neon.tech)
2. Создайте новую базу данных
3. Скопируйте строку подключения
4. Добавьте в переменные окружения:
```env
DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/database?sslmode=require
```

### PostgreSQL на Supabase

1. Создайте проект на [Supabase](https://supabase.com)
2. Перейдите в настройки базы данных
3. Скопируйте строку подключения
4. Добавьте в переменные окружения

### Локальная PostgreSQL

1. Установите PostgreSQL
2. Создайте базу данных:
```sql
CREATE DATABASE birthday_db;
CREATE USER birthday_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE birthday_db TO birthday_user;
```

3. Настройте переменную окружения:
```env
DATABASE_URL=postgresql://birthday_user:password@localhost:5432/birthday_db
```

## Мониторинг и логирование

### Настройка логирования

Добавьте в `server/index.ts`:
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Мониторинг с Sentry

1. Установите Sentry:
```bash
npm install @sentry/node @sentry/react
```

2. Настройте в `server/index.ts`:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

## Безопасность

### Настройка HTTPS

Для production обязательно используйте HTTPS:

```typescript
// server/index.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // максимум 100 запросов с одного IP
}));
```

### Переменные окружения

Никогда не коммитьте секретные данные. Используйте:

```env
# Обязательные для production
NODE_ENV=production
DATABASE_URL=postgresql://...

# Опциональные
SENTRY_DSN=https://...
TELEGRAM_BOT_TOKEN=...
EMAIL_PASSWORD=...
VK_ACCESS_TOKEN=...
```

## Резервное копирование

### Автоматическое резервное копирование PostgreSQL

```bash
# Создание резервной копии
pg_dump $DATABASE_URL > backup.sql

# Восстановление
psql $DATABASE_URL < backup.sql
```

### Настройка cron для автоматического бэкапа

```bash
# Каждый день в 2:00
0 2 * * * pg_dump $DATABASE_URL > /backups/backup-$(date +\%Y\%m\%d).sql
```

## Обновления

### Процесс обновления

1. Создайте бэкап базы данных
2. Обновите код
3. Запустите миграции
4. Перезапустите приложение

### Zero-downtime deployment

Используйте стратегию blue-green deployment или rolling updates для обновления без простоя.

## Устранение неполадок

### Частые проблемы

1. **Ошибка подключения к базе данных**
   - Проверьте строку подключения
   - Убедитесь, что база данных доступна
   - Проверьте права доступа

2. **Ошибки памяти**
   - Увеличьте лимит памяти Node.js
   - Оптимизируйте запросы к базе данных

3. **Медленная работа**
   - Добавьте индексы в базе данных
   - Используйте кэширование
   - Оптимизируйте фронтенд

### Полезные команды

```bash
# Просмотр логов
heroku logs --tail

# Подключение к базе данных
heroku pg:psql

# Мониторинг производительности
heroku ps:exec
```