# 🚀 QUICK START GUIDE - Deepfake Detection Platform

## For Immediate Demo/Testing

### Option 1: Docker (Fastest - Recommended)

```bash
# Clone or extract the project
cd deepfake-detector

# Start everything with Docker
docker-compose up -d

# Wait ~30 seconds for services to start
# Open browser to http://localhost:3000
```

**Done! The platform is now running.**

---

### Option 2: Manual Setup (5 minutes)

#### Step 1: Start Backend

```bash
# Open Terminal/Command Prompt
cd deepfake-detector/backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

**Backend now running on http://localhost:8000** ✅

#### Step 2: Start Frontend (New Terminal)

```bash
# Open a NEW Terminal/Command Prompt
cd deepfake-detector/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Frontend now running on http://localhost:3000** ✅

---

## Testing the Platform

### Test with Sample Files

1. **Open browser**: Go to `http://localhost:3000`
2. **Upload a file**: 
   - Click "Choose File"
   - Select an image or video
3. **Analyze**: Click "Start Analysis"
4. **View Results**: See detailed breakdown with statistics

### Understanding Results

- **0-25%**: Likely Authentic (GREEN)
- **25-40%**: Possibly Authentic (YELLOW)
- **40-60%**: Suspicious (ORANGE)
- **60-75%**: Likely Fake (ORANGE-RED)
- **75-100%**: Highly Likely Fake (RED)

### For Videos

The system will:
- Analyze frames throughout the video
- Show suspicious timestamps
- Provide frame-by-frame breakdown
- Highlight specific moments that appear manipulated

---

## API Testing (Optional)

### Test Image Analysis
```bash
curl -X POST "http://localhost:8000/analyze/image" \
  -F "file=@path/to/test-image.jpg"
```

### Test Video Analysis
```bash
curl -X POST "http://localhost:8000/analyze/video" \
  -F "file=@path/to/test-video.mp4"
```

---

## Stopping the Platform

### Docker:
```bash
docker-compose down
```

### Manual:
- Press `Ctrl+C` in both Terminal windows

---

## Troubleshooting

### Backend won't start:
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend won't start:
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Can't connect to backend:
1. Check backend is running: `http://localhost:8000`
2. Should see: `{"service":"Deepfake Detection API"...}`
3. If not, restart backend

### Upload fails:
- Check file size (keep under 100MB for demo)
- Ensure file is image/video format
- Backend must be running

---

## Quick Demo Script

**For presenting to Iraqi government officials:**

1. **Introduction** (1 min)
   - "This platform analyzes videos and images for deepfake indicators"
   - "Uses 5 different AI detection methods simultaneously"

2. **Upload Sample** (1 min)
   - Choose a test propaganda video
   - Show upload interface

3. **Analysis** (2-3 min)
   - Start analysis (processing takes 30-60 seconds)
   - Explain what it's checking while processing

4. **Results Review** (3-5 min)
   - Show overall verdict
   - Explain the percentage score
   - Highlight suspicious frame timestamps
   - Show method breakdown

5. **Discussion** (5 min)
   - Explain it can be deployed on their servers
   - No data sent to external services
   - Can analyze any video format
   - Processes in minutes, not hours

---

## Performance Notes

- **Images**: 2-5 seconds
- **Videos** (1 min): 30-60 seconds
- **Videos** (5 min): 2-3 minutes

**Tip**: For faster demo, use shorter videos (30-60 seconds)

---

## Next Steps After Demo

If client approves:

1. ✅ Add their logo/branding
2. ✅ Deploy to their servers
3. ✅ Add authentication
4. ✅ Integrate with their systems
5. ✅ Train on specific propaganda types
6. ✅ Add batch processing
7. ✅ Create admin dashboard

---

**Need Help?**
- Check README.md for detailed docs
- Contact: Darin Manley
- All code included and ready to deploy

**IMPORTANT**: Keep backend (port 8000) and frontend (port 3000) running simultaneously!
