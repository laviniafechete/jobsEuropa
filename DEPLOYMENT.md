# 🚀 Jobs Europa - Deployment Guide

## 📋 Environment Configuration

Acest proiect folosește sistem automat de detectare environment pentru a funcționa atât în development cât și în production.

### 🔧 Development Environment

**Frontend:**
- Detectează automat `localhost` și portul `5173`
- API calls merg către `http://localhost:5001`
- Password gate este **activat** by default

**Backend:**
- Detectează automat `NODE_ENV=development`
- Server pornește pe `http://localhost:5001`
- CORS permite `http://localhost:5173`

### 🌐 Production Environment  

**Frontend:**
- Detectează automat domeniul `jobs-europa.com`
- API calls merg către `https://jobs-europa.com/api`
- Password gate este **dezactivat** by default

**Backend:**
- Detectează automat `NODE_ENV=production`
- Server pornește pe portul configurat (default 5001)
- CORS permite doar `https://jobs-europa.com`

---

## 🛠️ Configurare Development

### Frontend
```bash
# Start development server
npm run dev
# URL: http://localhost:5173
```

### Backend
```bash
cd backend
# Instalează dependințele
npm install

# Pornește server-ul
npm start
# URL: http://localhost:5001
```

---

## 🚀 Configurare Production

### 1. Build Frontend
```bash
# Build pentru production
npm run build

# Output: /dist folder
# Deploy folder-ul dist pe server web (Apache, Nginx, etc.)
```

### 2. Deploy Backend

#### Varianta A: Environment Variables (.env file)
Creează fișier `.env` în `/backend`:

```env
NODE_ENV=production

# Database
MONGODB_URI=mongodb://your-mongo-connection-string

# JWT Secret (IMPORTANT: Schimbă în production!)
JWT_SECRET=your-super-secret-production-jwt-key

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# OAuth (Completează cu valorile reale)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Stripe (Completează cu cheile de production)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Web2SMS (Completează cu credențialele reale)
WEB2SMS_USERNAME=your-web2sms-username
WEB2SMS_PASSWORD=your-web2sms-password

# Security (Completează cu valori securizate)
SESSION_SECRET=your-session-secret-production
BCRYPT_ROUNDS=12
```

#### Varianta B: System Environment Variables
```bash
export NODE_ENV=production
export MONGODB_URI="mongodb://your-connection-string"
export JWT_SECRET="your-jwt-secret"
# ... etc
```

### 3. Start Production Server
```bash
cd backend
NODE_ENV=production npm start
```

---

## 🔒 Password Gate

### Pentru Development
- **Activat** by default
- Parola: `Stimorol1`
- Se salvează în localStorage

### Pentru Production
- **Dezactivat** by default
- Pentru a activa în production, modifică în `src/config/env.production.ts`:
```typescript
ENABLE_PASSWORD_GATE: true, // Schimbă la true
```

### Pentru a Șterge Complet Password Gate
1. Șterge `src/components/PasswordGate.tsx`
2. Scoate `<PasswordGate>` din `src/App.tsx`
3. Șterge import-ul din `src/App.tsx`

---

## 🌍 Domain Configuration

### Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`
- Auto-detectat prin hostname

### Production
- Frontend: `https://jobs-europa.com`
- Backend: `https://jobs-europa.com/api`
- Auto-detectat prin hostname

---

## 📦 Build Scripts

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

### Backend
```bash
npm start            # Start server (auto-detects environment)
npm run dev          # Development with nodemon (if configured)
```

---

## 🔧 Environment Detection Logic

### Frontend (src/config/env.ts)
```typescript
const isDevelopment = window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1';

const isProduction = window.location.hostname === 'jobs-europa.com';
```

### Backend (backend/config/env.js)
```javascript
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     !process.env.NODE_ENV;

const isProduction = process.env.NODE_ENV === 'production';
```

---

## ⚠️ Important pentru Production

1. **Schimbă JWT_SECRET** în production cu o valoare securizată
2. **Configurează OAuth** cu URL-urile corecte de production
3. **Verifică Stripe keys** - folosește live keys în production
4. **Testează CORS** - doar jobs-europa.com să fie permis
5. **Verifică certificatul SSL** pentru HTTPS

---

## 🐛 Troubleshooting

### Problema: API calls eșuează în production
**Soluție:** Verifică că backend-ul rulează și CORS este configurat pentru `https://jobs-europa.com`

### Problema: OAuth nu funcționează
**Soluție:** Verifică că OAuth provider-ul are URL-urile corecte de callback pentru production

### Problema: Password gate apare în production
**Soluție:** Schimbă `ENABLE_PASSWORD_GATE: false` în `env.production.ts`

---

## 📞 Contact

Pentru întrebări legate de deployment: contact@jobs-europa.com 