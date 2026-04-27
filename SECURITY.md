# SequenceLab AI Security Hardening Checklist

SequenceLab AI is currently a static/interactive educational Next.js app with no backend API, authentication, database, or persisted user data. The controls below define the minimum defense-in-depth posture before deploying it as an enterprise-facing application.

## Implemented In This Codebase

- Security headers configured in `next.config.ts`.
- CSP, frame denial, referrer policy, content type sniffing protection, HSTS, permissions policy, COOP, and CORP.
- No `X-Powered-By` framework header.
- Strict validation for custom email fragments and target phrases.
- Immediate warnings for script/HTML input, SQL-like payloads, command-like payloads, excessive symbols, repeated character floods, extremely long tokens, and low-context fragments.
- Simulation controls are disabled until validation passes.
- User input is sanitized before entering the simulation engine.
- React output escaping is preserved; no user input is rendered through unsafe HTML.

## 1. Cloud & Network Security

- Put production behind a managed WAF such as Cloudflare WAF, AWS WAF, Google Cloud Armor, or Azure Front Door WAF.
- Enable OWASP managed rules, bot protection, known-bad IP reputation feeds, geo/IP allowlists for admin routes, and custom rate-limit rules.
- Enable DDoS protection at the edge: Cloudflare DDoS, AWS Shield Advanced, Google Cloud Armor Adaptive Protection, or equivalent.
- Terminate TLS at the edge with TLS 1.3 preferred and TLS 1.2 minimum.
- Use HSTS preload only after confirming every subdomain supports HTTPS.
- Keep databases, queues, object stores, and internal services private inside VPC/VNet subnets.
- Never expose databases, Redis, admin dashboards, or observability services publicly.
- Use private endpoints or VPC peering for managed data stores.
- Apply deny-by-default security groups/firewall rules.
- Use Zero Trust access for administrative surfaces: identity-aware proxy, device posture checks, MFA, and short sessions.
- Restrict deployment dashboards and preview environments to authorized users.
- Enable CDN caching only for safe static assets; never cache authenticated or sensitive responses.

## 2. Application Architecture

- Treat all client-side validation as user-experience protection only. Re-validate every input server-side when APIs are added.
- Use schema validation with Zod or equivalent on every API boundary.
- Reject unknown fields on server payloads.
- Encode output by context: HTML, attribute, URL, JSON, CSV, and log contexts require different escaping rules.
- Avoid `dangerouslySetInnerHTML`. If unavoidable, sanitize with a vetted HTML sanitizer and an allowlist.
- Add API rate limiting by identity, IP, and route sensitivity.
- Use idempotency keys for write operations.
- Use CSRF protection for cookie-authenticated mutation routes.
- Use secure cookies: `HttpOnly`, `Secure`, `SameSite=Lax` or `Strict`, short TTL, rotation on privilege changes.
- Use OAuth 2.1 / OIDC with PKCE for enterprise login.
- Prefer server-side session storage or signed/encrypted session tokens with rotation.
- Add request body limits and file upload limits before accepting uploads.
- Add centralized error handling. Do not leak stack traces, secrets, SQL errors, or internal service names.

## 3. Data Security

- Classify data by sensitivity: public demo data, user input, enterprise confidential, regulated data.
- Encrypt all data in transit with TLS 1.2+ and prefer TLS 1.3.
- Encrypt all data at rest using AES-256 or cloud-provider managed envelope encryption.
- Use KMS-managed customer keys for sensitive enterprise workloads.
- Rotate encryption keys on a defined schedule and after incidents.
- Store secrets only in a secrets manager: AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, Doppler, or HashiCorp Vault.
- Never commit `.env`, API keys, certificates, tokens, service account JSON, private keys, or database URLs.
- Use separate secrets for dev, staging, preview, and production.
- Redact secrets and sensitive payloads from logs.
- Define retention policies and deletion workflows for user-submitted content.

## 4. Identity & Access Management

- Apply principle of least privilege to every user, service account, CI token, database role, and cloud role.
- Use RBAC for app roles: viewer, educator, content admin, security admin, platform admin.
- Use separate cloud accounts/projects/subscriptions for dev, staging, and production.
- Require MFA for all administrators and deployment maintainers.
- Use SSO/OIDC for team access.
- Avoid long-lived cloud keys. Prefer workload identity federation/OIDC from CI.
- Rotate credentials and revoke unused accounts automatically.
- Log every admin action and privileged permission change.
- Require approval for production deployments and infrastructure changes.

## 5. DevSecOps & Monitoring

- Add CI gates for typecheck, build, lint, dependency audit, and secret scanning.
- Add SAST: CodeQL, Semgrep, or equivalent.
- Add dependency scanning: Dependabot, Snyk, GitHub Advanced Security, or npm audit with reviewed remediation.
- Add DAST against staging: OWASP ZAP baseline or Burp Suite Enterprise.
- Add IaC scanning when infrastructure is added: Checkov, tfsec, Trivy, or Terrascan.
- Generate and store SBOMs using CycloneDX or SPDX.
- Pin production dependencies through lockfiles and review major upgrades.
- Enable real-time error monitoring: Sentry, Datadog, New Relic, or OpenTelemetry collector.
- Alert on WAF blocks, rate-limit spikes, 4xx/5xx anomalies, auth failures, suspicious user agents, and deployment changes.
- Centralize logs in a tamper-resistant sink with retention policies.
- Create incident response runbooks for credential exposure, XSS, dependency CVE, WAF bypass, and data exposure.

## OWASP Top 10 Coverage

- Broken Access Control: enforce RBAC/ABAC server-side when auth is added.
- Cryptographic Failures: TLS, KMS, secrets manager, encrypted storage.
- Injection: strict validation, parameterized queries, no shell execution from user input.
- Insecure Design: threat modeling before adding backend features.
- Security Misconfiguration: hardened headers, WAF, private networking, least privilege.
- Vulnerable Components: dependency scanning and lockfile review.
- Identification/Auth Failures: OIDC, MFA, secure sessions, short-lived tokens.
- Software/Data Integrity Failures: CI gates, signed builds where supported, SBOM.
- Logging/Monitoring Failures: centralized logs, alerts, incident runbooks.
- SSRF: block arbitrary outbound URLs; use allowlists and metadata-service protections when server fetches are added.

## Pre-Go-Live Gate

- Production WAF enabled and tested.
- TLS and HSTS verified.
- Security headers verified with a scanner.
- Dependency audit reviewed.
- No secrets in repository history.
- Staging DAST completed.
- Logging and alerting tested.
- Rollback plan documented.
- Incident owner and escalation path assigned.
- Privacy/data retention statement approved.
