# Jobs Europa - Platformă de Angajare

O platformă modernă de angajare pentru România, construită cu tehnologii moderne și optimizată pentru performanță.

## 🚀 Caracteristici

### Pentru Angajați
- ✅ Creare și gestionare CV complet
- ✅ Căutare joburi cu filtrare avansată
- ✅ Aplicare la joburi cu un click
- ✅ Urmărirea statusului aplicațiilor
- ✅ Profil personalizabil
- ✅ Notificări în timp real

### Pentru Angajatori
- ✅ Creare și gestionare anunțuri de joburi
- ✅ Dashboard pentru aplicații
- ✅ Gestionarea statusului candidatilor
- ✅ Profil companie complet
- ✅ Statistici și analize
- ✅ Căutare candidați

### Tehnical
- ✅ API RESTful optimizat
- ✅ Autentificare JWT securizată
- ✅ Validare avansată
- ✅ Gestionarea erorilor robustă
- ✅ Rate limiting
- ✅ Upload fișiere securizat
- ✅ Responsive design
- ✅ TypeScript end-to-end

## 🛠️ Tehnologii

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Bază de date NoSQL
- **Mongoose** - ODM pentru MongoDB
- **JWT** - Autentificare
- **bcrypt** - Hash parole
- **Multer** - Upload fișiere
- **Helmet** - Securitate
- **Express Rate Limit** - Rate limiting

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **React Query** - State management
- **Zustand** - Global state
- **React Hook Form** - Form handling
- **Axios** - HTTP client

## 📦 Instalare

### Cerințe
- Node.js 18+ 
- MongoDB 5+
- npm sau yarn

### 1. Clonează repository-ul
```bash
git clone <repository-url>
cd jobs-europa
```

### 2. Instalează dependențele
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 3. Configurare variabile de mediu

Creează fișierul `.env` în directorul backend:
```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/jobs-europa

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Email (opțional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Creează fișierul `.env` în directorul root:
```env
VITE_API_URL=http://localhost:5001/api
VITE_APP_NAME=Jobs Europa
VITE_APP_VERSION=1.0.0
```

### 4. Pornește MongoDB
```bash
# Dacă ai MongoDB instalat local
mongod

# Sau folosește MongoDB Atlas
```

### 5. Pornește aplicația
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

Aplicația va fi disponibilă la:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001
- Health check: http://localhost:5001/api/health

## 🏗️ Structura Proiectului

```
jobs-europa/
├── backend/                 # Backend API
│   ├── config.js           # Configurare
│   ├── server.js           # Server principal
│   ├── models/             # Modele MongoDB
│   ├── routes/             # Rute API
│   ├── controllers/        # Controlere
│   ├── middlewares/        # Middleware-uri
│   ├── utils/              # Utilități
│   └── uploads/            # Fișiere upload
├── src/                    # Frontend React
│   ├── components/         # Componente reutilizabile
│   ├── pages/              # Pagini
│   ├── stores/             # State management
│   ├── services/           # Servicii API
│   ├── utils/              # Utilități
│   └── config/             # Configurare
├── public/                 # Fișiere statice
└── docs/                   # Documentație
```

## 🔧 Scripturi Disponibile

### Backend
```bash
npm run dev          # Pornește în mod development
npm start            # Pornește în mod production
npm run build        # Build pentru production
```

### Frontend
```bash
npm run dev          # Pornește development server
npm run build        # Build pentru production
npm run preview      # Preview build-ului
npm run lint         # Lint code
npm run type-check   # Verifică tipurile TypeScript
```

## 📚 API Endpoints

### Autentificare
- `POST /api/auth/register-user` - Înregistrare angajat
- `POST /api/auth/register-employer` - Înregistrare angajator
- `POST /api/auth/login-user` - Login angajat
- `POST /api/auth/login-employer` - Login angajator
- `POST /api/auth/reset-password` - Resetare parolă

### Utilizatori
- `GET /api/users/profile` - Profil utilizator
- `PUT /api/users/profile` - Actualizare profil
- `GET /api/users/applied-jobs` - Joburi la care s-a aplicat

### Angajatori
- `GET /api/employers/profile` - Profil angajator
- `PUT /api/employers/profile` - Actualizare profil
- `GET /api/employers/my-jobs` - Joburile mele

### CV
- `GET /api/cv` - Obține CV
- `POST /api/cv` - Creează CV
- `PUT /api/cv` - Actualizează CV
- `POST /api/cv/upload-image` - Upload imagine

### Joburi
- `GET /api/jobs` - Lista joburi cu filtrare
- `GET /api/jobs/:id` - Detalii job
- `POST /api/jobs` - Creează job (angajator)
- `PUT /api/jobs/:id` - Actualizează job (angajator)
- `DELETE /api/jobs/:id` - Șterge job (angajator)
- `POST /api/jobs/:id/apply` - Aplică la job (angajat)

## 🔒 Securitate

- ✅ Autentificare JWT
- ✅ Hash parole cu bcrypt
- ✅ Rate limiting
- ✅ Validare input
- ✅ Sanitizare date
- ✅ CORS configurat
- ✅ Helmet pentru headers securi
- ✅ Upload fișiere securizat

## 🧪 Testare

```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test
```

## 📦 Deployment

### Backend (Heroku/Railway/DigitalOcean)
```bash
cd backend
npm run build
npm start
```

### Frontend (Vercel/Netlify)
```bash
npm run build
```

## 🤝 Contribuții

1. Fork repository-ul
2. Creează un branch pentru feature (`git checkout -b feature/AmazingFeature`)
3. Commit schimbările (`git commit -m 'Add some AmazingFeature'`)
4. Push la branch (`git push origin feature/AmazingFeature`)
5. Deschide un Pull Request

## 📄 Licență

Acest proiect este licențiat sub MIT License - vezi fișierul [LICENSE](LICENSE) pentru detalii.

## 📞 Suport

Pentru întrebări și suport:
- Email: support@jobseuropa.ro
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🚀 Roadmap

- [ ] Notificări push
- [ ] Chat între angajat și angajator
- [ ] Video interviuri
- [ ] Teste de competențe
- [ ] Analytics avansat
- [ ] Mobile app
- [ ] Integrare cu LinkedIn
- [ ] AI pentru matching job-candidat

---

**Jobs Europa** - Conectăm talentele cu oportunitățile! 🎯 