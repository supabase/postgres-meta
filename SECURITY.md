# Security Policy

Thank you for helping keep postgres-meta and Supabase users safe.

## Reporting a vulnerability

Please report suspected vulnerabilities through our HackerOne program:
<https://hackerone.com/supabase>. Please do not open public GitHub issues or
pull requests for security problems.

This repository contains postgres-meta (pg-meta), the REST service that
Supabase Studio uses to manage a Postgres database: tables, columns, roles,
privileges, functions and other objects, plus a query endpoint that runs SQL.
It runs behind the dashboard on the hosted Supabase platform, and as part of
the Docker-based self-hosted Supabase stack. We accept reports for both, and
we triage them differently (see "Hosted vs. self-hosted" below).

## How pg-meta security works here

pg-meta is a privileged administration API. Whoever is allowed to call it can
already run arbitrary SQL through the query endpoint, as the role pg-meta
connects with. When deployed with Supabase, only users who are already
authenticated and allowed to manage the database can reach it. The other
endpoints are conveniences that generate SQL for common tasks, and they run
with the same permissions as the query endpoint. So the question for most
reports is not "can I run SQL?" but "can someone who should not be able to
run SQL make pg-meta run it?".

## What we consider a vulnerability

In general, we want to hear about anything that lets someone make pg-meta run
SQL or change the database without being an authorized caller, or expose
connection credentials. The problem should be present on the hosted platform
or in the default self-hosted configuration, and the attacker should not
already hold the access you describe.

Examples of what this includes (these are illustrations, not a complete list):

- **SQL injection reachable cross-site.** Unescaped values in requests that a
  browser can send cross-site, such as GET query parameters, that turn a read
  into a write or run attacker-chosen SQL when a logged-in, authorized user
  visits an attacker's page. The attacker supplies the SQL; the victim does
  not. We treat this as in scope even though the victim has to load a page:
  it is a cross-site request forgery against a logged-in user, not the
  social-engineering exclusion below.
- **Reaching pg-meta without authorization.** A route in the hosted platform or
  the default self-hosted stack that lets an unauthenticated or
  lower-privileged caller reach pg-meta endpoints.
- **Credential exposure.** Database passwords or connection strings appearing
  in responses, logs or error messages to someone who should not see them.

## What we do not consider a vulnerability

Reports that rely on the behavior below will normally be closed as
informative or not applicable.

**By design**

- **The query endpoint runs arbitrary SQL**, including multiple statements, as
  a privileged role. That is its purpose.
- **Fields that take SQL.** Some fields are SQL by definition, for example a
  CHECK constraint expression or a function definition. Putting SQL in them is
  using the feature.
- **The database user in the self-hosted stack is a superuser.** pg-meta can
  run privileged SQL for anyone who is allowed to use it.

**Prerequisites that make the attack pointless**

- **Injection that gives the caller nothing new.** Injection into a parameter of
  an endpoint is only interesting if it crosses a boundary the caller does not
  already have. An authorized caller who can already run arbitrary SQL through
  the query endpoint gains nothing from injecting into another endpoint. Show
  what the caller can do afterwards that they could not do before, for example
  as a lower-privileged user or across projects.
- **A proof of concept that calls the library directly.** Show that the issue
  is reachable through the pg-meta HTTP API as it is deployed, not only by
  calling an internal function or the query function yourself.
- **Attacks that need the target database's credentials.** If the attacker
  must already know the connection string or password, they can connect to the
  database directly.

**Missing hardening or noise**

- **Placeholder defaults in source.** Fallback values such as a sample crypto
  key or local database credentials are for development. The documented
  self-hosted setup generates a random `PG_META_CRYPTO_KEY`, and the
  configuration docs say to set it to a random value. Show the problem in a
  documented deployment.
- **Automated scanner or AI output** with no working exploit against a real
  deployment, and reports that bundle several unverified findings.

## Out of scope for every Supabase asset

These are excluded program-wide (see also
<https://supabase.com/.well-known/security.txt>). They are repeated here so
you do not need to leave this repository to find them.

- Clickjacking on pages with no sensitive actions.
- Unauthenticated, logout and login CSRF.
- Attacks requiring MITM or physical access to a user's device.
- Attacks requiring social engineering.
- Any activity that could lead to the disruption of our service (DoS).
  This means volumetric attacks, load testing and flooding. A vulnerability in
  our code that lets an unprivileged attacker crash a service or exhaust
  resources for other users or tenants is in scope. Denial of service that only
  affects the attacker's own project, or that needs admin or owner privileges,
  is not.
- Content spoofing and text injection issues without showing an attack vector,
  or without being able to modify HTML/CSS.
- Email spoofing.
- Missing DNSSEC, CAA or CSP headers.
- Lack of Secure or HttpOnly flags on non-sensitive cookies.
- Dead links.
- User enumeration.

## Known and documented behavior

These are described in our documentation or in the shipped configuration.
Please check them before reporting.

- **`PG_META_CRYPTO_KEY` must be a random secret.** The self-hosting quick start
  generates it, and the self-hosted configuration docs
  (`docker/CONFIG.md` in the main Supabase repository) say to set it to a
  random string of at least 32 characters.
- **Self-hosting hardening.** pg-meta and Studio are not designed to be exposed
  to untrusted networks. Run them behind the gateway and change every
  placeholder secret, as the self-hosting guide describes.

## Hosted vs. self-hosted

We accept self-hosted findings when the shipped defaults or the documented
setup lead to the problem, and we treat them as lower severity when the
operator has to misconfigure the deployment first, such as by exposing pg-meta
directly to a network, keeping an unchanged sample key or password, or running
it outside the Supabase stack. Label your report as described in the next
section.

## How to write a report that gets triaged quickly

- **Say what you tested, at the top of the report and in the title.** Use one of
  these labels, for example `[Production] ...` in the title and a "Target" line
  at the start of the description:
  - **Production**: the hosted Supabase platform, against a project you own.
    Include the project ref. Never test another customer's project.
  - **Self-hosted, default configuration**: pg-meta as part of the
    documented Docker self-hosting setup, with only the secrets changed as the
    guide instructs. Include the pg-meta version or commit and how you started
    it.
  - **Self-hosted, custom configuration**: you changed settings, ran pg-meta on
    its own, exposed it directly, added a proxy, or modified code. List every
    setting you changed and why. We triage these lower unless the setting is
    one we recommend or document.

  Reports that do not say which of the three they are about are slower to
  triage, and are often closed with a request to retest. A finding that works
  only on a custom configuration is not a finding against production.

- **Test a real deployment.** Code reading alone is rarely enough. Static
  analysis findings need a working proof of concept against one of the targets
  above, through the HTTP API.
- **Give a short, runnable PoC.** The exact HTTP requests, and the output
  showing the impact. Confirm that the attacker really got something they
  should not have.
- **State the attacker's starting position.** Who sends the request: an
  anonymous user, a victim's browser visiting an attacker's page, or an
  authorized pg-meta caller? Reports where the attacker is already an
  authorized caller are our most common reason to close.
- **Name the boundary you crossed.** What can the attacker do that they could
  not already do with the query endpoint? If nothing, it is probably a
  hardening suggestion.
- **Check the docs and this file first.** If the behavior is documented,
  explain why it still fails.
- **Do not overstate severity.** A critical rating for SQL execution in an
  endpoint that is privileged by design costs credibility. Say what the
  realistic impact is.
- **Include versions.** The pg-meta version or commit and, for self-hosted
  reports, the relevant `PG_META_*` settings.
- **One issue per report.** Link variants of the same root cause instead of
  filing each variant separately.
- **Do not send unreviewed AI output.** Reports that were not reproduced by a
  human and that ignore the documentation are closed. AI-assisted analysis is
  fine when you have verified the result.
- **Respond to follow-up questions.** Reports that go quiet after we ask for a
  reproduction are closed.

## Severity

We rate severity by realistic impact on a default deployment. Issues that need
an authorized caller, a victim to visit an attacker's page, an unusual
configuration or another strong prerequisite are rated lower even when they
are valid, and we may fix them as defense in depth. A cross-site write that
does not return data to the attacker is rated on its integrity and
availability impact.

## Testing and disclosure

These are our program-wide rules. They also apply to AI agents and automated
tools acting on your behalf.

**Testing**

- Do not run automated scanners against other customers' projects. Scanners can
  run up costs for our users, can disrupt services, and our own security
  systems cannot tell hostile reconnaissance from research. If you want to run
  an automated scanner, notify security@supabase.com first and run it only on
  your own Supabase project.
- Do not attack projects that belong to other customers.
- Do not take advantage of a vulnerability you find, for example by downloading
  more data than necessary to demonstrate it, or by deleting or modifying other
  people's data.

**Disclosure**

- Do not reveal the problem to others until we have researched and fixed it and
  informed affected customers.
- If you want to share your research publicly (a conference, a blog or any
  other public forum), send us a draft for review and approval at least 30 days
  before the publication date. Do not include data about Supabase customer
  projects, customers' data, or information about Supabase employees,
  contractors or partners.

**What we promise**

- We will respond to your report within 5 business days with our evaluation and
  an expected resolution date.
- If you have followed these instructions, we will not take legal action against
  you in regard to the report.
- We will handle your report with strict confidentiality and will not pass on
  your personal details to third parties without your permission.
- We will keep you informed of our progress.
- In public information about the problem, we will name you as the discoverer
  unless you prefer otherwise.
