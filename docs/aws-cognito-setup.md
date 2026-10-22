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
- [ ] Office users created in Cognito
- [ ] App switched over: `AUTH_PROVIDER=cognito` in `.env` (code not written yet; `local` is the default)

## Removing it (January 2027, if AWS is dropped)

Set `AUTH_PROVIDER=local` in `.env` first, then:

```bash
aws cognito-idp delete-user-pool-domain --user-pool-id ap-southeast-2_tEQii9mgN --domain cloudcover-office-ac43af
aws cognito-idp delete-user-pool --user-pool-id ap-southeast-2_tEQii9mgN
```

Deleting the pool also deletes its users and app client.
