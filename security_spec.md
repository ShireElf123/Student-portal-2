# Security Specification: My Student Portal

## 1. Data Invariants
1. **User Scoping & Identity Isolation**: Users can only access their own user document (`/users/{userId}`) and their own subcollections (`/users/{userId}/...`). Cross-tenant access is strictly denied.
2. **Path Integrity**: Every document ID in path variables must conform to `isValidId()` (alphanumeric, hyphens, underscores, length <= 128) to prevent ID injection.
3. **Immutability of Identity**: `userId` must match `request.auth.uid` on write and cannot be changed on update.
4. **Boundary Checks**: All string fields must be constrained by explicit length checks (e.g. `.size() <= MAX_LEN`) to prevent Denial of Wallet and storage attacks.
5. **Type Safety & Strict Shapes**: Documents must adhere to the defined schemas in `firebase-blueprint.json` with required fields present and valid enum values.
6. **Default Deny**: All unmatched collections or documents have `allow read, write: if false;`.

## 2. The "Dirty Dozen" Exploit Payloads
The following payloads are crafted to attempt unauthorized operations, bypass state logic, or poison storage:

1. **Unauthenticated Read on User Document**:
   - Path: `/users/student123`
   - Payload: Read without `request.auth`
   - Expected: PERMISSION_DENIED

2. **Cross-User Snooping**:
   - Auth: `auth.uid = "studentA"`
   - Path: `/users/studentB/notebooks/nb-1`
   - Payload: Read or Write
   - Expected: PERMISSION_DENIED

3. **Identity Spoofing on Notebook Creation**:
   - Auth: `auth.uid = "studentA"`
   - Path: `/users/studentA/notebooks/nb-1`
   - Payload: `{ "id": "nb-1", "userId": "studentB", "name": "Bio 101", "subject": "Biology", "mode": "socratic", "createdAt": 1710000000 }`
   - Expected: PERMISSION_DENIED (mismatched `userId`)

4. **Shadow Field Injection**:
   - Auth: `auth.uid = "studentA"`
   - Path: `/users/studentA/notebooks/nb-1`
   - Payload: `{ "id": "nb-1", "userId": "studentA", "name": "Bio", "subject": "Biology", "mode": "socratic", "createdAt": 1710000000, "isAdmin": true }`
   - Expected: PERMISSION_DENIED (unknown field `isAdmin`)

5. **Path ID Poisoning**:
   - Auth: `auth.uid = "studentA"`
   - Path: `/users/studentA/notebooks/nb%20poison%20$$$^^^12345`
   - Payload: Create notebook with malformed path ID
   - Expected: PERMISSION_DENIED

6. **Denial of Wallet Oversized String**:
   - Auth: `auth.uid = "studentA"`
   - Path: `/users/studentA/studyPlanItems/item-1`
   - Payload: `{ "title": "A".repeat(10000), ... }`
   - Expected: PERMISSION_DENIED (exceeds max title length)

7. **Invalid Enum Attack**:
   - Auth: `auth.uid = "studentA"`
   - Path: `/users/studentA/notebooks/nb-1`
   - Payload: `{ "mode": "hacked_mode", ... }`
   - Expected: PERMISSION_DENIED (invalid mode)

8. **Tampering with Immutable Creation Time**:
   - Auth: `auth.uid = "studentA"`
   - Path: `/users/studentA/notebooks/nb-1`
   - Payload: Update with modified `createdAt`
   - Expected: PERMISSION_DENIED

9. **Negative or Invalid Numerical Bounds in Practice Session**:
   - Auth: `auth.uid = "studentA"`
   - Path: `/users/studentA/practiceSessions/ps-1`
   - Payload: `{ "totalQuestions": -10, "correctAnswers": 999999, ... }`
   - Expected: PERMISSION_DENIED

10. **Unauthorized Status Escalation in Assignment**:
    - Auth: `auth.uid = "studentA"`
    - Path: `/users/studentA/assignments/asgn-1`
    - Payload: Setting invalid status or injecting arbitrary fields
    - Expected: PERMISSION_DENIED

11. **Blanket Query Scraping**:
    - Auth: `auth.uid = "studentA"`
    - Path: Root collection group query attempting to read all `/notebooks`
    - Expected: PERMISSION_DENIED

12. **Malicious Role Escalation on User Profile**:
    - Auth: `auth.uid = "studentA"`
    - Path: `/users/studentA`
    - Payload: Update `{ "role": "super_admin" }`
    - Expected: PERMISSION_DENIED
