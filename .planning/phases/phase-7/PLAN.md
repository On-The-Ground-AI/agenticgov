# Phase 7: Beta Launch Preparation - Implementation Plan

## Overview

**Goal:** Production-ready platform for controlled beta testing with user management, activity tracking, and feedback collection.

**Duration:** Incremental implementation with atomic commits

---

## Requirements Mapping

| Req | Description | Priority | Complexity |
|-----|-------------|----------|------------|
| BETA-01 | User invitation/waitlist system | High | Medium |
| BETA-02 | User onboarding with role selection | High | Medium |
| BETA-03 | Feature flags for gradual rollout | Medium | Low |
| BETA-04 | Usage analytics dashboard | Medium | Medium |
| BETA-05 | Feedback collection mechanism | High | Low |
| BETA-06 | Audit log UI for admins | Medium | Medium |
| BETA-07 | User activity tracking | High | Low |
| BETA-08 | Rate limiting | Medium | Low |

---

## Implementation Waves

### Wave 1: Database Foundation (BETA-01, BETA-03, BETA-05, BETA-07)

**Files to create/modify:**
- `supabase/migrations/001_beta_launch.sql` - All new tables and schema changes

**Schema changes:**

```sql
-- 1. Extend profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'user'
    CHECK (role IN ('user', 'beta_tester', 'admin', 'reviewer')),
  ADD COLUMN IF NOT EXISTS organization text,
  ADD COLUMN IF NOT EXISTS invited_by uuid REFERENCES auth.users,
  ADD COLUMN IF NOT EXISTS invite_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS onboarded_at timestamptz;

-- 2. Waitlist table
CREATE TABLE public.waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  full_name text,
  organization text,
  role_interest text,
  referral_source text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'registered', 'rejected')),
  invited_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 3. Feature flags table
CREATE TABLE public.feature_flags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  enabled boolean DEFAULT false,
  rollout_percentage int DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  allowed_roles text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. User activities table
CREATE TABLE public.user_activities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  activity_type text NOT NULL,
  resource_type text,
  resource_id text,
  metadata jsonb,
  duration_ms int,
  created_at timestamptz DEFAULT now()
);

-- 5. Feedback table
CREATE TABLE public.feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  feedback_type text NOT NULL CHECK (feedback_type IN ('bug', 'feature', 'general', 'praise')),
  page text,
  content text NOT NULL,
  rating int CHECK (rating >= 1 AND rating <= 5),
  metadata jsonb,
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved', 'wontfix')),
  created_at timestamptz DEFAULT now()
);
```

**RLS Policies to add:**
- Waitlist: admin-only access
- Feature flags: read by authenticated, write by admin
- User activities: users see own, admin sees all
- Feedback: users can create, admin can read all

---

### Wave 2: API Endpoints (All requirements)

**Files to create:**

1. `api/waitlist.ts` - Waitlist signup (public)
2. `api/admin/invitations.ts` - Manage invitations (admin)
3. `api/admin/users.ts` - User management (admin)
4. `api/admin/analytics.ts` - Usage analytics (admin)
5. `api/feedback.ts` - Submit feedback (authenticated)
6. `api/activity.ts` - Track activity (authenticated)
7. `api/flags.ts` - Check feature flags (authenticated)

**Shared utilities:**
- `api/lib/rateLimit.ts` - Rate limiting middleware
- `api/lib/activity.ts` - Activity tracking helper

---

### Wave 3: Frontend - Admin Enhancements (BETA-04, BETA-06)

**Files to modify:**
- `frontend/src/components/AdminPanel.tsx` - Expand with new tabs

**New sections in AdminPanel:**
1. **User Management Tab**
   - View all users with roles
   - Invite new users
   - Change user roles
   - View activity per user

2. **Waitlist Management Tab**
   - View waitlist entries
   - Approve/reject/invite actions
   - Bulk invite functionality

3. **Audit Logs Tab**
   - Filterable log viewer
   - Search by user, action, date
   - Export functionality

4. **Analytics Dashboard Tab**
   - Active users chart
   - Feature usage breakdown
   - Daily/weekly/monthly views

5. **Feature Flags Tab**
   - Toggle flags on/off
   - Set rollout percentage
   - Assign to roles

---

### Wave 4: Frontend - User Features (BETA-01, BETA-02, BETA-05)

**Files to create:**
- `frontend/src/pages/WaitlistPage.tsx` - Public waitlist signup
- `frontend/src/components/OnboardingFlow.tsx` - Post-registration onboarding
- `frontend/src/components/FeedbackWidget.tsx` - In-app feedback

**Files to modify:**
- `frontend/src/App.tsx` - Add routes
- `frontend/src/pages/RegisterPage.tsx` - Support invite codes
- `frontend/src/pages/DashboardPage.tsx` - Add onboarding check, feedback widget

---

### Wave 5: Activity Tracking Integration (BETA-07)

**Files to modify:**
- All API endpoints - Add activity logging calls
- `frontend/src/components/*.tsx` - Track user interactions

**Activity types to track:**
- `chat.start`, `chat.message`
- `design.start`, `design.complete`
- `recommend.start`, `recommend.complete`
- `score.start`, `score.complete`
- `exante.start`, `exante.complete`
- `view.page`, `view.method`, `view.case_study`

---

## Task Breakdown

### Task 1: Database Migration Script
- Create `supabase/migrations/001_beta_launch.sql`
- All tables and schema changes
- RLS policies
- Indexes for performance

### Task 2: Waitlist API & Page
- Create `api/waitlist.ts`
- Create `frontend/src/pages/WaitlistPage.tsx`
- Add route in App.tsx

### Task 3: User Management API
- Create `api/admin/users.ts`
- Create `api/admin/invitations.ts`
- Implement role-based access control

### Task 4: Enhanced Admin Panel
- Extend AdminPanel.tsx with new tabs
- User management UI
- Waitlist management UI
- Audit log viewer

### Task 5: Feature Flags System
- Create `api/flags.ts`
- Add feature flag checking to frontend
- Admin UI for flag management

### Task 6: Feedback System
- Create `api/feedback.ts`
- Create FeedbackWidget.tsx
- Add to DashboardPage

### Task 7: Activity Tracking
- Create activity tracking utilities
- Integrate into API endpoints
- Create analytics dashboard

### Task 8: Onboarding Flow
- Create OnboardingFlow.tsx
- Modify RegisterPage for invite codes
- Add onboarding state check

### Task 9: Rate Limiting
- Create rate limiting middleware
- Apply to all API endpoints
- Configure limits per endpoint

---

## Success Criteria

1. ✅ Admin can view waitlist and invite users
2. ✅ Users can sign up for waitlist
3. ✅ Invited users can register with invite code
4. ✅ New users see onboarding flow
5. ✅ Feature flags control feature access
6. ✅ Users can submit feedback from any page
7. ✅ Admin can view all audit logs with filters
8. ✅ Analytics dashboard shows usage metrics
9. ✅ Rate limiting prevents abuse
10. ✅ All user activities tracked

---

## Dependencies

- Supabase project with admin access (for schema changes)
- Existing auth system (complete)
- Existing API structure (complete)

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Schema migration on live DB | Test migration on staging first |
| Rate limiting too aggressive | Start with generous limits, tune later |
| Activity tracking performance | Use async logging, batch writes |
| Admin panel complexity | Use tabs to organize, lazy load data |

---

## Recommended Implementation Order

1. **Database migration** (foundation for everything)
2. **Waitlist API + page** (immediate user impact)
3. **Feedback system** (quick win, high value)
4. **Activity tracking utilities** (needed by other features)
5. **Admin panel enhancements** (depends on data being tracked)
6. **Feature flags** (useful but not blocking)
7. **Onboarding flow** (polish)
8. **Rate limiting** (final hardening)

---

*Plan created: February 5, 2026*
