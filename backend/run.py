#!/usr/bin/env python
"""
Deepfake Detection API Server
Starts the FastAPI server with configuration from .env file
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', '8000'))
    workers = int(os.getenv('WORKERS', '4'))
    environment = os.getenv('ENVIRONMENT', 'development')
    
    # Reload only in development
    reload = environment == 'development'
    
    print(f"\n🚀 Starting Deepfake Detection API")
    print(f"   Environment: {environment}")
    print(f"   Host: {host}")
    print(f"   Port: {port}")
    print(f"   Workers: {workers}")
    print(f"   Auto-reload: {reload}\n")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )
