# 🍎 QUICK SETUP FOR MAC (No Docker Required)

Since you're on Mac, here's the fastest way to get running WITHOUT Docker:

## ⚡ 5-MINUTE SETUP

### Step 1: Start Backend (Terminal 1)

```bash
# Navigate to backend
cd ~/Downloads/deepfake-detector/backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

**You should see:** `Uvicorn running on http://0.0.0.0:8000`

✅ **Backend is now running!** Keep this terminal open.

---

### Step 2: Start Frontend (NEW Terminal 2)

```bash
# Open a NEW terminal window
cd ~/Downloads/deepfake-detector/frontend

# Install dependencies (first time only)
npm install

# Start the dev server
npm run dev
```

**You should see:** `Local: http://localhost:3000`

✅ **Frontend is now running!**

---

### Step 3: Use the Platform

1. Open your browser to: **http://localhost:3000**
2. Click "Choose File"
3. Upload a video or image
4. Click "Start Analysis"
5. See the results!

---

## 🛑 If You Get Errors

### Backend Errors:

**"python: command not found"**
```bash
# Use python3 instead
python3 -m venv venv
python3 main.py
```

**"pip: command not found"**
```bash
# Use pip3
pip3 install -r requirements.txt
```

**"No module named 'cv2'"**
```bash
# Reinstall OpenCV
pip install opencv-python-headless --force-reinstall
```

### Frontend Errors:

**"npm: command not found"**
```bash
# Install Node.js first
brew install node
```

**"Port 3000 already in use"**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Then try again
npm run dev
```

---

## 🧪 Testing

Once both are running, test it:

```bash
# In a third terminal
cd ~/Downloads/deepfake-detector
python3 test_system.py
```

This will verify everything works!

---

## 🐳 Docker Issues (Optional Fix)

If you want to use Docker later:

1. **Make sure Docker Desktop is running**
   - Open Docker Desktop app
   - Wait for it to fully start
   - Look for the whale icon in menu bar

2. **Try again:**
```bash
cd ~/Downloads/deepfake-detector
docker-compose up -d
```

---

## ⏹️ Stopping the Platform

**To stop:**
- Press `Ctrl+C` in both terminal windows

**To restart:**
- Just run the commands from Step 1 and Step 2 again

---

## ✅ You're Ready!

Once both terminals show they're running:
- Backend: `http://0.0.0.0:8000` 
- Frontend: `http://localhost:3000`

**Open the frontend URL in your browser and start detecting deepfakes!**

---

## 📱 Demo Time!

For your client meeting:

1. Have both terminals running
2. Open browser to http://localhost:3000
3. Upload a test video
4. Show them the results
5. Explain the statistics

**Pro tip:** Use Command+Tab to show them both terminals running to prove it's working locally on your machine!

---

Need help? Check START_HERE.md or README.md for more details.
