# Security Policy

## Supported Versions

This repository currently has a single actively developed backend service under `backend/`. Security updates and configuration guidance in this document apply to that service.

## Known Dependency Advisory: `qs`

Snyk reports a vulnerability of type "Allocation of Resources Without Limits or Throttling" in certain versions of the `qs` package.

- `bartender-order-service` (backend): `qs@6.14.0` appears in the dependency tree via transitive dependencies.
- There is currently no patched version of `qs` available in the range used by upstream dependencies, so we cannot simply upgrade to a fixed version.

## Mitigations Implemented

The backend service is configured to reduce or eliminate practical exploitability of this issue:

1. **Express query parser configuration**
   - The server uses Express with the built-in **simple** query parser, not `qs`:
     - `app.set('query parser', 'simple');`
   - This means incoming query strings are parsed by Node's basic querystring implementation and not by `qs`.
   - The API currently only relies on flat scalar query parameters (dates, IDs, pagination values, etc.), which are compatible with the simple parser.

2. **Request body size limits**
   - The backend enforces global limits on JSON and URL-encoded request bodies:
     - `express.json({ limit: BODY_LIMIT })`
     - `express.urlencoded({ extended: false, limit: BODY_LIMIT })`
   - `BODY_LIMIT` is configurable via the `BODY_LIMIT` environment variable and defaults to `100kb` if not set.
   - These limits reduce the risk of resource exhaustion from oversized request bodies.

3. **Rate limiting**
   - The backend uses `express-rate-limit` to protect all API routes:
     - A strict limiter for authentication routes: `/api/auth`.
     - A general limiter for all `/api` routes.
   - This provides additional protection against denial-of-service attempts, including those that might try to exploit heavy parsing.

## Snyk Configuration Guidance

Because there is no patched version of `qs` currently available and we have implemented the mitigations above, this repository treats the `qs` advisory as **mitigated by configuration**.

When configuring Snyk policies or ignores for this project, reference this document and note that:

- `qs` is not used by Express for query parsing in the backend.
- Request body sizes are strictly limited and use `extended: false` for URL-encoded parsing.
- Global rate limiting is in place for all API endpoints.

This decision should be revisited periodically. When an upstream dependency releases a version that depends on a non-vulnerable version of `qs` (as recognized by Snyk), we should:

1. Upgrade to that version.
2. Re-run Snyk.
3. Remove any temporary ignores related to the `qs` advisory if they are no longer necessary.

## Reporting a Vulnerability

If you discover a security vulnerability in this project:

1. Do **not** open a public GitHub issue with sensitive details.
2. Contact the maintainers directly using a private channel (email or direct message).
3. Provide:
   - A description of the issue and potential impact.
   - Steps to reproduce.
   - Any suggested remediation you may have.

We will investigate and respond as quickly as reasonably possible.