# 🛡️ DEPLOYMENT GUIDE - Iraqi Government

## Government-Grade Deployment Options

### Option 1: On-Premises Deployment (Most Secure - Recommended)

**Best for:**
- Maximum security and data sovereignty
- No external dependencies
- Full control over infrastructure
- Compliance with government regulations

#### Hardware Requirements

**Minimum Specs:**
- CPU: 4 cores (Intel i5 or equivalent)
- RAM: 8GB
- Storage: 100GB SSD
- OS: Ubuntu 20.04 LTS or Windows Server 2019+

**Recommended Specs:**
- CPU: 8+ cores (Intel i7/Xeon)
- RAM: 16GB+
- Storage: 500GB SSD
- GPU: Optional (NVIDIA for ML enhancement)
- OS: Ubuntu 22.04 LTS

#### Installation Steps

```bash
# 1. Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt-get install docker-compose

# 2. Deploy the platform
cd deepfake-detector
docker-compose up -d

# 3. Configure firewall (optional)
sudo ufw allow 3000/tcp  # Frontend
sudo ufw allow 8000/tcp  # Backend (internal only)

# 4. Set up reverse proxy with Nginx (for production)
sudo apt-get install nginx
```

#### Nginx Production Configuration

```nginx
server {
    listen 80;
    server_name deepfake.gov.iq;  # Your domain

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # File upload limits
        client_max_body_size 500M;
        client_body_timeout 300s;
        proxy_read_timeout 300s;
    }
}
```

---

### Option 2: Private Cloud (Flexible)

**Best for:**
- Scalability
- Multiple departments
- Remote access
- Centralized management

**Deployment Platforms:**
- DigitalOcean (private VPC)
- AWS (GovCloud if available)
- Azure Government
- Local data center with virtualization

#### Cloud Setup (Ubuntu Server)

```bash
# 1. Create Ubuntu 22.04 server
# Minimum: 2 vCPUs, 8GB RAM, 100GB SSD

# 2. Secure the server
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 3. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 4. Deploy application
git clone [your-repo]
cd deepfake-detector
docker-compose -f docker-compose.prod.yml up -d

# 5. Set up SSL (Let's Encrypt)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d deepfake.gov.iq
```

---

## Security Configuration

### 1. Access Control

#### Add Basic Authentication

Create `.htpasswd`:
```bash
sudo apt-get install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin
```

Update Nginx config:
```nginx
location / {
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://localhost:3000;
}
```

#### Advanced: JWT Authentication

Edit `backend/main.py` to add authentication:
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Add your JWT verification logic
    pass

@app.post("/analyze/video")
async def analyze_video(
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Depends(verify_token)
):
    # Your existing code
```

### 2. Network Security

```bash
# Firewall rules (production)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp     # SSH (from specific IPs only)
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp    # HTTPS
sudo ufw enable

# Restrict SSH to specific IPs
sudo ufw delete allow 22/tcp
sudo ufw allow from 192.168.1.0/24 to any port 22
```

### 3. Data Security

```bash
# Encrypt data at rest
# Set up LUKS encryption for data drives
sudo cryptsetup luksFormat /dev/sdb
sudo cryptsetup luksOpen /dev/sdb encrypted_data

# Mount encrypted volume
sudo mkfs.ext4 /dev/mapper/encrypted_data
sudo mount /dev/mapper/encrypted_data /mnt/secure_data
```

### 4. Logging & Monitoring

```bash
# Install monitoring
sudo apt-get install prometheus grafana

# Set up log rotation
sudo nano /etc/logrotate.d/deepfake-detector
```

Add:
```
/var/log/deepfake-detector/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

---

## Backup & Disaster Recovery

### Automated Backups

```bash
#!/bin/bash
# /usr/local/bin/backup-deepfake.sh

BACKUP_DIR="/mnt/backup/deepfake"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup configuration
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /opt/deepfake-detector

# Backup database (if added later)
# pg_dump deepfake_db > $BACKUP_DIR/db_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

Schedule with cron:
```bash
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-deepfake.sh
```

---

## Performance Optimization

### 1. Video Processing Queue

For high-volume processing, add Redis queue:

```bash
# Install Redis
sudo apt-get install redis-server

# Update docker-compose.yml
services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  worker:
    build: ./backend
    command: celery -A tasks worker --loglevel=info
    depends_on:
      - redis
```

### 2. Caching Results

```python
# Add to backend/main.py
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url("redis://localhost")
    FastAPICache.init(RedisBackend(redis), prefix="deepfake-cache")
```

### 3. GPU Acceleration (Optional)

If GPU available:
```dockerfile
# Update backend/Dockerfile
FROM nvidia/cuda:11.8.0-base-ubuntu22.04

# Install CUDA-enabled OpenCV
RUN pip install opencv-python-headless
```

---

## Monitoring & Maintenance

### Health Checks

```bash
# Add to cron for automated monitoring
*/5 * * * * curl -f http://localhost:8000/health || systemctl restart docker-compose
```

### System Monitoring

```bash
# Install monitoring tools
sudo apt-get install htop iotop nethogs

# Monitor in real-time
htop                    # CPU/RAM
iotop                   # Disk I/O
nethogs                 # Network
docker stats            # Container resources
```

### Log Analysis

```bash
# View backend logs
docker-compose logs -f backend

# View frontend logs
docker-compose logs -f frontend

# Check for errors
docker-compose logs backend | grep -i error

# Monitor API requests
tail -f /var/log/nginx/access.log
```

---

## Scaling for Multiple Users

### Horizontal Scaling

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    build: ./backend
    deploy:
      replicas: 4  # Multiple instances
    environment:
      - WORKERS=4

  nginx-lb:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
```

### Load Balancer Configuration

```nginx
upstream backend_servers {
    least_conn;
    server backend:8000 max_fails=3 fail_timeout=30s;
    server backend:8001 max_fails=3 fail_timeout=30s;
    server backend:8002 max_fails=3 fail_timeout=30s;
    server backend:8003 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    
    location /api/ {
        proxy_pass http://backend_servers;
        proxy_next_upstream error timeout invalid_header http_500;
        proxy_connect_timeout 5s;
    }
}
```

---

## Maintenance Schedule

### Daily
- Check system logs for errors
- Monitor disk space
- Verify backups completed

### Weekly
- Review access logs
- Update system packages: `sudo apt-get update && sudo apt-get upgrade`
- Check performance metrics

### Monthly
- Review and rotate logs
- Test disaster recovery procedures
- Update application dependencies
- Security audit

---

## Compliance & Documentation

### For Iraqi Government Standards

1. **Data Sovereignty**: All data stored within Iraq
2. **Access Logs**: Maintain audit trail of all analyses
3. **User Authentication**: Track who analyzes what content
4. **Encryption**: All data encrypted at rest and in transit
5. **Backup**: Regular backups with 30-day retention

### Required Documentation

- System architecture diagram
- User access policies
- Incident response plan
- Maintenance procedures
- Training materials

---

## Training & Support

### User Training (2 hours)

1. **Hour 1: Platform Overview**
   - How deepfake detection works
   - Understanding results
   - When to use each method

2. **Hour 2: Hands-on Practice**
   - Uploading files
   - Interpreting statistics
   - Handling suspicious content
   - Report generation

### Administrator Training (4 hours)

1. **System Administration**
   - Deployment
   - Configuration
   - User management
   - Troubleshooting

2. **Security & Compliance**
   - Access control
   - Audit logging
   - Backup/restore
   - Incident response

---

## Cost Estimation

### On-Premises (One-Time)

- **Hardware**: $2,000 - $5,000
- **Software**: $0 (open source)
- **Setup**: Included in contract
- **Training**: Included in contract

**Annual Operating Costs**: $500 - $1,000 (power, maintenance)

### Cloud Deployment (Monthly)

- **Server**: $50 - $200/month
- **Storage**: $20 - $50/month
- **Bandwidth**: $10 - $100/month (depends on usage)

**Total**: $80 - $350/month

---

## Support & Maintenance Package

### Included in Contract:

✅ Initial deployment and configuration
✅ User training (2 hours)
✅ Administrator training (4 hours)
✅ 30 days of support after deployment
✅ Documentation and runbooks

### Optional (Additional):

- 24/7 support: $500/month
- Monthly maintenance: $300/month
- Custom feature development: Quote on request
- Integration with existing systems: Quote on request

---

## Emergency Contacts

**Technical Issues**:
- Contact: Darin Manley
- Response Time: 24 hours
- Emergency: 4 hours

**Security Incidents**:
- Immediate system isolation
- Log preservation
- Contact support team

---

## Next Steps

1. ✅ Review deployment options
2. ✅ Choose hardware/cloud provider
3. ✅ Schedule deployment date
4. ✅ Plan user training
5. ✅ Define access policies
6. ✅ Test with sample propaganda

**Ready to deploy when you are!**
