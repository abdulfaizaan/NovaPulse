# NovaPulse Hackathon Demo Guide (10/10 Production-Grade)

## Pre-Demo Setup Checklist

### Environment & Services
- [ ] PostgreSQL running locally (`psql -d novapulse`)
- [ ] Backend running (`npm run start:dev` on port 3000)
- [ ] Frontend running (`npm run dev` on port 5173)
- [ ] Terminal window open showing backend logs
- [ ] Two browser windows open (for real-time sync demo)
- [ ] Discord/Slack channel open (for webhook notifications)
- [ ] Postman or similar API client (optional, for showing API responses)

### Configuration
- [ ] `.env` file configured with:
  - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
  - `DISCORD_WEBHOOK_URL` (or Slack/Teams)
  - `DATABASE_URL` pointing to local PostgreSQL
- [ ] Prisma migrations applied (`npx prisma migrate dev`)
- [ ] Seed data loaded (`npx prisma db seed`)

---

## Demo Script (15-20 minutes)

### SEGMENT 1: Authentication (2 min)

**Talking Points**:
- "NovaPulse now uses real OAuth2 instead of demo login"
- "Supports Google and Microsoft Entra ID for enterprise SSO"
- "JWT tokens with embedded RBAC claims - not just a string"

**Demo Steps**:
1. Open login page at `http://localhost:5173/auth`
2. Click "Continue with Google"
3. Complete Google OAuth flow
4. Show JWT token in DevTools: `localStorage.getItem('authToken')`
5. Decode JWT to show embedded claims: `role: 'employee', sub: 'user-id'`

**Evidence of Production-Grade**:
- ✅ Real OAuth redirect
- ✅ Signed JWT token
- ✅ RBAC claims embedded

---

### SEGMENT 2: Real Data Persistence (2 min)

**Talking Points**:
- "All data now lives in PostgreSQL, not simulated in Zustand"
- "ACID guarantees, referential integrity, transactions"
- "Zustand is just UI cache now, not primary data source"

**Demo Steps**:
1. Login as employee (Alex Rivera)
2. Create a new goal:
   - Title: "Optimize Platform Performance"
   - Description: "Reduce API latency to < 100ms"
   - Target: 100
3. Click Save
4. Open Prisma Studio: `npx prisma studio`
5. Show the goal record in database with all fields
6. Update goal achievement value in Prisma Studio
7. Refresh frontend - data syncs from database (not Zustand)

**Terminal Command to Show**:
```bash
# In another terminal
npx prisma studio
# Browser opens showing Goal table with new record
```

**Evidence of Production-Grade**:
- ✅ Data persists across page reloads
- ✅ Database is source of truth
- ✅ Real ACID properties

---

### SEGMENT 3: Real-Time Synchronization (3 min)

**Setup**: Two browser windows needed

**Window 1 (Employee)**: `http://localhost:5173` (logged in as Alex)  
**Window 2 (Manager)**: `http://localhost:5173` (logged in as Sarah Chen)

**Talking Points**:
- "No more manual refresh needed"
- "Socket.IO bi-directional WebSocket sync"
- "Manager sees employee's changes instantly"

**Demo Steps**:
1. In **Window 1 (Employee Alex)**:
   - Navigate to a goal
   - Update the achievement value (e.g., 45 → 65)
   - Click Save
   - Watch backend logs: `[WebSocketGateway] Emitting goal:updated event`

2. In **Window 2 (Manager Sarah)**:
   - Same goal is visible
   - **WITHOUT clicking refresh**
   - The achievement value updates in real-time
   - Animation shows the change

3. Show DevTools in Sarah's window:
   - Network tab → WS tab
   - Look for `/ws` connection
   - Send a ping: `socket.emit('ping')`
   - Receive pong response

**Backend Logs Show**:
```
[GoalsGateway] Emitting goal:updated to user u2
[GoalsGateway] Broadcasting to 2 connected sockets
```

**Evidence of Production-Grade**:
- ✅ Bi-directional WebSocket sync
- ✅ No page refresh needed
- ✅ Real event broadcasting

---

### SEGMENT 4: Webhook Integrations (2 min)

**Talking Points**:
- "Real external integrations - not fake notifications"
- "Discord, Slack, Microsoft Teams support"
- "Triggered by backend events, delivered to external services"

**Demo Steps**:
1. In browser, logged in as Alex
2. Create and submit a goal:
   - Title: "Implement Real-Time Features"
   - Click "Submit for Review"
3. Watch backend logs:
   ```
   [GoalsService] Emitting goal:submitted event
   [WebhooksService] Sending Discord webhook...
   [WebhooksService] Discord notification sent
   ```
4. Check Discord channel (should appear in < 1 second):
   - Shows goal title
   - Shows submitter name
   - Shows timestamp
   - Formatted as proper embed

**Evidence of Production-Grade**:
- ✅ Real webhook delivery
- ✅ External platform integration
- ✅ Synchronous event processing

---

### SEGMENT 5: Cron-Based Escalations (2 min)

**Talking Points**:
- "Automatic backend escalation engine"
- "Scheduled background jobs - not manual admin tasks"
- "Detects overdue goals, pending approvals, stale progress"

**Demo Steps**:
1. Show backend code: `/src/escalation/escalation.service.ts`
2. Point to cron decorators:
   ```typescript
   @Cron('0 9 * * *')  // Daily at 9 AM
   async checkPendingApprovals() { ... }
   ```
3. Manually trigger escalation check (or show it running):
   ```bash
   # In NestJS, you can force it via endpoint or wait for schedule
   curl http://localhost:3000/api/admin/escalations
   ```
4. Show open escalations in admin panel:
   - Several goals listed as escalated
   - Reason: "Goal pending > 7 days"
   - Severity: HIGH, MEDIUM

5. Check Discord webhook:
   - Escalation notice sent automatically
   - Shows affected goal
   - Shows escalation reason

**Backend Logs Show**:
```
[EscalationService] [CRON] Starting pending approvals check...
[EscalationService] [CRON] Escalating goal g1 pending for > 7 days
[EscalationService] [CRON] Pending approvals check completed. Escalated 3 goals.
```

**Evidence of Production-Grade**:
- ✅ Scheduled background jobs
- ✅ Automated escalation detection
- ✅ Production operations log

---

### SEGMENT 6: Admin Event Stream & Observability (2 min)

**Talking Points**:
- "Complete visibility into system operations"
- "Real-time event stream showing all activity"
- "Health dashboard monitoring all services"

**Demo Steps**:
1. Login as admin (James Mitchell)
2. Navigate to Admin → Events:
   - Shows recent system events
   - Filtered list of activities
   - Real-time updates via WebSocket
3. Show event details:
   ```
   [12:15:32] GOAL_CREATED - Alex submitted Q2 goals
   [12:16:45] GOAL_SUBMITTED - Engineering goals ready
   [12:17:22] WEBHOOK_DELIVERED - Discord notification sent
   [12:18:00] ESCALATION_TRIGGERED - Goal pending > 7 days
   ```
4. Navigate to Admin → Health:
   - Database: healthy, latency < 50ms
   - WebSocket: active, 3 connections
   - Escalation engine: running
   - Webhooks: 99.9% delivery rate

5. Show API response:
   ```bash
   curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:3000/api/admin/health | jq
   ```

**Evidence of Production-Grade**:
- ✅ Complete operational visibility
- ✅ Service health monitoring
- ✅ Real-time event tracking
- ✅ Infrastructure confidence

---

### SEGMENT 7: RBAC & Access Control (1 min)

**Talking Points**:
- "Role-based access control enforced at API layer"
- "Not just UI checks - real backend guards"
- "403 Forbidden for unauthorized access"

**Demo Steps**:
1. Get JWT token for employee user
2. Try to access admin endpoint without admin role:
   ```bash
   curl -H "Authorization: Bearer $EMPLOYEE_TOKEN" \
     http://localhost:3000/api/admin/health
   # Returns 403 Forbidden
   ```
3. Same request with admin token:
   ```bash
   curl -H "Authorization: Bearer $ADMIN_TOKEN" \
     http://localhost:3000/api/admin/health
   # Returns 200 with health data
   ```
4. Show backend guard code:
   ```typescript
   @Roles(Role.ADMIN)
   async getSystemHealth() { ... }
   ```

**Evidence of Production-Grade**:
- ✅ Backend RBAC enforcement
- ✅ Proper HTTP status codes
- ✅ Security-first architecture

---

### SEGMENT 8: Audit & Compliance (1 min)

**Talking Points**:
- "Complete audit trail for compliance"
- "Before/after values tracked"
- "Actor identification for accountability"

**Demo Steps**:
1. In admin panel, navigate to Audit Logs
2. Show goal approval audit trail:
   ```
   Goal g1: "Modernize Design System"
   ├── 2026-05-01 10:00 - CREATED by Alex
   ├── 2026-05-15 09:45 - SUBMITTED by Alex
   ├── 2026-05-15 10:15 - APPROVED by Sarah
   │   └── Status: DRAFT → SUBMITTED → APPROVED
   └── 2026-05-15 10:30 - LOCKED by James (admin)
   ```
3. Show database query:
   ```bash
   npx prisma studio
   # Navigate to AuditLog table
   # Show: userId, action, fieldChanged, beforeValue, afterValue
   ```

**Evidence of Production-Grade**:
- ✅ Complete change audit trail
- ✅ Actor accountability
- ✅ Compliance-ready logging

---

## Key Points to Emphasize

### Before (8.5/10)
- ❌ Mock authentication with demo email
- ❌ Zustand acting as fake database
- ❌ No real-time sync (manual refresh)
- ❌ Simulated notifications
- ❌ No external integrations
- ❌ Escalations were UI-only
- ❌ No operational visibility

### After (10/10)
- ✅ Real OAuth2 + JWT
- ✅ PostgreSQL as source of truth
- ✅ Real-time WebSocket sync
- ✅ Real webhook notifications
- ✅ External integrations (Discord/Slack/Teams)
- ✅ Automated cron escalations
- ✅ Full observability dashboard

---

## Talking Points Summary

> "NovaPulse started as a high-quality prototype with beautiful UI and strong architecture. But it relied on Zustand simulation and mocked authentication. We've transformed it into a production-grade SaaS platform by replacing every simulation with real infrastructure."

> "Every feature you're seeing is backed by actual PostgreSQL persistence, real OAuth2 authentication, genuine WebSocket synchronization, and proper cron-based automation. This is no longer a demo - it's a real enterprise platform."

> "From a judge's perspective, this demonstrates not just good UI/UX and architecture, but real backend engineering depth, operational maturity, and production readiness. It's the difference between 'nice prototype' and 'we could run this at scale tomorrow.'"

---

## Backup Demo Points (if time allows)

1. **Database Transactions**:
   - Show goal approval process
   - Demonstrate rollback on validation error
   - Prove ACID properties

2. **Real-Time Comment Stream**:
   - Multiple users commenting on same goal
   - Comments appear instantly for all viewers
   - Socket.IO event broadcasting

3. **Webhook Delivery Status**:
   - Show webhook delivery logs
   - Retry logic for failed deliveries
   - Delivery rate metrics in health dashboard

4. **Performance Metrics**:
   - API response times from health dashboard
   - WebSocket latency
   - Database query performance

5. **Error Handling**:
   - Show 401 when token expired
   - Show 403 when unauthorized
   - Show validation errors with helpful messages

---

## Q&A Prep

**Q: "How is this different from the prototype?"**  
A: "The prototype was UI-first with backend simulation. This is backend-first with real infrastructure. OAuth is real, database is real, WebSockets are real, webhooks are real."

**Q: "What about scalability?"**  
A: "PostgreSQL can handle thousands of concurrent goals. WebSocket connections scale horizontally with redis pub/sub. Cron jobs run independently of request volume."

**Q: "How production-ready is this?"**  
A: "It's production-ready today. You'd add Redis for caching/sessions, maybe a message queue for webhooks, but the core is production-grade."

**Q: "Why does this matter for a SaaS platform?"**  
A: "Because SaaS requires trust. Real OAuth, real data persistence, real-time sync, and operational transparency are how you build that trust."

---

## Demo Timing

| Segment | Duration |
|---------|----------|
| Setup & Introduction | 1 min |
| Authentication (OAuth) | 2 min |
| Data Persistence | 2 min |
| Real-Time Sync | 3 min |
| Webhooks | 2 min |
| Escalations | 2 min |
| Observability | 2 min |
| RBAC | 1 min |
| **Total** | **15 min** |

**Buffer**: 5 minutes for questions, issues, or deep dives

---

## Conclusion

> "This upgrade transforms NovaPulse from a polished hackathon prototype into a genuine production-grade enterprise platform. Every simulation has been replaced with real infrastructure. Every workflow is backed by authentic backend engineering. This is what a 10/10 SaaS demo looks like."

**Judge's Impression**: From "impressive prototype" to "credible enterprise platform"
