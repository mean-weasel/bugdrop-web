import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Set up BugDrop",
  description: "Add BugDrop to your website and start receiving feedback in GitHub.",
  alternates: { canonical: "https://bugdrop.dev/setup" },
  robots: { index: false, follow: true },
};

const invitation = `mailto:privacy@bugdrop.dev?subject=${encodeURIComponent("BugDrop — optional research invitation")}&body=${encodeURIComponent(
  "Hi BugDrop,\n\nYou may reply to this email to invite me to share my experience using BugDrop or discuss a testimonial. This is permission to contact me, not permission to publish my name, app, logo, or words. Please ask for my separate approval before publishing anything.\n\nI can withdraw this permission by replying to this email.\n\nThanks!",
)}`;

const button = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-cyan";

export default function SetupPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 py-8">
      <header className="space-y-4">
        <p className="text-sm font-mono text-accent-cyan">LET’S GET YOU SET UP</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Welcome to BugDrop.</h1>
        <p className="text-lg text-text-subtle">
          Installed the GitHub App? Next, add the widget to your website and send your first test report.
        </p>
      </header>

      <section aria-labelledby="setup-next" className="rounded-2xl border border-border bg-bg-surface p-6 sm:p-8 space-y-5">
        <h2 id="setup-next" className="text-2xl font-semibold">Your first feedback, in three steps</h2>
        <ol className="list-decimal pl-6 space-y-3 text-text-subtle">
          <li>Give the GitHub App access to the repository that should receive feedback.</li>
          <li>Follow the installation guide to add the widget to your website.</li>
          <li>Submit a test report and check that it appears in GitHub Issues.</li>
        </ol>
        <Link href="/docs/installation" className={`${button} bg-accent-cyan text-bg-deep hover:opacity-90 w-full sm:w-auto`}>
          Add the widget to your website
        </Link>
        <p className="text-sm text-text-subtle">
          Still need the App?{" "}
          <a href="https://github.com/apps/neonwatty-bugdrop/installations/new" className="text-accent-cyan underline underline-offset-4">Install on GitHub</a>.
        </p>
      </section>

      <section aria-labelledby="setup-contact" className="rounded-2xl border border-border p-6 sm:p-8 space-y-4">
        <p className="text-sm font-mono text-accent-warm">OPTIONAL</p>
        <h2 id="setup-contact" className="text-2xl font-semibold">Help shape BugDrop</h2>
        <p className="text-text-subtle">
          Open to sharing your experience once you’ve used it? Send us an email so we can invite you to a conversation or ask about a testimonial.
        </p>
        <a href={invitation} className={`${button} border border-border hover:bg-bg-surface w-full sm:w-auto`}>
          Open an email to opt in
        </a>
        <p className="text-sm text-text-subtle">
          Review and send the draft in your email app. Opening it does not opt you in.
          We’ll ask separately before publishing any name, logo, link, or quote.
          You can withdraw by replying to us.
        </p>
        <p className="text-sm text-text-subtle">
          No email app? Write to <a href="mailto:privacy@bugdrop.dev" className="text-accent-cyan underline underline-offset-4">privacy@bugdrop.dev</a> and tell us you’d like an invitation.
        </p>
      </section>

      <p className="text-sm text-text-subtle">
        BugDrop keeps minimal GitHub installation details and a private count of successful feedback Issues across each installation’s repositories.
        These help us operate the service and understand use. Installing does not give us permission to feature your app publicly.
        {" "}<Link href="/privacy" className="text-accent-cyan underline underline-offset-4">Read our privacy policy</Link>.
      </p>
    </main>
  );
}
