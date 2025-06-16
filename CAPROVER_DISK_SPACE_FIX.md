# CapRover Disk Space Issue - Fix Guide

## Problem
The deployment is failing with:
```
write /app/node_modules/@prisma/engines/schema-engine-linux-musl-arm64-openssl-3.0.x: no space left on device
```

## Solution Steps

### 1. Access CapRover Server
You need to SSH into your CapRover server or access it through your hosting provider's console.

### 2. Check Disk Usage
```bash
df -h
```
This will show which partitions are full.

### 3. Clean Up Docker Resources
CapRover uses Docker, which can accumulate unused images, containers, and volumes:

```bash
# Remove unused Docker images
docker image prune -a

# Remove unused containers
docker container prune

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Or do all at once (be careful!)
docker system prune -a --volumes
```

### 4. Check CapRover App Logs
Large log files can consume space:
```bash
# Find large log files
find /var/lib/docker/containers -name "*.log" -exec ls -lh {} \; | awk '{ print $5 " " $9 }' | sort -hr | head -20

# Truncate large log files if needed
truncate -s 0 /var/lib/docker/containers/[container-id]/[container-id]-json.log
```

### 5. Clean npm/node_modules caches
```bash
# Clear npm cache
npm cache clean --force

# Remove old node_modules in CapRover apps
cd /captain/data/app-data
# Be careful with this - only remove from apps you're sure about
```

### 6. After Cleanup
1. Check disk space again: `df -h`
2. Restart the app in CapRover
3. Try deploying again

## Prevention
1. Set up log rotation for Docker containers
2. Regular cleanup schedule
3. Monitor disk usage
4. Consider increasing disk size if this happens frequently

## Quick CapRover-specific cleanup
In CapRover dashboard:
1. Go to "Apps"
2. Click on your app
3. Go to "App Configs"
4. Click "Clean Build Cache"
5. Also consider removing old app versions if you have many

## Note
The good news is that we already updated the production database successfully with the seed command, so GreenGoods has been removed from the database. We just need to get the new code deployed once the disk space issue is resolved.