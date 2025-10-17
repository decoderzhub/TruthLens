# 🔐 ENVIRONMENT VARIABLES GUIDE

## ✅ Overview

The platform now uses `.env` files for configuration instead of hardcoded values. This makes it easier to:
- ✅ Deploy to different environments (dev, staging, production)
- ✅ Change settings without editing code
- ✅ Keep sensitive data out of version control
- ✅ Configure per deployment

---

## 📁 File Structure

```
deepfake-detector/
├── backend/
│   ├── .env                    # Your actual config (gitignored)
│   ├── .env.example            # Template to copy
│   ├── .gitignore              # Prevents .env from being committed
│   └── run.py                  # New startup script
└── frontend/
    ├── .env                    # Your actual config (gitignored)
    ├── .env.example            # Template to copy
    └── .gitignore              # Prevents .env from being committed
```

---

## 🚀 Quick Setup

### First Time Setup:

```bash
# Backend
cd deepfake-detector/backend
cp .env.example .env
# Edit .env with your settings (optional - defaults work fine)

# Frontend  
cd ../frontend
cp .env.example .env
# Edit .env with your settings (optional - defaults work fine)
```

### Start Everything:

```bash
# Backend (new way)
cd backend
source venv_py311/bin/activate
pip install python-dotenv  # One time only
python run.py              # Uses .env automatically

# OR old way still works
python main.py

# Frontend (no changes needed)
cd frontend
npm run dev
```

---

## ⚙️ Backend Environment Variables

### Location: `backend/.env`

```bash
# Server Settings
HOST=0.0.0.0              # Bind address (0.0.0.0 = all interfaces)
PORT=8000                 # API port
WORKERS=4                 # Number of worker processes

# CORS Settings
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
# Comma-separated list of allowed origins

# Model Settings
ML_MODEL_NAME=dima806/deepfake_vs_real_image_detection
# HuggingFace model to use

ML_DEVICE=auto           # 'auto', 'cpu', or 'cuda'
# auto = GPU if available, else CPU

# Video Analysis
DEFAULT_SAMPLE_RATE=30   # Frames to analyze per video
MAX_VIDEO_SIZE_MB=500    # Maximum upload size

# YouTube Download
YOUTUBE_DOWNLOAD_DIR=/tmp     # Where to download temp videos
YOUTUBE_MAX_DURATION=600      # Max video length (seconds)

# Environment
ENVIRONMENT=development  # 'development' or 'production'
# development = auto-reload enabled
```

### How to Change Settings:

```bash
# Example: Change to production mode
echo "ENVIRONMENT=production" >> backend/.env

# Example: Use GPU
echo "ML_DEVICE=cuda" >> backend/.env

# Example: Change port
echo "PORT=9000" >> backend/.env
```

---

## 🎨 Frontend Environment Variables

### Location: `frontend/.env`

**IMPORTANT:** All frontend variables MUST start with `VITE_`

```bash
# API Backend URL
VITE_API_URL=http://localhost:8000
# Change to your production API URL when deploying

# Application Settings
VITE_APP_TITLE=Deepfake Detection Platform
VITE_APP_SUBTITLE=Advanced AI-Powered Media Authentication

# Feature Flags
VITE_ENABLE_YOUTUBE=true      # Show YouTube URL tab
VITE_ENABLE_FILE_UPLOAD=true  # Show file upload

# Upload Limits
VITE_MAX_FILE_SIZE_MB=500
VITE_ACCEPTED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
VITE_ACCEPTED_VIDEO_TYPES=video/mp4,video/avi,video/mov,video/webm

# Environment
VITE_ENVIRONMENT=development
```

### How to Use in Code:

```javascript
// Access in React components
const apiUrl = import.meta.env.VITE_API_URL;
const appTitle = import.meta.env.VITE_APP_TITLE;
const enableYoutube = import.meta.env.VITE_ENABLE_YOUTUBE === 'true';
```

---

## 🌍 Different Environments

### Development (Local):

```bash
# backend/.env
ENVIRONMENT=development
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# frontend/.env
VITE_API_URL=http://localhost:8000
VITE_ENVIRONMENT=development
```

### Production (Server):

```bash
# backend/.env
ENVIRONMENT=production
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=https://yourdomain.com
ML_DEVICE=cuda

# frontend/.env
VITE_API_URL=https://api.yourdomain.com
VITE_ENVIRONMENT=production
```

### Staging:

```bash
# backend/.env
ENVIRONMENT=production
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=https://staging.yourdomain.com

# frontend/.env
VITE_API_URL=https://api-staging.yourdomain.com
VITE_ENVIRONMENT=staging
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` files in `.gitignore`
- Use `.env.example` for templates (commit this)
- Use different values per environment
- Restrict file permissions: `chmod 600 .env`
- Use strong secrets in production

### ❌ DON'T:
- Commit `.env` files to git
- Share `.env` files publicly
- Use development settings in production
- Put passwords in `.env.example`

---

## 🎯 Common Use Cases

### 1. Deploy to Different Server

```bash
# Copy project to server
scp -r deepfake-detector user@server:/opt/

# On server, create .env
cd /opt/deepfake-detector/backend
cp .env.example .env

# Edit for production
nano .env
# Change: 
#   ENVIRONMENT=production
#   CORS_ORIGINS=https://yoursite.com
#   ML_DEVICE=cuda

# Same for frontend
cd ../frontend
cp .env.example .env
nano .env
# Change:
#   VITE_API_URL=https://api.yoursite.com
```

### 2. Use Different AI Model

```bash
# backend/.env
ML_MODEL_NAME=your-username/your-model-name
```

### 3. Disable YouTube for Client

```bash
# frontend/.env
VITE_ENABLE_YOUTUBE=false
```

Only file upload will show!

### 4. Custom Branding

```bash
# frontend/.env
VITE_APP_TITLE=Iraqi Government Media Verification
VITE_APP_SUBTITLE=Protecting Truth from Propaganda
```

### 5. Multiple Backends (Load Balancing)

```bash
# frontend/.env
VITE_API_URL=https://lb.yourdomain.com
```

Point to load balancer that distributes to multiple backend instances.

---

## 📝 Template Files

### Backend .env.example
All settings with safe defaults. Copy this to start.

### Frontend .env.example
All settings with safe defaults. Copy this to start.

### .gitignore Files
Both backend and frontend have `.gitignore` that excludes:
- `.env` (actual config)
- `.env.local`
- `.env.*.local`

But includes:
- `.env.example` (template)

---

## 🐛 Troubleshooting

### Backend Not Loading .env

**Solution:**
```bash
pip install python-dotenv
python run.py  # Use run.py instead of main.py
```

### Frontend Variables Not Working

**Problem:** Used `API_URL` instead of `VITE_API_URL`

**Solution:** ALL frontend env vars must start with `VITE_`

### CORS Errors After Changing Backend URL

**Solution:** Add frontend URL to backend CORS_ORIGINS:
```bash
# backend/.env
CORS_ORIGINS=http://localhost:3000,https://yourfrontend.com
```

### Can't See Environment Changes

**Solution:** Restart both servers after changing .env:
```bash
# Backend
Ctrl+C
python run.py

# Frontend  
Ctrl+C
npm run dev
```

---

## 📚 Additional Resources

### Python-dotenv Docs
https://github.com/theskumar/python-dotenv

### Vite Environment Variables
https://vitejs.dev/guide/env-and-mode.html

### FastAPI Settings
https://fastapi.tiangolo.com/advanced/settings/

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `.env` files exist in backend and frontend
- [ ] `.env` files are in `.gitignore`
- [ ] Backend starts with `python run.py`
- [ ] Frontend connects to correct backend URL
- [ ] CORS allows frontend origin
- [ ] ML model loads correctly
- [ ] YouTube feature works (if enabled)

---

## 🎉 Benefits

### Before (Hardcoded):
```python
# main.py
CORS_ORIGINS = ["*"]  # Hardcoded - insecure!
PORT = 8000           # Hardcoded - can't change easily
```

### After (Environment Variables):
```python
# main.py
CORS_ORIGINS = os.getenv('CORS_ORIGINS').split(',')  # Configurable!
PORT = int(os.getenv('PORT', 8000))                  # Configurable with default!
```

```bash
# .env
CORS_ORIGINS=https://trusted-site.com
PORT=9000
```

---

**Now your platform is production-ready with proper configuration management!** 🚀
