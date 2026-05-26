# 🚀 EvionShop - Deployment Checklist

## ✅ Перед началом развертывания

### Подготовка
- [ ] Создан GitHub аккаунт (если нет)
- [ ] Весь код залит в GitHub репозиторий
- [ ] Все файлы скоммичены и залиты

### Accounts создать
- [ ] Vercel аккаунт (vercel.com)
- [ ] Render аккаунт (render.com)
- [ ] Доменный реджистратор аккаунт (Namecheap / GoDaddy / Cloudflare)

### Домен готов
- [ ] Домен выбран: `evionshop.pl`
- [ ] Бюджет на домен: ~$10-15/год
- [ ] Бюджет на хостинг: Верцел бесплатно, Render $7/месяц для production

---

## 📝 Шаг за шагом (можно скопировать команды)

### 1️⃣ BACKEND - Render Development

```bash
# Локально убедиться что все работает
cd backend/cms
npm run develop

# Должно появиться:
# ⚡️ Server: http://localhost:1337
# 📋 Admin: http://localhost:1337/admin
```

### 2️⃣ BACKEND - Залить на GitHub
```bash
cd /g/evion
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 3️⃣ BACKEND - Render Deploy
```
1. Зайти на render.com
2. Нажать "New +" → "Web Service"
3. Выбрать GitHub репо
4. Root Directory: backend/cms
5. Build: npm install && npm run build
6. Start: npm run start
7. Создать PostgreSQL Database
8. Настроить Environment Variables (смотри DEPLOYMENT_GUIDE.md)
9. Deploy
10. Дождаться деплоя (~2-3 минуты)
11. Скопировать URL: https://[NAME].onrender.com
```

### 4️⃣ FRONTEND - Vercel Deploy
```
1. Зайти на vercel.com
2. Import Project → выбрать GitHub репо
3. Root Directory: frontend
4. Environment Variables:
   - NEXT_PUBLIC_STRAPI_URL = https://[YOUR-RENDER-URL].onrender.com
   - STRAPI_URL = https://[YOUR-RENDER-URL].onrender.com
5. Deploy
6. Дождаться деплоя (~1 минута)
7. Скопировать URL: https://[PROJECT].vercel.app
```

### 5️⃣ ДОМЕН - Купить
```
1. Зайти на namecheap.com
2. Search → evionshop.pl
3. Добавить в корзину
4. Checkout → Оплатить
5. Получить доступ к админ-панели домена
```

### 6️⃣ ДОМЕН - Подключить к Vercel
```
1. В Vercel → Project Settings → Domains
2. Add Domain → evionshop.pl
3. Vercel даст nameservers
4. В Namecheap → Domain → Nameservers → заменить на Vercel
5. Подождать 24-48 часов (обычно 15-30 минут)
6. Проверить: https://evionshop.pl должен открыться
```

### 7️⃣ ДОМЕН - Поддомен API
```
1. В Render → Settings → Custom Domain
2. Добавить api.evionshop.pl
3. Скопировать CNAME
4. В Namecheap → Advanced DNS → Add Record:
   - Type: CNAME
   - Host: api
   - Value: [CNAME от Render]
5. Подождать распространения DNS
6. Проверить: https://api.evionshop.pl/admin должен открыться
```

---

## 🧪 Тестирование после деплоя

```
✅ Сайт открывается: https://evionshop.pl
✅ API отвечает: curl https://api.evionshop.pl/api/products
✅ Админ Strapi: https://api.evionshop.pl/admin
✅ Изображения загружаются корректно
✅ Каталог работает
✅ Переводы работают (pl, uk, en)
✅ Админ-панель защищена паролем
```

---

## 🐛 Если что-то не работает

### Frontend не грузится
```bash
# Проверить logs на Vercel
# Settings → Deployments → logs
```

### API не отвечает
```bash
# Проверить logs на Render
# Logs tab
```

### CORS ошибки в консоли
```bash
# backend/cms/config/middlewares.js
# Добавить frontend URL в whitelist
```

### Домен не подключается
```bash
# Проверить DNS распространение:
# https://www.whatsmydns.net/
# Должны быть nameservers от Vercel
```

---

## 📞 Контакты поддержки

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Strapi Docs**: https://strapi.io/documentation
- **Namecheap Support**: support@namecheap.com

---

## 💰 Стоимость в месяц

- **Vercel**: $0 (free tier)
- **Render**: $7-15 (зависит от вычислений)
- **Домен**: ~$1-2 (в месяц)
- **Итого**: ~$8-17/месяц

---

**Удачи с развертыванием! 🚀**
