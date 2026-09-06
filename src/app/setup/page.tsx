import type { Metadata } from "next";
import Link from "next/link";
import { WidgetInstallSnippet } from "@/components/widget-install-snippet";

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
    <main className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-4">
        <p className="text-xs font-mono tracking-widest text-accent-cyan">WELCOME TO BUGDROP</p>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance">Start collecting feedback.</h1>
        <p className="text-lg text-text-subtle">
          Add the widget to your website, then send a test report.
        </p>
        <a href="#setup-widget" className={`${button} bg-accent-cyan text-bg-deep hover:opacity-90 w-full sm:w-auto`}>
          Add the widget <span aria-hidden="true" className="ml-3">↓</span>
        </a>
      </header>

      <section id="setup-widget" aria-labelledby="setup-next" className="scroll-mt-24 rounded-2xl border border-accent-cyan/25 bg-bg-surface p-5 sm:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-cyan/10 font-mono text-sm text-accent-cyan">1</span>
          <h2 id="setup-next" className="text-xl sm:text-2xl font-semibold">Add the script</h2>
        </div>
        <p className="text-text-subtle">
          Paste this before <code className="text-text-primary">{"</body>"}</code> in your website’s HTML.
          Replace <code className="text-text-primary">owner/repo</code> with the GitHub repository you gave BugDrop access to.
        </p>
        <div className="[&_pre]:mb-0 [&_pre]:whitespace-pre-wrap [&_pre]:break-all [&_pre]:border-white/10 [&_pre]:text-xs sm:[&_pre]:text-sm">
          <WidgetInstallSnippet />
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href="/docs/installation#framework-specific-notes" className="text-accent-cyan underline underline-offset-4">Using a framework?</Link>
          <a href="https://github.com/apps/neonwatty-bugdrop/installations/new" className="text-text-subtle underline underline-offset-4">Still need the GitHub App?</a>
        </div>
      </section>

      <section aria-labelledby="setup-test" className="rounded-2xl border border-white/10 p-5 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-green/10 font-mono text-sm text-accent-green">2</span>
          <h2 id="setup-test" className="text-xl sm:text-2xl font-semibold">Send a test report</h2>
        </div>
        <p className="text-text-subtle">
          Open your website, click the BugDrop button, and submit a report.
          Check your repository’s Issues tab — your report should appear there.
        </p>
        <p className="text-sm text-text-subtle">
          Nothing showing up? <Link href="/docs/installation#verifying-the-installation" className="text-accent-cyan underline underline-offset-4">Check your setup</Link>.
        </p>
      </section>

      <details className="group rounded-xl border border-white/10 px-5 sm:px-6">
        <summary className="cursor-pointer py-4 font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-cyan">
          Help shape BugDrop <span className="ml-2 text-xs font-normal text-text-subtle">Optional</span>
        </summary>
        <div className="space-y-4 pb-5 text-sm text-text-subtle">
          <p>Open to a research conversation or testimonial request once you’ve tried it?</p>
          <a href={invitation} className={`${button} border border-white/20 text-text-primary hover:bg-bg-surface w-full sm:w-auto`}>
            Draft an invitation request
          </a>
          <p>
            Send the email to opt in; opening the draft does nothing.
            We’ll ask separately before publishing your name, logo, link, or quote.
            Withdraw anytime by replying.
          </p>
          <p>
            No email app? Write to <a href="mailto:privacy@bugdrop.dev" className="text-accent-cyan underline underline-offset-4">privacy@bugdrop.dev</a> to request an invitation.
          </p>
        </div>
      </details>

      <p className="text-sm text-text-subtle">
        We keep minimal installation details and feedback counts to run BugDrop.
        Featuring your app always needs separate permission.
        {" "}<Link href="/privacy" className="text-accent-cyan underline underline-offset-4">Read our privacy policy</Link>.
      </p>
    </main>
  );
}
