# 🔐 ENVIRONMENT VARIABLES - PRODUCTION READY!

## ✅ What Just Changed

I've upgraded the platform to use **environment variables** instead of hardcoded values. This is a professional best practice and makes deployment much easier!

---

## 🎯 What You Get

### Before:
```python
# Hardcoded in code
API_URL = 'http://localhost:8000'
PORT = 8000
CORS_ORIGINS = ["*"]
```

### After:
```bash
# In .env file - easy to change!
VITE_API_URL=http://localhost:8000
PORT=8000
CORS_ORIGINS=http://localhost:3000
```

---

## 📦 New Files Created

### Backend:
- ✅ `.env` - Your configuration (gitignored)
- ✅ `.env.example` - Template for others
- ✅ `.gitignore` - Protects sensitive data
- ✅ `run.py` - New startup script

### Frontend:
- ✅ `.env` - Your configuration (gitignored)
- ✅ `.env.example` - Template for others
- ✅ `.gitignore` - Protects sensitive data

### Documentation:
- ✅ `ENV_VARIABLES.md` - Complete guide

---

## 🚀 How to Use

### Setup (One Time):

```bash
# Backend
cd deepfake-detector/backend
pip install python-dotenv

# Frontend (no changes needed)
```

### Start Backend (NEW way):

```bash
cd backend
source venv_py311/bin/activate
python run.py
```

**Or old way still works:**
```bash
python main.py
```

### Start Frontend (no changes):

```bash
cd frontend
npm run dev
```

---

## ⚙️ Key Environment Variables

### Backend (backend/.env):

```bash
# Server
PORT=8000
HOST=0.0.0.0

# CORS (important!)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# AI Model
ML_MODEL_NAME=dima806/deepfake_vs_real_image_detection
ML_DEVICE=auto  # 'auto', 'cpu', or 'cuda'

# Analysis
DEFAULT_SAMPLE_RATE=30

# YouTube
YOUTUBE_DOWNLOAD_DIR=/tmp

# Environment
ENVIRONMENT=development
```

### Frontend (frontend/.env):

```bash
# API URL (most important!)
VITE_API_URL=http://localhost:8000

# Branding
VITE_APP_TITLE=Deepfake Detection Platform
VITE_APP_SUBTITLE=Advanced AI-Powered Media Authentication

# Features
VITE_ENABLE_YOUTUBE=true
VITE_ENABLE_FILE_UPLOAD=true
```

---

## 🌍 Deploy to Production

### On Your Server:

```bash
# 1. Copy project
scp -r deepfake-detector user@server:/opt/

# 2. Configure backend
cd /opt/deepfake-detector/backend
cp .env.example .env
nano .env

# Change these:
ENVIRONMENT=production
CORS_ORIGINS=https://yoursite.com
ML_DEVICE=cuda
PORT=8000

# 3. Configure frontend
cd ../frontend
cp .env.example .env
nano .env

# Change this:
VITE_API_URL=https://api.yoursite.com

# 4. Build frontend
npm install
npm run build

# 5. Start backend
cd ../backend
python run.py
```

---

## 💡 Cool Features

### 1. Custom Branding

```bash
# frontend/.env
VITE_APP_TITLE=Iraqi Government Media Verification
VITE_APP_SUBTITLE=Protecting Truth from Propaganda
```

Instantly rebranded!

### 2. Disable Features

```bash
# frontend/.env
VITE_ENABLE_YOUTUBE=false
```

YouTube tab disappears!

### 3. Use Different AI Model

```bash
# backend/.env
ML_MODEL_NAME=your-model/better-detector
```

Swap AI models instantly!

### 4. Multiple Environments

```bash
# Development
cp .env.development .env

# Production
cp .env.production .env

# Staging
cp .env.staging .env
```

---

## 🔒 Security Benefits

### ✅ What's Protected:

- Sensitive URLs not in code
- API keys (if you add them) safe
- Different configs per environment
- `.env` files gitignored

### Example Production .env:

```bash
# backend/.env (production)
ENVIRONMENT=production
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:pass@host/db
API_KEY=your-api-key-here
```

None of this goes in git!

---

## 📥 Download

[**Download deepfake-detector-ENV-VARS.tar.gz**](computer:///mnt/user-data/outputs/deepfake-detector-ENV-VARS.tar.gz)

---

## ✅ What Works Right Now

Everything still works exactly the same! The defaults in `.env` match the old hardcoded values.

**No changes needed to test it!**

Just run:
```bash
# Backend
python run.py  # NEW
# or
python main.py  # OLD (still works)

# Frontend
npm run dev  # Same as before
```

---

## 🎯 Why This Matters

### For Development:
- Easy to test different configs
- Switch between environments
- Try different AI models
- No code changes needed

### For Production:
- Secure configuration
- Easy deployment
- Can customize per server
- Professional standard

### For Your Client:
- Easy to rebrand
- Can white-label
- Custom settings per deployment
- No code access needed

---

## 📚 Full Documentation

Check **ENV_VARIABLES.md** for:
- Complete variable list
- Deployment guides
- Security best practices
- Troubleshooting
- Examples for all scenarios

---

## 🎉 Benefits Summary

✅ **Production-ready** - Industry standard
✅ **Secure** - Sensitive data protected
✅ **Flexible** - Easy to customize
✅ **Professional** - Proper config management
✅ **Deployable** - Multiple environments
✅ **Maintainable** - Change without code edits

---

**Your platform is now enterprise-grade!** 🚀

Test it, deploy it, sell it! Everything still works, but now it's professional and production-ready.
