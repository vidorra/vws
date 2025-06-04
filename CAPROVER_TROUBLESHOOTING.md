# CapRover Troubleshooting Guide

## Check These Settings in CapRover:

### 1. In the App Dashboard for `vaatwasstripsvergelijker`:

#### HTTP Settings Tab:
- [ ] **Container HTTP Port**: Must be `3000` (not 80 or anything else)
- [ ] **Force HTTPS**: Should be UNCHECKED
- [ ] **Websocket Support**: Can be enabled if needed

#### App Configs Tab:
- [ ] All environment variables are set (check CAPROVER_ENV_VARS.md)
- [ ] Click "Save & Update" after any changes

#### Deployment Tab:
- [ ] Check if the latest deployment was successful
- [ ] Look for any error messages in the deployment logs

### 2. Domain Configuration:
- [ ] The domain `vaatwasstripsvergelijker.server.devjens.nl` should be listed
- [ ] If using a custom domain, make sure it's properly configured

### 3. Try These Actions:

1. **Restart the App**:
   - Click "Restart" button in the app dashboard

2. **Force Redeploy**:
   - In Deployment tab, click "Deploy via ImageName"
   - Use the same image name to force a fresh deployment

3. **Check App Logs**:
   - Look for any runtime errors
   - Should see "Next.js 14.1.0" and "Ready in Xms"

### 4. Test Direct Container Access:
If CapRover shows the app is running on a specific container port, you might be able to test it directly through CapRover's internal network.

### 5. Common Issues:

**Issue**: Default CapRover page shows
**Solution**: Container HTTP Port is wrong (should be 3000)

**Issue**: SSL/HTTPS errors
**Solution**: Disable "Force HTTPS" until SSL is properly configured

**Issue**: App crashes immediately
**Solution**: Check environment variables, especially DATABASE_URL

**Issue**: Database connection errors
**Solution**: Ensure DATABASE_URL uses the internal hostname (srv-captain--vaatwasstrips-db)