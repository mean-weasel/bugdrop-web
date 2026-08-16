# Screenshot privacy checklist

Reviewed: 2026-08-16

Use this before capture, before sharing, and when reviewing retention. Adapt it to your data classification, access model, and legal obligations. It is not a guarantee that an image is safe or compliant.

## 1. Before capture
- [ ] Confirm a screenshot is necessary; prefer text or synthetic evidence when it proves the issue.
- [ ] Use a synthetic account and test data where possible.
- [ ] Close or hide unrelated tabs, notifications, password managers, developer tools, chat, email, and system UI.
- [ ] Remove secrets, tokens, recovery codes, payment data, health data, customer records, private messages, and unreleased material from the capture surface.
- [ ] Choose the smallest useful page, element, area, tab, or window.
- [ ] Check the URL, query string, page title, bookmarks, filenames, account avatar, and background content.
- [ ] Mark stable sensitive DOM regions when the capture tool supports masking.

## 2. Inspect the final image
- [ ] Review the actual exported image at full size, not only the live page or capture preview.
- [ ] Crop unnecessary surroundings.
- [ ] Apply opaque redaction before upload; do not rely on blur, pixelation, or a promise to delete later.
- [ ] Verify every edge of each redaction, including content revealed by scrolling, reflow, animation, or overlays.
- [ ] Check images, canvas, video, SVG, iframes, Shadow DOM, and native capture fallbacks separately because DOM masking may not inspect their pixels.
- [ ] Confirm annotations do not expose or reconstruct hidden information.
- [ ] Retake the screenshot if there is any uncertainty about what the final file contains.

## 3. Share to the intended destination
- [ ] Confirm the repository, issue, ticket, channel, or document before upload.
- [ ] Verify who can access that destination now and after forwarding, export, or repository visibility changes.
- [ ] Treat public-repository GitHub attachments as publicly accessible.
- [ ] Keep security vulnerabilities, credentials, and unpublished exploit details out of ordinary public issues.
- [ ] Add only the context needed to reproduce the problem; put secrets in no screenshot or description.
- [ ] Record who owns triage and removal if the artifact is later found unsafe.

## 4. Store and retire deliberately
- [ ] Identify where the original and edited copies live, including downloads, clipboard history, chat, issue storage, and repository branches.
- [ ] Apply the destination's access controls and retention policy.
- [ ] Keep screenshot storage out of privileged CI and deployment paths when artifacts are user-generated.
- [ ] Delete superseded local copies and review shared copies on the agreed schedule.
- [ ] Escalate accidental exposure through the organization's incident process; deletion alone may not undo access, caching, or copies.

## BugDrop-specific check
- [ ] Prefer the manual screenshot flow when a reporter must inspect or redact the image.
- [ ] Test every enabled capture path on the actual page.
- [ ] Treat data-bugdrop-mask and related attributes as visual coverage, not secret discovery or data-loss prevention.
- [ ] Avoid screenshot capture when sensitive pixels cannot be enclosed and verified reliably.
- [ ] Review access and retention for the dedicated bugdrop-screenshots branch.

## Sources reviewed
- OWASP screenshot evidence guidance: https://owasp.org/APTS/standard/5_Auditability/
- MDN getDisplayMedia security guidance: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia#security
- GitHub attachment access documentation: https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/attaching-files
- BugDrop screenshot masking and storage documentation: https://bugdrop.dev/docs/security#screenshot-masking
