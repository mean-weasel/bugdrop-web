export const portableResourceText = {
  "visual-bug-report-template": `# Visual bug report

## Summary
[One sentence: what is wrong, where, and impact]

## Expected behavior
[What should happen?]

## Actual behavior
[What happened instead?]

## Reproduction steps
1. [Starting state]
2. [Action]
3. [Observed result]

## Environment
- Page URL:
- Browser and version:
- Operating system:
- Viewport or device:
- Account or test-data state (no secrets):

## Visual evidence
- Screenshot or recording:
- Annotation explains:
- Privacy review completed: yes / no / not applicable

## Triage
- Severity and user impact:
- Reproducible: always / sometimes / once
- Owner or component:
- Related issue:
`,
  "client-website-qa-checklist": `# Client website QA checklist

## Review contract
- [ ] Named review URL and build
- [ ] Scope and out-of-scope changes agreed
- [ ] Reviewers, deadline, triage owner, and approval owner named
- [ ] Synthetic test data prepared

## Responsive and visual
- [ ] 320–390 px mobile width checked
- [ ] Tablet and desktop widths checked
- [ ] Navigation, dialogs, forms, and long content do not clip or overflow
- [ ] Images, typography, spacing, focus, hover, loading, empty, and error states checked

## Content and interaction
- [ ] Titles, headings, links, forms, validation, and success states checked
- [ ] Keyboard path and visible focus checked
- [ ] Text alternatives and labels checked
- [ ] Console and failed network requests reviewed

## Privacy and handoff
- [ ] Screenshots contain no secrets or unapproved customer data
- [ ] Each issue includes URL, viewport, expected result, actual result, and steps
- [ ] Duplicates and out-of-scope requests routed
- [ ] Blockers resolved; deferred items recorded; approval captured
`,
  "screenshot-privacy-checklist": `# Screenshot privacy checklist

Reviewed: 2026-08-16

Use this before capture, before sharing, and when reviewing retention. Adapt it to your data classification, access model, and legal obligations. It is not a guarantee that an image is safe or compliant.

## Start with the boundary
- [ ] Confirm a screenshot is necessary. Prefer written steps, synthetic output, or a smaller artifact when it proves the same point.
- [ ] Name the intended destination and audience before capture.
- [ ] Use a synthetic account and test data where possible.
- [ ] Identify the smallest useful page, component, area, tab, or window.
- [ ] Decide who can access the image, how it should be handled, and how long it should be kept.

## 1. Prepare the capture surface
- [ ] Close or hide unrelated tabs, notifications, password managers, developer tools, chat, email, and system UI.
- [ ] Remove credentials, access tokens, recovery codes, payment data, health information, customer records, private conversations, and unreleased material from the capture surface.
- [ ] Check the page title, URL and query string, bookmarks bar, filenames, account avatar, workspace name, and visible browser extensions.
- [ ] Freeze or dismiss transient UI such as toasts, autocomplete suggestions, notification previews, and background windows.
- [ ] Mark stable sensitive DOM regions when the capture tool supports masking.
- [ ] Prefer a selected element or selected area over an entire display when the smaller scope still proves the issue.

## 2. Inspect the actual image
- [ ] Open the exported image at full size. Do not approve only the live page or a reduced capture preview.
- [ ] Crop unnecessary surroundings while retaining enough orientation to understand the evidence.
- [ ] Apply opaque redaction before upload. Do not rely on blur, light pixelation, or a promise to delete later.
- [ ] Inspect every edge of each covered region and confirm the redaction is permanently applied to the exported file.
- [ ] Check content revealed by scrolling, sticky elements, reflow, animation, overlays, and responsive changes.
- [ ] Check images, canvas, video, SVG, iframes, Shadow DOM, and native capture fallbacks separately; a DOM-aware tool may not inspect their internal pixels.
- [ ] Confirm arrows, labels, and annotations do not repeat or reconstruct the hidden value.
- [ ] Retake the screenshot if any region is uncertain.

## 3. Verify the destination before upload
- [ ] Confirm the exact repository, issue, ticket, channel, document, or support case.
- [ ] Verify who can access the destination now and after forwarding, export, or a repository visibility change.
- [ ] Treat public-repository GitHub attachments as public.
- [ ] Keep credentials, unpublished exploit details, and security vulnerabilities out of ordinary public issues.
- [ ] Put no secret in the description as a substitute for removing it from the image.
- [ ] Add only the environment context needed to reproduce the report.
- [ ] Know who will remove the image and lead follow-up if it is found to be unsafe.

## 4. Store and retire deliberately
- [ ] Identify where the original and edited copies live, including downloads, clipboard history, chat, issue storage, repository branches, and backups.
- [ ] Apply the destination’s access controls and retention policy.
- [ ] Keep user-generated screenshot storage out of privileged CI and deployment paths.
- [ ] Delete superseded local copies and review shared copies on the agreed schedule.
- [ ] Record an exception when the image must be retained longer for audit, support, or legal reasons.
- [ ] Escalate accidental exposure through the organization’s incident process. Deletion alone may not undo access, caching, notifications, or copies.

## BugDrop-specific review
- [ ] Prefer the manual screenshot flow when the reporter must inspect or redact the image.
- [ ] Test every enabled capture path on the actual page before collecting real reports.
- [ ] Mark the smallest stable container that encloses sensitive content.
- [ ] Check media, embedded content, closed Shadow DOM, custom rendering, and native viewport fallbacks against the documented limitations.
- [ ] Avoid screenshots where sensitive pixels cannot be enclosed and verified reliably.
- [ ] Review access and retention for the \`bugdrop-screenshots\` branch.

## Sources reviewed
- OWASP screenshot evidence guidance: https://owasp.org/APTS/standard/5_Auditability/
- MDN getDisplayMedia security guidance: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia#security
- GitHub attachment access documentation: https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/attaching-files
- BugDrop screenshot masking and storage documentation: https://bugdrop.dev/docs/security#screenshot-masking
`,
} as const;
