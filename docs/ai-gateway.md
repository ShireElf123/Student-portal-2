# Shared AI gateway and organization quotas

All model-backed endpoints use one server admission path:

- `POST /api/chat`
- `POST /api/chat/stream`
- `POST /api/practice/generate`
- `POST /api/study-plan/generate`
- `POST /api/content/generate`

Each request must include a Firebase ID token in `Authorization: Bearer <token>`. The server verifies issuer, audience, signature, and expiry; the verified UID is the only account identity used for quotas. Client-provided roles, subscription tiers, account limits, and organization claims are never used as entitlements. An optional `X-Organization-Id` header selects an organization, but the server checks the active membership in Firestore inside the quota transaction.

## Firestore records

These records are server-provisioned through Firebase Admin/another trusted administrative process. Client security rules allow a signed-in user to read only their own membership documents; clients cannot write memberships, entitlements, organization records, or usage counters.

```text
users/{uid}/organizationMemberships/{organizationId}
  organizationId: string       // must equal the document ID
  status: "active" | "suspended"
  role: "owner" | "admin" | "educator" | "learner" | "parent" | "member"

organizations/{organizationId}
  status: "active" | "suspended"
  ai: {
    enabled: boolean            // must be true for organization AI access
    dailyLimit?: integer        // aggregate organization usage units per UTC day
    perMinuteLimit?: integer   // aggregate organization usage units per minute
    memberDailyLimit?: integer
    memberPerMinuteLimit?: integer
  }

users/{uid}/aiEntitlements/current
  enabled?: boolean             // false disables AI for this user
  dailyLimit?: integer          // optional server-managed personal limit
  perMinuteLimit?: integer

users/{uid}/aiUsageWindows/{day_YYYY-MM-DD | minute_YYYYMMDDHHmm}
organizations/{organizationId}/aiUsageWindows/{same window ID}
  schemaVersion: 1
  windowKey: string
  totalUnits: integer
  byAction: { chat: integer, practice: integer, study_plan: integer, content: integer }
  updatedAt: number
  expiresAt: Firestore Timestamp
```

The `expiresAt` field is 14 days after the window update. `firestore.indexes.json` enables the Firestore TTL policy for the `aiUsageWindows` collection group. Deploy the Firestore index/TTL configuration before production use and allow the TTL policy to finish provisioning.

## Membership selection

- No active membership: use the server-managed personal entitlement or the default personal quota. Existing users without an organization remain eligible for AI.
- One active membership: use that organization automatically.
- Multiple active memberships: return `409 ORGANIZATION_SELECTION_REQUIRED`; the user must select one using `X-Organization-Id`.
- A requested organization with no matching active membership is rejected with `403`. A disabled/suspended organization is also rejected. Suspended memberships are not silently treated as active.

The current client does not yet include an organization picker. Multi-organization accounts need a future selection UI/API before their requests can pass the explicit-selection requirement.

## Default limits and accounting

If an Admin-managed field is omitted, the defaults are:

| Scope | UTC daily limit | Per-minute limit |
| --- | ---: | ---: |
| Personal account | 20 units | 5 units |
| Organization aggregate | 2,000 units | 120 units |
| Organization member | 100 units | 10 units |

Chat and study-plan requests cost one unit; chat with an image costs two; practice costs one unit for 1–5 questions and two units for 6–10. Structured content generation also retains a separate per-user cap of 12 requests per UTC day and 3 per minute. User counters are shared across AI features, and an organization member is bounded by both their user limit and their organization's aggregate limit. Limits of zero intentionally disable that scope. Invalid Admin-managed quota data fails closed rather than granting defaults.

Quota is reserved atomically before a provider call. Provider failures do not refund a unit because a provider request may already have incurred cost. `429` responses include `Retry-After`; successful responses include daily quota metadata headers. Content requests that coalesce into one in-flight generation in a process consume one admission.

The Firestore transaction is the authoritative cross-process user/organization counter, so admission remains shared across server instances. The IP/network abuse limiter is deliberately supplemental and remains per-process. Behind a reverse proxy, set `TRUST_PROXY` to the exact trusted ingress hop count so Express derives the network address correctly; never trust arbitrary forwarded-header chains. Organization aggregate windows are transactionally consistent but can become contention points for very high request concurrency; monitor Firestore transaction retries and move the aggregate counter to a dedicated quota service before sustained high-throughput deployment.

## Operational requirements and boundaries

- The server needs Firebase Admin credentials/Application Default Credentials with access to the configured Firestore database. The browser Firebase API key is not a server credential.
- Provision organizations, membership, and `aiEntitlements/current` documents only from trusted server/admin workflows. No organization administration or billing provisioning UI is introduced here.
- Existing `subscriptionTier` and `aiUsageToday` profile fields and the localStorage usage meter are display/experience data only. They do not grant or enforce server quota.
- A Firestore/network failure returns `503` and fails closed; it does not fall back to per-process account limits.
- The generated-content refill flow remains on-demand and bounded. This gateway does not add proactive generation or Learner Brain/mastery changes.
