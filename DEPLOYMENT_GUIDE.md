# 📚 Инструкция по развертыванию EvionShop на продакшн

## 🎯 Итоговая архитектура:
- **Frontend**: evionshop.pl (Vercel)
- **Backend API**: api.evionshop.pl (Render)
- **Database**: PostgreSQL (Render)
- **Домен**: evionshop.pl

---

## 📋 Шаг 1: Подготовка к развертыванию

### 1.1 Создать GitHub репозиторий
```bash
# Инициализировать git (если еще нет)
git init
git add .
git commit -m "Initial commit"

# Создать на GitHub новый репо и залить туда код
git remote add origin https://github.com/YOUR_USERNAME/evion.git
git branch -M main
git push -u origin main
```

### 1.2 Убедиться что файлы есть:
- `frontend/` - Next.js приложение
- `backend/cms/` - Strapi проект
- `backend/cms/.env.example` - нужно создать

---

## 🚀 Шаг 2: Развертывание Backend (Strapi) на Render

### 2.1 Подготовить Strapi к production

1. Открить `backend/cms/.env` и скопировать содержимое
2. Создать файл `backend/cms/.env.example` (без чувствительных данных):

```env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=changeme
ADMIN_JWT_SECRET=generated-secret
JWT_SECRET=generated-secret
API_TOKEN_SALT=generated-salt
```

3. В реальном `.env` на Render будут настоящие значения.

### 2.2 Развернуть на Render.com

1. Зайти на [render.com](https://render.com) → Sign Up
2. Создать New → Web Service
3. Выбрать GitHub репо
4. Заполнить:
   - **Name**: evion-api
   - **Root Directory**: `backend/cms`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: Free (или Starter для reliability)

5. В Environment Variables добавить:
```
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_HOST=[HOST ИЗ PostgreSQL DATABASE]
DATABASE_PORT=5432
DATABASE_NAME=[NAME ИЗ PostgreSQL DATABASE]
DATABASE_USERNAME=[USER ИЗ PostgreSQL DATABASE]
DATABASE_PASSWORD=[PASSWORD ИЗ PostgreSQL DATABASE]
ADMIN_JWT_SECRET=[СГЕНЕРИРУЙТЕ СЛУЧАЙНУЮ СТРОКУ 32+ СИМВОЛА]
JWT_SECRET=[СГЕНЕРИРУЙТЕ СЛУЧАЙНУЮ СТРОКУ 32+ СИМВОЛА]
API_TOKEN_SALT=[СГЕНЕРИРУЙТЕ СЛУЧАЙНУЮ СТРОКУ 16+ СИМВОЛА]
```

6. Создать PostgreSQL Database на Render:
   - New → PostgreSQL
   - Имя: evion-db
   - СкопироватьCredentialsи использовать выше

7. Deploy ✓

**Ваш API URL**: https://evion-api.onrender.com

### 2.3 Создать первого админа в Strapi
```
Зайти на: https://evion-api.onrender.com/admin
Создать админ-аккаунт (один раз)
```

---

## 🎨 Шаг 3: Развертывание Frontend (Next.js) на Vercel

### 3.1 Подготовить environment переменные

1. В `frontend/` создать `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_STRAPI_URL": "@strapi_url",
    "STRAPI_URL": "@strapi_url"
  }
}
```

### 3.2 Развернуть на Vercel

1. Зайти на [vercel.com](https://vercel.com) → Sign Up with GitHub
2. Import Project → выбрать GitHub репо
3. Выбрать `frontend/` как root directory
4. Environment Variables:
   ```
   NEXT_PUBLIC_STRAPI_URL = https://evion-api.onrender.com
   STRAPI_URL = https://evion-api.onrender.com
   ```
5. Deploy ✓

**Ваш Frontend URL**: https://evion-[random].vercel.app (или evionshop.pl после настройки домена)

---

## 🌐 Шаг 4: Купить домен

### 4.1 Вариант 1: Купить на Namecheap.com
1. Зайти на namecheap.com
2. Search → вбить `evionshop.pl`
3. Add to cart → Checkout
4. Оплатить

### 4.2 Вариант 2: Купить на другом реджистраре
- GoDaddy
- Hostinger
- Cloudflare (рекомендую)

---

## 🔗 Шаг 5: Подключить домен

### 5.1 Подключить к Vercel (Frontend)

1. Зайти в Vercel → Settings → Domains
2. Add Domain → вбить `evionshop.pl`
3. Выбрать "Use nameservers" (рекомендуется)
4. Скопировать nameservers от Vercel
5. Зайти в админ-панель реджистратора (Namecheap/GoDaddy)
6. Найти Domain → Nameservers
7. Заменить на nameservers от Vercel
8. Подождать 24-48 часов пока DNS распространится ✓

### 5.2 Настроить API поддомен

1. На Render → Settings → Custom Domain
2. Добавить `api.evionshop.pl`
3. Скопировать CNAME запись
4. На реджистраторе создать CNAME:
   ```
   Name: api
   Value: [CNAME ОТ RENDER]
   ```
5. Подождать распространения DNS ✓

---

## ✅ Шаг 6: Финальная проверка

1. Зайти на https://evionshop.pl → должен загрузиться сайт
2. Проверить консоль (F12) → Network → API запросы должны идти на api.evionshop.pl
3. Загрузить продукт в админ → проверить что работает
4. Проверить изображения → должны загружаться правильно
5. Проверить категории на разных языках

---

## 🔧 Важные переменные окружения для Production

**Frontend (.env.production в Vercel):**
```
NEXT_PUBLIC_STRAPI_URL=https://api.evionshop.pl
STRAPI_URL=https://api.evionshop.pl
```

**Backend (.env в Render):**
```
NODE_ENV=production
DATABASE_CLIENT=postgres
API_TOKEN_SALT=[УНИКАЛЬНАЯ СТРОКА]
ADMIN_JWT_SECRET=[УНИКАЛЬНАЯ СТРОКА]
JWT_SECRET=[УНИКАЛЬНАЯ СТРОКА]
```

---

## 🚨 Решение проблем

### API не отвечает
- Проверить что Backend запущен на Render (Dashboard → Logs)
- Проверить Database credentialsy в .env
- Перезапустить приложение на Render

### CORS ошибки
- В Strapi: `backend/cms/config/middlewares.js`
- Убедиться что `api.evionshop.pl` в CORS whitelist

### Изображения не грузятся
- Проверить URL изображений в админ-панели
- Убедиться что Strapi сохраняет absolute URL (настройка в админе)

---

## 📞 Техподдержка платформ

- **Vercel Support**: https://vercel.com/support
- **Render Support**: https://render.com/docs
- **Strapi Docs**: https://strapi.io/documentation

