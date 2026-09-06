# Post-install setup

The first version of `/setup` links to widget installation instructions and offers
an optional email draft sent to the existing privacy inbox. Sending the email is
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
