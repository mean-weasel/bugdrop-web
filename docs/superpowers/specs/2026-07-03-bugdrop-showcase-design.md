# BugDrop Showcase Design

## Goal

Create social proof for BugDrop by giving installers a public, opt-in way to show where they
use the product, while seeding the first version with first-party apps already using BugDrop:
`bleepthat.sh`, `deckchecker.app`, and `seatify.app`.

The canonical destination lives in `bugdrop-web` at `/showcase`. The BugDrop homepage, GitHub
repository, and GitHub Marketplace/App listing should point to that page rather than each trying
to host their own separate showcase.

## Product Positioning

The showcase should feel confident and community-minded, not needy. The tone is:

- "Built with BugDrop"
- "See how real products use BugDrop"
- "Using BugDrop? Share your setup"

Until external submissions exist, the page should label the initial examples as first-party
projects from the BugDrop maker's own portfolio. Once outside users submit entries, the page can
change the framing to a broader community/customer showcase.

## User Journey

1. A visitor sees a subtle homepage CTA after BugDrop has established its core value.
2. The CTA links to `/showcase`.
3. `/showcase` lists the seeded first-party examples and explains that public submissions are
   opt-in and moderated.
4. A "Share your setup" CTA links to a pinned GitHub issue in `mean-weasel/bugdrop`.
5. The issue asks installers for permission to list their app publicly and collects the content
   needed for a future showcase card.

## Page Structure

### `/showcase`

The page should include:

- A compact hero:
  - Title: "Built with BugDrop"
  - Supporting copy: real apps use BugDrop to collect feedback directly into GitHub Issues.
  - Primary CTA: "Share your setup"
  - Secondary CTA: "Install BugDrop"
- A seeded showcase grid with three first-party examples:
  - Bleep That Sh*t! (`https://bleepthat.sh`)
    - Suggested description: "Media-cleanup app using BugDrop for product feedback around upload,
      transcript, and export workflows."
  - DeckChecker (`https://deckchecker.app`)
    - Suggested description: "Conference presentation management software using BugDrop to capture
      review and revision feedback from event workflows."
  - Seatify (`https://seatify.app`)
    - Suggested description: "Seating chart planner using BugDrop to collect feedback from event
      planning and beta workflows."
- A short "How to get listed" section:
  - Install BugDrop.
  - Share a public app URL or anonymized use case.
  - Confirm permission to list it on `bugdrop.dev`.
- A privacy/consent note:
  - BugDrop does not publish install data automatically.
  - Private/internal use can be submitted as an anonymized blurb.
  - Entries are reviewed before appearing on the site.

### Homepage CTA

Add a modest social-proof CTA to the existing homepage, after the core value has been established
and before the final install push. Recommended placement: near the "Why Teams Use BugDrop" section
or immediately after it.

Suggested copy:

> Using BugDrop in your app? Share your setup and get listed in the showcase.

The CTA should link to `/showcase`, not directly to GitHub, so visitors first see examples and the
submission rules.

### GitHub Repository

Create a pinned issue in `mean-weasel/bugdrop` titled:

> Show us what you built with BugDrop

The issue body should ask for:

- App or site name
- Public URL, if available
- Screenshot or logo, optional
- One-sentence use case
- Whether attribution should be public, company-only, or anonymous
- Explicit permission to list the submission on `bugdrop.dev/showcase`

In the future this can become a GitHub issue form, but a pinned issue is enough for the first loop.

### GitHub Marketplace/App Listing

Update the Marketplace/App copy to point to `https://bugdrop.dev/showcase` as a lightweight funnel:

> Using BugDrop? Share your setup for the BugDrop showcase.

The listing should not try to host showcase content itself. It should link out to the canonical
page.

## Data Model

For the first implementation, use a small static array in `bugdrop-web` rather than adding a CMS,
database, or remote fetch.

Each entry needs:

- `name`
- `href`
- `description`
- `category`
- `status`, such as `First-party` or `Community`
- Optional `logo` or screenshot path

The first version can render text-only cards if no approved brand assets are available. This keeps
the page honest and avoids inventing logos or screenshots.

## Design Constraints

- Keep the homepage CTA understated.
- Do not imply external customers until external submissions are approved.
- Do not publish GitHub App install metadata automatically.
- Do not list private repositories, private apps, or internal products without explicit permission.
- Make the showcase page useful even with only three seeded examples.
- Keep visual treatment consistent with the existing BugDrop site: dark surface, restrained cards,
  warm/cyan accents, and clear developer-friendly copy.

## Implementation Scope

In `bugdrop-web`:

- Add `/showcase`.
- Add a reusable showcase card component only if it keeps the page cleaner.
- Add a homepage CTA that links to `/showcase`.
- Add `/showcase` to the sitemap.
- Add a footer or nav link only if it does not crowd the existing navigation.

In `mean-weasel/bugdrop`:

- Create and pin the showcase submission issue.
- Optionally add a README link after the page exists.

Outside code:

- Update GitHub Marketplace/App listing copy manually after the page is deployed.

## Testing And Proof

Before considering the implementation complete:

- Run `npm run lint` in `bugdrop-web`.
- Run `npm run build` in `bugdrop-web`.
- Load `/showcase` locally and inspect desktop and mobile layouts.
- Verify the homepage CTA links to `/showcase`.
- Verify `/showcase` appears in the generated sitemap.
- Try to disprove the social-proof claim by checking the copy does not imply external adopters
  before external submissions exist.

## Sequencing Notes

- Create the pinned submission issue before wiring the final "Share your setup" URL.
- Use text-only cards for the first version unless approved screenshots or logos already exist in
  the project. Do not generate or scrape brand assets for the seed apps.
