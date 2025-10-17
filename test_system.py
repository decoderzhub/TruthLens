#!/usr/bin/env python3
"""
Test script to verify the Deepfake Detection Platform is working correctly.
Run this after installation to ensure all components are functioning.
"""

import requests
import sys
import time
from pathlib import Path

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_status(message, status="info"):
    """Print colored status messages"""
    colors = {
        "success": Colors.GREEN + "✓ " + Colors.END,
        "error": Colors.RED + "✗ " + Colors.END,
        "warning": Colors.YELLOW + "⚠ " + Colors.END,
        "info": Colors.BLUE + "ℹ " + Colors.END
    }
    print(f"{colors.get(status, '')}{message}")

def test_backend_health():
    """Test if backend is running and healthy"""
    print_status("Testing backend health...", "info")
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            print_status("Backend is healthy!", "success")
            return True
        else:
            print_status(f"Backend returned status code {response.status_code}", "error")
            return False
    except requests.exceptions.RequestException as e:
        print_status(f"Cannot connect to backend: {e}", "error")
        print_status("Make sure backend is running on port 8000", "warning")
        return False

def test_frontend():
    """Test if frontend is accessible"""
    print_status("Testing frontend accessibility...", "info")
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print_status("Frontend is accessible!", "success")
            return True
        else:
            print_status(f"Frontend returned status code {response.status_code}", "error")
            return False
    except requests.exceptions.RequestException as e:
        print_status(f"Cannot connect to frontend: {e}", "error")
        print_status("Make sure frontend is running on port 3000", "warning")
        return False

def test_api_root():
    """Test API root endpoint"""
    print_status("Testing API root endpoint...", "info")
    try:
        response = requests.get(BACKEND_URL, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if "service" in data and "Deepfake Detection" in data["service"]:
                print_status(f"API Root: {data}", "success")
                return True
        print_status("API root endpoint not working correctly", "error")
        return False
    except Exception as e:
        print_status(f"Error testing API root: {e}", "error")
        return False

def create_test_image():
    """Create a simple test image"""
    print_status("Creating test image...", "info")
    try:
        import numpy as np
        from PIL import Image
        
        # Create a simple gradient image
        width, height = 640, 480
        image_array = np.zeros((height, width, 3), dtype=np.uint8)
        
        for i in range(height):
            for j in range(width):
                image_array[i, j] = [i % 256, j % 256, (i + j) % 256]
        
        img = Image.fromarray(image_array)
        test_path = Path("test_image.jpg")
        img.save(test_path)
        print_status(f"Test image created: {test_path}", "success")
        return test_path
    except ImportError:
        print_status("PIL/Pillow not installed. Install with: pip install Pillow", "error")
        return None
    except Exception as e:
        print_status(f"Error creating test image: {e}", "error")
        return None

def test_image_analysis(image_path):
    """Test image analysis endpoint"""
    print_status("Testing image analysis...", "info")
    try:
        with open(image_path, 'rb') as f:
            files = {'file': ('test.jpg', f, 'image/jpeg')}
            response = requests.post(
                f"{BACKEND_URL}/analyze/image",
                files=files,
                timeout=30
            )
        
        if response.status_code == 200:
            data = response.json()
            print_status("Image analysis successful!", "success")
            print_status(f"  Verdict: {data['analysis']['verdict']}", "info")
            print_status(f"  Probability: {data['analysis']['deepfake_probability']}%", "info")
            print_status(f"  Risk Level: {data['analysis']['risk_level']}", "info")
            return True
        else:
            print_status(f"Image analysis failed with status {response.status_code}", "error")
            print_status(f"Response: {response.text}", "error")
            return False
    except Exception as e:
        print_status(f"Error testing image analysis: {e}", "error")
        return False

def run_all_tests():
    """Run all tests"""
    print("\n" + "="*60)
    print("  DEEPFAKE DETECTION PLATFORM - SYSTEM TEST")
    print("="*60 + "\n")
    
    results = []
    
    # Test 1: Backend Health
    print("\n[Test 1/5] Backend Health Check")
    print("-" * 40)
    results.append(("Backend Health", test_backend_health()))
    time.sleep(1)
    
    # Test 2: Frontend Accessibility
    print("\n[Test 2/5] Frontend Accessibility")
    print("-" * 40)
    results.append(("Frontend", test_frontend()))
    time.sleep(1)
    
    # Test 3: API Root
    print("\n[Test 3/5] API Root Endpoint")
    print("-" * 40)
    results.append(("API Root", test_api_root()))
    time.sleep(1)
    
    # Test 4: Create Test Image
    print("\n[Test 4/5] Test Image Creation")
    print("-" * 40)
    test_image = create_test_image()
    results.append(("Test Image", test_image is not None))
    time.sleep(1)
    
    # Test 5: Image Analysis (only if test image created)
    print("\n[Test 5/5] Image Analysis")
    print("-" * 40)
    if test_image:
        results.append(("Image Analysis", test_image_analysis(test_image)))
        # Clean up
        try:
            test_image.unlink()
            print_status("Test image cleaned up", "info")
        except:
            pass
    else:
        results.append(("Image Analysis", False))
        print_status("Skipping image analysis (no test image)", "warning")
    
    # Summary
    print("\n" + "="*60)
    print("  TEST SUMMARY")
    print("="*60 + "\n")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "success" if result else "error"
        print_status(f"{test_name}: {'PASSED' if result else 'FAILED'}", status)
    
    print("\n" + "-"*60)
    percentage = (passed / total) * 100
    if passed == total:
        print_status(f"All tests passed! ({passed}/{total}) ✨", "success")
        print_status("\nPlatform is ready to use!", "success")
        print_status(f"  • Frontend: {FRONTEND_URL}", "info")
        print_status(f"  • Backend API: {BACKEND_URL}", "info")
        return 0
    else:
        print_status(f"Some tests failed ({passed}/{total} passed, {percentage:.0f}%)", "warning")
        print_status("\nPlease check the errors above and ensure:", "warning")
        print_status("  1. Backend is running (python backend/main.py)", "info")
        print_status("  2. Frontend is running (npm run dev in frontend/)", "info")
        print_status("  3. All dependencies are installed", "info")
        return 1

if __name__ == "__main__":
    try:
        exit_code = run_all_tests()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print_status("\n\nTest interrupted by user", "warning")
        sys.exit(1)
    except Exception as e:
        print_status(f"\n\nUnexpected error: {e}", "error")
        sys.exit(1)
