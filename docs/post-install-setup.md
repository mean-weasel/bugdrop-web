# Post-install setup

The `/setup` page includes the widget script, repository configuration instructions,
and a test-report step. Framework and troubleshooting links lead to the relevant
installation guide sections. An expandable optional invitation below setup offers
an email draft addressed to the existing privacy inbox. Sending the email is
permission to contact the sender about research or a testimonial; it is not
permission to publish anything. A click alone must never be recorded as consent.
Keep the original email as private permission evidence. Honor withdrawals and
obtain separate approval for each exact public profile and quote before publication.
Do not copy email addresses into the installation analytics store or consent registry.

The page does not authenticate GitHub users or verify installations. Incoming query
parameters are removed before rendering, including spoofed `installation_id` and
`setup_action` values. No installation-specific information is displayed or joined
to email. The initial request still reaches hosting infrastructure; this does not
promise query values are absent from provider operational logs.

## Rollout

1. Review and deploy the page; verify `/setup` and a query-bearing URL on production.
2. Inspect the App registration's current Post installation settings while signed in.
   The public GitHub App API exposes the homepage, not the configured Setup URL;
   that setting has not yet been verified by this implementation.
3. Set Setup URL to `https://bugdrop.dev/setup` after the page is live. Keep Redirect
   on update disabled unless deliberately approved. Do not change OAuth or callback
   settings. OAuth-on-install, if enabled, uses its callback instead of Setup URL.
4. Dogfood a controlled installation. Confirm the browser reaches the query-free
   page, the guide is accessible, and opening an email draft does not send it.

Reference: https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/about-the-setup-url

## Opt-in follow-up email

Gmail template name: `BugDrop - opt-in follow-up`

Use only after someone explicitly opts in. Send from the inbox receiving the
privacy alias. Keep individual replies and consent evidence private, not in Git.
Before featuring anyone, show them the exact name, app link, logo, and quote to
be published and obtain separate approval. This template is not that approval.

Subject: How's BugDrop working for you?

Hi,

Thanks for offering to share your experience!

What app or site are you using BugDrop on, and how has it helped? A link and a
sentence or two would be great. Anything we could improve?

We won't publish your name, app, or words without showing you exactly what we'd
feature and getting your approval first.

Thanks,
Jeremy
