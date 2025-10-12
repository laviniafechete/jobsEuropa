# Architecture Documentation - Jobs Europa

## System Overview

Jobs Europa is a full-stack job portal platform connecting job seekers with employers in Romania and across Europe. The system consists of a React-based frontend, Express backend API, and MongoDB database.

```
┌─────────────────┐       ┌──────────────────┐       ┌─────────────┐
│                 │       │                  │       │             │
│  React Frontend │◄─────►│  Express Backend │◄─────►│   MongoDB   │
│  (Vite + TS)    │       │   (Node.js API)  │       │  (Database) │
│                 │       │                  │       │             │
└─────────────────┘       └──────────────────┘       └─────────────┘
         │                         │                         
         │                         │                         
         ▼                         ▼                         
┌─────────────────┐       ┌──────────────────┐              
│  Static Assets  │       │  External APIs   │              
│  (S3/CDN)       │       │  - Email (SMTP)  │              
│                 │       │  - SMS (Web2SMS) │              
│                 │       │  - OAuth (Google)│              
│                 │       │  - Stripe        │              
└─────────────────┘       └──────────────────┘              
```

---

## Technology Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 7.1.9** - Build tool and dev server
- **TailwindCSS 3.4.1** - Utility-first CSS
- **React Router 6.30.1** - Client-side routing
- **React Query 3.39.3** - Server state management
- **Zustand 4.5.7** - Client state management
- **React Hook Form 7.60.0** - Form handling
- **Axios 1.10.0** - HTTP client
- **Heroicons & Lucide React** - Icon libraries

### Backend
- **Node.js 18.20.4** - JavaScript runtime
- **Express 4.21.2** - Web framework
- **MongoDB (Mongoose 7.8.7)** - Database and ODM
- **JWT (jsonwebtoken 9.0.0)** - Authentication
- **bcrypt 5.1.0** - Password hashing
- **Passport 0.7.0** - OAuth strategy
- **Helmet 8.1.0** - Security headers
- **Express Rate Limit 8.0.1** - Rate limiting
- **Multer 2.0.2** - File uploads
- **Nodemailer 7.0.5** - Email sending
- **SOAP 1.2.1** - SMS integration (Web2SMS)

---

## Architecture Patterns

### Frontend Architecture

#### **1. Component-Based Architecture**
```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Global navigation
│   ├── Footer.tsx      # Global footer
│   ├── JobCard.tsx     # Job listing card
│   └── Snackbar.tsx    # Toast notifications
├── pages/              # Route-level components
│   ├── employee/       # Employee-specific pages
│   ├── employer/       # Employer-specific pages
│   └── admin/          # Admin dashboard pages
├── context/            # React Context providers
├── stores/             # Zustand global state
├── services/           # API client layer
└── utils/              # Helper functions
```

**Key Patterns:**
- **Separation of Concerns**: Components, business logic, and state are separated
- **Container/Presentational**: Smart (pages) vs Dumb (components) components
- **Custom Hooks**: Reusable logic in hooks (e.g., `useSnackbar`)
- **Protected Routes**: Auth-based route guards

#### **2. State Management Strategy**

**Three-Tier State Model:**

```typescript
// 1. Server State (React Query)
const { data, isLoading } = useQuery('jobs', fetchJobs);

// 2. Global Client State (Zustand)
const { user, token, login, logout } = useAuthStore();

// 3. Local Component State (useState)
const [filter, setFilter] = useState('');
```

**When to use what:**
- **React Query**: Server data, caching, refetching
- **Zustand**: Auth state, user preferences, UI state
- **useState**: Form inputs, toggles, ephemeral UI state
- **Context**: Provider-based data (e.g., EmployerContext)

#### **3. Routing Architecture**

```typescript
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Landing />} />
  <Route path="/employee" element={<EmployeeEntry />} />
  <Route path="/employer" element={<EmployerEntry />} />
  
  {/* Protected Routes */}
  <Route path="/employee/home" element={
    <ProtectedRoute userType="user">
      <EmployeeHome />
    </ProtectedRoute>
  } />
</Routes>
```

---

### Backend Architecture

#### **1. Layered Architecture**

```
backend/
├── server.js           # Entry point, middleware setup
├── routes/             # Route definitions (controllers)
├── controllers/        # Business logic handlers
├── models/             # Mongoose schemas (data layer)
├── middlewares/        # Auth, error handling, rate limiting
├── services/           # External integrations (SMS, email)
├── utils/              # Helpers, validation
└── config.js           # Configuration management
```

**Layers:**
1. **Routes** → Define API endpoints
2. **Controllers** → Handle requests, orchestrate logic
3. **Services** → External APIs, complex business logic
4. **Models** → Database schemas and validation
5. **Middleware** → Cross-cutting concerns (auth, logging)

#### **2. Request Flow**

```
Client Request
    ↓
Express Middleware (CORS, Body Parser, Rate Limit)
    ↓
Authentication Middleware (JWT verification)
    ↓
Route Handler
    ↓
Controller (Business Logic)
    ↓
Service Layer (if needed)
    ↓
Model (Database)
    ↓
Response (JSON)
    ↓
Error Handler (if error occurs)
```

#### **3. Authentication Flow**

**JWT-Based Authentication:**

```javascript
// 1. User Login
POST /api/auth/login-user
  ↓
Validate credentials
  ↓
Generate JWT token (exp: 7d)
  ↓
Return { user, token }

// 2. Protected Route
GET /api/users/profile
  ↓
Extract Bearer token from header
  ↓
Verify JWT (secret, expiration)
  ↓
Attach user to req.user
  ↓
Execute route handler
```

**OAuth Flow (Google):**

```
User clicks "Login with Google"
  ↓
Redirect to Google OAuth consent
  ↓
Google callback → /api/auth/google/callback
  ↓
Passport strategy verifies token
  ↓
Find or create user in DB
  ↓
Generate JWT
  ↓
Redirect to frontend with token
```

---

## Data Models

### User Schema
```javascript
{
  userId: String (UUID, indexed),
  email: String (unique, sparse),
  phone: String (unique, sparse),
  password: String (hashed with bcrypt),
  name: String,
  emailVerified: Boolean,
  phoneVerified: Boolean,
  hasCompletedCv: Boolean,
  appliedJobs: [ObjectId],
  lastLogin: Date,
  timestamps: true
}
```

### Employer Schema
```javascript
{
  userId: String (UUID, indexed),
  email: String (unique),
  password: String (hashed),
  companyName: String,
  hasProfileCompleted: Boolean,
  companyProfile: {
    cui, location, domain, description, ...
  },
  subscription: {
    plan, status, startDate, endDate
  },
  timestamps: true
}
```

### Job Schema
```javascript
{
  jobId: String (UUID),
  employer: ObjectId (ref: Employer),
  title: String,
  description: String,
  location: String,
  jobType: String (full-time, part-time, etc.),
  salary: { min, max, currency },
  requirements: [String],
  responsibilities: [String],
  benefits: [String],
  category: String,
  status: String (active, inactive, expired),
  applications: [
    { user: ObjectId, cv: ObjectId, status, appliedAt }
  ],
  expiresAt: Date,
  timestamps: true
}
```

### CV Schema
```javascript
{
  user: ObjectId (ref: User, unique),
  personalInfo: { name, email, phone, address, ... },
  education: [{ institution, degree, field, years }],
  experience: [{ company, title, description, years }],
  skills: [String],
  languages: [{ language, level }],
  certifications: [String],
  preferences: {
    desiredPosition, desiredSalary, availability, ...
  },
  photo: String (URL),
  timestamps: true
}
```

---

## API Design

### RESTful Principles

**Base URL:** `/api`

**Endpoints:**

```
Authentication
POST   /auth/register-user          # User registration
POST   /auth/register-employer      # Employer registration
POST   /auth/login-user              # User login
POST   /auth/login-employer          # Employer login
GET    /auth/verify-email/:type/:token
POST   /auth/reset-password

Users
GET    /users/profile                # Get user profile
PUT    /users/profile                # Update user profile
GET    /users/applied-jobs           # Get applied jobs
PUT    /users/applied-jobs           # Apply to job

Employers
GET    /employers/profile            # Get employer profile
POST   /employers/company-profile    # Save company profile
GET    /employers/jobs               # Get employer jobs
GET    /employers/employees          # Get applicants
POST   /employers/stripe/create-checkout-session

CVs
GET    /cv/get                       # Get user CV
POST   /cv/save                      # Save/Update CV
PUT    /cv/status                    # Update CV status

Jobs
GET    /jobs                         # List jobs (with filters)
GET    /jobs/:id                     # Get job details
POST   /jobs                         # Create job (employer)
PUT    /jobs/:id                     # Update job (employer)
DELETE /jobs/:id                     # Delete job (employer)
POST   /jobs/:id/apply               # Apply to job (user)

Admin
POST   /admin/login                  # Admin login
GET    /admin/dashboard              # Analytics
GET    /admin/users                  # List users
GET    /admin/employers              # List employers
GET    /admin/jobs                   # List jobs
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

---

## Security Architecture

### 1. Authentication & Authorization

- **JWT Tokens**: Stateless authentication, 7-day expiration
- **Password Hashing**: bcrypt with salt rounds = 12
- **OAuth 2.0**: Google Sign-In integration
- **Protected Routes**: Middleware-based route protection
- **Role-Based Access**: User, Employer, Admin roles

### 2. Data Protection

- **Input Validation**: Joi/custom validation on all inputs
- **SQL Injection**: MongoDB (NoSQL) + Mongoose sanitization
- **XSS Protection**: React auto-escapes, Helmet.js headers
- **CSRF Protection**: Same-site cookies, CORS restrictions
- **Rate Limiting**: 100 requests per 15 minutes per IP

### 3. CORS Configuration

```javascript
// Environment-based CORS
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: corsOrigin.split(','),
  credentials: true
}));
```

### 4. File Upload Security

- **Type Validation**: Only images (jpeg, png, webp)
- **Size Limit**: 5MB max per file
- **Filename Sanitization**: UUID-based naming
- **Storage**: Local uploads/ directory (consider S3 for production)

---

## Performance Considerations

### Frontend Optimization

1. **Code Splitting**: Manual chunks for vendor, UI, query libs
2. **Lazy Loading**: Dynamic imports for routes (planned)
3. **Image Optimization**: Lazy loading, responsive images
4. **Caching**: React Query caches server data (5 min)
5. **Bundle Size**: ~360KB main bundle (gzip: 80KB)

### Backend Optimization

1. **Database Indexing**: 
   - User: userId, email, phone
   - Job: status, location, category, employer
   - Employer: userId, email
2. **Connection Pooling**: MongoDB connection pool (maxPoolSize: 10)
3. **Rate Limiting**: Protects against abuse
4. **Async/Await**: Non-blocking I/O operations

---

## Deployment Architecture

### Production Setup

```
┌─────────────────────┐
│   DigitalOcean      │
│   App Platform      │
│                     │
│  ┌───────────────┐  │
│  │  Node Server  │  │ ← Frontend (dist/) + Backend (Express)
│  │  (Port 5001)  │  │
│  └───────────────┘  │
│          │          │
└──────────┼──────────┘
           │
           ▼
┌─────────────────────┐
│   MongoDB Atlas     │
│   (Database)        │
└─────────────────────┘
```

**Build Process:**
```bash
# Root: Build frontend
npm run build  # → dist/

# Backend: Install production deps
cd backend && npm ci --omit=dev

# Server serves both API and static frontend
```

**Environment Variables:**
- Frontend: `VITE_*` vars baked into build
- Backend: Runtime env vars via DigitalOcean secrets

---

## Monitoring & Observability

### Current State
- **Logging**: console.log (to be replaced with pino)
- **Error Tracking**: Basic error handler
- **Metrics**: None (manual monitoring)

### Planned Improvements
- Structured logging (pino)
- Error tracking (Sentry)
- Performance monitoring (RUM)
- Health check endpoints

---

## Scalability Considerations

### Current Limitations
- Single server deployment
- No load balancing
- Local file storage
- No caching layer

### Scaling Path

**Phase 1 (Current):** Single DigitalOcean droplet
- Handles ~1000 concurrent users
- Vertical scaling (increase resources)

**Phase 2 (Next):** Horizontal scaling
- Multiple app instances
- Load balancer (nginx)
- Redis for session storage
- S3/CDN for static assets

**Phase 3 (Future):** Microservices
- Separate auth service
- Separate job service
- Message queue (RabbitMQ/Redis)
- Elasticsearch for job search

---

## Development Workflow

### Local Development

```bash
# Terminal 1: Frontend dev server
npm run dev  # → http://localhost:5173

# Terminal 2: Backend dev server
cd backend && npm run dev  # → http://localhost:5001

# MongoDB (local or Atlas)
mongod  # or connect to MongoDB Atlas
```

### Code Quality Checks

```bash
npm run type-check  # TypeScript compilation
npm run lint        # ESLint
npm run build       # Production build
```

### Git Workflow

1. Feature branch: `feature/feature-name`
2. Commit: `feat: add new feature`
3. PR to `main`
4. Auto-deploy on merge (DigitalOcean)

---

## Decision Records

See `docs/adr/` for Architecture Decision Records (ADRs) explaining key technical choices.

---

## Future Architecture Improvements

1. **Microservices**: Split into auth, jobs, notifications services
2. **Event-Driven**: Use message queues for async tasks
3. **Caching**: Redis for sessions, frequent queries
4. **CDN**: Cloudflare/CloudFront for static assets
5. **Search**: Elasticsearch for advanced job search
6. **Real-time**: WebSockets for notifications
7. **Testing**: Unit, integration, E2E test suites
8. **CI/CD**: Automated testing and deployment
9. **Monitoring**: Full observability stack
10. **Mobile**: React Native app

---

**Last Updated:** October 12, 2025  
**Maintainer:** Jobs Europa Engineering Team

