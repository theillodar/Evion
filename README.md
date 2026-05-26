# 🛒 EvionShop

**Мультиязычный B2C маркетплейс техники с админ-панелью на Next.js + Strapi**

- 🌐 **Frontend**: Next.js 16 (SSR, ISR, Turbopack)
- ⚙️ **Backend**: Strapi CMS (Node.js, SQLite/PostgreSQL)
- 🎨 **UI**: Tailwind CSS + Framer Motion
- 🌍 **i18n**: Поддержка польского, украинского, английского

---

## 🚀 Быстрый старт (Development)

### Требования
- Node.js 18+
- npm или pnpm

### Запуск Frontend
```bash
cd frontend
npm install
npm run dev
# Откроется на http://localhost:3000
```

### Запуск Backend (в другом терминале)
```bash
cd backend/cms
npm install
npm run develop
# Откроется на http://localhost:1337/admin
```

### Вход в админ-панель
- URL: http://localhost:3000/[locale]/admin
- Пароль: `evionadmin` (можно изменить в `frontend/src/lib/admin-auth.ts`)

---

## 📦 Развертывание на Production

**Полная инструкция**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**Быстрый старт**: [QUICK_START.md](./QUICK_START.md)

**Целевая архитектура**:
- Frontend на **Vercel** → `evionshop.pl`
- Backend на **Render** → `api.evionshop.pl`
- База на **PostgreSQL** (Render)

---

## 📁 Структура проекта

```
evion/
├── frontend/                    # Next.js приложение
│   ├── src/
│   │   ├── app/                # App Router (динамические маршруты)
│   │   ├── components/         # React компоненты
│   │   ├── lib/                # Утилиты и хуки
│   │   └── styles/             # Глобальные стили
│   ├── public/                 # Статические файлы
│   └── package.json
│
├── backend/cms/                # Strapi проект
│   ├── src/
│   │   ├── api/               # API структура
│   │   ├── plugins/           # Плагины
│   │   └── admin/             # Админ-панель
│   ├── config/                # Конфиги БД, middleware
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md        # Полная инструкция деплоя
├── QUICK_START.md             # Быстрый чек-лист
└── .gitignore                 # Git исключения
```

---

## 🔑 Ключевые особенности

### ✅ Frontend
- **Многоязычность**: Динамические маршруты `/[locale]/`
- **Каталог**: Фильтрация по категориям, брендам, поиск, сортировка
- **Админ-панель**: Защита паролем, управление товарами и скидками
- **Корзина**: LocalStorage синхронизация
- **Изображения**: Полноэкранный просмотр с навигацией
- **Скрытая кнопка админа**: Точка (•) в футере

### ✅ Backend
- **Strapi CMS**: Готовое API для управления контентом
- **Коллекции**: Products, Brands, Categories
- **Медиа**: Встроенный upload изображений
- **Автоматическое API**: REST endpoints для всех коллекций

### ✅ Security
- **Админ-панель**: Защита паролем (localStorage token)
- **CORS**: Настроена на frontend домен
- **API токены**: Поддержка для интеграций

---

## 🛠️ Переменные окружения

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_URL=http://localhost:1337
```

### Backend (`.env`)
```env
NODE_ENV=development
DATABASE_CLIENT=sqlite
JWT_SECRET=your-secret
ADMIN_JWT_SECRET=your-secret
```

---

## 📊 API Endpoints

### Products
```
GET    /api/strapi/products
POST   /api/strapi/products
PUT    /api/strapi/products/{id}
DELETE /api/strapi/products/{id}
```

### Brands & Categories
```
GET  /api/strapi/brands
GET  /api/strapi/categories
POST /api/strapi/brands
POST /api/strapi/categories
```

### Media Upload
```
POST /api/strapi/upload
```

---

## 🐛 Решение проблем

### Backend не запускается
```bash
cd backend/cms
rm -rf node_modules package-lock.json
npm install
npm run develop
```

### Port 1337 занят
```bash
# Изменить в backend/cms/.env
PORT=3001
```

### Изображения не грузятся
- Убедиться что Strapi запущен
- Проверить консоль (F12) → Network
- Проверить CORS в `backend/cms/config/middlewares.js`

---

## 🚀 Roadmap

- [ ] Оплата (Stripe/PayPal)
- [ ] Email уведомления
- [ ] Аналитика
- [ ] Реcommendations
- [ ] User reviews

---

## 📄 Лицензия

MIT

---

## 👨‍💻 Контакты

**Техподдержка**: Смотри DEPLOYMENT_GUIDE.md

---

**Успехов с запуском! 🎉**
