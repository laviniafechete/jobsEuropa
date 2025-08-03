# 🚨 CORS Error Fix Guide - WWW Subdomain Issue

## ❌ **Problema Exactă:**
- Site: `https://www.jobs-europa.com` (cu **www**)
- API: `https://jobs-europa.com/api` (fără **www**)
- Origin: `https://www.jobs-europa.com`
- Status: 200 OK, dar frontend nu primește răspunsul

## ✅ **Soluția:**

### 1. **Setează Variabilele de Mediu în DigitalOcean:**

**Mergi în DigitalOcean → App Platform → Settings → Environment Variables:**

```bash
NODE_ENV=production
CORS_ORIGIN=https://www.jobs-europa.com
FRONTEND_URL=https://www.jobs-europa.com
```

⚠️ **IMPORTANT:** 
- Cu **www** dacă site-ul tău rulează pe www
- Fără `/` la sfârșitul URL-urilor!

### 2. **Configurația CORS Din Cod (Deja Implementată):**

```javascript
const allowedOrigins = [
  config.corsOrigin,
  'https://jobs-europa.com',
  'https://www.jobs-europa.com', // ✅ Deja inclus
  'http://localhost:5173',
  'http://localhost:3000'
];
```

### 3. **Redeploy Aplicația:**
După ce setezi variabilele, apasă **Actions → Force Rebuild**.

### 4. **Verifică Logs:**
În **Runtime Logs** vei vedea:
```
2025-07-30 - GET /api/jobs - Origin: https://www.jobs-europa.com
CORS_ORIGIN from env: https://www.jobs-europa.com
```

## 🔧 **Ce Să Verifici:**

### **A. Variabile de Mediu:**
```bash
CORS_ORIGIN=https://www.jobs-europa.com  # Cu www dacă site-ul are www
NODE_ENV=production                      # Obligatoriu
```

### **B. Debugging în Browser:**
1. **Network Tab → API Call**
2. **Response Headers:** Trebuie să vezi `Access-Control-Allow-Origin: https://www.jobs-europa.com`
3. **Status:** 200 OK + Response body vizibil

### **C. Runtime Logs:**
```
✅ CORS_ORIGIN from env: https://www.jobs-europa.com
✅ Origin allowed: https://www.jobs-europa.com
```

## 🚀 **Rezultat Final:**
- ✅ Frontend primește răspunsurile API
- ✅ Job list se încarcă
- ✅ Toate feature-urile funcționează
- ✅ Nu mai sunt erori CORS

## 📋 **Checklist Rapid:**
- [ ] `CORS_ORIGIN=https://www.jobs-europa.com` (cu www)
- [ ] `NODE_ENV=production`
- [ ] Rebuild aplicația în DigitalOcean
- [ ] Verifică logs pentru confirmarea variabilelor
- [ ] Testează API calls în browser Network tab 