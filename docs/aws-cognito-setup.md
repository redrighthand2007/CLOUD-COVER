# AWS Cognito setup: office login with MFA

CloudCover's office users (Admin/Staff) can log in through **Amazon Cognito** with a required
second step (an authenticator-app code). Customers keep the app's own mobile-number login.
This page records exactly what was created, why, and how to remove it.

Created on 22 Oct 2026 for the AWS course project (fake sample data only until January 2027).

## What exists in AWS

| Resource | Value |
|---|---|
| AWS project / account | CloudCover / `448592647758` (new AWS experience, free plan) |
| Region | `ap-southeast-2` (Sydney). The project's only allowed Region: other Regions, including Mumbai, are blocked by the organization's service control policy |
| User pool | `cloudcover-office`, ID `ap-southeast-2_tEQii9mgN` |
| Login domain | `https://cloudcover-office-ac43af.auth.ap-southeast-2.amazoncognito.com` (managed login v2) |
| App client | `cloudcover-web`, ID `2g1fe41d6g7acpgicl07h7p866` (public, no secret) |
| Callback URL | `http://localhost:3000/auth-callback.html` |
| Sign-out URL | `http://localhost:3000/login.html` |

The IDs above are not secrets (they appear in the browser during login). They are also in `.env`.

## Settings and the reasons for them

| Setting | Value | Why |
|---|---|---|
| Feature plan | Essentials | Managed login pages with MFA setup screens. Free for up to 10,000 monthly active users; the office has about 3 |
| Sign-up | Admins create users only | Office staff only; no public sign-up |
| Usernames | Plain usernames, not case-sensitive | Must match the `users.username` column in the app's database |
| MFA | **Required** (`ON`), authenticator app (TOTP) only | Free; SMS would cost per message and need DLT registration in India |
| Password policy | 12+ characters, upper, lower, number, symbol; temporary passwords expire in 7 days | AWS recommended baseline |
| Account recovery | Admin only | No email sending to configure; an Admin resets forgotten passwords |
| OAuth flow | Authorization code + PKCE, scopes `openid profile` | Secure default for browser apps; no client secret in the browser |
| Tokens | ID/access 60 minutes, refresh 1 day, rotation + revocation on | Short sessions; a revoked refresh token stops working |
| Deletion protection | Inactive | So the pool can be removed cleanly if AWS is dropped in January |

## Commands used (AWS CLI, profile `cloudcover`)

```bash
export AWS_PROFILE=cloudcover AWS_REGION=ap-southeast-2

aws cognito-idp create-user-pool \
  --pool-name cloudcover-office \
  --user-pool-tier ESSENTIALS \
  --username-configuration CaseSensitive=false \
  --admin-create-user-config '{"AllowAdminCreateUserOnly":true}' \
  --policies '{"PasswordPolicy":{"MinimumLength":12,"RequireUppercase":true,"RequireLowercase":true,"RequireNumbers":true,"RequireSymbols":true,"TemporaryPasswordValidityDays":7}}' \
  --account-recovery-setting '{"RecoveryMechanisms":[{"Priority":1,"Name":"admin_only"}]}' \
  --deletion-protection INACTIVE \
  --user-pool-tags Project=CloudCover,Purpose=office-login-mfa

# MFA is set after creation (setting it at creation requires SMS configuration)
aws cognito-idp set-user-pool-mfa-config --user-pool-id ap-southeast-2_tEQii9mgN \
  --mfa-configuration ON --software-token-mfa-configuration Enabled=true

aws cognito-idp create-user-pool-domain --user-pool-id ap-southeast-2_tEQii9mgN \
  --domain cloudcover-office-ac43af --managed-login-version 2

aws cognito-idp create-user-pool-client --user-pool-id ap-southeast-2_tEQii9mgN \
  --client-name cloudcover-web --no-generate-secret \
  --explicit-auth-flows ALLOW_USER_SRP_AUTH \
  --enable-token-revocation --refresh-token-rotation Feature=ENABLED,RetryGracePeriodSeconds=30 \
  --prevent-user-existence-errors ENABLED --supported-identity-providers COGNITO \
  --allowed-o-auth-flows-user-pool-client --allowed-o-auth-flows code \
  --allowed-o-auth-scopes openid profile \
  --callback-urls http://localhost:3000/auth-callback.html \
  --logout-urls http://localhost:3000/login.html \
  --access-token-validity 60 --id-token-validity 60 --refresh-token-validity 1 \
  --token-validity-units AccessToken=minutes,IdToken=minutes,RefreshToken=days

# Managed login v2 needs a branding style per app client (the CLI does not add one automatically)
aws cognito-idp create-managed-login-branding --user-pool-id ap-southeast-2_tEQii9mgN \
  --client-id 2g1fe41d6g7acpgicl07h7p866 --use-cognito-provided-values
```

**Warning for later changes:** `update-user-pool-client` replaces the *whole* client
configuration. Any setting you leave out is reset. Always describe the client first and send
every field back (see AWS's guidance on `--cli-input-json`).

## Status

- [x] User pool, MFA, domain, app client, login branding created and verified (login page loads)
- [x] Office users created in Cognito: `admin_father`, `admin_mother`, `staff_emp1` (temporary passwords in the git-ignored `cognito-temp-passwords.local.txt`)
- [x] App code: `AUTH_PROVIDER=cognito` in `.env` turns it on; `local` turns it off

## How the app uses it

```text
Login page (Office tab)            AWS Cognito                     CloudCover server
  "Log in with MFA"  ─────────►  password + authenticator code
  (PKCE secret kept in tab)        │
                                   ▼
  auth-callback.html  ◄──────── one-time code
        │  code + PKCE secret
        └────────────────────────────────────────────────►  /api/auth/cognito
                                                              1. swaps code at Cognito /oauth2/token
                                                              2. verifies ID token (aws-jwt-verify)
                                                              3. revokes Cognito refresh token
                                                              4. finds the office user by username,
                                                                 links/checks Cognito "sub"
                                                              5. starts a normal CloudCover session
```

- **No MFA bypass:** with `AUTH_PROVIDER=cognito`, office username/password login is refused.
- **Customers are unchanged:** they keep the mobile-number login.
- **Account linking:** the first Cognito login saves the Cognito user id (`sub`) on the office user.
  After that, only that exact Cognito account can log in as that user.
- **Roles and access stay in CloudCover:** Admin/Staff, turning accounts off, instant logout and the
  audit log work as before. A Cognito user with no matching active office user is refused.
- **Logout** also ends the Cognito session, so the next login asks for the password again.

### First login (each office user)

1. Office tab → **Log in with MFA**.
2. Enter the username and the temporary password from the Admin.
3. Choose a new password (12+ characters with upper, lower, number and symbol).
4. Scan the QR code with Google Authenticator or Microsoft Authenticator, and enter the 6-digit code.
5. From then on: password + the current 6-digit code.

**Note:** when MFA is set up through Cognito's login page like this, `aws cognito-idp admin-get-user`
may show `UserMFASettingList: null` for the user. That record is not filled in by this flow; MFA is
still enforced because the pool requires it (`MfaConfiguration: ON`) and the user has a verified
authenticator. The real check is the login itself: after the password, it asks for the 6-digit code.
All three office users completed this on 22 Oct 2026.

### Adding an office user

1. Add them on the **Team** page (sets their role).
2. Create the same username in Cognito:
   `powershell -ExecutionPolicy Bypass -File scripts\cognito-add-user.ps1 -Username new.person`
3. Give them the temporary password in person (it expires in 7 days).

### Lost phone / reset

An Admin resets them in Cognito, then they set up the authenticator again at next login:

```bash
aws cognito-idp admin-reset-user-password --user-pool-id ap-southeast-2_tEQii9mgN --username <username>
aws cognito-idp admin-set-user-mfa-preference --user-pool-id ap-southeast-2_tEQii9mgN --username <username> --software-token-mfa-settings Enabled=false
```

To stop someone right away, turn their account off on the Team page (ends their sessions immediately).

## Removing it (January 2027, if AWS is dropped)

Set `AUTH_PROVIDER=local` in `.env` first, then:

```bash
aws cognito-idp delete-user-pool-domain --user-pool-id ap-southeast-2_tEQii9mgN --domain cloudcover-office-ac43af
aws cognito-idp delete-user-pool --user-pool-id ap-southeast-2_tEQii9mgN
```

Deleting the pool also deletes its users and app client.
