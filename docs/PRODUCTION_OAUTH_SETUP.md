# NovaPulse Production-Grade OAuth & Real Backend Setup Guide

## Overview

This guide transforms NovaPulse from a simulated prototype into a genuine production-grade enterprise platform with real authentication, database persistence, WebSockets, webhooks, and automated escalation.

---

## Part 1: Real OAuth Setup

### Google OAuth 2.0 Configuration

#### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Select **Web Application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
   - `https://your-production-domain.com/api/auth/google/callback`

7. Copy **Client ID** and **Client Secret**

#### Step 2: Update .env File

```bash
# backend/.env

GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"
```

### Microsoft Entra ID Configuration (Optional)

#### Step 1: Register Application

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Set redirect URI: `http://localhost:3000/api/auth/microsoft/callback`
5. Go to **Certificates & secrets** → **New client secret**
6. Copy **Application (client) ID** and **Client secret value**

#### Step 2: Update .env File

```bash
# backend/.env

MICROSOFT_CLIENT_ID="YOUR_MICROSOFT_CLIENT_ID"
MICROSOFT_CLIENT_SECRET="YOUR_MICROSOFT_CLIENT_SECRET"
MICROSOFT_TENANT_ID="YOUR_TENANT_ID"
MICROSOFT_CALLBACK_URL="http://localhost:3000/api/auth/microsoft/callback"
```

---

## Part 2: Database Setup

### Prerequisites

- PostgreSQL 14+
- Docker (recommended)

### Setup Local PostgreSQL

#### Option A: Docker (Recommended)

```bash
# Create .env file if not exists
cat >> backend/.env << EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/novapulse"
EOF

# Start PostgreSQL
docker run -d \
  --name novapulse-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=novapulse \
  -p 5432:5432 \
  postgres:15-alpine

# Wait for container to be healthy
sleep 5
```

#### Option B: Native PostgreSQL

```bash
# Create database
createdb novapulse

# Update .env with your connection string
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/novapulse"
```

### Run Migrations & Seed Data

```bash
cd backend

# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate deploy

# Seed database with demo data
npx prisma db seed

# Open Prisma Studio to inspect data
npx prisma studio
```

---

## Part 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Update .env with complete configuration
cat > .env << EOF
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/novapulse"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"

# Google OAuth
GOOGLE_CLIENT_ID="YOUR_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

# Microsoft OAuth
MICROSOFT_CLIENT_ID="YOUR_CLIENT_ID"
MICROSOFT_CLIENT_SECRET="YOUR_CLIENT_SECRET"
MICROSOFT_TENANT_ID="YOUR_TENANT_ID"
MICROSOFT_CALLBACK_URL="http://localhost:3000/api/auth/microsoft/callback"

# Webhooks (Optional - set if you have Discord/Slack)
WEBHOOK_DISCORD_URL="https://discord.com/api/webhooks/..."
WEBHOOK_SLACK_URL="https://hooks.slack.com/..."

# Frontend
FRONTEND_URL="http://localhost:5173"
PORT=3000
NODE_ENV="development"
EOF

# Start development server
npm run start:dev
```

Backend will be available at `http://localhost:3000`

---

## Part 4: Frontend Setup

```bash
cd frontend/NovaPulse

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## Part 5: Complete Demo Story (Production-Grade)

### SCENE 1: Real OAuth Login

1. **Open Application**
   - Navigate to `http://localhost:5173`
   - Click "Continue with Google"

2. **Google Login Flow**
   - Browser redirects to Google login
   - User authenticates
   - Google redirects to backend callback
   - Backend:
     - Verifies JWT signature from Google
     - Creates or updates user in PostgreSQL
     - Issues signed JWT with RBAC claims
     - Redirects to frontend with token

3. **Frontend Handling**
   - Parses JWT from redirect URL
   - Stores token in sessionStorage
   - Decodes JWT to extract role
   - Redirects to authenticated dashboard

4. **Expected Result**
   - User logged in as themselves (not demo user!)
   - JWT visible in browser DevTools
   - User data persisted in PostgreSQL

### SCENE 2: Real Database Persistence

1. **Create a Goal**
   - As logged-in user, click "New Goal"
   - Fill in goal details
   - Click "Create"

2. **Backend Flow**
   - Validates JWT (403 if invalid)
   - Validates RBAC (user has "goals:create" permission)
   - Inserts goal into PostgreSQL
   - Emits `goal.created` event
   - WebSocket broadcasts to user
   - Event stream records in admin log

3. **Verify in Prisma Studio**
   - In backend terminal, run: `npx prisma studio`
   - Navigate to Goals table
   - **See your goal appear in real-time!**

4. **Expected Result**
   - Goal visible in UI
   - Goal in PostgreSQL database
   - Audit log entry created
   - WebSocket notification in browser

### SCENE 3: Real Webhook Integration

#### Setup Discord Webhook (Free):

1. Create Discord server or use existing
2. Right-click channel → Edit Channel
3. Integrations → Webhooks → New Webhook
4. Copy webhook URL
5. Update `.env`:
   ```bash
   WEBHOOK_DISCORD_URL="https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN"
   ```
6. Restart backend

#### Demo Webhook Flow:

1. **Submit a Goal for Review**
   - Click "Submit for Approval"

2. **Backend Flow**
   - Updates goal status to SUBMITTED
   - Emits `goal.submitted` event
   - WebhooksService catches event
   - Sends HTTP POST to Discord webhook
   - Discord displays notification

3. **Live Discord Notification**
   - Check Discord channel
   - **See notification appear in real-time!**
   - Shows: Goal title, submitter name, timestamp

4. **Expected Result**
   - Goal marked as submitted in UI
   - Discord webhook triggered
   - External notification delivered
   - Demonstrates production event-driven architecture

### SCENE 4: Real-Time WebSocket Synchronization

#### Two-Window Demo:

1. **Open Two Browser Windows**
   - Window A: Logged in as Employee
   - Window B: Logged in as Manager

2. **Window A: Create & Submit Goal**
   - Create a new goal
   - Submit for approval
   - **DO NOT REFRESH Window B**

3. **Window B: Real-Time Update**
   - Goal appears immediately (no refresh!)
   - Status shows as SUBMITTED
   - Button changes to "Approve" or "Reject"

4. **Window B: Approve Goal**
   - Click "Approve"
   - Backend emits `goal.approved`
   - WebSocket broadcasts to Window A

5. **Window A: See Approval**
   - Goal status changes to APPROVED
   - No page refresh needed
   - Real-time synchronization visible

6. **Expected Result**
   - Both windows show consistent state
   - Updates propagate via WebSocket (< 100ms)
   - Demonstrates live collaboration features

### SCENE 5: Automated Escalation Engine

#### Terminal Logs:

1. **Create a Goal**
   - Submit goal
   - Leave it pending (don't approve)

2. **Check Escalation Cron Logs**
   - In backend terminal, watch for logs
   - Cron jobs run on configured schedule:
     - 9 AM: Check pending approvals
     - 8 AM Mondays: Check overdue check-ins

3. **Force Immediate Cron Run (for demo)**
   ```bash
   # In backend directory
   npm run test:e2e
   ```

4. **Expected Logs**
   ```
   [CRON] Starting pending approvals check...
   [CRON] Escalating goal g1 pending for > 7 days
   [CRON] Escalating goal g2 pending for > 7 days
   [CRON] Pending approvals check completed. Escalated 2 goals.
   ```

5. **Expected Result**
   - Escalation records created
   - Notifications sent to managers
   - Discord/Slack webhooks triggered
   - Escalation visible in admin event stream

### SCENE 6: Admin Event Stream & Observability

1. **Access Admin Dashboard**
   - Login as admin
   - Navigate to Admin section
   - Click "System Events"

2. **Live Event Stream**
   - See events in real-time:
     - `[12:04] Alex submitted Q2 goals`
     - `[12:05] Engineering KPI approved`
     - `[12:06] Escalation triggered`
     - `[12:07] Webhook delivered successfully`

3. **System Health Dashboard**
   - Click "System Health"
   - View real-time metrics:
     - API Status: `healthy`
     - Database: `connected`
     - WebSocket: `active`
     - Queue Workers: `running`
     - Escalation Engine: `active`
     - Open Escalations: `2`
     - Pending Approvals: `3`

4. **Audit Logs**
   - Click "Audit Logs"
   - See all actions with:
     - Actor (who did it)
     - Action (what they did)
     - Timestamp (when)
     - Before/after values (what changed)

5. **Expected Result**
   - Admin has full operational visibility
   - Infrastructure transparency
   - Enterprise-grade auditability
   - Real-time monitoring capabilities

---

## Part 6: RBAC & Authorization Demo

### Test 403 Forbidden

#### Employee Attempting Admin Access:

1. **Login as Employee**
   - OAuth login with employee account
   - JWT contains role: "employee"

2. **Try to Access Admin API**
   ```bash
   curl -H "Authorization: Bearer YOUR_JWT" \
     http://localhost:3000/api/admin/cycles
   ```

3. **Expected Response**
   ```json
   {
     "statusCode": 403,
     "message": "Forbidden: Insufficient permissions",
     "error": "Forbidden"
   }
   ```

4. **In UI**
   - Admin menu items don't appear
   - Admin routes redirect to dashboard
   - Buttons for unauthorized actions are disabled

#### Frontend RBAC Enforcement:

```typescript
// Only show approve button if user has permission
if (user.hasPermission('goals:approve')) {
  <Button onClick={approve}>Approve</Button>
}
```

#### Backend RBAC Enforcement:

```typescript
@Patch(':id/approve')
@Roles(Role.MANAGER, Role.ADMIN)  // Endpoint-level guard
async approve(@Param('id') id: string) {
  // JWT verified
  // Role checked
  // Approval executed
}
```

---

## Part 7: Production Checklist

- [ ] Google OAuth credentials configured
- [ ] Microsoft Entra ID configured (optional)
- [ ] PostgreSQL database running
- [ ] Database migrations applied
- [ ] Demo data seeded
- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 5173
- [ ] WebSocket connection established
- [ ] Discord/Slack webhooks configured (optional)
- [ ] JWT_SECRET changed from default
- [ ] CORS properly configured for production domain
- [ ] Environment variables validated
- [ ] OAuth callback URLs match configured domain
- [ ] Database backups configured
- [ ] Error logging configured
- [ ] Rate limiting configured

---

## Part 8: Architecture Validation

### What Makes NovaPulse Production-Grade

✅ **Real OAuth Authentication**
- Industry-standard Google OAuth 2.0
- Verified JWT tokens
- Role-based access control

✅ **Persistent Database**
- PostgreSQL for durability
- Prisma ORM for type-safety
- Transactional integrity

✅ **Real-Time Synchronization**
- Socket.IO WebSockets
- Sub-100ms propagation
- Multi-user collaboration

✅ **Event-Driven Architecture**
- Domain event emission
- Webhook integrations
- Admin event streaming

✅ **Automated Processing**
- NestJS Scheduler for crons
- Background job processing
- Escalation automation

✅ **Operational Visibility**
- System health monitoring
- Audit logging
- Event stream tracking

✅ **Enterprise Security**
- JWT authentication
- Role-based authorization
- API rate limiting
- CORS protection
- Helmet security headers

---

## Troubleshooting

### JWT Verification Fails

```bash
# Ensure JWT_SECRET is set
echo $JWT_SECRET

# If missing, update .env
JWT_SECRET="your-new-secret"
npm run start:dev
```

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -h localhost -U postgres -d novapulse -c "SELECT 1"

# Check DATABASE_URL is correct
echo $DATABASE_URL

# Run migrations
npx prisma migrate deploy
```

### WebSocket Not Connecting

```bash
# Check FRONTEND_URL in .env
FRONTEND_URL="http://localhost:5173"

# Check CORS is enabled
# app.enableCors() in main.ts
```

### OAuth Callback Fails

```bash
# Verify callback URL matches exactly:
# In Google Console: http://localhost:3000/api/auth/google/callback
# In .env: GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

# Ensure backend server is running
curl http://localhost:3000/api/docs
```

---

## Production Deployment

See [PRODUCTION_UPGRADE.md](./PRODUCTION_UPGRADE.md) for deployment guidance to AWS, GCP, or Azure.

---

## Success Criteria

When this guide is complete, NovaPulse should:

1. ✅ Accept real OAuth logins (not demo credentials)
2. ✅ Persist all data to PostgreSQL (verified in Prisma Studio)
3. ✅ Show webhook notifications in Discord/Slack
4. ✅ Synchronize changes real-time via WebSockets
5. ✅ Enforce 403 Forbidden for unauthorized access
6. ✅ Display cron logs for escalation engine
7. ✅ Show live event stream in admin panel
8. ✅ Display system health and metrics

At this point, NovaPulse is a **genuine enterprise platform** with production-grade infrastructure, not a simulated prototype.
